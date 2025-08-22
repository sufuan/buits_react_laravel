import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function UserRoleHistory({ user, history }) {
    const getChangeTypeBadge = (changeType) => {
        const badges = {
            manual: 'bg-blue-100 text-blue-800',
            bulk_manual: 'bg-purple-100 text-purple-800',
            application_approval: 'bg-green-100 text-green-800',
            system: 'bg-gray-100 text-gray-800'
        };
        return badges[changeType] || 'bg-gray-100 text-gray-800';
    };

    const getChangeTypeLabel = (changeType) => {
        const labels = {
            manual: 'Manual Change',
            bulk_manual: 'Bulk Operation',
            application_approval: 'Application Approval',
            system: 'System Change'
        };
        return labels[changeType] || changeType;
    };

    const getUserTypeBadge = (usertype) => {
        const badges = {
            member: 'bg-blue-100 text-blue-800',
            volunteer: 'bg-green-100 text-green-800',
            executive: 'bg-purple-100 text-purple-800'
        };
        return badges[usertype] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Role Change History
                    </h2>
                    <Link
                        href={route('admin.user-role-management.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                        Back to User Management
                    </Link>
                </div>
            }
        >
            <Head title={`Role History - ${user.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* User Info Card */}
                    <div className="bg-white shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                    {user.student_id && (
                                        <p className="text-xs text-gray-400">Student ID: {user.student_id}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-600">Current Role:</span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUserTypeBadge(user.usertype)}`}>
                                            {user.usertype.charAt(0).toUpperCase() + user.usertype.slice(1)}
                                        </span>
                                    </div>
                                    {user.designation && (
                                        <div className="mt-1">
                                            <span className="text-sm text-gray-600">Designation:</span>
                                            <span className="ml-1 text-sm font-medium text-gray-900">
                                                {user.designation.name} (Level {user.designation.level})
                                            </span>
                                        </div>
                                    )}
                                    {user.department && (
                                        <div className="mt-1">
                                            <span className="text-sm text-gray-600">Department:</span>
                                            <span className="ml-1 text-sm text-gray-900">{user.department}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* History Timeline */}
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h4 className="text-lg font-medium text-gray-900 mb-6">Role Change Timeline</h4>
                            
                            {history.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No role changes found for this user.</p>
                                </div>
                            ) : (
                                <div className="flow-root">
                                    <ul role="list" className="-mb-8">
                                        {history.map((change, changeIdx) => (
                                            <li key={change.id}>
                                                <div className="relative pb-8">
                                                    {changeIdx !== history.length - 1 ? (
                                                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                                    ) : null}
                                                    <div className="relative flex space-x-3">
                                                        <div>
                                                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getChangeTypeBadge(change.change_type).replace('text-', 'bg-').replace('100', '500')}`}>
                                                                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                            </span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm text-gray-500">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getChangeTypeBadge(change.change_type)}`}>
                                                                            {getChangeTypeLabel(change.change_type)}
                                                                        </span>
                                                                        <span className="text-gray-900 font-medium">
                                                                            by {change.admin?.name || 'System'}
                                                                        </span>
                                                                    </div>
                                                                    <time className="flex-shrink-0 text-xs text-gray-500">
                                                                        {new Date(change.created_at).toLocaleString()}
                                                                    </time>
                                                                </div>
                                                            </div>
                                                            <div className="mt-2 bg-gray-50 p-4 rounded-lg">
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <h5 className="text-sm font-medium text-gray-900 mb-2">Previous Role</h5>
                                                                        <div className="space-y-1">
                                                                            <div>
                                                                                <span className="text-xs text-gray-600">User Type:</span>
                                                                                <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getUserTypeBadge(change.previous_usertype)}`}>
                                                                                    {change.previous_usertype.charAt(0).toUpperCase() + change.previous_usertype.slice(1)}
                                                                                </span>
                                                                            </div>
                                                                            {change.previous_designation && (
                                                                                <div>
                                                                                    <span className="text-xs text-gray-600">Designation:</span>
                                                                                    <span className="ml-2 text-xs text-gray-900">
                                                                                        {change.previous_designation.name}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <h5 className="text-sm font-medium text-gray-900 mb-2">New Role</h5>
                                                                        <div className="space-y-1">
                                                                            <div>
                                                                                <span className="text-xs text-gray-600">User Type:</span>
                                                                                <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getUserTypeBadge(change.new_usertype)}`}>
                                                                                    {change.new_usertype.charAt(0).toUpperCase() + change.new_usertype.slice(1)}
                                                                                </span>
                                                                            </div>
                                                                            {change.new_designation && (
                                                                                <div>
                                                                                    <span className="text-xs text-gray-600">Designation:</span>
                                                                                    <span className="ml-2 text-xs text-gray-900">
                                                                                        {change.new_designation.name}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {change.reason && (
                                                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                                                        <h5 className="text-sm font-medium text-gray-900 mb-1">Reason</h5>
                                                                        <p className="text-sm text-gray-700">{change.reason}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-8 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-2">Role Change Information:</h4>
                                <ul className="list-disc list-inside space-y-1 text-blue-800">
                                    <li>All role changes are permanently logged with timestamps and admin information</li>
                                    <li>Manual changes require admin approval and a reason</li>
                                    <li>Application approvals automatically trigger role changes</li>
                                    <li>Bulk operations are marked separately for audit purposes</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
