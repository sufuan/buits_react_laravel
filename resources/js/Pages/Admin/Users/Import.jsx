import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ImportWizard from '@/Components/Admin/Import/ImportWizard';

export default function UserImport({ auth, validationMetadata }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">User Import</h2>}
        >
            <Head title="User Import" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <ImportWizard validationMetadata={validationMetadata} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
