<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class PipraPay
{
    protected string $api_key;
    protected string $base_url;
    protected string $currency;

    public function __construct(string $api_key, string $base_url, string $currency = 'BDT')
    {
        $this->api_key  = $api_key;
        $this->base_url = rtrim($base_url, '/');
        $this->currency = $currency;
    }

    /**
     * Create a new payment charge.
     * Endpoint: POST https://pay.buits.org/api/checkout/redirect
     */
    public function createCharge(array $data): array
    {
        // Map our data to PipraPay's expected format (all fields required per API spec)
        $payload = [
            'full_name' => $data['full_name'],
            'email_address' => $data['email_address'],
            'mobile_number' => $data['mobile_number'],
            'amount' => (string) $data['amount'],
            'currency' => $this->currency,
            'metadata' => json_encode($data['metadata'] ?? []),
            'return_url' => $data['return_url'],
            'webhook_url' => $data['webhook_url'],
        ];

        return $this->post('/api/checkout/redirect', $payload);
    }

    /**
     * Verify a payment by pp_id.
     * Endpoint: POST https://pay.buits.org/api/verify-payment
     */
    public function verifyPayment(string $pp_id): array
    {
        return $this->post('/api/verify-payment', ['pp_id' => $pp_id]);
    }

    /**
     * Refund a payment by pp_id.
     * Endpoint: POST https://pay.buits.org/api/refund-payment
     */
    public function refundPayment(string $pp_id): array
    {
        return $this->post('/api/refund-payment', ['pp_id' => $pp_id]);
    }

    /**
     * Handle incoming webhook from PipraPay.
     * No API key validation needed for webhooks per official docs.
     */
    public function handleWebhook(): array
    {
        // Get raw JSON payload
        $payload = json_decode(file_get_contents('php://input'), true);

        if (!$payload) {
            return ['status' => false, 'message' => 'Invalid payload'];
        }

        return ['status' => true, 'data' => $payload];
    }

    /**
     * Internal POST helper — sends requests to https://pay.buits.org/api
     */
    protected function post(string $endpoint, array $data): array
    {
        $response = Http::withHeaders([
            'accept'              => 'application/json',
            'content-type'        => 'application/json',
            'MHS-PIPRAPAY-API-KEY' => $this->api_key,
        ])->post($this->base_url . $endpoint, $data);

        if ($response->successful()) {
            return $response->json() ?? [];
        }

        return ['status' => false, 'error' => $response->body()];
    }
}
