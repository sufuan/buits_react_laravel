import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { CalendarIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function PreviousCommittees({ auth, previousCommittees = [] }) {
    const [selectedCommittee, setSelectedCommittee] = useState(null);
    const [filterYear, setFilterYear] = useState('');

    const filteredCommittees = previousCommittees.filter(committee => 
        !filterYear || committee.committee_number.includes(filterYear)
    );

    const getCommitteeYears = () => {
        if (!previousCommittees || previousCommittees.length === 0) return [];
        const years = new Set();
        previousCommittees.forEach(committee => {
            const year = committee.committee_number?.split('-')[0];
            if (year) years.add(year);
        });
        return Array.from(years).sort((a, b) => b - a);
    };

    return (
        <AdminAuthenticatedLayout user={auth.user}>
            <Head title="Previous Committees" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">Previous Committees</h2>
                                    <p className="text-gray-600 mt-1">
                                        Historical record of committee members • {previousCommittees?.length || 0} committees total
                                    </p>
                                </div>
                                
                                {/* Filter Section */}
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Filter by Year
                                        </label>
                                        <select
                                            value={filterYear}
                                            onChange={(e) => setFilterYear(e.target.value)}
                                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">All Years</option>
                                            {getCommitteeYears().map((year) => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Committees List */}
                            {filteredCommittees.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-400">
                                        <CalendarIcon className="mx-auto h-12 w-12" />
                                    </div>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No committees found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {filterYear ? `No committees found for year ${filterYear}` : 'No previous committees available.'}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {filteredCommittees.map((committee) => (
                                        <div key={committee.committee_number} className="bg-gray-50 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <CalendarIcon className="w-6 h-6 text-blue-600" />
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-gray-900">
                                                            Committee {committee.committee_number}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 flex items-center">
                                                            <UsersIcon className="w-4 h-4 mr-1" />
                                                            {committee.member_count} members
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedCommittee(
                                                        selectedCommittee === committee.committee_number ? null : committee.committee_number
                                                    )}
                                                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {selectedCommittee === committee.committee_number ? 'Hide Members' : 'View Members'}
                                                </button>
                                            </div>

                                            {/* Members Grid - Expandable */}
                                            {selectedCommittee === committee.committee_number && (
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                        {(committee.members || []).map((member) => (
                                                            <div key={member.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="flex-shrink-0">
                                                                        {member.photo ? (
                                                                            <img
                                                                                className="h-12 w-12 rounded-full object-cover"
                                                                                src={`/storage/${member.photo}`}
                                                                                alt={member.name}
                                                                            />
                                                                        ) : (
                                                                            <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                                                                                <span className="text-sm font-medium text-gray-700">
                                                                                    {member.name.charAt(0)}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="text-sm font-medium text-gray-900 truncate">
                                                                            {member.name}
                                                                        </h4>
                                                                        <p className="text-xs text-blue-600 font-medium">
                                                                            {member.designation}
                                                                        </p>
                                                                        <p className="text-xs text-gray-400">
                                                                            Order: {member.member_order}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Quick Preview - Always Visible */}
                                            {selectedCommittee !== committee.committee_number && (
                                                <div className="mt-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {(committee.members || []).slice(0, 6).map((member) => (
                                                            <div key={member.id} className="flex items-center space-x-2 bg-white rounded-full px-3 py-1 text-xs">
                                                                {member.photo ? (
                                                                    <img
                                                                        className="h-6 w-6 rounded-full object-cover"
                                                                        src={`/storage/${member.photo}`}
                                                                        alt={member.name}
                                                                    />
                                                                ) : (
                                                                    <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center">
                                                                        <span className="text-xs font-medium text-gray-700">
                                                                            {member.name.charAt(0)}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <span className="font-medium text-gray-900">
                                                                    {member.name}
                                                                </span>
                                                                <span className="text-gray-500">
                                                                    {member.designation}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {committee.member_count > 6 && (
                                                            <div className="flex items-center justify-center bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600">
                                                                +{committee.member_count - 6} more
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary Statistics */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <CalendarIcon className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total Committees
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {previousCommittees?.length || 0}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <UsersIcon className="h-8 w-8 text-green-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total Past Members
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {(previousCommittees || []).reduce((sum, committee) => sum + (committee.member_count || 0), 0)}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <CalendarIcon className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Years of History
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {getCommitteeYears().length}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
