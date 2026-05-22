<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Services\PipraPay;
use Illuminate\Http\Request;
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
     * Creates charge with PipraPay, saves to DB, redirects to PipraPay checkout.
     * Webhook handles payment updates when user completes payment.
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
            'return_url'    => route('home'),
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
     * Webhook endpoint — receives real-time updates from PipraPay.
     * Updates payment record when payment status changes.
     */
    public function webhook(Request $request)
    {
        $validation = $this->pipra->handleWebhook();

        if (!$validation['status']) {
            return response()->json(['status' => 'error', 'message' => 'Invalid payload'], 400);
        }

        $data = $validation['data'];

        if (isset($data['pp_id'], $data['status'])) {
            Payment::where('pp_id', (string) $data['pp_id'])->update([
                'customer_name'         => $data['full_name'] ?? null,
                'customer_email_mobile' => ($data['email_address'] ?? '') . ' | ' . ($data['mobile_number'] ?? ''),
                'payment_method'        => $data['gateway'] ?? null,
                'fee'                   => $data['fee'] ?? '0',
                'refund_amount'         => $data['discount_amount'] ?? '0',
                'total'                 => $data['total'] ?? 0,
                'transaction_id'        => $data['transaction_id'] ?? null,
                'sender_number'         => $data['sender'] ?? null,
                'metadata'              => $data['metadata'] ?? null,
                'status'                => $data['status'],
                'paid_at'               => $data['date'] ?? null,
            ]);
        }

        return response()->json(['status' => 'ok'], 200);
    }
}
