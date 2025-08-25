import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';

export default function VolunteerApplicationManagement({ 
    applications, 
    pendingUsersCount = 0,
    pendingVolunteerApplications = 0,
    pendingExecutiveApplications = 0 
}) {
    const [processing, setProcessing] = useState(false);
    const [selectedApplications, setSelectedApplications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [showBulkActions, setShowBulkActions] = useState(false);

    const handleStatusChange = (id, status, comment = '') => {
        router.patch(route('admin.applications.volunteer.update', id), {
            status,
            admin_notes: comment,
        }, {
            preserveScroll: true, // Keeps scroll position after update
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => {
                console.log('Application status updated successfully');
            },
            onError: (errors) => {
                console.error('Error updating application:', errors);
            }
        });
    };

    const handleBulkStatusChange = (status) => {
        if (selectedApplications.length === 0) return;
        
        if (status === 'approved') {
            if (confirm(`Approve ${selectedApplications.length} volunteer applications? This will change their role to volunteer.`)) {
                selectedApplications.forEach(id => {
                    handleStatusChange(id, status, '');
                });
                setSelectedApplications([]);
                setShowBulkActions(false);
            }
        } else if (status === 'rejected') {
            const comment = prompt('Rejection reason (required for all):');
            if (comment && comment.trim()) {
                selectedApplications.forEach(id => {
                    handleStatusChange(id, status, comment.trim());
                });
                setSelectedApplications([]);
                setShowBulkActions(false);
            } else if (comment !== null) {
                alert('Rejection reason is required');
            }
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const pendingIds = filteredApplications
                .filter(app => app.status === 'pending')
                .map(app => app.id);
            setSelectedApplications(pendingIds);
        } else {
            setSelectedApplications([]);
        }
    };

    const handleSelectApplication = (id, checked) => {
        if (checked) {
            setSelectedApplications([...selectedApplications, id]);
        } else {
            setSelectedApplications(selectedApplications.filter(appId => appId !== id));
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    const filteredApplications = applications.filter(app => {
        if (filter === 'all') return true;
        return app.status === filter;
    });

    return (
        <AdminAuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Volunteer Application Management
                </h2>
            }
            pendingUsersCount={pendingUsersCount}
            pendingVolunteerApplications={pendingVolunteerApplications}
            pendingExecutiveApplications={pendingExecutiveApplications}
        >
            <Head title="Volunteer Applications" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header with filters and bulk actions */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Volunteer Applications
                                    </h3>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setFilter('all')}
                                            className={`px-3 py-1 text-xs rounded-full ${filter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                                        >
                                            All ({applications.length})
                                        </button>
                                        <button
                                            onClick={() => setFilter('pending')}
                                            className={`px-3 py-1 text-xs rounded-full ${filter === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}
                                        >
                                            Pending ({applications.filter(a => a.status === 'pending').length})
                                        </button>
                                        <button
                                            onClick={() => setFilter('approved')}
                                            className={`px-3 py-1 text-xs rounded-full ${filter === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                                        >
                                            Approved ({applications.filter(a => a.status === 'approved').length})
                                        </button>
                                        <button
                                            onClick={() => setFilter('rejected')}
                                            className={`px-3 py-1 text-xs rounded-full ${filter === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}
                                        >
                                            Rejected ({applications.filter(a => a.status === 'rejected').length})
                                        </button>
                                    </div>
                                </div>
                                
                                {selectedApplications.length > 0 && (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-600">
                                            {selectedApplications.length} selected
                                        </span>
                                        <button
                                            onClick={() => handleBulkStatusChange('approved')}
                                            disabled={processing}
                                            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                        >
                                            Bulk Approve
                                        </button>
                                        <button
                                            onClick={() => handleBulkStatusChange('rejected')}
                                            disabled={processing}
                                            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                        >
                                            Bulk Reject
                                        </button>
                                    </div>
                                )}
                            </div>

                            {filteredApplications.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No volunteer applications found for the selected filter.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    <input
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        className="rounded border-gray-300"
                                                        checked={selectedApplications.length === filteredApplications.filter(a => a.status === 'pending').length && filteredApplications.filter(a => a.status === 'pending').length > 0}
                                                    />
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Applicant
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Department
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Reason
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Applied On
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredApplications.map((application) => (
                                                <tr key={application.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {application.status === 'pending' && (
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedApplications.includes(application.id)}
                                                                onChange={(e) => handleSelectApplication(application.id, e.target.checked)}
                                                                className="rounded border-gray-300"
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {application.user.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {application.user.email}
                                                                </div>
                                                                <div className="text-xs text-gray-400">
                                                                    ID: {application.user.member_id || 'N/A'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {application.user.department || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                                                        <div className="truncate" title={application.reason}>
                                                            {application.reason || 'No reason provided'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(application.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(application.status)}`}>
                                                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                        </span>
                                                        {application.admin_comment && (
                                                            <div className="text-xs text-gray-500 mt-1" title={application.admin_comment}>
                                                                Comment: {application.admin_comment.substring(0, 30)}...
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        {application.status === 'pending' && (
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => {
                                                                        if (confirm('Approve this volunteer application? This will change the user\'s role to volunteer.')) {
                                                                            handleStatusChange(application.id, 'approved', '');
                                                                        }
                                                                    }}
                                                                    disabled={processing}
                                                                    className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        const comment = prompt('Rejection reason (required):');
                                                                        if (comment && comment.trim()) {
                                                                            handleStatusChange(application.id, 'rejected', comment.trim());
                                                                        } else if (comment !== null) {
                                                                            alert('Rejection reason is required');
                                                                        }
                                                                    }}
                                                                    disabled={processing}
                                                                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        )}
                                                        {application.status !== 'pending' && (
                                                            <span className="text-gray-400">
                                                                {application.status === 'approved' ? 'Approved' : 'Rejected'}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="mt-6 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-2">Application Process:</h4>
                                <ul className="list-disc list-inside space-y-1 text-blue-800">
                                    <li>Approved volunteer applications will automatically change user role from "member" to "volunteer"</li>
                                    <li>Use bulk actions to approve/reject multiple applications at once</li>
                                    <li>All actions are logged with admin information and timestamps</li>
                                    <li>Rejected applications can include admin comments for feedback</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
