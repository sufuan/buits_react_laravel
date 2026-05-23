import { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    User,
    Mail,
    Phone,
    GraduationCap,
    MapPin,
    CreditCard,
    CheckCircle,
    Sparkles,
    Heart,
    Star
} from 'lucide-react';

export default function Register({ success }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [emailChecking, setEmailChecking] = useState(false);
    const [emailError, setEmailError] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        department: '',
        session: '',
        gender: 'male',
        class_roll: '',
        father_name: '',
        mother_name: '',
        current_address: '',
        permanent_address: '',
        transaction_id: '',
        to_account: '01939378080',
        payment_method: '',
        payment_type: '',
    });

    const totalSteps = 5;

    // Step definitions with icons and titles
    const steps = [
        {
            id: 1,
            title: "Personal Info",
            subtitle: "Tell us about yourself",
            icon: User,
            color: "from-blue-500 to-purple-600"
        },
        {
            id: 2,
            title: "Contact Details",
            subtitle: "How can we reach you?",
            icon: Mail,
            color: "from-green-500 to-blue-500"
        },
        {
            id: 3,
            title: "Academic Info",
            subtitle: "Your educational background",
            icon: GraduationCap,
            color: "from-purple-500 to-pink-500"
        },
        {
            id: 4,
            title: "Address & Family",
            subtitle: "Where do you live?",
            icon: MapPin,
            color: "from-orange-500 to-red-500"
        },
        {
            id: 5,
            title: "Payment Info",
            subtitle: "Complete your registration",
            icon: CreditCard,
            color: "from-teal-500 to-green-500"
        }
    ];

    // Navigation functions
    const nextStep = async () => {
        if (currentStep >= totalSteps || !validateCurrentStep()) return;

        // Server-side email check on step 1
        if (currentStep === 1) {
            setEmailChecking(true);
            setEmailError('');
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
                const res = await fetch(route('register.check-email'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    body: JSON.stringify({ email: data.email }),
                });
                const json = await res.json();
                if (!json.available) {
                    setEmailError(json.message);
                    setEmailChecking(false);
                    return; // block navigation
                }
            } catch {
                setEmailError('Unable to verify email. Please check your connection and try again.');
                setEmailChecking(false);
                return;
            }
            setEmailChecking(false);
        }

        setIsAnimating(true);
        setTimeout(() => {
            setCompletedSteps(prev => [...prev, currentStep]);
            setCurrentStep(prev => prev + 1);
            setIsAnimating(false);
        }, 300);
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep(prev => prev - 1);
                setIsAnimating(false);
            }, 300);
        }
    };

    const goToStep = (step) => {
        if (step <= currentStep || completedSteps.includes(step - 1)) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep(step);
                setIsAnimating(false);
            }, 300);
        }
    };

    // Validation for current step
    const validateCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return data.name && data.email && data.password && data.password_confirmation;
            case 2:
                return data.phone;
            case 3:
                return data.department && data.session;
            case 4:
                return data.current_address;
            case 5:
                if (!data.payment_type) return false;
                if (data.payment_type === 'offline') {
                    return !!(data.transaction_id && data.payment_method);
                }
                return true; // online — no extra fields needed
            default:
                return true;
        }
    };

    // Departments from your controller
    const departments = [
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

    // Dynamic sessions from 2015 to current year
    const generateSessions = () => {
        const currentYear = new Date().getFullYear();
        const startYear = 2015;
        const sessions = [];
        for (let year = startYear; year <= currentYear; year++) {
            sessions.push(`${year}-${year + 1}`);
        }
        return sessions;
    };

    const sessions = generateSessions();

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
            <Head title="Register - Join Us!" />

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }

                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
            `}</style>

            <div className="w-full max-w-4xl">
                {/* Header with Progress */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Join Our Community
                        </h1>
                
                    </div>
                    <p className="text-gray-600 text-lg">Let's get you started on this exciting journey!</p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-4 bg-white rounded-full px-6 py-3 shadow-lg">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.id;
                            const isCompleted = completedSteps.includes(step.id);
                            const isAccessible = step.id <= currentStep || completedSteps.includes(step.id - 1);

                            return (
                                <div key={step.id} className="flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => goToStep(step.id)}
                                        disabled={!isAccessible}
                                        className={`
                                            relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 transform
                                            ${isActive
                                                ? `bg-gradient-to-r ${step.color} text-white scale-110 shadow-lg`
                                                : isCompleted
                                                    ? 'bg-green-500 text-white hover:scale-105'
                                                    : isAccessible
                                                        ? 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:scale-105'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle className="h-6 w-6" />
                                        ) : (
                                            <Icon className="h-6 w-6" />
                                        )}

                                        {isActive && (
                                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-75 animate-ping"></div>
                                        )}
                                    </button>

                                    {index < steps.length - 1 && (
                                        <div className={`w-8 h-1 mx-2 rounded-full transition-colors duration-300 ${
                                            completedSteps.includes(step.id) ? 'bg-green-400' : 'bg-gray-200'
                                        }`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center animate-fade-in">
                        <CheckCircle className="h-5 w-5 inline mr-2" />
                        {success}
                    </div>
                )}

                {/* Main Form Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className={`bg-gradient-to-r ${steps[currentStep - 1].color} p-6 text-white`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">{steps[currentStep - 1].title}</h2>
                                <p className="text-white/80 mt-1">{steps[currentStep - 1].subtitle}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">{currentStep}</div>
                                <div className="text-sm text-white/80">of {totalSteps}</div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} className="p-8">
                        <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
                            {/* Step 1: Personal Information */}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="text-center mb-6">
                                        <Star className="h-12 w-12 text-yellow-500 mx-auto mb-2 animate-spin-slow" />
                                        <h3 className="text-xl font-semibold text-gray-800">Tell us about yourself!</h3>
                                        <p className="text-gray-600">We're excited to get to know you better</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="name" value="Full Name" className="text-gray-700 font-medium" />
                                            <TextInput
                                                id="name"
                                                name="name"
                                                value={data.name}
                                                className="mt-2 block w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                                autoComplete="name"
                                                isFocused={true}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Enter your full name"
                                                required
                                            />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="email" value="Email Address" className="text-gray-700 font-medium" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                className={`mt-2 block w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${
                                                    emailError ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''
                                                }`}
                                                autoComplete="username"
                                                onChange={(e) => { setData('email', e.target.value); setEmailError(''); }}
                                                placeholder="your.email@example.com"
                                                required
                                            />
                                            <InputError message={errors.email} className="mt-2" />
                                        </div>

                                        {/* Email duplicate error banner */}
                                        {emailError && (
                                            <div className="md:col-span-2 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
                                                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                                                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-red-700">Email Not Available</p>
                                                    <p className="text-sm text-red-600 mt-0.5">{emailError}</p>
                                                    <Link href={route('login')} className="inline-block mt-2 text-sm font-medium text-red-700 underline hover:text-red-900">
                                                        Sign in instead →
                                                    </Link>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <InputLabel htmlFor="password" value="Password" className="text-gray-700 font-medium" />
                                            <TextInput
                                                id="password"
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                className="mt-2 block w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Create a strong password"
                                                required
                                            />
                                            <InputError message={errors.password} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-gray-700 font-medium" />
                                            <TextInput
                                                id="password_confirmation"
                                                type="password"
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                className="mt-2 block w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Confirm your password"
                                                required
                                            />
                                            <InputError message={errors.password_confirmation} className="mt-2" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Contact Details */}
                            {currentStep === 2 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="text-center mb-6">
                                        <Phone className="h-12 w-12 text-green-500 mx-auto mb-2 animate-pulse" />
                                        <h3 className="text-xl font-semibold text-gray-800">How can we reach you?</h3>
                                        <p className="text-gray-600">Let's get your contact information</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="phone" value="Phone Number" className="text-gray-700 font-medium" />
                                            <TextInput
                                                id="phone"
                                                name="phone"
                                                value={data.phone}
                                                className="mt-2 block w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="01XXXXXXXXX"
                                                required
                                            />
                                            <InputError message={errors.phone} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="gender" value="Gender" className="text-gray-700 font-medium" />
                                            <select
                                                id="gender"
                                                name="gender"
                                                value={data.gender}
                                                onChange={(e) => setData('gender', e.target.value)}
                                                className="mt-2 block w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                required
                                            >
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                            <InputError message={errors.gender} className="mt-2" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Academic Information */}
                            {currentStep === 3 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="text-center mb-6">
                                        <GraduationCap className="h-12 w-12 text-purple-500 mx-auto mb-2 animate-bounce" />
                                        <h3 className="text-xl font-semibold text-gray-800">Your Academic Journey</h3>
                                        <p className="text-gray-600">Tell us about your educational background</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="department" value="Department" className="text-gray-700 font-medium" />
                                            <select
                                                id="department"
                                                name="department"
                                                value={data.department}
                                                onChange={(e) => setData('department', e.target.value)}
                                                className="mt-2 block w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                                required
                                            >
                                                <option value="">Select Department</option>
                                                {departments.map((dept) => (
                                                    <option key={dept} value={dept}>{dept}</option>
                                                ))}
                                            </select>
                                            <InputError message={errors.department} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="session" value="Session" className="text-gray-700 font-medium" />
                                            <select
                                                id="session"
                                                name="session"
                                                value={data.session}
                                                onChange={(e) => setData('session', e.target.value)}
                                                className="mt-2 block w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                                required
                                            >
                                                <option value="">Select Session</option>
                                                {sessions.map((session) => (
                                                    <option key={session} value={session}>{session}</option>
                                                ))}
                                            </select>
                                            <InputError message={errors.session} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="class_roll" value="Class Roll" className="text-gray-700 font-medium" />
                                            <TextInput
                                                id="class_roll"
                                                name="class_roll"
                                                value={data.class_roll}
                                                className="mt-2 block w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                                onChange={(e) => setData('class_roll', e.target.value)}
                                                placeholder="Enter your roll number"
                                            />
                                            <InputError message={errors.class_roll} className="mt-2" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Address & Family */}
                            {currentStep === 4 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="text-center mb-6">
                                        <MapPin className="h-12 w-12 text-orange-500 mx-auto mb-2 animate-pulse" />
                                        <h3 className="text-xl font-semibold text-gray-800">Where do you call home?</h3>
                                        <p className="text-gray-600">Tell us about your family and address</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <InputLabel htmlFor="father_name" value="Father's Name" className="text-gray-700 font-medium" />
                                                <TextInput
                                                    id="father_name"
                                                    name="father_name"
                                                    value={data.father_name}
                                                    className="mt-2 block w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                                    onChange={(e) => setData('father_name', e.target.value)}
                                                    placeholder="Enter father's name"
                                                />
                                                <InputError message={errors.father_name} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="mother_name" value="Mother's Name" className="text-gray-700 font-medium" />
                                                <TextInput
                                                    id="mother_name"
                                                    name="mother_name"
                                                    value={data.mother_name}
                                                    className="mt-2 block w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                                    onChange={(e) => setData('mother_name', e.target.value)}
                                                    placeholder="Enter mother's name"
                                                />
                                                <InputError message={errors.mother_name} className="mt-2" />
                                            </div>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="current_address" value="Current Address" className="text-gray-700 font-medium" />
                                            <textarea
                                                id="current_address"
                                                name="current_address"
                                                value={data.current_address}
                                                onChange={(e) => setData('current_address', e.target.value)}
                                                className="mt-2 block w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                                rows="3"
                                                placeholder="Enter your current address"
                                                required
                                            />
                                            <InputError message={errors.current_address} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="permanent_address" value="Permanent Address" className="text-gray-700 font-medium" />
                                            <textarea
                                                id="permanent_address"
                                                name="permanent_address"
                                                value={data.permanent_address}
                                                onChange={(e) => setData('permanent_address', e.target.value)}
                                                className="mt-2 block w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                                rows="3"
                                                placeholder="Enter your permanent address"
                                            />
                                            <InputError message={errors.permanent_address} className="mt-2" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 5: Payment Information */}
                            {currentStep === 5 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="text-center mb-6">
                                        <CreditCard className="h-12 w-12 text-teal-500 mx-auto mb-2 animate-pulse" />
                                        <h3 className="text-xl font-semibold text-gray-800">Almost there!</h3>
                                        <p className="text-gray-600">Choose a payment method and complete your registration</p>
                                    </div>

                                    {/* Payment Type Selection */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setData('payment_type', 'online');
                                                setData('payment_method', '');
                                                setData('transaction_id', '');
                                            }}
                                            className={`
                                                relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300
                                                ${data.payment_type === 'online'
                                                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-transparent shadow-xl scale-105 ring-4 ring-blue-300 ring-opacity-50'
                                                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:shadow-md'
                                                }
                                            `}
                                        >
                                            <CreditCard className={`h-10 w-10 mb-3 ${data.payment_type === 'online' ? 'text-white' : 'text-blue-500'}`} />
                                            <h4 className="text-lg font-bold mb-1">Pay Online</h4>
                                            <p className={`text-sm text-center ${data.payment_type === 'online' ? 'text-blue-100' : 'text-gray-500'}`}>
                                                Redirected to payment gateway
                                            </p>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setData('payment_type', 'offline')}
                                            className={`
                                                relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300
                                                ${data.payment_type === 'offline'
                                                    ? 'bg-gradient-to-br from-orange-500 to-pink-600 text-white border-transparent shadow-xl scale-105 ring-4 ring-orange-300 ring-opacity-50'
                                                    : 'bg-white text-gray-700 border-gray-200 hover:border-orange-400 hover:shadow-md'
                                                }
                                            `}
                                        >
                                            <Phone className={`h-10 w-10 mb-3 ${data.payment_type === 'offline' ? 'text-white' : 'text-orange-500'}`} />
                                            <h4 className="text-lg font-bold mb-1">Pay Offline</h4>
                                            <p className={`text-sm text-center ${data.payment_type === 'offline' ? 'text-orange-100' : 'text-gray-500'}`}>
                                                bKash / Rocket / Nagad
                                            </p>
                                        </button>
                                    </div>
                                    <InputError message={errors.payment_type} className="text-center" />

                                    {/* Online Payment Info */}
                                    {data.payment_type === 'online' && (
                                        <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 animate-fade-in text-center mt-4">
                                            <Sparkles className="h-6 w-6 inline-block mb-2 text-blue-500" />
                                            <p className="font-medium">You will be redirected to the secure payment gateway after submitting.</p>
                                            <p className="text-sm text-blue-600 mt-1">Your account will be activated automatically once payment is confirmed.</p>
                                        </div>
                                    )}

                                    {/* Offline Payment Fields */}
                                    {data.payment_type === 'offline' && (
                                        <div className="space-y-6 animate-fade-in mt-6">
                                            {/* Payment Method Toggle Buttons */}
                                            <div>
                                                <InputLabel value="Select Payment Method" className="text-gray-700 font-medium mb-3 block" />
                                                <div className="grid grid-cols-3 gap-3">
                                                    {[
                                                        { value: 'bkash',  label: 'bKash',  color: 'from-pink-500 to-rose-500',   ring: 'ring-pink-400',   bg: 'bg-pink-50',   border: 'border-pink-400'  },
                                                        { value: 'rocket', label: 'Rocket', color: 'from-purple-500 to-violet-600', ring: 'ring-purple-400', bg: 'bg-purple-50', border: 'border-purple-400' },
                                                        { value: 'nagad',  label: 'Nagad',  color: 'from-orange-500 to-amber-500', ring: 'ring-orange-400', bg: 'bg-orange-50', border: 'border-orange-400' },
                                                    ].map((method) => (
                                                        <button
                                                            key={method.value}
                                                            type="button"
                                                            onClick={() => setData('payment_method', method.value)}
                                                            className={`
                                                                relative flex flex-col items-center justify-center py-4 px-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200 cursor-pointer
                                                                ${data.payment_method === method.value
                                                                    ? `bg-gradient-to-br ${method.color} text-white border-transparent shadow-lg scale-105 ring-2 ${method.ring} ring-offset-2`
                                                                    : `bg-white text-gray-700 border-gray-200 hover:${method.bg} hover:border-current hover:scale-102`
                                                                }
                                                            `}
                                                        >
                                                            {data.payment_method === method.value && (
                                                                <CheckCircle className="h-4 w-4 mb-1" />
                                                            )}
                                                            {method.label}
                                                        </button>
                                                    ))}
                                                </div>
                                                <InputError message={errors.payment_method} className="mt-2" />
                                            </div>

                                            {/* Dynamic Payment Instructions */}
                                            {data.payment_method && (
                                                <div className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                                                    data.payment_method === 'bkash'  ? 'bg-pink-50 border-pink-200'   :
                                                    data.payment_method === 'rocket' ? 'bg-purple-50 border-purple-200' :
                                                                                        'bg-orange-50 border-orange-200'
                                                }`}>
                                                    <h4 className={`font-semibold mb-2 ${
                                                        data.payment_method === 'bkash'  ? 'text-pink-800'   :
                                                        data.payment_method === 'rocket' ? 'text-purple-800' :
                                                                                            'text-orange-800'
                                                    }`}>
                                                        {data.payment_method === 'bkash'  ? '📱 bKash Payment' :
                                                         data.payment_method === 'rocket' ? '🚀 Rocket Payment' :
                                                                                            '💛 Nagad Payment'} Instructions
                                                    </h4>
                                                    <p className={`text-sm ${
                                                        data.payment_method === 'bkash'  ? 'text-pink-700'   :
                                                        data.payment_method === 'rocket' ? 'text-purple-700' :
                                                                                            'text-orange-700'
                                                    }`}>
                                                        Send money to <strong>01939378080</strong> via{' '}
                                                        <strong>
                                                            {data.payment_method === 'bkash'  ? 'bKash'  :
                                                             data.payment_method === 'rocket' ? 'Rocket' : 'Nagad'}
                                                        </strong>, then enter your Transaction ID below.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Transaction ID */}
                                            <div>
                                                <InputLabel htmlFor="transaction_id" value="Transaction ID" className="text-gray-700 font-medium" />
                                                <TextInput
                                                    id="transaction_id"
                                                    name="transaction_id"
                                                    value={data.transaction_id}
                                                    className="mt-2 block w-full rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                                                    onChange={(e) => setData('transaction_id', e.target.value)}
                                                    placeholder="Enter your transaction ID"
                                                    required
                                                />
                                                <InputError message={errors.transaction_id} className="mt-2" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className={`
                                    flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200
                                    ${currentStep === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
                                    }
                                `}
                            >
                                <ChevronLeft className="h-5 w-5 mr-2" />
                                Previous
                            </button>

                            <div className="text-center">
                                <div className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</div>
                                <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            {currentStep < totalSteps ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!validateCurrentStep() || emailChecking}
                                    className={`
                                        flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200
                                        ${validateCurrentStep() && !emailChecking
                                            ? `bg-gradient-to-r ${steps[currentStep - 1].color} text-white hover:scale-105 shadow-lg`
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    {emailChecking ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                                            Checking...
                                        </>
                                    ) : (
                                        <>
                                            Next
                                            <ChevronRight className="h-5 w-5 ml-2" />
                                        </>
                                    )}
                                </button>
                            ) : (
                                <PrimaryButton
                                    disabled={processing || !validateCurrentStep()}
                                    className={`
                                        flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600
                                        text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-all duration-200
                                        ${processing ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-5 w-5 mr-2" />
                                            {data.payment_type === 'online' ? 'Submit & Pay Online' : 'Submit Registration'}
                                        </>
                                    )}
                                </PrimaryButton>
                            )}
                        </div>
                    </form>
                </div>

                {/* Login Link */}
                <div className="text-center mt-8">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link
                            href={route('login')}
                            className="text-purple-600 hover:text-purple-800 font-medium hover:underline transition-colors"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
