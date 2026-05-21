import { RotateCcw, CheckCircle2, Home, Clock, CreditCard } from 'lucide-react';

export default function Refunded({ transaction: t }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full">
                {/* Refund Animation Container */}
                <div className="text-center mb-8">
                    {/* Refund Icon with Animation */}
                    <div className="relative inline-flex items-center justify-center mb-6">
                        <div className="absolute inset-0 bg-purple-400 rounded-full opacity-25 animate-ping"></div>
                        <div className="absolute inset-0 bg-purple-400 rounded-full opacity-50 animate-pulse"></div>
                        <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-2xl">
                            <RotateCcw className="w-14 h-14 text-white" />
                        </div>
                    </div>
                    
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Refund Processed</h1>
                    <p className="text-lg text-gray-600">
                        Your payment has been refunded successfully
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-purple-100">
                    {/* Gradient Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <RotateCcw className="w-6 h-6 text-white" />
                                <h2 className="text-xl font-semibold text-white">Refund Details</h2>
                            </div>
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white">
                                REFUNDED
                            </span>
                        </div>
                    </div>

                    {/* Refund Content */}
                    <div className="p-8 space-y-6">
                        {/* Refund Amount Highlight */}
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide font-medium">Refunded Amount</p>
                                <p className="text-5xl font-bold text-purple-700">
                                    {t.refund_amount} <span className="text-3xl text-gray-600">{t.currency}</span>
                                </p>
                            </div>
                        </div>

                        {/* Success Message */}
                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-base font-semibold text-green-900 mb-1">
                                        Refund Initiated Successfully
                                    </h3>
                                    <p className="text-sm text-green-700 leading-relaxed">
                                        Your refund has been processed. The amount will be credited back to your original payment method within 5-7 business days.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
                                <CreditCard className="w-5 h-5" />
                                Original Transaction Details
                            </h3>

                            {/* Original Amount */}
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">Original Amount</span>
                                <span className="text-gray-900 font-semibold">{t.amount} {t.currency}</span>
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

                            {/* Original Payment Date */}
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">Original Payment Date</span>
                                <span className="text-gray-900 font-semibold">{t.paid_at}</span>
                            </div>

                            {/* Payment ID */}
                            <div className="flex justify-between items-start py-3">
                                <span className="text-gray-600 font-medium">Payment ID</span>
                                <span className="font-mono text-xs bg-gray-50 px-3 py-1.5 rounded-md text-gray-700 border border-gray-200 max-w-xs break-all text-right">
                                    {t.pp_id}
                                </span>
                            </div>
                        </div>

                        {/* Timeline Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-blue-900">
                                    <p className="font-semibold mb-2">Refund Timeline</p>
                                    <ul className="space-y-1.5 text-blue-700">
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500">•</span>
                                            <span><strong>Immediate:</strong> Refund request initiated</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500">•</span>
                                            <span><strong>1-2 business days:</strong> Processing by payment gateway</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500">•</span>
                                            <span><strong>5-7 business days:</strong> Amount credited to your account</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="pt-2">
                            <a
                                href="/"
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <Home className="w-5 h-5" />
                                Back to Home
                            </a>
                        </div>

                        {/* Support Info */}
                        <div className="pt-6 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Questions about your refund?{' '}
                                    <a href="mailto:support@example.com" className="text-purple-600 hover:text-purple-700 font-semibold underline">
                                        Contact Support
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Note */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                        A confirmation email has been sent to your registered email address
                    </p>
                </div>
            </div>
        </div>
    );
}
