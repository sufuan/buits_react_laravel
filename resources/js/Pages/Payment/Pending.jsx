import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Clock, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Pending({ pp_id }) {
    const [elapsed, setElapsed] = useState(0);
    const [attempts, setAttempts] = useState(0);

    useEffect(() => {
        const interval = setInterval(async () => {
            setElapsed(s => s + 5);
            setAttempts(a => a + 1);

            try {
                const res = await fetch(`/payment/check/${pp_id}`);
                const data = await res.json();

                if (data.status === 'completed') {
                    clearInterval(interval);
                    router.visit(`/payment/success?pp_id=${pp_id}`);
                }
            } catch (e) {
                console.error('Poll error:', e);
            }
        }, 5000);

        // Stop after 10 minutes
        const timeout = setTimeout(() => clearInterval(interval), 600000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [pp_id]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-yellow-100">
                    {/* Animated Header */}
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-white opacity-10 animate-pulse"></div>
                        <div className="relative">
                            {/* Animated Icon */}
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg relative">
                                <RefreshCw className="w-10 h-10 text-yellow-600 animate-spin" />
                                <div className="absolute inset-0 rounded-full border-4 border-yellow-300 border-t-transparent animate-spin"></div>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">Verifying Payment</h2>
                            <p className="text-yellow-100 text-sm">Please wait while we confirm your transaction</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-6">
                        {/* Status Message */}
                        <div className="text-center">
                            <p className="text-gray-700 text-base leading-relaxed">
                                Your payment is being verified with our secure payment gateway.
                                <span className="font-semibold block mt-2 text-gray-900">Please keep this page open.</span>
                            </p>
                        </div>

                        {/* Info Box */}
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-5">
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-yellow-900">
                                    <p className="font-semibold mb-1">⚡ Typically takes under a minute</p>
                                    <p className="text-yellow-700">If it takes longer, don't worry! Your payment will be confirmed automatically by our system.</p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Indicator */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 font-medium">Verification Progress</span>
                                <span className="text-gray-500">{attempts} checks</span>
                            </div>
                            <div className="relative">
                                <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200">
                                    <div 
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 animate-pulse"
                                        style={{ width: `${Math.min((elapsed / 60) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                                <div className="text-2xl font-bold text-gray-900">{attempts}</div>
                                <div className="text-xs text-gray-500 mt-1">Verification Attempts</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                                <div className="text-2xl font-bold text-gray-900">{elapsed}s</div>
                                <div className="text-xs text-gray-500 mt-1">Time Elapsed</div>
                            </div>
                        </div>

                        {/* Payment ID */}
                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Payment ID</span>
                                <span className="text-xs font-mono bg-gray-100 px-3 py-1.5 rounded-md text-gray-700 border border-gray-200">
                                    {pp_id}
                                </span>
                            </div>
                        </div>

                        {/* Loading Animation */}
                        <div className="flex justify-center items-center gap-2 pt-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>

                        {/* Auto-refresh indicator */}
                        <div className="text-center">
                            <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                Auto-checking every 5 seconds
                            </p>
                        </div>
                    </div>
                </div>

                {/* Security Note */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        🔒 Your transaction is secure and encrypted
                    </p>
                </div>
            </div>
        </div>
    );
}
