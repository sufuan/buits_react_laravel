<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\PendingUser;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        $departments = [
            'Marketing',
            'Law',
            'Mathematics',
            'Physics',
            'History & Civilization',
            'Soil & Environmental Sciences',
            'Economics',
            'Geology & Mining',
            'Management Studies',
            'Statistics',
            'Chemistry',
            'Coastal Studies and Disaster Management',
            'Accounting & Information Systems',
            'Computer Science and Engineering',
            'Sociology',
            'Botany',
            'Public Administration',
            'Philosophy',
            'Political Science',
            'Biochemistry and Biotechnology',
            'Finance and Banking',
            'Mass Communication and Journalism',
            'English',
            'Bangla',
        ];

        return Inertia::render('Auth/Register', [
            'departments' => $departments
        ]);
    }

    /**
     * Check if an email is already registered or pending.
     */
    public function checkEmail(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email', 'max:255'],
        ]);

        $email = strtolower($request->email);

        if (User::where('email', $email)->exists()) {
            return response()->json([
                'available' => false,
                'message'   => 'This email is already registered. Please sign in or use a different email address.',
            ]);
        }

        if (PendingUser::where('email', $email)->exists()) {
            return response()->json([
                'available' => false,
                'message'   => 'A registration with this email is already pending admin approval. Please wait or contact support.',
            ]);
        }

        return response()->json(['available' => true]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Validate the standard user fields
        $request->validate([
            'name'              => ['required', 'string', 'max:255'],
            'email'             => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class, 'unique:pending_users,email'],
            'password'          => ['required', 'confirmed', Rules\Password::defaults()],
            'phone'             => ['required', 'string', 'max:255'],
            'department'        => ['required', 'string', 'max:255'],
            'session'           => ['required', 'string', 'regex:/^\d{4}-\d{4}$/'],
            'gender'            => ['required', 'string', 'max:255'],
            'class_roll'        => ['required', 'string'],
            'father_name'       => ['nullable', 'string', 'max:255'],
            'mother_name'       => ['nullable', 'string', 'max:255'],
            'current_address'   => ['nullable', 'string', 'max:255'],
            'permanent_address' => ['nullable', 'string', 'max:255'],

            // Payment fields
            'payment_type'   => ['required', 'string', 'in:online,offline'],
            'transaction_id' => Rule::when(
                $request->payment_type === 'offline',
                ['required', 'string', 'max:255', 'unique:pending_users,transaction_id', 'unique:users,transaction_id'],
                ['nullable', 'string', 'max:255']
            ),
            'to_account'     => Rule::when(
                $request->payment_type === 'offline',
                ['required', 'string'],
                ['nullable', 'string']
            ),
            'payment_method' => Rule::when(
                $request->payment_type === 'offline',
                ['required', 'string', 'in:bkash,rocket,nagad'],
                ['nullable', 'string']
            ),
        ]);

        // ── OFFLINE PATH ──────────────────────────────────────────────────────
        // For offline payments we create the PendingUser immediately because
        // the email reservation is intentional — admin must review the payment.
        if ($request->payment_type === 'offline') {
            PendingUser::create([
                'name'              => $request->name,
                'email'             => $request->email,
                'password'          => Hash::make($request->password),
                'phone'             => $request->phone,
                'department'        => $request->department,
                'session'           => $request->session,
                'usertype'          => 'user',
                'gender'            => $request->gender,
                'class_roll'        => $request->class_roll,
                'father_name'       => $request->father_name,
                'mother_name'       => $request->mother_name,
                'current_address'   => $request->current_address,
                'permanent_address' => $request->permanent_address,
                'transaction_id'    => $request->transaction_id,
                'to_account'        => $request->to_account,
                'payment_method'    => $request->payment_method,
                'payment_type'      => 'offline',
                'payment_status'    => 'pending_payment',
            ]);

            return redirect()->route('login')->with('status', 'Registration submitted! Your payment is under review.');
        }

        // ── ONLINE PATH ───────────────────────────────────────────────────────
        // Do NOT write to the database yet. The email remains free until the
        // user actually clicks "Proceed to Pay Online" and hits initiate().
        // We store all form data in the encrypted server-side session so that
        // no database row exists — and the email stays available — unless the
        // user commits to paying.
        session([
            'registration_form_data' => [
                'name'              => $request->name,
                'email'             => $request->email,
                'password'          => Hash::make($request->password),
                'phone'             => $request->phone,
                'department'        => $request->department,
                'session'           => $request->session,
                'usertype'          => 'user',
                'gender'            => $request->gender,
                'class_roll'        => $request->class_roll,
                'father_name'       => $request->father_name,
                'mother_name'       => $request->mother_name,
                'current_address'   => $request->current_address,
                'permanent_address' => $request->permanent_address,
                'payment_type'      => 'online',
                'payment_status'    => 'pending_payment',
            ],
        ]);

        return redirect()->route('registration.payment.checkout');
    }

    /**
     * Display the payment checkout page for online registration.
     */
    public function registrationCheckout(): Response|RedirectResponse
    {
        // Read from session — no DB row has been created yet for online registrations.
        $formData = session('registration_form_data');

        if (!$formData) {
            return redirect()->route('register')
                ->withErrors(['error' => 'Session expired. Please fill in the registration form again.']);
        }

        return Inertia::render('Auth/RegistrationPayment', [
            'pending_user' => [
                'name'  => $formData['name'],
                'email' => $formData['email'],
                'phone' => $formData['phone'],
            ],
            'amount' => config('services.piprapay.registration_fee'),
        ]);
    }

    /**
     * Handle registration cancellation and free the email.
     */
    public function registrationCancelled(): Response
    {
        // Two possible states when this page is reached:
        //
        // A) User abandoned BEFORE clicking "Proceed to Pay Online":
        //    → registration_form_data is in session, NO PendingUser row exists.
        //    → Just clear the session; email was never locked.
        //
        // B) User clicked "Proceed to Pay Online" then cancelled AT PipraPay:
        //    → initiate() already created a PendingUser row and stored its ID
        //      under registration_pending_user_id.
        //    → We must delete that row NOW so the email is freed immediately,
        //      rather than waiting for the async webhook to clean up.
        $pendingUserId = session('registration_pending_user_id');
        if ($pendingUserId) {
            PendingUser::find($pendingUserId)?->delete();
        }

        session()->forget(['registration_form_data', 'registration_pending_user_id']);

        return Inertia::render('Auth/RegistrationCancelled');
    }

    /**
     * Display the success page for online registration.
     */
    public function registrationSuccess(Request $request): Response
    {
        return Inertia::render('Auth/RegistrationSuccess', [
            'transaction_id' => $request->query('transaction_id')
        ]);
    }
}
