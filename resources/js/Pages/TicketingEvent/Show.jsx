import { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import NavBar from '@/Components/HomePage/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { AlertCircle, CheckCircle2, Lock, Upload } from 'lucide-react';

function InputError({ message }) {
    if (!message) return null;
    return (
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {message}
        </p>
    );
}

export default function TicketingEventShow({ event, htmlContent, formSchema, isClosed, isPreview }) {
    const { flash } = usePage().props;
    const [showForm, setShowForm] = useState(true);

    // Member verification states
    const [memberChoice, setMemberChoice] = useState(null); // 'yes' | 'no' | null
    const [verificationStatus, setVerificationStatus] = useState(null); // null | 'verified' | 'failed'
    const [verifiedMemberName, setVerifiedMemberName] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [currentFee, setCurrentFee] = useState(null);
    const [paymentFieldsEnabled, setPaymentFieldsEnabled] = useState(!event.requires_payment);

    // Handle flash success message
    useEffect(() => {
        if (flash?.success) {
            setShowForm(false);
        }
    }, [flash]);

    // Initialize custom_fields keyed by each custom field's label
    const initialCustomFields = {};
    formSchema.forEach(f => { initialCustomFields[f.label] = f.type === 'checkbox' ? [] : ''; });


    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        payment_method: '',
        transaction_id: '',
        sender_number: '',
        member_id: '',
        custom_fields: initialCustomFields,
    });

    const handleMemberChoiceChange = (choice) => {
        setMemberChoice(choice);
        setVerificationStatus(null);
        setVerifiedMemberName(null);

        if (choice === 'no') {
            // Non-member path - unlock payment fields immediately
            setCurrentFee(event.non_member_fee);
            setPaymentFieldsEnabled(true);
            setData('member_id', '');
        } else if (choice === 'yes') {
            // Member path - lock payment fields until verification
            setCurrentFee(null);
            setPaymentFieldsEnabled(false);
        }
    };

    const handleVerifyMember = async () => {
        if (!data.member_id || !data.member_id.trim()) {
            toast.error('Please enter your Member ID');
            return;
        }

        setIsVerifying(true);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
            const response = await fetch('/verify-member', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ member_id: data.member_id }),
            });

            const result = await response.json();

            if (result.valid) {
                // Valid member - apply member fee and unlock payment fields
                setVerificationStatus('verified');
                setVerifiedMemberName(result.name);
                setCurrentFee(event.member_fee);
                setPaymentFieldsEnabled(true);
                toast.success(`Verified: ${result.name}`);
            } else {
                // Invalid member - apply non-member fee and unlock payment fields
                setVerificationStatus('failed');
                setCurrentFee(event.non_member_fee);
                setPaymentFieldsEnabled(true);
                toast.error('Verification failed. You will be charged the non-member fee.');
            }
        } catch (error) {
            toast.error('Verification failed. Please try again.');
            setVerificationStatus('failed');
            setCurrentFee(event.non_member_fee);
            setPaymentFieldsEnabled(true);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('ticketing-event.register', event.slug), {
            onSuccess: () => {
                setShowForm(false);
                toast.success('Registration submitted successfully!');
            },
            onError: () => {
                toast.error('Please fix the errors below.');
            },
        });
    };

    const paymentMethods = [
        { value: 'bkash', label: 'bKash' },
        { value: 'nagad', label: 'Nagad' },
        { value: 'rocket', label: 'Rocket' },
        { value: 'bank', label: 'Bank Transfer' },
    ];

    // Filter payment methods based on event settings
    const enabledPaymentMethods = event.enabled_payment_methods && event.enabled_payment_methods.length > 0
        ? paymentMethods.filter(method => event.enabled_payment_methods.includes(method.value))
        : paymentMethods;

    // Determine if submit button should be enabled
    const canSubmit = !event.requires_payment ||
        memberChoice === 'no' ||
        (memberChoice === 'yes' && verificationStatus !== null);

    return (
        <>
            <Head title={event.title} />
            <NavBar />

            <div className="min-h-screen bg-gray-50">
                {/* Preview Banner */}
                {isPreview && (
                    <div className="bg-amber-500 text-white text-center py-3 font-semibold shadow-md">
                        Preview Mode — This page has not been published yet
                    </div>
                )}

                {/* HTML Content Section */}
                {htmlContent && (
                    <section className="bg-white py-12 border-b">
                        <div className="container mx-auto px-4 max-w-5xl">
                            <div
                                className="ticketing-event-content prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ __html: htmlContent }}
                            />

                            {/* CTA Button */}
                            {!isClosed && (
                                <div className="mt-12 text-center">
                                    <a
                                        href="#registration-form"
                                        className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
                                    >
                                        Register Now
                                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </a>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Registration Form Section */}
                <section id="registration-form" className="py-16">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <Card className="shadow-xl border-2 border-gray-200">
                            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
                                <CardTitle className="text-2xl font-bold text-gray-900">
                                    Register for {event.title}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-3 mt-2">
                                    {!event.requires_payment ? (
                                        <span className="inline-flex items-center px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-full">
                                            Free Registration
                                        </span>
                                    ) : currentFee !== null ? (
                                        <span className="inline-flex items-center px-3 py-1 bg-gray-100 border border-gray-300 text-gray-900 text-sm font-semibold rounded-full">
                                            {verificationStatus === 'verified' ? 'Member Fee' : 'Non-Member Fee'}: ৳ {parseFloat(currentFee).toFixed(2)}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold rounded-full">
                                            Fee: TBD
                                        </span>
                                    )}
                                    {event.deadline && (
                                        <span className="text-sm text-gray-600">
                                            Deadline: {new Date(event.deadline).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    )}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="p-8">
                                {/* Closed State */}
                                {isClosed && (
                                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
                                        <Lock className="h-12 w-12 text-red-600 mx-auto mb-3" />
                                        <h3 className="text-lg font-semibold text-red-900 mb-2">Registration Closed</h3>
                                        <p className="text-red-700">
                                            This event is no longer accepting registrations.
                                        </p>
                                    </div>
                                )}

                                {/* Success State */}
                                {!isClosed && flash?.success && !showForm && (
                                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-8 text-center">
                                        <CheckCircle2 className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                                        <h3 className="text-2xl font-bold text-emerald-900 mb-3">Registration Submitted Successfully!</h3>
                                        {event.requires_payment ? (
                                            <>
                                                <p className="text-emerald-800 mb-2 leading-relaxed">
                                                    Your registration is pending payment verification.
                                                </p>
                                                <p className="text-emerald-700 text-sm">
                                                    You will receive a confirmation email with your ticket once your payment is verified by our team.
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-emerald-800 mb-2 leading-relaxed">
                                                    Your registration has been confirmed!
                                                </p>
                                                <p className="text-emerald-700 text-sm">
                                                    You will receive a confirmation email with your ticket shortly.
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Form */}
                                {!isClosed && showForm && (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Required Information Section */}
                                        <div className="space-y-5">
                                            <div className="flex items-center gap-2 pb-2">
                                                <div className="h-px flex-1 bg-gray-200"></div>
                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
                                                    Required Information
                                                </span>
                                                <div className="h-px flex-1 bg-gray-200"></div>
                                            </div>

                                            {/* Full Name */}
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                                                    Full Name
                                                    <span className="text-red-600 ml-1">*</span>
                                                </Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    placeholder="Enter your full name"
                                                    className="h-11"
                                                    required
                                                />
                                                <InputError message={errors.name} />
                                            </div>

                                            {/* Email & Phone Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                                        Email Address
                                                        <span className="text-red-600 ml-1">*</span>
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={data.email}
                                                        onChange={e => setData('email', e.target.value)}
                                                        placeholder="your.email@example.com"
                                                        className="h-11"
                                                        required
                                                    />
                                                    <InputError message={errors.email} />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                                                        Phone Number
                                                        <span className="text-red-600 ml-1">*</span>
                                                    </Label>
                                                    <Input
                                                        id="phone"
                                                        type="tel"
                                                        value={data.phone}
                                                        onChange={e => setData('phone', e.target.value)}
                                                        placeholder="+880 1XXX-XXXXXX"
                                                        className="h-11"
                                                        required
                                                    />
                                                    <InputError message={errors.phone} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Custom Fields Section - shown after name/email/phone, before payment */}
                                        {formSchema.length > 0 && (
                                            <div className="space-y-5 pt-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-px flex-1 bg-gray-200"></div>
                                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Additional Information</span>
                                                    <div className="h-px flex-1 bg-gray-200"></div>
                                                </div>
                                                {formSchema.map(field => (
                                                    <div key={field.id} className="space-y-2">
                                                        <Label className="text-sm font-semibold text-gray-700">
                                                            {field.label}
                                                            {field.required && <span className="text-red-600 ml-1">*</span>}
                                                            {!field.required && <span className="text-gray-400 text-xs font-normal ml-1.5">(Optional)</span>}
                                                        </Label>

                                                        {/* Text / Email / Tel / URL */}
                                                        {['text','email','tel','url'].includes(field.type) && (
                                                            <Input type={field.type} value={data.custom_fields[field.label] || ''}
                                                                onChange={e => setData('custom_fields', { ...data.custom_fields, [field.label]: e.target.value })}
                                                                placeholder={field.placeholder || `Enter ${field.label}`}
                                                                className="h-11" required={field.required} />
                                                        )}

                                                        {/* Number */}
                                                        {field.type === 'number' && (
                                                            <Input type="number" value={data.custom_fields[field.label] || ''}
                                                                onChange={e => setData('custom_fields', { ...data.custom_fields, [field.label]: e.target.value })}
                                                                placeholder={field.placeholder || 'Enter number'}
                                                                min={field.min} max={field.max} step={field.step}
                                                                className="h-11" required={field.required} />
                                                        )}

                                                        {/* Date / Time / DateTime-local */}
                                                        {['date','time','datetime-local'].includes(field.type) && (
                                                            <Input type={field.type} value={data.custom_fields[field.label] || ''}
                                                                onChange={e => setData('custom_fields', { ...data.custom_fields, [field.label]: e.target.value })}
                                                                className="h-11" required={field.required} />
                                                        )}

                                                        {/* Textarea */}
                                                        {field.type === 'textarea' && (
                                                            <Textarea value={data.custom_fields[field.label] || ''}
                                                                onChange={e => setData('custom_fields', { ...data.custom_fields, [field.label]: e.target.value })}
                                                                placeholder={field.placeholder || 'Enter your response'}
                                                                rows={parseInt(field.rows) || 4}
                                                                maxLength={field.maxLength ? parseInt(field.maxLength) : undefined}
                                                                className="resize-none" required={field.required} />
                                                        )}

                                                        {/* Select Dropdown */}
                                                        {field.type === 'select' && (
                                                            <Select value={data.custom_fields[field.label] || ''}
                                                                onValueChange={v => setData('custom_fields', { ...data.custom_fields, [field.label]: v })}>
                                                                <SelectTrigger className="h-11">
                                                                    <SelectValue placeholder={field.placeholder || 'Select an option'} />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {(field.options || []).filter(o => o.trim()).map((opt, oi) => (
                                                                        <SelectItem key={oi} value={opt}>{opt}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        )}

                                                        {/* Radio Buttons */}
                                                        {field.type === 'radio' && (
                                                            <div className="space-y-2 pt-1">
                                                                {(field.options || []).filter(o => o.trim()).map((opt, oi) => (
                                                                    <label key={oi} className="flex items-center gap-3 cursor-pointer">
                                                                        <input type="radio"
                                                                            name={`custom_radio_${field.label}`}
                                                                            value={opt}
                                                                            checked={data.custom_fields[field.label] === opt}
                                                                            onChange={() => setData('custom_fields', { ...data.custom_fields, [field.label]: opt })}
                                                                            required={field.required}
                                                                            className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900" />
                                                                        <span className="text-sm text-gray-700">{opt}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Checkboxes (Multiple Choice) */}
                                                        {field.type === 'checkbox' && (
                                                            <div className="space-y-2 pt-1">
                                                                {(field.options || []).filter(o => o.trim()).map((opt, oi) => {
                                                                    const currentVal = Array.isArray(data.custom_fields[field.label]) ? data.custom_fields[field.label] : [];
                                                                    return (
                                                                        <label key={oi} className="flex items-center gap-3 cursor-pointer">
                                                                            <input type="checkbox" value={opt}
                                                                                checked={currentVal.includes(opt)}
                                                                                onChange={e => {
                                                                                    const prev = Array.isArray(data.custom_fields[field.label]) ? data.custom_fields[field.label] : [];
                                                                                    const next = e.target.checked ? [...prev, opt] : prev.filter(v => v !== opt);
                                                                                    setData('custom_fields', { ...data.custom_fields, [field.label]: next });
                                                                                }}
                                                                                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900" />
                                                                            <span className="text-sm text-gray-700">{opt}</span>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}

                                                        {/* Range Slider */}
                                                        {field.type === 'range' && (
                                                            <div className="space-y-2 pt-1">
                                                                <input type="range"
                                                                    min={field.min || 0} max={field.max || 100} step={field.step || 1}
                                                                    value={data.custom_fields[field.label] || field.min || 0}
                                                                    onChange={e => setData('custom_fields', { ...data.custom_fields, [field.label]: e.target.value })}
                                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                                                                <div className="flex justify-between text-xs text-gray-500">
                                                                    <span>{field.min || 0}</span>
                                                                    <span className="font-medium text-gray-700">{data.custom_fields[field.label] || field.min || 0}</span>
                                                                    <span>{field.max || 100}</span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Color Picker */}
                                                        {field.type === 'color' && (
                                                            <div className="flex items-center gap-3">
                                                                <input type="color"
                                                                    value={data.custom_fields[field.label] || '#000000'}
                                                                    onChange={e => setData('custom_fields', { ...data.custom_fields, [field.label]: e.target.value })}
                                                                    className="h-11 w-24 rounded border border-gray-300 cursor-pointer" />
                                                                <span className="text-sm text-gray-500">{data.custom_fields[field.label] || '#000000'}</span>
                                                            </div>
                                                        )}

                                                        {/* File Upload */}
                                                        {field.type === 'file' && (
                                                            <Input type="file" accept={field.accept || undefined}
                                                                onChange={e => setData('custom_fields', { ...data.custom_fields, [field.label]: e.target.files[0] || '' })}
                                                                required={field.required} className="h-11" />
                                                        )}

                                                        {field.helpText && (
                                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{field.helpText}</p>
                                                        )}

                                                        <InputError message={errors[`custom_fields.${field.label}`]} />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Member Verification & Payment Section - Only if payment required */}
                                        {event.requires_payment && (
                                            <div className="space-y-5 pt-2">
                                                <div className="flex items-center gap-2 pb-2">
                                                    <div className="h-px flex-1 bg-gray-200"></div>
                                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
                                                        Payment Information
                                                    </span>
                                                    <div className="h-px flex-1 bg-gray-200"></div>
                                                </div>

                                                {/* Member Question */}
                                                <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                    <Label className="text-sm font-semibold text-gray-800">
                                                        Are you a member of BUITS?
                                                        <span className="text-red-600 ml-1">*</span>
                                                    </Label>
                                                    <div className="flex gap-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleMemberChoiceChange('yes')}
                                                            className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${memberChoice === 'yes'
                                                                ? 'bg-blue-600 border-blue-600 text-white'
                                                                : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400'
                                                                }`}
                                                        >
                                                            Yes, I'm a Member
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleMemberChoiceChange('no')}
                                                            className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${memberChoice === 'no'
                                                                ? 'bg-blue-600 border-blue-600 text-white'
                                                                : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400'
                                                                }`}
                                                        >
                                                            No, I'm Not a Member
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Member ID Verification - shown only if 'Yes' */}
                                                {memberChoice === 'yes' && (
                                                    <div className="space-y-3 p-4 bg-white border border-gray-300 rounded-lg">
                                                        <Label htmlFor="member_id" className="text-sm font-semibold text-gray-700">
                                                            Member ID
                                                            <span className="text-red-600 ml-1">*</span>
                                                        </Label>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                id="member_id"
                                                                type="text"
                                                                value={data.member_id}
                                                                onChange={e => setData('member_id', e.target.value)}
                                                                placeholder="Enter your Member ID"
                                                                className="h-11 flex-1"
                                                                disabled={verificationStatus !== null}
                                                            />
                                                            <Button
                                                                type="button"
                                                                onClick={handleVerifyMember}
                                                                disabled={isVerifying || verificationStatus !== null}
                                                                className="h-11 px-6"
                                                            >
                                                                {isVerifying ? 'Verifying...' : verificationStatus !== null ? 'Verified' : 'Verify'}
                                                            </Button>
                                                        </div>
                                                        <InputError message={errors.member_id} />

                                                        {/* Verification Status Messages */}
                                                        {verificationStatus === 'verified' && (
                                                            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-semibold text-green-900">Verified: {verifiedMemberName}</p>
                                                                    <p className="text-xs text-green-700">Member fee will be applied</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {verificationStatus === 'failed' && (
                                                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                                <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-semibold text-red-900">Verification Failed</p>
                                                                    <p className="text-xs text-red-700">Non-member fee will be applied</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Payment Fields - Gated behind verification resolution */}
                                                <div className={`space-y-5 ${!paymentFieldsEnabled ? 'opacity-50 pointer-events-none' : ''}`}>

                                                    {/* Payment Method */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="payment_method" className="text-sm font-semibold text-gray-700">
                                                            Payment Method
                                                            <span className="text-red-600 ml-1">*</span>
                                                        </Label>
                                                        <Select
                                                            value={data.payment_method}
                                                            onValueChange={value => setData('payment_method', value)}
                                                            disabled={!paymentFieldsEnabled}
                                                        >
                                                            <SelectTrigger className="h-11">
                                                                <SelectValue placeholder="Select payment method" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {enabledPaymentMethods.map(method => (
                                                                    <SelectItem key={method.value} value={method.value}>
                                                                        {method.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <InputError message={errors.payment_method} />
                                                    </div>

                                                    {/* Transaction ID */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="transaction_id" className="text-sm font-semibold text-gray-700">
                                                            Transaction ID
                                                            <span className="text-red-600 ml-1">*</span>
                                                        </Label>
                                                        <Input
                                                            id="transaction_id"
                                                            type="text"
                                                            value={data.transaction_id}
                                                            onChange={e => setData('transaction_id', e.target.value)}
                                                            placeholder="Enter payment transaction ID"
                                                            className="h-11 font-mono"
                                                            disabled={!paymentFieldsEnabled}
                                                        />
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Enter the TrxID from your bKash/Nagad/Rocket payment
                                                        </p>
                                                        <InputError message={errors.transaction_id} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}



                                        {/* Submit Button */}
                                        <div className="pt-6 border-t border-gray-200">
                                            <Button
                                                type="submit"
                                                disabled={processing || (event.requires_payment && !canSubmit)}
                                                className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-base shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processing ? 'Submitting...' : 'Complete Registration'}
                                                {currentFee && (
                                                    <span className="ml-2 font-normal opacity-90">
                                                        • Pay ৳ {parseFloat(currentFee).toFixed(2)}
                                                    </span>
                                                )}
                                            </Button>
                                            <p className="text-xs text-center text-gray-500 mt-3">
                                                By registering, you agree to the event terms and conditions
                                            </p>
                                        </div>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </>
    );
}
