<?php

namespace App\Console\Commands;

use App\Models\Payment;
use App\Services\PipraPay;
use Illuminate\Console\Command;

class VerifyPendingPayments extends Command
{
    protected $signature   = 'payments:verify-pending';
    protected $description = 'Auto-verify pending payments via PipraPay API';

    public function handle(): void
    {
        $pipra = new PipraPay(
            config('services.piprapay.api_key'),
            config('services.piprapay.base_url'),
            config('services.piprapay.currency', 'BDT')
        );

        // Only check payments created in last 2 hours still pending
        $pending = Payment::where('status', 'pending')
            ->where('created_at', '>=', now()->subHours(2))
            ->get();

        $this->info("Checking {$pending->count()} pending payments...");

        foreach ($pending as $payment) {
            $result = $pipra->verifyPayment($payment->pp_id);

            if (isset($result['status']) && $result['status'] === 'completed') {
                $payment->update([
                    'customer_name'         => $result['full_name'] ?? null,
                    'customer_email_mobile' => ($result['email_address'] ?? '') . ' | ' . ($result['mobile_number'] ?? ''),
                    'payment_method'        => $result['gateway'] ?? null,
                    'fee'                   => $result['fee'] ?? '0',
                    'refund_amount'         => $result['discount_amount'] ?? '0',
                    'total'                 => $result['total'] ?? 0,
                    'transaction_id'        => $result['transaction_id'] ?? null,
                    'sender_number'         => $result['sender'] ?? null,
                    'metadata'              => $result['metadata'] ?? null,
                    'status'                => 'completed',
                    'paid_at'               => $result['date'] ?? null,
                ]);

                $this->info("✅ Verified: {$payment->pp_id}");
            }
        }

        $this->info('Done.');
    }
}
