import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ExcelImportButton from '@/Components/Admin/ExcelImport/ExcelImportButton';

export default function UserImport({ auth, validationMetadata }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">User Import</h2>}
        >
            <Head title="User Import" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                Import Users from Excel
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Use the button below to import users from an Excel file. The system supports validation and provides an Excel-like interface for editing data before import.
                            </p>
                            <ExcelImportButton validationMetadata={validationMetadata} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
