import { Ban, ArrowLeft, Home, ShoppingCart, AlertTriangle } from 'lucide-react';

export default function Cancel({ message }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg w-full">
                {/* Cancel Animation Container */}
                <div className="text-center mb-8">
                    {/* Cancel Icon with Animation */}
                    <div className="relative inline-flex items-center justify-center mb-6">
                        <div className="absolute inset-0 bg-orange-400 rounded-full opacity-20 animate-pulse"></div>
                        <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full shadow-2xl">
                            <Ban className="w-14 h-14 text-white" />
                        </div>
                    </div>
                    
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
                    <p className="text-lg text-gray-600">
                        Your payment was not completed
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-orange-100">
                    {/* Gradient Header */}
                    <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-white" />
                            <h2 className="text-xl font-semibold text-white">Transaction Cancelled</h2>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-6">
                        {/* Cancel Message */}
                        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <Ban className="w-6 h-6 text-orange-600" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-semibold text-orange-900 mb-1">
                                        Why was my payment cancelled?
                                    </h3>
                                    <p className="text-sm text-orange-700 leading-relaxed">
                                        {message ?? 'Payment was cancelled. You can try again whenever you\'re ready.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <div className="text-sm text-blue-900">
                                    <p className="font-semibold mb-1">Good News!</p>
                                    <p className="text-blue-700">
                                        No charges were made to your account. Your payment information is secure and you can retry at any time.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* What happens next */}
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4" />
                                What happens next?
                            </h3>
                            <ul className="space-y-2.5 text-sm text-gray-700">
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1 text-lg">✓</span>
                                    <span>No amount has been deducted from your account</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1 text-lg">✓</span>
                                    <span>Your transaction was cancelled successfully</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1 text-lg">✓</span>
                                    <span>You can retry the payment whenever you're ready</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1 text-lg">✓</span>
                                    <span>Your payment information remains secure</span>
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-2">
                            <a
                                href="/payment/checkout"
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Return to Checkout
                            </a>

                            <a
                                href="/"
                                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-lg transition-all duration-200"
                            >
                                <Home className="w-5 h-5" />
                                Back to Home
                            </a>
                        </div>

                        {/* Help Section */}
                        <div className="pt-6 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Need assistance?{' '}
                                    <a href="/contact" className="text-orange-600 hover:text-orange-700 font-semibold underline">
                                        Contact Support
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reassurance Message */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                        🔒 Your payment information is safe and secure
                    </p>
                </div>
            </div>
        </div>
    );
}
