import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { CreditCard, ArrowRight, ShieldCheck, User, Mail, Phone } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function RegistrationPayment({ pending_user, amount }) {
    const { post, processing, errors } = useForm({
        full_name: pending_user.name,
        email_address: pending_user.email,
        mobile_number: pending_user.phone,
        amount: amount,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/payment/initiate');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
            <Head title="Complete Payment - Registration" />

            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <CreditCard className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">Complete Registration</h2>
                    <p className="text-blue-100 mt-2">Almost there! Complete your payment to activate your account.</p>
                </div>

                <div className="p-8">
                    {/* User Summary Card */}
                    <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <User className="h-4 w-4" /> Account Details
                        </h3>

                        <div className="space-y-3">
                            <div className="flex items-center text-gray-700">
                                <User className="h-5 w-5 mr-3 text-indigo-400" />
                                <span className="font-medium">{pending_user.name}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <Mail className="h-5 w-5 mr-3 text-indigo-400" />
                                <span>{pending_user.email}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <Phone className="h-5 w-5 mr-3 text-indigo-400" />
                                <span>{pending_user.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary Box */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <CreditCard className="h-24 w-24 transform rotate-12" />
                        </div>

                        <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider mb-2">Registration Fee</p>
                        <div className="flex items-end justify-center gap-1">
                            <span className="text-4xl font-bold text-blue-900">৳ {amount}</span>
                            <span className="text-blue-600 font-medium mb-1">BDT</span>
                        </div>
                    </div>

                    {/* Payment Error */}
                    {errors.payment && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <p className="text-sm text-red-800">{errors.payment}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <PrimaryButton
                            className="w-full justify-center py-4 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
                            disabled={processing}
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Connecting to Gateway...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Proceed to Pay Online
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </PrimaryButton>
                    </form>

                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                        <span>Secured by BUITS Payment Gateway</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
