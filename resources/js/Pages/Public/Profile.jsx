import React from 'react';
import { Head } from '@inertiajs/react';

export default function Profile({ user }) {
    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <Head title={`${user.name} - Profile`} />

            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-indigo-600 h-32 md:h-48"></div>
                <div className="px-6 relative">
                    <div className="absolute -top-16 left-6 block">
                        {user.image ? (
                            <img
                                src={`/storage/${user.image}`}
                                alt={user.name}
                                className="w-32 h-32 rounded-full border-4 border-white object-cover bg-white"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
                                {user.name.charAt(0)}
                            </div>
                        )}
                    </div>

                    <div className="mt-16 pb-8">
                        <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                        <p className="text-lg text-gray-600 mt-1">{user.member_id}</p>

                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Department</dt>
                                    <dd className="mt-1 text-lg text-gray-900">{user.department || 'N/A'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Session</dt>
                                    <dd className="mt-1 text-lg text-gray-900">{user.session || 'N/A'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Joined</dt>
                                    <dd className="mt-1 text-lg text-gray-900">{new Date(user.created_at).toLocaleDateString()}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
