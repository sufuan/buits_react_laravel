<?php

namespace App\Http\Controllers;

use App\Services\PipraPay;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
use App\Models\PendingUser;
use Inertia\Inertia;

class PipraPayController extends Controller
{
    protected $pipra;

    public function __construct()
    {
        $this->pipra = new PipraPay(
            env('PIPRAPAY_API_KEY'),
            env('PIPRAPAY_BASE_URL'),
            env('PIPRAPAY_CURRENCY', 'BDT')
        );
    }

    // Step 1: Create charge
    public function createCharge(Request $request)
    {
        try {
            Log::info('PipraPay createCharge called with data:', $request->all());

            // Check environment variables
            $apiKey = env('PIPRAPAY_API_KEY');
            $baseUrl = env('PIPRAPAY_BASE_URL');
            $currency = env('PIPRAPAY_CURRENCY', 'BDT');

            Log::info('PipraPay Environment Check:', [
                'api_key_exists' => !empty($apiKey),
                'api_key_length' => strlen($apiKey ?? ''),
                'base_url' => $baseUrl,
                'currency' => $currency
            ]);

            if (empty($apiKey) || empty($baseUrl)) {
                throw new \Exception('PipraPay configuration is missing. Please check environment variables.');
            }

            // Basic validation for PipraPay
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255',
                'amount' => 'required|numeric|min:1',
            ]);

            Log::info('Validation passed');

            // Store registration data in session for later use
            Session::put('registration_data', $request->all());
            Log::info('Registration data stored in session');

            $chargeData = [
                'full_name'   => $request->input('name'),
                'email_mobile'=> $request->input('email'),
                'amount'      => (string)$request->input('amount'),
                'metadata'    => [
                    'invoiceid' => uniqid('INV-'),
                    'type' => 'registration',
                    'email' => $request->input('email')
                ],
                'redirect_url'=> route('piprapay.success'),
                'return_type' => 'GET',
                'cancel_url'  => route('piprapay.cancel'),
                'webhook_url' => route('piprapay.webhook'),
            ];

            Log::info('Charge data prepared:', $chargeData);

            $response = $this->pipra->createCharge($chargeData);
            Log::info('PipraPay API response:', $response);

            // Detailed response analysis
            if (is_array($response)) {
                Log::info('Response is array. Keys:', ['keys' => array_keys($response)]);
                if (isset($response['status'])) {
                    Log::info('Response status:', ['status' => $response['status']]);
                }
                if (isset($response['error'])) {
                    Log::info('Response error:', ['error' => $response['error']]);
                }
                if (isset($response['pp_url'])) {
                    Log::info('Response pp_url:', ['pp_url' => $response['pp_url']]);
                }
            } else {
                Log::info('Response type:', ['type' => gettype($response)]);
                Log::info('Response content:', ['content' => $response]);
            }

            if (!empty($response['pp_url'])) {
                Log::info('Redirecting to PipraPay URL:', ['url' => $response['pp_url']]);

                // Return an Inertia response with redirect URL
                return Inertia::render('Auth/PaymentRedirect', [
                    'redirect_url' => $response['pp_url']
                ]);
            }

            $errorMessage = $response['error'] ?? 'Unable to create charge';
            Log::error('PipraPay charge creation failed:', ['error' => $errorMessage, 'response' => $response]);

            return redirect()->route('register')->withErrors([
                'payment_method' => 'PipraPay service is currently unavailable. Please try manual payment method.'
            ]);

        } catch (\Exception $e) {
            Log::error('Exception in createCharge:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->route('register')->withErrors([
                'payment_method' => 'An error occurred while processing your request. Please try again.'
            ]);
        }
    }

    // Step 2: Success callback
    public function success(Request $request)
    {
        $pp_id = $request->query('pp_id'); // PipraPay sends this back
        $verify = $this->pipra->verifyPayment($pp_id);

        if (!empty($verify['status']) && $verify['status'] === 'paid') {
            // Get registration data from session
            $registrationData = Session::get('registration_data');

            if ($registrationData) {
                // Generate member ID
                $departmentCodes = [
                    'Computer Science and Engineering' => 'CSE',
                    'Electrical and Electronic Engineering' => 'EEE',
                    'Civil Engineering' => 'CE',
                    'Mechanical Engineering' => 'ME',
                    'Business Administration' => 'BBA',
                    'Economics' => 'ECO',
                    'English' => 'ENG',
                    'Mathematics' => 'MATH',
                    'Physics' => 'PHY',
                    'Chemistry' => 'CHEM',
                    'Biology' => 'BIO',
                    'Law' => 'LAW',
                    'Marketing' => 'MKT',
                    'Accounting' => 'ACC',
                    'Finance' => 'FIN',
                    'Management' => 'MGT',
                    'Political Science' => 'PS',
                    'Sociology' => 'SOC',
                    'Psychology' => 'PSY',
                    'History' => 'HIST',
                    'Philosophy' => 'PHIL',
                    'Islamic Studies' => 'IS',
                    'Arabic' => 'ARB',
                    'Bangla' => 'BAN',
                ];

                $deptCode = $departmentCodes[$registrationData['department']] ?? 'GEN';
                $year = date('Y');
                $lastUser = PendingUser::where('member_id', 'like', "BUITS-{$deptCode}-{$year}-%")->latest()->first();
                $nextNumber = $lastUser ? (int)substr($lastUser->member_id, -3) + 1 : 1;
                $memberId = sprintf("BUITS-%s-%s-%03d", $deptCode, $year, $nextNumber);

                // Create pending user
                PendingUser::create([
                    'name' => $registrationData['name'],
                    'email' => $registrationData['email'],
                    'password' => Hash::make($registrationData['password']),
                    'phone' => $registrationData['phone'],
                    'department' => $registrationData['department'],
                    'session' => $registrationData['session'],
                    'gender' => $registrationData['gender'],
                    'class_roll' => $registrationData['class_roll'],
                    'father_name' => $registrationData['father_name'],
                    'mother_name' => $registrationData['mother_name'],
                    'current_address' => $registrationData['current_address'],
                    'permanent_address' => $registrationData['permanent_address'],
                    'member_id' => $memberId,
                    'payment_status' => 'paid',
                    'payment_method' => 'piprapay',
                    'transaction_id' => $pp_id,
                    'amount' => $registrationData['amount'],
                ]);

                // Clear session data
                Session::forget('registration_data');

                return redirect()->route('register')->with('success', 'Registration successful! Your payment has been confirmed. Please wait for admin approval.');
            }
        }

        return redirect()->route('register')->with('error', 'Payment verification failed. Please try again.');
    }

    // Step 3: Cancel callback
    public function cancel()
    {
        // Clear session data
        Session::forget('registration_data');

        return redirect()->route('register')->with('error', 'Payment was cancelled. Please try again.');
    }

    // Step 4: Webhook (IPN)
    public function webhook(Request $request)
    {
        $data = $this->pipra->handleWebhook(env('PIPRAPAY_API_KEY'));

        if ($data['status']) {
            // Process $data['data'] → contains payment info
            // e.g. mark order as paid
        }

        return response()->json(['ok' => true]);
    }
}
