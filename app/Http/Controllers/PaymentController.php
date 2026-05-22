<?php

namespace App\Http\Controllers;

use App\Models\Payment;
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

        $response = $this->pipra->createCharge([
            'full_name'     => $validated['full_name'],
            'email_address' => $validated['email_address'],
            'mobile_number' => $validated['mobile_number'],
            'amount'        => (string) $validated['amount'],
            'metadata'      => ['invoiceid' => $invoiceId],
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
                'metadata'              => ['invoiceid' => $invoiceId],
                'status'                => 'pending',
            ]);

            return Inertia::location($response['pp_url']);
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
            return redirect()->route('home');
        }

        // Payment will be updated by webhook
        $payment = Payment::where('pp_id', (string) $ppId)->first();

        if (!$payment) {
            return redirect()->route('home');
        }

        // Handle cancelled status from return_url
        if ($ppStatus === 'canceled') {
            $payment->update(['status' => 'cancelled']);
            return redirect()->route('home');
        }

        return response()->json([
            'status' => 'ok',
            'message' => 'Payment received. Your payment is being processed.',
            'pp_id' => $ppId,
            'payment_status' => $payment->status,
        ]);
    }

    /**
     * Webhook endpoint — receives real-time updates from PipraPay.
     * Updates payment record with status from PipraPay.
     */
    public function webhook(Request $request)
    {
        $validation = $this->pipra->handleWebhook();

        if (!$validation['status']) {
            Log::error('Webhook Validation Failed', ['error' => $validation['message'] ?? 'Unknown']);
            return response()->json(['status' => 'error', 'message' => $validation['message'] ?? 'Invalid payload'], 400);
        }

        $data = $validation['data'];

        if (!isset($data['pp_id'], $data['status'])) {
            Log::error('Webhook Missing Required Fields', ['data' => $data]);
            return response()->json(['status' => 'error', 'message' => 'Missing pp_id or status'], 400);
        }

        try {
            $payment = Payment::where('pp_id', (string) $data['pp_id'])->first();

            if (!$payment) {
                Log::warning('Webhook Payment Not Found', ['pp_id' => $data['pp_id']]);
                return response()->json(['status' => 'error', 'message' => 'Payment not found'], 404);
            }

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
                'status'                => $data['status'],
                'paid_at'               => $data['date'] ?? now(),
            ]);

            Log::info('Webhook Payment Updated', [
                'pp_id' => $data['pp_id'],
                'status' => $data['status'],
            ]);

            return response()->json(['status' => 'ok'], 200);
        } catch (\Exception $e) {
            Log::error('Webhook Processing Error', [
                'pp_id' => $data['pp_id'] ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['status' => 'error', 'message' => 'Processing failed'], 500);
        }
    }
}
