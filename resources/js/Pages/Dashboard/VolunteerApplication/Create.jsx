import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ user }) {
    const { data, setData, post, processing, errors } = useForm({
        reason: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('volunteer-application.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Apply for Volunteer Position
                </h2>
            }
        >
            <Head title="Volunteer Application" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Application Details
                                </h3>
                                
                                {/* User Information from Database */}
                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                    <h4 className="font-medium text-gray-700 mb-3">Your Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Name:</span>
                                            <p className="text-gray-900">{user.name}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Email:</span>
                                            <p className="text-gray-900">{user.email}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Department:</span>
                                            <p className="text-gray-900">{user.department || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Session:</span>
                                            <p className="text-gray-900">{user.session || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Current Status:</span>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {user.usertype.charAt(0).toUpperCase() + user.usertype.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={submit} className="space-y-6">
                                    <div>
                                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                                            Why do you want to become a volunteer? (Optional)
                                        </label>
                                        <textarea
                                            id="reason"
                                            name="reason"
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Share your motivation for becoming a volunteer..."
                                            value={data.reason}
                                            onChange={(e) => setData('reason', e.target.value)}
                                        />
                                        {errors.reason && (
                                            <p className="mt-2 text-sm text-red-600">{errors.reason}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            <p>By submitting this application, you agree to:</p>
                                            <ul className="list-disc list-inside mt-1 space-y-1">
                                                <li>Actively participate in organization activities</li>
                                                <li>Maintain good academic standing</li>
                                                <li>Follow organization guidelines and policies</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end space-x-4">
                                        <a
                                            href={route('dashboard')}
                                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Cancel
                                        </a>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                        >
                                            {processing ? 'Submitting...' : 'Submit Application'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
