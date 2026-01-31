
import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function VolunteerSettings({
    volunteerEnabled,
    pendingUsersCount = 0,
    pendingVolunteerApplications = 0,
    pendingExecutiveApplications = 0,
}) {
    const [processing, setProcessing] = useState(false);
    const [isEnabled, setIsEnabled] = useState(volunteerEnabled);

    const handleToggle = (checked) => {
        setIsEnabled(checked);
        router.post(route('admin.settings.volunteer.update'), {
            enabled: checked
        }, {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => {
                toast.success(checked ? "Volunteer applications enabled" : "Volunteer applications disabled");
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
                    Volunteer Settings
                </h2>
            }
            pendingUsersCount={pendingUsersCount}
            pendingVolunteerApplications={pendingVolunteerApplications}
            pendingExecutiveApplications={pendingExecutiveApplications}
        >
            <Head title="Volunteer Settings" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle>Volunteer Application System</CardTitle>
                            <CardDescription>
                                Control the availability of the volunteer application system for members.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Accept Applications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {isEnabled
                                            ? "Members can currently submit volunteer applications."
                                            : "Volunteer applications are currently closed."}
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
                                            When disabled, the "Become a Volunteer" button will be hidden from the user dashboard. Existing applications will specifically be unaffected.
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
