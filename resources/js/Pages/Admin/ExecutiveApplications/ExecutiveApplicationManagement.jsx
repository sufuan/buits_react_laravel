import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';

export default function ExecutiveApplicationManagement({ applications, designations }) {
    const { patch, processing } = useForm();
    const [selectedApplications, setSelectedApplications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [showDesignationModal, setShowDesignationModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [selectedDesignation, setSelectedDesignation] = useState('');

    const handleStatusChange = (id, status, comment = '', designationId = null) => {
        patch(route('admin.applications.executive.update', id), {
            status,
            admin_comment: comment,
            designation_id: designationId,
        });
    };

    const handleApproveWithDesignation = (application) => {
        setSelectedApplication(application);
        setSelectedDesignation(application.designation_id || '');
        setShowDesignationModal(true);
    };

    const confirmApproval = () => {
        if (!selectedDesignation) {
            alert('Please select a designation for this executive position.');
            return;
        }
        
        const comment = prompt('Approval comment (optional):') || '';
        handleStatusChange(selectedApplication.id, 'approved', comment, selectedDesignation);
        setShowDesignationModal(false);
        setSelectedApplication(null);
        setSelectedDesignation('');
    };

    const handleBulkStatusChange = (status) => {
        if (selectedApplications.length === 0) return;
        
        const comment = prompt(`${status === 'approved' ? 'Approval' : 'Rejection'} reason (optional):`);
        if (comment === null) return;

        selectedApplications.forEach(id => {
            handleStatusChange(id, status, comment);
        });
        
        setSelectedApplications([]);
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
                    Executive Application Management
                </h2>
            }
        >
            <Head title="Executive Applications" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header with filters and bulk actions */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Executive Applications
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
                                    <p className="text-gray-500">No executive applications found for the selected filter.</p>
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
                                                    Applied Position
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
                                                                    Current: {application.user.usertype}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {application.designation?.name || 'N/A'}
                                                        </div>
                                                        {application.designation?.level && (
                                                            <div className="text-sm text-gray-500">
                                                                Level {application.designation.level}
                                                            </div>
                                                        )}
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
                                                                    onClick={() => handleApproveWithDesignation(application)}
                                                                    disabled={processing}
                                                                    className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        const comment = prompt('Rejection reason (optional):');
                                                                        if (comment !== null) {
                                                                            handleStatusChange(application.id, 'rejected', comment);
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

                            {/* Designation Selection Modal */}
                            {showDesignationModal && (
                                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                        <div className="mt-3">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                Approve Executive Application
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Approving <strong>{selectedApplication?.user.name}</strong> for executive position.
                                                Please select their designation:
                                            </p>
                                            <select
                                                value={selectedDesignation}
                                                onChange={(e) => setSelectedDesignation(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Designation...</option>
                                                {designations.map((designation) => (
                                                    <option key={designation.id} value={designation.id}>
                                                        {designation.name} (Level {designation.level})
                                                        {designation.is_primary && ' - Primary Position'}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="flex justify-end space-x-3 mt-6">
                                                <button
                                                    onClick={() => setShowDesignationModal(false)}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={confirmApproval}
                                                    disabled={!selectedDesignation}
                                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    Approve & Assign
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 text-sm text-gray-600 bg-purple-50 p-4 rounded-lg">
                                <h4 className="font-medium text-purple-900 mb-2">Executive Application Process:</h4>
                                <ul className="list-disc list-inside space-y-1 text-purple-800">
                                    <li>Approved executive applications will change user role from "volunteer" to "executive"</li>
                                    <li>Each approved executive must be assigned a specific designation/position</li>
                                    <li>Designations determine hierarchy and responsibilities within the organization</li>
                                    <li>All role changes are logged with admin information and timestamps</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
