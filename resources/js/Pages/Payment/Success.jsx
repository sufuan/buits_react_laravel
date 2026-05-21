import { CheckCircle2, Download, Home, Receipt } from 'lucide-react';

export default function Success({ transaction: t }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full">
                {/* Success Animation Container */}
                <div className="text-center mb-8 animate-fade-in">
                    {/* Success Icon with Ripple Effect */}
                    <div className="relative inline-flex items-center justify-center mb-6">
                        <div className="absolute inset-0 bg-green-400 rounded-full opacity-25 animate-ping"></div>
                        <div className="absolute inset-0 bg-green-400 rounded-full opacity-50 animate-pulse"></div>
                        <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-2xl">
                            <CheckCircle2 className="w-14 h-14 text-white animate-bounce" />
                        </div>
                    </div>
                    
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 animate-slide-up">Payment Successful!</h1>
                    <p className="text-lg text-gray-600 animate-slide-up" style={{ animationDelay: '100ms' }}>
                        Your transaction has been completed successfully
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-green-100 animate-slide-up" style={{ animationDelay: '200ms' }}>
                    {/* Gradient Header */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Receipt className="w-6 h-6 text-white" />
                                <h2 className="text-xl font-semibold text-white">Transaction Details</h2>
                            </div>
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white">
                                COMPLETED
                            </span>
                        </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="p-8">
                        {/* Amount Highlight */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border-2 border-green-200">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide font-medium">Total Amount Paid</p>
                                <p className="text-5xl font-bold text-green-700">
                                    {t.total} <span className="text-3xl text-gray-600">{t.currency}</span>
                                </p>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="space-y-4">
                            {/* Original Amount */}
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">Amount</span>
                                <span className="text-gray-900 font-semibold text-lg">{t.amount} {t.currency}</span>
                            </div>

                            {/* Payment Method */}
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">Payment Method</span>
                                <span className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-semibold">
                                    {t.payment_method}
                                </span>
                            </div>

                            {/* Transaction ID */}
                            <div className="flex justify-between items-start py-3 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">Transaction ID</span>
                                <span className="font-mono text-sm bg-gray-100 px-3 py-1.5 rounded-md text-gray-800 border border-gray-200 max-w-xs break-all text-right">
                                    {t.transaction_id}
                                </span>
                            </div>

                            {/* Date & Time */}
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">Date & Time</span>
                                <span className="text-gray-900 font-semibold">{t.date}</span>
                            </div>

                            {/* Payment ID */}
                            <div className="flex justify-between items-start py-3">
                                <span className="text-gray-600 font-medium">Payment ID</span>
                                <span className="font-mono text-xs bg-gray-50 px-3 py-1.5 rounded-md text-gray-700 border border-gray-200 max-w-xs break-all text-right">
                                    {t.pp_id}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-md">
                                <Download className="w-4 h-4" />
                                Download Receipt
                            </button>
                            <a
                                href="/"
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <Home className="w-4 h-4" />
                                Back to Home
                            </a>
                        </div>
                    </div>
                </div>

                {/* Thank You Message */}
                <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: '400ms' }}>
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
                        <p className="text-gray-700 text-base leading-relaxed">
                            Thank you for your payment! A confirmation email has been sent to your registered email address.
                        </p>
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
                .animate-slide-up {
                    animation: slide-up 0.6s ease-out;
                }
            `}</style>
        </div>
    );
}
