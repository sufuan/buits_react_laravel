import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { PlusIcon, TrashIcon, ExclamationTriangleIcon, PencilIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

export default function CurrentCommittee({
    auth,
    currentMembers,
    currentCommitteeNumber,
    designations,
    availableUsers,
    totalCurrentMembers,
    isPublished
}) {
    const [showEditMemberModal, setShowEditMemberModal] = useState(false);
    const [showEndTenureModal, setShowEndTenureModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [sortedMembers, setSortedMembers] = useState(currentMembers);
    const [sortField, setSortField] = useState('member_order');
    const [sortDirection, setSortDirection] = useState('asc');
    const { flash = {} } = usePage().props;
    const { post } = useForm();

    const handlePublishCommittee = () => {
        if (confirm('Are you sure you want to publish the current committee? This will make it visible to the public.')) {
            post(route('admin.committee.publish'), {
                preserveScroll: true,
                onSuccess: () => {
                    // Success is handled by flash message
                }
            });
        }
    };

    // Edit Member Form
    const { data: editMemberData, setData: setEditMemberData, patch: patchEditMember, processing: processingEdit, errors: editErrors, reset: resetEdit } = useForm({
        user_id: '',
        designation_id: '',
        member_order: ''
    });

    // End Tenure Form
    const { data: endTenureData, setData: setEndTenureData, post: postEndTenure, processing: processingEndTenure, errors: endTenureErrors, reset: resetEndTenure } = useForm({
        confirmation: '',
        new_committee_number: ''
    });

    // Sorting functionality
    const handleSort = (field) => {
        const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);

        const sorted = [...sortedMembers].sort((a, b) => {
            if (field === 'member_order') {
                return direction === 'asc' ? a[field] - b[field] : b[field] - a[field];
            }
            if (direction === 'asc') {
                return a[field].localeCompare(b[field]);
            }
            return b[field].localeCompare(a[field]);
        });
        setSortedMembers(sorted);
    };

    const handleEditMember = (member) => {
        setEditingMember(member);
        setEditMemberData({
            user_id: member.user_id,
            designation_id: member.designation_id,
            member_order: member.member_order
        });
        setShowEditMemberModal(true);
    };

    const handleUpdateMember = (e) => {
        e.preventDefault();
        patchEditMember(route('committee.current.update-order'), {
            onSuccess: () => {
                resetEdit();
                setShowEditMemberModal(false);
                setEditingMember(null);
            }
        });
    };

    const handleEndTenure = (e) => {
        e.preventDefault();
        if (endTenureData.confirmation !== 'CONFIRM') {
            return;
        }
        postEndTenure(route('admin.committee.end-tenure'), {
            onSuccess: () => {
                resetEndTenure();
                setShowEndTenureModal(false);
            }
        });
    };

    const handleRemoveMember = (assignment) => {
        if (confirm('Are you sure you want to remove this member from the current committee?')) {
            const form = useForm({});
            form.delete(route('committee.current.remove-member', assignment.id));
        }
    };

    const moveUp = (index) => {
        if (index > 0) {
            const newMembers = [...sortedMembers];
            [newMembers[index], newMembers[index - 1]] = [newMembers[index - 1], newMembers[index]];
            setSortedMembers(newMembers);
            updateOrder(newMembers);
        }
    };

    const moveDown = (index) => {
        if (index < sortedMembers.length - 1) {
            const newMembers = [...sortedMembers];
            [newMembers[index], newMembers[index + 1]] = [newMembers[index + 1], newMembers[index]];
            setSortedMembers(newMembers);
            updateOrder(newMembers);
        }
    };

    const updateOrder = (members) => {
        const updatedMembers = members.map((member, index) => ({
            id: member.id,
            member_order: index + 1
        }));

        const form = useForm({ members: updatedMembers });
        form.patch(route('committee.current.update-order'));
    };

    const generateNewCommitteeNumber = () => {
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
        return `${currentYear}-${nextYear}`;
    };

    React.useEffect(() => {
        setSortedMembers(currentMembers);
    }, [currentMembers]);

    return (
        <AdminAuthenticatedLayout user={auth.user}>
            <Head title="Current Committee Management" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">Current Committee</h2>
                                    <p className="text-gray-600 mt-1">
                                        {currentCommitteeNumber ? `Committee ${currentCommitteeNumber}` : 'Committee 1'}
                                        • {totalCurrentMembers} executive members
                                    </p>
                                    <p className="text-sm text-blue-600 mt-1">
                                        ✓ All executive members with designations are automatically included
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    {totalCurrentMembers > 0 && (
                                        !isPublished ? (
                                            <button
                                                onClick={handlePublishCommittee}
                                                className="inline-flex items-center px-6 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                Publish Committee
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setShowEndTenureModal(true)}
                                                className="inline-flex items-center px-6 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            >
                                                <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                                                End Tenure
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Flash Messages */}
                            {flash?.success && (
                                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                                    {flash.success}
                                </div>
                            )}
                            {flash?.error && (
                                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                    {flash.error}
                                </div>
                            )}

                            {/* Current Members Sortable Table */}
                            {totalCurrentMembers === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-400">
                                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No current committee members</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by adding a committee member.</p>
                                </div>
                            ) : (
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleSort('member_order')}
                                                >
                                                    <div className="flex items-center space-x-1">
                                                        <span>Order</span>
                                                        {sortField === 'member_order' && (
                                                            sortDirection === 'asc' ?
                                                                <ArrowUpIcon className="w-4 h-4" /> :
                                                                <ArrowDownIcon className="w-4 h-4" />
                                                        )}
                                                    </div>
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Photo
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleSort('user_name')}
                                                >
                                                    <div className="flex items-center space-x-1">
                                                        <span>Executive Member</span>
                                                        {sortField === 'user_name' && (
                                                            sortDirection === 'asc' ?
                                                                <ArrowUpIcon className="w-4 h-4" /> :
                                                                <ArrowDownIcon className="w-4 h-4" />
                                                        )}
                                                    </div>
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleSort('designation_name')}
                                                >
                                                    <div className="flex items-center space-x-1">
                                                        <span>Designation</span>
                                                        {sortField === 'designation_name' && (
                                                            sortDirection === 'asc' ?
                                                                <ArrowUpIcon className="w-4 h-4" /> :
                                                                <ArrowDownIcon className="w-4 h-4" />
                                                        )}
                                                    </div>
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Contact
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {sortedMembers.map((member, index) => (
                                                <tr key={member.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {member.member_order}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {member.user_image ? (
                                                            <img
                                                                className="h-12 w-12 rounded-full object-cover"
                                                                src={`/storage/${member.user_image}`}
                                                                alt={member.user_name}
                                                            />
                                                        ) : (
                                                            <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                                                                <span className="text-sm font-medium text-gray-700">
                                                                    {member.user_name.charAt(0)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {member.user_name}
                                                        </div>
                                                        <div className="text-sm text-green-600">
                                                            Auto-assigned Executive Member
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                            {member.designation_name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{member.user_email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                Active
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                (Managed via User Roles)
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* End Tenure Modal */}
            {showEndTenureModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="flex items-center mb-4">
                            <ExclamationTriangleIcon className="w-8 h-8 text-red-600 mr-3" />
                            <h3 className="text-lg font-bold text-gray-900">End Committee Tenure</h3>
                        </div>

                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
                            <p className="text-sm text-red-800">
                                <strong>Warning:</strong> This will archive all current executive committee members ({totalCurrentMembers} members)
                                and remove them from the current committee. They will be moved to previous committee records.
                                To add new members to the committee, approve executives with designations in User Role Management.
                                This action cannot be undone.
                            </p>
                        </div>

                        <form onSubmit={handleEndTenure}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    New Committee Number
                                </label>
                                <input
                                    type="text"
                                    value={endTenureData.new_committee_number}
                                    onChange={(e) => setEndTenureData('new_committee_number', e.target.value)}
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                                    placeholder={generateNewCommitteeNumber()}
                                    required
                                />
                                {endTenureErrors.new_committee_number && (
                                    <p className="text-red-500 text-xs mt-1">{endTenureErrors.new_committee_number}</p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Type "CONFIRM" to proceed
                                </label>
                                <input
                                    type="text"
                                    value={endTenureData.confirmation}
                                    onChange={(e) => setEndTenureData('confirmation', e.target.value)}
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                                    placeholder="CONFIRM"
                                    required
                                />
                                {endTenureErrors.confirmation && (
                                    <p className="text-red-500 text-xs mt-1">{endTenureErrors.confirmation}</p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEndTenureModal(false)}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processingEndTenure || endTenureData.confirmation !== 'CONFIRM'}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                >
                                    {processingEndTenure ? 'Processing...' : 'End Tenure'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminAuthenticatedLayout>
    );
}
