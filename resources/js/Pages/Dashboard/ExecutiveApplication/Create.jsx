import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ user, designations }) {
    const { data, setData, post, processing, errors } = useForm({
        designation_id: '',
        reason: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('executive-application.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Apply for Executive Position
                </h2>
            }
        >
            <Head title="Executive Application" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Executive Position Application
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
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {user.usertype.charAt(0).toUpperCase() + user.usertype.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={submit} className="space-y-6">
                                    <div>
                                        <label htmlFor="designation_id" className="block text-sm font-medium text-gray-700">
                                            Select Position <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="designation_id"
                                            name="designation_id"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={data.designation_id}
                                            onChange={(e) => setData('designation_id', e.target.value)}
                                        >
                                            <option value="">Select a position...</option>
                                            {designations.map((designation) => (
                                                <option key={designation.id} value={designation.id}>
                                                    {designation.name}
                                                    {designation.level && ` (Level ${designation.level})`}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.designation_id && (
                                            <p className="mt-2 text-sm text-red-600">{errors.designation_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                                            Why do you want this executive position? <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="reason"
                                            name="reason"
                                            rows={5}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Explain your qualifications, experience, and vision for this position..."
                                            value={data.reason}
                                            onChange={(e) => setData('reason', e.target.value)}
                                        />
                                        {errors.reason && (
                                            <p className="mt-2 text-sm text-red-600">{errors.reason}</p>
                                        )}
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-blue-900 mb-2">Executive Requirements</h4>
                                        <ul className="text-sm text-blue-800 space-y-1">
                                            <li>• Must be an active volunteer member</li>
                                            <li>• Demonstrate leadership skills and commitment</li>
                                            <li>• Maintain excellent academic standing</li>
                                            <li>• Available for regular meetings and events</li>
                                            <li>• Previous experience in organization activities preferred</li>
                                        </ul>
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
