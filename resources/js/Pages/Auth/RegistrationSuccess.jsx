import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function RegistrationSuccess({ transaction_id }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Head title="Registration Successful" />

            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Registration Complete!</h1>
                <p className="text-gray-600 mb-6 text-lg">
                    Your payment was successfully received.
                </p>

                {transaction_id && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1 uppercase tracking-wide font-semibold">Transaction ID</p>
                        <p className="font-mono text-gray-800 break-all">{transaction_id}</p>
                    </div>
                )}

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 text-left rounded-r-lg">
                    <p className="text-sm text-blue-800">
                        <strong>Please wait a few seconds.</strong> Your account is currently being activated. Once activated, you will be able to log in.
                    </p>
                </div>

                <Link
                    href={route('login')}
                    className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                    Go to Login
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
