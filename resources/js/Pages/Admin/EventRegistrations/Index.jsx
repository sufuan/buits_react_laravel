import React from 'react';
import { Head } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

export default function EventRegistrationsIndex() {
    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur-xl opacity-50 animate-pulse"></div>
                            <ClipboardList className="relative h-10 w-10 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                Event Registrations
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Verify payments and manage ticket issuance</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Event Registrations" />

            <div className="p-6 space-y-6">
                <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                        <CardTitle className="text-2xl">Coming Soon</CardTitle>
                        <CardDescription>
                            The event registrations verification dashboard will be available here
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="p-4 bg-green-50 rounded-full">
                                <ClipboardList className="h-16 w-16 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Registration Management
                                </h3>
                                <p className="text-gray-600 max-w-md">
                                    Review registration submissions, verify payment transactions, 
                                    generate unique ticket numbers, and dispatch confirmation emails to attendees.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
