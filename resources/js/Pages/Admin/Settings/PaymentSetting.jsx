import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, CreditCard } from "lucide-react";

export default function PaymentSettings({
    paymentEnabled,
    pendingUsersCount = 0,
    pendingVolunteerApplications = 0,
    pendingExecutiveApplications = 0,
}) {
    const [processing, setProcessing] = useState(false);
    const [isEnabled, setIsEnabled] = useState(paymentEnabled);

    const handleToggle = (checked) => {
        setIsEnabled(checked);
        router.post(route('admin.settings.payment.update'), {
            enabled: checked
        }, {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => {
                toast.success(checked ? "Payment system enabled" : "Payment system disabled");
            },
            onError: () => {
                setIsEnabled(!checked); // Revert UI on error
                toast.error("Failed to update settings");
            }
        });
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Payment Settings
                </h2>
            }
            pendingUsersCount={pendingUsersCount}
            pendingVolunteerApplications={pendingVolunteerApplications}
            pendingExecutiveApplications={pendingExecutiveApplications}
        >
            <Head title="Payment Settings" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="max-w-2xl mx-auto">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-6 w-6 text-blue-600" />
                                <div>
                                    <CardTitle>Online Payment System</CardTitle>
                                    <CardDescription>
                                        Control the availability of online payment functionality.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Enable Payments</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {isEnabled
                                            ? "Online payments are currently enabled. Users can process payments."
                                            : "Online payments are currently disabled. Payment options will not be shown."}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {processing && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
                                    <Switch
                                        checked={isEnabled}
                                        onCheckedChange={handleToggle}
                                        disabled={processing}
                                        className="data-[state=checked]:bg-green-600"
                                    />
                                </div>
                            </div>

                            <div className="rounded-md bg-blue-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3 flex-1 md:flex md:justify-between">
                                        <p className="text-sm text-blue-700">
                                            When disabled, the payment gateway and payment options will be hidden from users. Make sure all pending payments are processed before disabling this feature.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-md bg-amber-50 border border-amber-200 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm text-amber-800">
                                            <strong>Important:</strong> Ensure your payment gateway is properly configured before enabling this feature.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
