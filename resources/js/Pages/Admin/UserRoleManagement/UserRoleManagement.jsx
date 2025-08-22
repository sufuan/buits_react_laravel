import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';

export default function UserRoleManagement({ users, designations, departments, filters }) {
    const { put, processing } = useForm();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [roleFormData, setRoleFormData] = useState({
        usertype: '',
        designation_id: '',
        reason: ''
    });
    const [searchForm, setSearchForm] = useState({
        search: filters.search || '',
        usertype: filters.usertype || 'all',
        department: filters.department || 'all',
        designation_id: filters.designation_id || 'all'
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.user-role-management.index'), searchForm, {
            preserveState: true,
        });
    };

    const handleFilterChange = (field, value) => {
        const newFilters = { ...searchForm, [field]: value };
        setSearchForm(newFilters);
        router.get(route('admin.user-role-management.index'), newFilters, {
            preserveState: true,
        });
    };

    const openRoleModal = (user) => {
        setSelectedUser(user);
        setRoleFormData({
            usertype: user.usertype,
            designation_id: user.designation_id || '',
            reason: ''
        });
        setShowRoleModal(true);
    };

    const handleRoleUpdate = () => {
        if (!roleFormData.reason.trim()) {
            alert('Please provide a reason for the role change.');
            return;
        }

        put(route('admin.user-role-management.update-role', selectedUser.id), {
            ...roleFormData,
            onSuccess: () => {
                setShowRoleModal(false);
                setSelectedUser(null);
                setRoleFormData({ usertype: '', designation_id: '', reason: '' });
            }
        });
    };

    const openBulkModal = () => {
        if (selectedUsers.length === 0) {
            alert('Please select users to update.');
            return;
        }
        setRoleFormData({ usertype: '', designation_id: '', reason: '' });
        setShowBulkModal(true);
    };

    const handleBulkUpdate = () => {
        if (!roleFormData.reason.trim()) {
            alert('Please provide a reason for the bulk role change.');
            return;
        }

        put(route('admin.user-role-management.bulk-update'), {
            user_ids: selectedUsers,
            ...roleFormData,
            onSuccess: () => {
                setShowBulkModal(false);
                setSelectedUsers([]);
                setRoleFormData({ usertype: '', designation_id: '', reason: '' });
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(users.data.map(user => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId, checked) => {
        if (checked) {
            setSelectedUsers([...selectedUsers, userId]);
        } else {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        }
    };

    const getUserTypeBadge = (usertype) => {
        const badges = {
            member: 'bg-blue-100 text-blue-800',
            volunteer: 'bg-green-100 text-green-800',
            executive: 'bg-purple-100 text-purple-800'
        };
        return badges[usertype] || 'bg-gray-100 text-gray-800';
    };

    const exportUsers = () => {
        const params = new URLSearchParams(searchForm);
        window.open(route('admin.user-role-management.export') + '?' + params.toString());
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    User Role Management
                </h2>
            }
        >
            <Head title="User Role Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Search and Filters */}
                            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                <form onSubmit={handleSearch} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Search users..."
                                                value={searchForm.search}
                                                onChange={(e) => setSearchForm({...searchForm, search: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <select
                                                value={searchForm.usertype}
                                                onChange={(e) => handleFilterChange('usertype', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="all">All User Types</option>
                                                <option value="member">Members</option>
                                                <option value="volunteer">Volunteers</option>
                                                <option value="executive">Executives</option>
                                            </select>
                                        </div>
                                        <div>
                                            <select
                                                value={searchForm.department}
                                                onChange={(e) => handleFilterChange('department', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="all">All Departments</option>
                                                {departments.map((dept) => (
                                                    <option key={dept} value={dept}>{dept}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <select
                                                value={searchForm.designation_id}
                                                onChange={(e) => handleFilterChange('designation_id', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="all">All Designations</option>
                                                {designations.map((designation) => (
                                                    <option key={designation.id} value={designation.id}>
                                                        {designation.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            >
                                                Search
                                            </button>
                                            <button
                                                type="button"
                                                onClick={exportUsers}
                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                            >
                                                Export
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Bulk Actions */}
                            {selectedUsers.length > 0 && (
                                <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                                    <span className="text-sm text-blue-800">
                                        {selectedUsers.length} user(s) selected
                                    </span>
                                    <button
                                        onClick={openBulkModal}
                                        disabled={processing}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Bulk Update Roles
                                    </button>
                                </div>
                            )}

                            {/* Users Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <input
                                                    type="checkbox"
                                                    onChange={handleSelectAll}
                                                    checked={selectedUsers.length === users.data.length && users.data.length > 0}
                                                    className="rounded border-gray-300"
                                                />
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Current Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Designation
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Department
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Last Changed
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.data.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.includes(user.id)}
                                                        onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                                                        className="rounded border-gray-300"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {user.email}
                                                        </div>
                                                        {user.student_id && (
                                                            <div className="text-xs text-gray-400">
                                                                ID: {user.student_id}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUserTypeBadge(user.usertype)}`}>
                                                        {user.usertype.charAt(0).toUpperCase() + user.usertype.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {user.designation ? (
                                                        <div>
                                                            <div className="font-medium">{user.designation.name}</div>
                                                            <div className="text-xs text-gray-500">Level {user.designation.level}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">No designation</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {user.department || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.role_change_logs && user.role_change_logs.length > 0 ? (
                                                        <div>
                                                            <div>{new Date(user.role_change_logs[0].created_at).toLocaleDateString()}</div>
                                                            <div className="text-xs">by {user.role_change_logs[0].admin?.name || 'System'}</div>
                                                        </div>
                                                    ) : (
                                                        'Never'
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <button
                                                        onClick={() => openRoleModal(user)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Change Role
                                                    </button>
                                                    <button
                                                        onClick={() => router.get(route('admin.user-role-management.history', user.id))}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        View History
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {users.links && (
                                <div className="mt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Showing {users.from} to {users.to} of {users.total} results
                                        </div>
                                        <div className="flex space-x-1">
                                            {users.links.map((link, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => router.get(link.url)}
                                                    disabled={!link.url}
                                                    className={`px-3 py-1 text-sm rounded ${
                                                        link.active
                                                            ? 'bg-blue-600 text-white'
                                                            : link.url
                                                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Single Role Change Modal */}
                            {showRoleModal && (
                                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                        <div className="mt-3">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                Change User Role
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        User: {selectedUser?.name}
                                                    </label>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        New User Type
                                                    </label>
                                                    <select
                                                        value={roleFormData.usertype}
                                                        onChange={(e) => setRoleFormData({...roleFormData, usertype: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="member">Member</option>
                                                        <option value="volunteer">Volunteer</option>
                                                        <option value="executive">Executive</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Designation (Optional)
                                                    </label>
                                                    <select
                                                        value={roleFormData.designation_id}
                                                        onChange={(e) => setRoleFormData({...roleFormData, designation_id: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="">No designation</option>
                                                        {designations.map((designation) => (
                                                            <option key={designation.id} value={designation.id}>
                                                                {designation.name} (Level {designation.level})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Reason for Change *
                                                    </label>
                                                    <textarea
                                                        value={roleFormData.reason}
                                                        onChange={(e) => setRoleFormData({...roleFormData, reason: e.target.value})}
                                                        rows={3}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Explain why this role change is being made..."
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end space-x-3 mt-6">
                                                <button
                                                    onClick={() => setShowRoleModal(false)}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleRoleUpdate}
                                                    disabled={processing || !roleFormData.reason.trim()}
                                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                                                >
                                                    Update Role
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Bulk Role Change Modal */}
                            {showBulkModal && (
                                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                        <div className="mt-3">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                Bulk Update User Roles
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Selected Users: {selectedUsers.length}
                                                    </label>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        New User Type
                                                    </label>
                                                    <select
                                                        value={roleFormData.usertype}
                                                        onChange={(e) => setRoleFormData({...roleFormData, usertype: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="">Select user type...</option>
                                                        <option value="member">Member</option>
                                                        <option value="volunteer">Volunteer</option>
                                                        <option value="executive">Executive</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Designation (Optional)
                                                    </label>
                                                    <select
                                                        value={roleFormData.designation_id}
                                                        onChange={(e) => setRoleFormData({...roleFormData, designation_id: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="">No designation</option>
                                                        {designations.map((designation) => (
                                                            <option key={designation.id} value={designation.id}>
                                                                {designation.name} (Level {designation.level})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Reason for Bulk Change *
                                                    </label>
                                                    <textarea
                                                        value={roleFormData.reason}
                                                        onChange={(e) => setRoleFormData({...roleFormData, reason: e.target.value})}
                                                        rows={3}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Explain why these role changes are being made..."
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end space-x-3 mt-6">
                                                <button
                                                    onClick={() => setShowBulkModal(false)}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleBulkUpdate}
                                                    disabled={processing || !roleFormData.usertype || !roleFormData.reason.trim()}
                                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                                                >
                                                    Update All Roles
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
