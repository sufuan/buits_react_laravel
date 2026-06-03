<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\PendingUser;
use App\Models\User;
use App\Services\PipraPay;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaymentController extends Controller
{
    protected PipraPay $pipra;

    public function __construct()
    {
        $this->pipra = new PipraPay(
            config('services.piprapay.api_key'),
            config('services.piprapay.base_url'),
            config('services.piprapay.currency', 'BDT')
        );
    }

    /** Show the checkout form page. */
    public function checkout()
    {
        return Inertia::render('Payment/Checkout');
    }

    /**
     * Initiate a new payment.
     * Calls POST https://pay.buits.org/api/create-charge
     * On success: saves pending payment to DB, redirects to pp_url
     */
    public function initiate(Request $request)
    {
        $validated = $request->validate([
            'full_name'     => 'required|string|max:255',
            'email_address' => 'required|email|max:255',
            'mobile_number' => 'required|string|max:20',
            'amount'        => 'required|numeric|min:1',
        ]);

        $invoiceId = 'INV-' . uniqid();
        $metadata  = ['invoiceid' => $invoiceId];

        // ── Registration payment: create PendingUser HERE, not in store() ──────
        // The form data was stored in the encrypted session by RegisteredUserController@store().
        // We create the DB row only now — so the email was never locked until the
        // user actually clicked "Proceed to Pay Online".
        $registrationFormData = session('registration_form_data');

        if ($registrationFormData) {
            // ── Race-condition guard ──────────────────────────────────────────
            // Two users could simultaneously pass the step-1 checkEmail() call
            // and both reach this point. We do a final DB-level check here to
            // prevent a duplicate pending_users row.
            $email = $registrationFormData['email'];

            if (PendingUser::where('email', $email)->exists() ||
                User::where('email', $email)->exists()) {
                session()->forget('registration_form_data');
                return redirect()->route('register')
                    ->withErrors(['email' => 'This email was just taken by another registration. Please register again with a different email.']);
            }

            // ── Create PendingUser atomically with the PipraPay charge ─────────
            $pendingUser = PendingUser::create([
                'name'              => $registrationFormData['name'],
                'email'             => $registrationFormData['email'],
                'password'          => $registrationFormData['password'], // already hashed
                'phone'             => $registrationFormData['phone'],
                'department'        => $registrationFormData['department'],
                'session'           => $registrationFormData['session'],
                'usertype'          => $registrationFormData['usertype'] ?? 'user',
                'gender'            => $registrationFormData['gender'],
                'class_roll'        => $registrationFormData['class_roll'],
                'father_name'       => $registrationFormData['father_name'] ?? null,
                'mother_name'       => $registrationFormData['mother_name'] ?? null,
                'current_address'   => $registrationFormData['current_address'] ?? null,
                'permanent_address' => $registrationFormData['permanent_address'] ?? null,
                'payment_type'      => 'online',
                'payment_status'    => 'pending_payment',
            ]);

            // Embed ID in metadata so the webhook can find this PendingUser
            $metadata['pending_user_id'] = $pendingUser->id;

            // Swap session keys: form data is no longer needed; the pending user
            // ID is now the canonical reference for webhook + cancellation flows.
            session()->forget('registration_form_data');
            session(['registration_pending_user_id' => $pendingUser->id]);
        }

        $response = $this->pipra->createCharge([
            'full_name'     => $validated['full_name'],
            'email_address' => $validated['email_address'],
            'mobile_number' => $validated['mobile_number'],
            'amount'        => (string) $validated['amount'],
            'metadata'      => $metadata,
            'return_url'    => route('payment.success'),
            'webhook_url'   => route('payment.webhook'),
        ]);

        if (isset($response['pp_id'], $response['pp_url'])) {
            Payment::create([
                'pp_id'                 => (string) $response['pp_id'],
                'customer_name'         => $validated['full_name'],
                'customer_email_mobile' => $validated['email_address'] . ' | ' . $validated['mobile_number'],
                'amount'                => (string) $validated['amount'],
                'currency'              => config('services.piprapay.currency', 'BDT'),
                'metadata'              => $metadata,
                'status'                => 'pending',
            ]);

            return Inertia::location($response['pp_url']);
        }

        // PipraPay rejected the charge — roll back the PendingUser we just created
        // so the email is freed and the user can try again.
        if (isset($pendingUser)) {
            $pendingUser->delete();
            session()->forget('registration_pending_user_id');
        }

        return back()->withErrors([
            'payment' => $response['message'] ?? $response['error'] ?? 'Could not initiate payment.'
        ]);
    }

    /**
     * Webhook handles payment updates.
     * This endpoint is called after user completes payment on PipraPay.
     * Handles both successful and cancelled payments.
     */
    public function success(Request $request)
    {
        // PipraPay sends either pp_id or transaction_ref
        $ppId = $request->query('pp_id') ?? $request->query('transaction_ref');
        $ppStatus = $request->query('pp_status');

        if (!$ppId) {
            return redirect('/');
        }

        // Payment will be updated by webhook
        $payment = Payment::where('pp_id', (string) $ppId)->first();

        if (!$payment) {
            return redirect('/');
        }

        // Handle cancelled status from return_url
        if ($ppStatus === 'canceled') {
            $payment->update(['status' => 'cancelled']);

            // If this is a registration payment, delegate to the cancellation page
            // which will delete the PendingUser row and clear the session.
            if (session('registration_pending_user_id')) {
                return redirect()->route('registration.payment.cancelled');
            }

            return redirect('/');
        }

        // Handle successful/pending status
        // Clean up any lingering registration session data
        session()->forget(['registration_form_data', 'registration_pending_user_id']);

        // Check if this was a registration payment via metadata
        $metadata = is_string($payment->metadata) ? json_decode($payment->metadata, true) : ($payment->metadata ?? []);
        
        if (isset($metadata['pending_user_id'])) {
            return redirect()->route('registration.payment.success', ['transaction_id' => $ppId]);
        }

        return redirect('/')->with('status', 'Payment processed successfully.');
    }

    /**
     * Webhook endpoint — receives real-time updates from PipraPay.
     * Updates payment record with status from PipraPay.
     */
    public function webhook(Request $request)
    {
        // ── 0. Log the RAW incoming payload immediately ────────────────────────
        // This fires before any processing so we can always see if PipraPay hit us.
        $rawPayload = file_get_contents('php://input');
        \Log::channel('webhook')->info('=== WEBHOOK HIT ===', [
            'time'       => now()->toDateTimeString(),
            'ip'         => $request->ip(),
            'raw_body'   => $rawPayload,
        ]);

        // ── 1. Validate webhook signature ─────────────────────────────────────
        $validation = $this->pipra->handleWebhook();

        if (!$validation['status']) {
            Log::error('Webhook Validation Failed', ['error' => $validation['message'] ?? 'Unknown']);
            return response()->json(['status' => 'error', 'message' => $validation['message'] ?? 'Invalid payload'], 200);
        }

        $data = $validation['data'];

        if (!isset($data['pp_id'], $data['status'])) {
            Log::error('Webhook Missing Required Fields', ['data' => $data]);
            return response()->json(['status' => 'error', 'message' => 'Missing pp_id or status'], 200);
        }

        // ── 2. Update Payment record (existing logic — untouched) ──────────────
        try {
            $payment = Payment::where('pp_id', (string) $data['pp_id'])->first();

            if (!$payment) {
                Log::warning('Webhook Payment Not Found', ['pp_id' => $data['pp_id']]);
                return response()->json(['status' => 'error', 'message' => 'Payment not found'], 200);
            }

            // Per PipraPay official docs, webhook payload has "status": "completed" directly
            $paymentStatus = $data['status'];

            // Update payment record
            $payment->update([
                'customer_name'         => $data['full_name'] ?? $payment->customer_name,
                'customer_email_mobile' => ($data['email_address'] ?? '') . ' | ' . ($data['mobile_number'] ?? ''),
                'payment_method'        => $data['gateway'] ?? null,
                'fee'                   => $data['fee'] ?? '0',
                'refund_amount'         => $data['discount_amount'] ?? '0',
                'total'                 => $data['total'] ?? 0,
                'transaction_id'        => $data['transaction_id'] ?? null,
                'sender_number'         => $data['sender'] ?? null,
                'metadata'              => $data['metadata'] ?? null,
                'status'                => $paymentStatus,
                'paid_at'               => $data['date'] ?? now(),
            ]);

            Log::info('Webhook Payment Updated', [
                'pp_id'  => $data['pp_id'],
                'status' => $paymentStatus,
            ]);

        } catch (\Exception $e) {
            Log::error('Webhook Processing Error', [
                'pp_id' => $data['pp_id'] ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['status' => 'error', 'message' => 'Processing failed'], 200);
        }

        // ── 3. Registration block (new — isolated try/catch, never breaks payment update) ──
        try {
            // Prefer the pending_user_id from payment metadata (most reliable)
            // Webhooks are server-to-server — they have NO browser session; never use session() here
            $webhookMetadata = is_string($data['metadata'] ?? null) 
                ? json_decode($data['metadata'], true) 
                : ($data['metadata'] ?? []);
                
            $pendingUserId = $webhookMetadata['pending_user_id'] ?? null;

            $pendingUser = $pendingUserId
                ? PendingUser::find($pendingUserId)
                : PendingUser::where('payment_type', 'online')
                             ->where('email', $data['email_address'] ?? '')
                             ->first();

            if (!$pendingUser) {
                // Not a registration payment — nothing to do
                Log::info('Webhook: no PendingUser found — not a registration payment', [
                    'pending_user_id' => $pendingUserId,
                ]);

            } elseif ($paymentStatus === 'completed') {
                // ✅ Payment successful → promote PendingUser to User immediately
                $memberId = generate_member_id($pendingUser->department, $pendingUser->session);

                User::create([
                    'name'              => $pendingUser->name,
                    'email'             => $pendingUser->email,
                    'password'          => $pendingUser->password,
                    'phone'             => $pendingUser->phone,
                    'department'        => $pendingUser->department,
                    'session'           => $pendingUser->session,
                    'usertype'          => $pendingUser->usertype ?? 'user',
                    'gender'            => $pendingUser->gender,
                    'class_roll'        => $pendingUser->class_roll,
                    'father_name'       => $pendingUser->father_name,
                    'mother_name'       => $pendingUser->mother_name,
                    'current_address'   => $pendingUser->current_address,
                    'permanent_address' => $pendingUser->permanent_address,
                    'member_id'         => $memberId,
                    'is_approved'       => true,
                ]);

                $pendingUser->delete();
                Log::info('✅ Registration approved via webhook — user created', [
                    'email'     => $pendingUser->email,
                    'member_id' => $memberId,
                ]);

            } elseif ($paymentStatus === 'cancelled') {
                $pendingUser->delete(); // free the email so user can re-register
                Log::info('Registration PendingUser deleted on webhook cancellation', [
                    'email' => $pendingUser->email,
                ]);

            } elseif ($paymentStatus === 'pending') {
                Log::info('Registration payment pending — no action needed', [
                    'email' => $pendingUser->email,
                ]);

            } elseif ($paymentStatus === 'failed') {
                Log::info('Registration payment failed — PendingUser kept for admin review', [
                    'email' => $pendingUser->email,
                ]);
            }

        } catch (\Exception $e) {
            // Log but do NOT return an error — the payment record was already updated successfully
            Log::error('Registration webhook block failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }

        // ── 4. Single return point ─────────────────────────────────────────────
        return response()->json(['status' => 'ok'], 200);
    }
}
