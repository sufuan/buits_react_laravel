import React, { useState, useEffect } from 'react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import ExcelImportButton from '@/Components/Admin/ExcelImport/ExcelImportButton';

export default function ExecutiveImport({ auth }) {
    const { flash, errors: pageErrors } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        file: null,
        committee_number: '',
        tenure_start: '',
        tenure_end: '',
    });

    const [showResultModal, setShowResultModal] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const [validationMetadata, setValidationMetadata] = useState(null);

    // Load validation metadata for dropdowns
    useEffect(() => {
        const loadValidationMetadata = async () => {
            try {
                // Reuse the same validation metadata endpoint as User Import
                const response = await fetch(route('admin.users.import.validation-metadata'));
                const result = await response.json();
                if (result.success) {
                    setValidationMetadata(result.data);
                }
            } catch (error) {
                console.error('Failed to load validation metadata:', error);
            }
        };
        loadValidationMetadata();
    }, []);

    const executiveColumns = [
        { key: 'row_id', label: '#', width: 60, readOnly: true },
        { key: 'member_id', label: 'Member ID', width: 120, readOnly: true },
        { key: 'name', label: 'Name', width: 200, required: true },
        { key: 'email_address', label: 'Email', width: 250, required: true },
        { key: 'designation', label: 'Designation', width: 180, required: true },
        { key: 'department', label: 'Department', width: 180 },
        { key: 'session', label: 'Session', width: 120 },
        { key: 'gender', label: 'Gender', width: 100 },
        { key: 'contact_number', label: 'Contact', width: 150 },
        { key: 'member_order', label: 'Order', width: 80 },
        { key: 'tenure_start', label: 'Tenure Start', width: 120 },
        { key: 'tenure_end', label: 'Tenure End', width: 120 },
    ];

    useEffect(() => {
        if (flash?.success || flash?.error || pageErrors?.file || pageErrors?.error) {
            setImportResult({
                success: flash?.success || null,
                error: flash?.error || pageErrors?.error || pageErrors?.file || null,
                stats: flash?.import_stats || null
            });
            setShowResultModal(true);
        }
    }, [flash, pageErrors]);

    const handleImportComplete = (result) => {
        setImportResult({
            success: result.success ? result.message : null,
            error: !result.success ? result.message : null,
            stats: result
        });
        setShowResultModal(true);
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Executive Member Import</h2>
                </div>
            }
        >
            <Head title="Executive Member Import" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-8 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Import Executive Members
                                    </h3>
                                    <p className="text-gray-600">
                                        Upload an Excel file containing committee members. Note: Every imported member 
                                        <strong> must </strong> already exist as a registered user in the system (matched by email).
                                    </p>
                                </div>
                                <div>
                                    <Button variant="outline" asChild>
                                        <a href={route('admin.executive-import.template')}>
                                            Download Template
                                        </a>
                                    </Button>
                                </div>
                            </div>

                            {/* Import Result Modal */}
                            <Dialog open={showResultModal} onOpenChange={setShowResultModal}>
                                <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            {importResult?.success ? (
                                                <>
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                    Import Successful
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-5 w-5 text-red-500" />
                                                    Import Failed
                                                </>
                                            )}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="py-4">
                                        {importResult?.success && (
                                            <Alert className="border-green-200 bg-green-50">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                <AlertTitle className="text-green-800">Success</AlertTitle>
                                                <AlertDescription className="text-green-700 mt-2">
                                                    {importResult.success}
                                                    {importResult.stats?.errors?.length > 0 && (
                                                        <div className="mt-3 bg-white p-3 rounded border border-green-100 text-sm">
                                                            <strong className="text-gray-900">Skipped/Errors ({importResult.stats.errors.length}):</strong>
                                                            <ul className="list-disc pl-5 mt-1 text-gray-700 space-y-1">
                                                                {importResult.stats.errors.slice(0, 5).map((err, i) => (
                                                                    <li key={i}>{err}</li>
                                                                ))}
                                                                {importResult.stats.errors.length > 5 && (
                                                                    <li>...and {importResult.stats.errors.length - 5} more.</li>
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                        {importResult?.error && (
                                            <Alert className="border-red-200 bg-red-50">
                                                <AlertCircle className="h-4 w-4 text-red-600" />
                                                <AlertTitle className="text-red-800">Error</AlertTitle>
                                                <AlertDescription className="text-red-700 mt-2">
                                                    {importResult.error}
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={() => setShowResultModal(false)}>
                                            Close
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* Form fields wrapper */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="committee_number">Committee Number / Identifier <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="committee_number"
                                            type="text"
                                            value={data.committee_number}
                                            onChange={(e) => setData('committee_number', e.target.value)}
                                            placeholder="e.g. 5th, 2023-2024"
                                            required
                                        />
                                        <p className="text-xs text-gray-500">Fill this before selecting the Excel file.</p>
                                    </div>

                                    <div className="space-y-2 flex items-end">
                                        <div className="w-full">
                                            <ExcelImportButton 
                                                buttonText="Select Excel & Preview"
                                                disabled={!data.committee_number}
                                                className="w-full h-10"
                                                apiRoutes={{
                                                    preview: route('admin.executive-import.preview'),
                                                    validateRow: route('admin.executive-import.validate-row'),
                                                    batch: route('admin.executive-import.batch'),
                                                    clearSession: route('admin.executive-import.clear-session')
                                                }}
                                                additionalPayload={{
                                                    committee_number: data.committee_number,
                                                    tenure_start: data.tenure_start,
                                                    tenure_end: data.tenure_end,
                                                }}
                                                columns={executiveColumns}
                                                validationMetadata={validationMetadata} 
                                                onImportComplete={handleImportComplete}
                                            />
                                            {!data.committee_number && (
                                                <p className="text-xs text-red-500 mt-1">Please enter a Committee Number first.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="tenure_start">Tenure Start Date (Optional fallback)</Label>
                                        <Input
                                            id="tenure_start"
                                            type="date"
                                            value={data.tenure_start}
                                            onChange={(e) => setData('tenure_start', e.target.value)}
                                        />
                                        <p className="text-xs text-gray-500">Used if the sheet row is missing a tenure start date.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tenure_end">Tenure End Date (Optional fallback)</Label>
                                        <Input
                                            id="tenure_end"
                                            type="date"
                                            value={data.tenure_end}
                                            onChange={(e) => setData('tenure_end', e.target.value)}
                                        />
                                        <p className="text-xs text-gray-500">Used if the sheet row is missing a tenure end date.</p>
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
