import React, { useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FileUploader from '@/Components/Admin/ExcelImport/FileUploader';
import DataGrid from '@/Components/Admin/ExcelImport/DataGrid';
import ImportProgress from '@/Components/Admin/ExcelImport/ImportProgress';
import ImportSummary from '@/Components/Admin/ExcelImport/ImportSummary';

export default function ImportWizard({ auth }) {
    const [step, setStep] = useState('upload'); // upload, preview, importing, complete
    const [data, setData] = useState([]);
    const [errors, setErrors] = useState({});
    const [sessionId, setSessionId] = useState(null);
    const [importStats, setImportStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [validationMetadata, setValidationMetadata] = useState(null);

    // Fetch validation metadata on component mount
    React.useEffect(() => {
        fetchValidationMetadata();
    }, []);

    const fetchValidationMetadata = async () => {
        try {
            const response = await axios.get('/admin/users/validation-metadata');
            if (response.data.success) {
                setValidationMetadata(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch validation metadata:', error);
        }
    };

    const handleFileUpload = async (file) => {
        setLoading(true);
        setFile(file);
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await axios.post('/admin/users/preview', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (response.data.success) {
                setData(response.data.data.rows);
                setErrors(groupErrorsByRow(response.data.data.errors));
                setSessionId(response.data.session_id);
                setStep('preview');
            }
        } catch (error) {
            console.error('File upload failed:', error);
            const errorMessage = error.response?.data?.message || error.message;
            alert('Failed to upload file: ' + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCellEdit = async (rowId, field, value) => {
        try {
            // Update local data immediately for better UX
            const updatedData = data.map(row => 
                row.row_id === rowId ? { ...row, [field]: value } : row
            );
            setData(updatedData);

            // Validate the row
            const rowData = updatedData.find(row => row.row_id === rowId);
            const response = await axios.post('/admin/users/validate-row', {
                row_id: rowId,
                data: rowData
            });

            if (response.data.success) {
                // Update validation errors
                const updatedErrors = { ...errors };
                if (response.data.valid) {
                    // Remove errors for this row and field
                    if (updatedErrors[rowId]) {
                        delete updatedErrors[rowId][field];
                        if (Object.keys(updatedErrors[rowId]).length === 0) {
                            delete updatedErrors[rowId];
                        }
                    }
                } else {
                    // Add new errors
                    if (!updatedErrors[rowId]) {
                        updatedErrors[rowId] = {};
                    }
                    response.data.errors.forEach(error => {
                        updatedErrors[rowId][error.column] = error;
                    });
                }
                setErrors(updatedErrors);

                // Update member_id if provided
                if (response.data.member_id) {
                    const dataWithMemberId = updatedData.map(row => 
                        row.row_id === rowId ? { ...row, member_id: response.data.member_id } : row
                    );
                    setData(dataWithMemberId);
                }
            }
        } catch (error) {
            console.error('Cell validation failed:', error);
        }
    };

    const handleImport = async () => {
        setStep('importing');
        try {
            const response = await axios.post('/admin/users/import-batch', {
                rows: data,
                chunk_size: 100,
                session_id: sessionId
            });

            if (response.data.success) {
                setImportStats(response.data);
                setStep('complete');
            }
        } catch (error) {
            console.error('Import failed:', error);
            const errorMessage = error.response?.data?.message || error.message;
            alert('Import failed: ' + errorMessage);
            setStep('preview');
        }
    };

    const canImport = Object.keys(errors).length === 0 && data.length > 0;

    const groupErrorsByRow = (errorsList) => {
        const grouped = {};
        errorsList.forEach(error => {
            if (!grouped[error.row]) {
                grouped[error.row] = {};
            }
            grouped[error.row][error.column] = error;
        });
        return grouped;
    };

    const resetWizard = () => {
        setStep('upload');
        setData([]);
        setErrors({});
        setSessionId(null);
        setImportStats(null);
        setFile(null);
        setLoading(false);
    };

    const getStepNumber = (stepName) => {
        const steps = ['upload', 'preview', 'importing', 'complete'];
        return steps.indexOf(stepName) + 1;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Import Users</h2>}
        >
            <Head title="Import Users" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Step Indicator */}
                            <div className="mb-8">
                                <div className="flex items-center justify-center space-x-8">
                                    <div className={`flex items-center ${getStepNumber(step) >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${getStepNumber(step) >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                                            1
                                        </div>
                                        <span className="ml-2 font-medium">Upload File</span>
                                    </div>
                                    <div className={`w-16 h-0.5 ${getStepNumber(step) >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                    <div className={`flex items-center ${getStepNumber(step) >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${getStepNumber(step) >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                                            2
                                        </div>
                                        <span className="ml-2 font-medium">Preview & Edit</span>
                                    </div>
                                    <div className={`w-16 h-0.5 ${getStepNumber(step) >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                    <div className={`flex items-center ${getStepNumber(step) >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${getStepNumber(step) >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                                            3
                                        </div>
                                        <span className="ml-2 font-medium">Import</span>
                                    </div>
                                    <div className={`w-16 h-0.5 ${getStepNumber(step) >= 4 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                    <div className={`flex items-center ${getStepNumber(step) >= 4 ? 'text-blue-600' : 'text-gray-400'}`}>
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${getStepNumber(step) >= 4 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                                            ✓
                                        </div>
                                        <span className="ml-2 font-medium">Complete</span>
                                    </div>
                                </div>
                            </div>

                            {/* Step Content */}
                            {step === 'upload' && (
                                <FileUploader
                                    onFileUpload={handleFileUpload}
                                    loading={loading}
                                    validationMetadata={validationMetadata}
                                />
                            )}

                            {step === 'preview' && (
                                <DataGrid
                                    data={data}
                                    errors={errors}
                                    onCellEdit={handleCellEdit}
                                    onImport={handleImport}
                                    canImport={canImport}
                                    onBack={() => setStep('upload')}
                                    validationMetadata={validationMetadata}
                                    fileName={file?.name}
                                />
                            )}

                            {step === 'importing' && (
                                <ImportProgress
                                    message="Importing users..."
                                />
                            )}

                            {step === 'complete' && (
                                <ImportSummary
                                    stats={importStats}
                                    onReset={resetWizard}
                                    onGoToUsers={() => window.location.href = '/admin/users'}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
