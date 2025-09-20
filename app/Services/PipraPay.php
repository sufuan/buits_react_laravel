<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class PipraPay
{
    protected $api_key;
    protected $base_url;
    protected $currency;

    public function __construct($api_key, $base_url, $currency = 'BDT')
    {
        $this->api_key = $api_key;
        $this->base_url = rtrim($base_url, '/');
        $this->currency = $currency;
    }

    public function createCharge($data)
    {
        // Ensure all required fields are present according to PipraPay API
        $chargeData = [
            'full_name' => $data['full_name'] ?? 'Demo',
            'email_mobile' => $data['email_mobile'] ?? 'demo@gmail.com',
            'amount' => (string)($data['amount'] ?? '10'),
            'metadata' => $data['metadata'] ?? [],
            'redirect_url' => $data['redirect_url'] ?? 'https://piprapay.com',
            'return_type' => $data['return_type'] ?? 'GET',
            'cancel_url' => $data['cancel_url'] ?? 'https://piprapay.com',
            'webhook_url' => $data['webhook_url'] ?? 'https://piprapay.com',
            'currency' => $this->currency,
        ];

        return $this->post('/create-charge', $chargeData);
    }

    public function verifyPayment($pp_id)
    {
        return $this->post('/verify-payments', ['pp_id' => $pp_id]);
    }

    public function handleWebhook($expected_api_key)
    {
        $received_key = request()->header('mh-piprapay-api-key');

        if ($received_key !== $expected_api_key) {
            return ['status' => false, 'message' => 'Unauthorized'];
        }

        return ['status' => true, 'data' => request()->all()];
    }

    protected function post($endpoint, $data)
    {
        $response = Http::withHeaders([
            'accept' => 'application/json',
            'content-type' => 'application/json',
            'mh-piprapay-api-key' => $this->api_key
        ])->post($this->base_url . $endpoint, $data);

        if ($response->successful()) {
            return $response->json();
        }

        return ['status' => false, 'error' => $response->body()];
    }
}