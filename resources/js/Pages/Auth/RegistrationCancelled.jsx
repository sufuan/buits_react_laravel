import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function RegistrationCancelled() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Head title="Registration Cancelled" />

            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="h-10 w-10 text-red-500" />
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
                <p className="text-gray-600 mb-8">
                    Your registration process was cancelled during payment. The email address you used has been freed, so you can try registering again.
                </p>

                <div className="space-y-4">
                    <Link 
                        href={route('register')} 
                        className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <RefreshCw className="h-5 w-5" />
                        Try Registering Again
                    </Link>

                    <Link 
                        href="/" 
                        className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Return to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
