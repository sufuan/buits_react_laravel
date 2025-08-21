import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Index({ committees }) {
    const [selectedCommittee, setSelectedCommittee] = useState(1);

    return (
        <GuestLayout>
            <Head title="Previous Committee" />
            
            <div className="min-h-screen bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Previous Committee Members
                        </h1>
                        <p className="text-lg text-gray-600">
                            Meet our dedicated committee members who have served our organization
                        </p>
                    </div>

                    {/* Committee Selector */}
                    <div className="mb-8">
                        <div className="flex flex-wrap justify-center gap-4">
                            {[1, 2, 3, 4, 5, 6].map((committeeNumber) => (
                                <button
                                    key={committeeNumber}
                                    onClick={() => setSelectedCommittee(committeeNumber)}
                                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                        selectedCommittee === committeeNumber
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    Committee {committeeNumber}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Committee Members Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {committees[selectedCommittee]?.map((member) => (
                            <div 
                                key={member.id} 
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {/* Photo Placeholder */}
                                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                                        <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"/>
                                        </svg>
                                    </div>
                                </div>
                                
                                {/* Member Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 text-sm mb-1 text-center">
                                        {member.name}
                                    </h3>
                                    <p className="text-blue-600 text-sm text-center font-medium">
                                        {member.designation}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Committee Stats */}
                    <div className="mt-12 text-center">
                        <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
                            <span className="text-blue-800 font-medium">
                                Committee {selectedCommittee}: {committees[selectedCommittee]?.length || 0} Members
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
