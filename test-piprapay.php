<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Get config values
$apiKey = config('services.piprapay.api_key');
$baseUrl = config('services.piprapay.base_url');
$currency = config('services.piprapay.currency');

echo "API Key: " . $apiKey . "\n";
echo "Base URL: " . $baseUrl . "\n";
echo "Currency: " . $currency . "\n";
echo "API Key Length: " . strlen($apiKey) . "\n";
echo "\n";

// Test the actual HTTP request
use Illuminate\Support\Facades\Http;

$testData = [
    'full_name' => 'Test User',
    'email_address' => 'test@example.com',
    'mobile_number' => '01712345678',
    'amount' => '100',
    'currency' => $currency,
    'metadata' => json_encode(['test' => true]),
    'return_url' => 'http://127.0.0.1:8000/payment/success',
    'webhook_url' => 'http://127.0.0.1:8000/payment/webhook',
];

echo "Making API request to: " . $baseUrl . "/api/checkout/redirect\n";
echo "With headers:\n";
echo "  - accept: application/json\n";
echo "  - content-type: application/json\n";
echo "  - MHS-PIPRAPAY-API-KEY: " . $apiKey . "\n";
echo "\n";
echo "Request body:\n";
echo json_encode($testData, JSON_PRETTY_PRINT) . "\n\n";

$response = Http::withHeaders([
    'accept' => 'application/json',
    'content-type' => 'application/json',
    'MHS-PIPRAPAY-API-KEY' => $apiKey,
])->post($baseUrl . '/api/checkout/redirect', $testData);

echo "Response Status: " . $response->status() . "\n";
echo "Response Body:\n";
echo $response->body() . "\n";
