import React, { useState, useMemo } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { PlusIcon, ExclamationTriangleIcon, ArrowUpIcon, ArrowDownIcon, MagnifyingGlassIcon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function CurrentCommittee({
    auth,
    currentMembers,
    currentCommitteeNumber,
    designations,
    availableUsers,
    totalCurrentMembers,
    isPublished
}) {
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showEndTenureModal, setShowEndTenureModal] = useState(false);
    const [sortedMembers, setSortedMembers] = useState(currentMembers);
    const [sortField, setSortField] = useState('member_order');
    const [sortDirection, setSortDirection] = useState('asc');

    // Search state inside modal
    const [userSearch, setUserSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [addProcessing, setAddProcessing] = useState(false);

    const { flash = {} } = usePage().props;
    const { post } = useForm();

    // Add Member Form
    const { data: addData, setData: setAddData, post: postAdd, processing: processingAdd, errors: addErrors, reset: resetAdd } = useForm({
        user_id: '',
        designation_id: '',
    });

    // End Tenure Form
    const { data: endTenureData, setData: setEndTenureData, post: postEndTenure, processing: processingEndTenure, errors: endTenureErrors, reset: resetEndTenure } = useForm({
        confirmation: '',
        new_committee_number: ''
    });

    const handlePublishCommittee = () => {
        if (confirm('Are you sure you want to publish the current committee? This will make it visible to the public.')) {
            post(route('admin.committee.publish'), {
                preserveScroll: true,
            });
        }
    };

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

    const handleEndTenure = (e) => {
        e.preventDefault();
        if (endTenureData.confirmation !== 'CONFIRM') return;
        postEndTenure(route('admin.committee.end-tenure'), {
            onSuccess: () => {
                resetEndTenure();
                setShowEndTenureModal(false);
            }
        });
    };

    // Filtered users based on search term
    const filteredUsers = useMemo(() => {
        if (!userSearch.trim()) return availableUsers;
        const q = userSearch.toLowerCase();
        return availableUsers.filter(u =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            (u.department && u.department.toLowerCase().includes(q))
        );
    }, [availableUsers, userSearch]);

    // IDs of users already in the committee (to prevent duplicates)
    const currentMemberIds = useMemo(() => new Set(currentMembers.map(m => m.user_id)), [currentMembers]);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setAddData('user_id', user.id);
        setUserSearch(user.name);
    };

    const handleAddMember = (e) => {
        e.preventDefault();
        if (!addData.user_id || !addData.designation_id) return;
        postAdd(route('admin.committee.add'), {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => {
                resetAdd();
                setSelectedUser(null);
                setUserSearch('');
                setShowAddMemberModal(false);
            }
        });
    };

    const closeAddModal = () => {
        setShowAddMemberModal(false);
        resetAdd();
        setSelectedUser(null);
        setUserSearch('');
    };

    const generateNewCommitteeNumber = () => {
        const currentYear = new Date().getFullYear();
        return `${currentYear}-${currentYear + 1}`;
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
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">Current Committee</h2>
                                    <p className="text-gray-600 mt-1">
                                        {currentCommitteeNumber ? `Committee ${currentCommitteeNumber}` : 'Committee 1'}
                                        {' '}• {totalCurrentMembers} executive members
                                    </p>
                                    <p className="text-sm text-blue-600 mt-1">
                                        ✓ All executive members with designations are automatically included
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {/* Add Member Button — always visible */}
                                    <button
                                        onClick={() => setShowAddMemberModal(true)}
                                        className="inline-flex items-center px-5 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Add Member to Committee
                                    </button>

                                    {/* Publish / End Tenure */}
                                    {totalCurrentMembers > 0 && (
                                        !isPublished ? (
                                            <button
                                                onClick={handlePublishCommittee}
                                                className="inline-flex items-center px-5 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
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
                                                className="inline-flex items-center px-5 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
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
                                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    {flash.success}
                                </div>
                            )}
                            {flash?.error && (
                                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
                                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5a1 1 0 112 0v-4a1 1 0 10-2 0v4zm1-8a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>
                                    {flash.error}
                                </div>
                            )}

                            {/* Current Members Table */}
                            {totalCurrentMembers === 0 ? (
                                <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
                                    <div className="text-gray-300 mb-4">
                                        <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No committee members yet</h3>
                                    <p className="text-gray-500 mb-6">Get started by clicking <strong>Add Member to Committee</strong> above.</p>
                                    <button
                                        onClick={() => setShowAddMemberModal(true)}
                                        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition"
                                    >
                                        <PlusIcon className="w-5 h-5 mr-2" />
                                        Add First Member
                                    </button>
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
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleSort('user_name')}
                                                >
                                                    <div className="flex items-center space-x-1">
                                                        <span>Member</span>
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
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {sortedMembers.map((member, index) => (
                                                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center justify-center w-7 h-7 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full">
                                                            {member.member_order}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {member.user_image ? (
                                                            <img
                                                                className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-100"
                                                                src={`/storage/${member.user_image}`}
                                                                alt={member.user_name}
                                                            />
                                                        ) : (
                                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center ring-2 ring-indigo-100">
                                                                <span className="text-sm font-bold text-white">
                                                                    {member.user_name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-semibold text-gray-900">{member.user_name}</div>
                                                        <div className="text-xs text-indigo-500 font-medium mt-0.5">Executive Member</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                            {member.designation_name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-700">{member.user_email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                            Active
                                                        </span>
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

            {/* ── Add Member Modal ── */}
            {showAddMemberModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-xl">
                                    <PlusIcon className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Add Member to Committee</h3>
                                    <p className="text-xs text-gray-500">Search a user and assign their role</p>
                                </div>
                            </div>
                            <button onClick={closeAddModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <XMarkIcon className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleAddMember} className="flex flex-col flex-1 overflow-hidden">
                            <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
                                {/* User Search */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Search User <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={userSearch}
                                            onChange={(e) => {
                                                setUserSearch(e.target.value);
                                                if (selectedUser && e.target.value !== selectedUser.name) {
                                                    setSelectedUser(null);
                                                    setAddData('user_id', '');
                                                }
                                            }}
                                            placeholder="Search by name, email or department..."
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        />
                                    </div>

                                    {/* User dropdown results */}
                                    {userSearch && !selectedUser && filteredUsers.length > 0 && (
                                        <div className="mt-1 border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto divide-y divide-gray-100">
                                            {filteredUsers.slice(0, 20).map(user => {
                                                const alreadyAdded = currentMemberIds.has(user.id);
                                                return (
                                                    <button
                                                        key={user.id}
                                                        type="button"
                                                        disabled={alreadyAdded}
                                                        onClick={() => !alreadyAdded && handleSelectUser(user)}
                                                        className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors ${alreadyAdded ? 'opacity-60 cursor-not-allowed bg-gray-50' : 'hover:bg-indigo-50'}`}
                                                    >
                                                        {user.image ? (
                                                            <img src={`/storage/${user.image}`} alt={user.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                                                                <span className="text-xs font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
                                                            </div>
                                                        )}
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                                            <p className="text-xs text-gray-500 truncate">{user.email}{user.department ? ` • ${user.department}` : ''}</p>
                                                        </div>
                                                        {alreadyAdded ? (
                                                            <span className="ml-auto text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium whitespace-nowrap">✓ In Committee</span>
                                                        ) : (
                                                            <span className="ml-auto text-xs capitalize px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{user.usertype}</span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {userSearch && !selectedUser && filteredUsers.length === 0 && (
                                        <div className="mt-1 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-500 text-center">
                                            No users found matching "{userSearch}"
                                        </div>
                                    )}

                                    {/* Selected user chip */}
                                    {selectedUser && (
                                        <div className="mt-2 flex items-center gap-3 bg-indigo-50 border border-indigo-200 px-4 py-2.5 rounded-xl">
                                            {selectedUser.image ? (
                                                <img src={`/storage/${selectedUser.image}`} alt={selectedUser.name} className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-white">{selectedUser.name.charAt(0).toUpperCase()}</span>
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-indigo-800 truncate">{selectedUser.name}</p>
                                                <p className="text-xs text-indigo-600 truncate">{selectedUser.email}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => { setSelectedUser(null); setAddData('user_id', ''); setUserSearch(''); }}
                                                className="text-indigo-400 hover:text-indigo-600"
                                            >
                                                <XMarkIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                    {addErrors.user_id && <p className="mt-1 text-xs text-red-600">{addErrors.user_id}</p>}
                                </div>

                                {/* Designation / Role */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Assign Designation / Role <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={addData.designation_id}
                                        onChange={e => setAddData('designation_id', e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                    >
                                        <option value="">— Select a designation —</option>
                                        {designations.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                    {addErrors.designation_id && <p className="mt-1 text-xs text-red-600">{addErrors.designation_id}</p>}
                                </div>

                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                                    <strong>Note:</strong> The selected user will be promoted to <strong>Executive</strong> status with the chosen designation and added to the current committee automatically.
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeAddModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processingAdd || !addData.user_id || !addData.designation_id}
                                    className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                                >
                                    {processingAdd ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <PlusIcon className="w-4 h-4" />
                                            Add to Committee
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* End Tenure Modal */}
            {showEndTenureModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-100 rounded-xl">
                                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">End Committee Tenure</h3>
                            </div>

                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-sm text-red-800">
                                    <strong>Warning:</strong> This will archive all current executive committee members ({totalCurrentMembers} members)
                                    and remove them from the current committee. They will be moved to previous committee records.
                                    This action cannot be undone.
                                </p>
                            </div>

                            <form onSubmit={handleEndTenure} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">New Committee Number</label>
                                    <input
                                        type="text"
                                        value={endTenureData.new_committee_number}
                                        onChange={(e) => setEndTenureData('new_committee_number', e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder={generateNewCommitteeNumber()}
                                        required
                                    />
                                    {endTenureErrors.new_committee_number && (
                                        <p className="text-red-500 text-xs mt-1">{endTenureErrors.new_committee_number}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Type "CONFIRM" to proceed</label>
                                    <input
                                        type="text"
                                        value={endTenureData.confirmation}
                                        onChange={(e) => setEndTenureData('confirmation', e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="CONFIRM"
                                        required
                                    />
                                    {endTenureErrors.confirmation && (
                                        <p className="text-red-500 text-xs mt-1">{endTenureErrors.confirmation}</p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowEndTenureModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processingEndTenure || endTenureData.confirmation !== 'CONFIRM'}
                                        className="px-6 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50"
                                    >
                                        {processingEndTenure ? 'Processing...' : 'End Tenure'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminAuthenticatedLayout>
    );
}
