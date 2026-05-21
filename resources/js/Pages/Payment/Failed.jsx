import { XCircle, RefreshCcw, Home, AlertCircle, HelpCircle } from 'lucide-react';

export default function Failed({ message }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg w-full">
                {/* Error Animation Container */}
                <div className="text-center mb-8 animate-shake">
                    {/* Error Icon with Pulse Effect */}
                    <div className="relative inline-flex items-center justify-center mb-6">
                        <div className="absolute inset-0 bg-red-400 rounded-full opacity-25 animate-ping"></div>
                        <div className="absolute inset-0 bg-red-400 rounded-full opacity-50 animate-pulse"></div>
                        <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500 to-rose-600 rounded-full shadow-2xl">
                            <XCircle className="w-14 h-14 text-white" />
                        </div>
                    </div>
                    
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Failed</h1>
                    <p className="text-lg text-gray-600">
                        We couldn't process your payment
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-red-100">
                    {/* Gradient Header */}
                    <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-white" />
                            <h2 className="text-xl font-semibold text-white">Transaction Error</h2>
                        </div>
                    </div>

                    {/* Error Content */}
                    <div className="p-8 space-y-6">
                        {/* Error Message */}
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                        <XCircle className="w-6 h-6 text-red-600" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-semibold text-red-900 mb-1">
                                        Error Details
                                    </h3>
                                    <p className="text-sm text-red-700 leading-relaxed">
                                        {message ?? 'Something went wrong while processing your payment. Please try again.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Possible Reasons */}
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <HelpCircle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                        Common Reasons for Payment Failure:
                                    </h3>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-500 mt-1">●</span>
                                            <span>Insufficient funds in your account</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-500 mt-1">●</span>
                                            <span>Incorrect payment details entered</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-500 mt-1">●</span>
                                            <span>Payment gateway timeout or network issue</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-500 mt-1">●</span>
                                            <span>Transaction declined by your bank</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-2">
                            <a
                                href="/payment/checkout"
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <RefreshCcw className="w-5 h-5" />
                                Try Again
                            </a>

                            <a
                                href="/"
                                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-lg transition-all duration-200"
                            >
                                <Home className="w-5 h-5" />
                                Back to Home
                            </a>
                        </div>

                        {/* Support Info */}
                        <div className="pt-6 border-t border-gray-200">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <div className="text-sm text-blue-900">
                                        <p className="font-semibold mb-1">Need Help?</p>
                                        <p className="text-blue-700">
                                            If the problem persists, please contact our support team at{' '}
                                            <a href="mailto:support@example.com" className="underline font-medium hover:text-blue-900">
                                                support@example.com
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
}
