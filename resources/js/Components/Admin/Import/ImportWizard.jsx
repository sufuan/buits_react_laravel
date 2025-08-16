import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import FileUploader from './FileUploader';
import DataGrid from './DataGrid';
import ImportProgress from './ImportProgress';
import ImportSummary from './ImportSummary';

export default function ImportWizard({ validationMetadata }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [previewData, setPreviewData] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [importProgress, setImportProgress] = useState({
        status: 'idle',
        progress: 0,
        currentBatch: 0,
        totalBatches: 0,
        processedRows: 0,
        totalRows: 0,
        errors: []
    });
    const [importResults, setImportResults] = useState(null);
    const [pollInterval, setPollInterval] = useState(null);

    const steps = [
        { number: 1, title: 'Upload File', description: 'Choose your Excel file' },
        { number: 2, title: 'Preview & Validate', description: 'Review and fix data' },
        { number: 3, title: 'Import Progress', description: 'Processing your data' },
        { number: 4, title: 'Summary', description: 'Import complete' }
    ];

    const handleFileUpload = async (file) => {
        setUploadedFile(file);
        
        const formData = new FormData();
        formData.append('excel_file', file);

        try {
            const response = await fetch(route('admin.users.import.preview'), {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json',
                }
            });

            const result = await response.json();
            
            if (result.success) {
                setPreviewData(result.data);
                setValidationErrors(result.validation_errors || {});
                setCurrentStep(2);
            } else {
                alert(result.message || 'Error uploading file');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error uploading file. Please try again.');
        }
    };

    const handleCellEdit = async (rowId, field, value) => {
        // Update preview data
        const updatedData = previewData.rows.map(row => 
            row.row_id === rowId ? { ...row, [field]: value } : row
        );
        
        setPreviewData({
            ...previewData,
            rows: updatedData
        });

        // Validate the specific row
        try {
            const response = await fetch(route('admin.users.import.validate-row'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    row_id: rowId,
                    data: updatedData.find(row => row.row_id === rowId)
                })
            });

            const result = await response.json();
            
            if (result.success) {
                // Update validation errors
                const newErrors = { ...validationErrors };
                if (result.validation_errors && Object.keys(result.validation_errors).length > 0) {
                    newErrors[rowId] = result.validation_errors;
                } else {
                    delete newErrors[rowId];
                }
                setValidationErrors(newErrors);
            }
        } catch (error) {
            console.error('Validation error:', error);
        }
    };

    const startImport = async () => {
        setCurrentStep(3);
        setImportProgress(prev => ({
            ...prev,
            status: 'processing',
            progress: 0
        }));

        try {
            const response = await fetch(route('admin.users.import.batch'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    session_id: previewData.session_id,
                    batch_size: 50
                })
            });

            const result = await response.json();
            
            if (result.success) {
                // Start polling for progress
                startProgressPolling();
            } else {
                setImportProgress(prev => ({
                    ...prev,
                    status: 'error'
                }));
                alert(result.message || 'Error starting import');
            }
        } catch (error) {
            console.error('Import error:', error);
            setImportProgress(prev => ({
                ...prev,
                status: 'error'
            }));
        }
    };

    const startProgressPolling = () => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(route('admin.users.import.status'), {
                    headers: {
                        'Accept': 'application/json',
                    }
                });

                const result = await response.json();
                
                if (result.success) {
                    setImportProgress(result.data);
                    
                    if (result.data.status === 'completed' || result.data.status === 'error') {
                        clearInterval(interval);
                        setPollInterval(null);
                        
                        if (result.data.status === 'completed') {
                            setImportResults(result.data);
                            setCurrentStep(4);
                        }
                    }
                }
            } catch (error) {
                console.error('Progress polling error:', error);
            }
        }, 2000);

        setPollInterval(interval);
    };

    const handleNewImport = () => {
        // Reset all state
        setCurrentStep(1);
        setUploadedFile(null);
        setPreviewData(null);
        setValidationErrors({});
        setImportProgress({
            status: 'idle',
            progress: 0,
            currentBatch: 0,
            totalBatches: 0,
            processedRows: 0,
            totalRows: 0,
            errors: []
        });
        setImportResults(null);
        
        if (pollInterval) {
            clearInterval(pollInterval);
            setPollInterval(null);
        }

        // Clear server session
        fetch(route('admin.users.import.clear-session'), {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            }
        });
    };

    const handleViewUsers = () => {
        router.get(route('admin.users.index'));
    };

    const handleDownloadErrorReport = () => {
        if (importResults && importResults.errors.length > 0) {
            const csvContent = "data:text/csv;charset=utf-8," 
                + "Row,Field,Error\n"
                + importResults.errors.map(error => 
                    `${error.row},"${error.field}","${error.message}"`
                ).join("\n");
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "import_errors.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const hasValidationErrors = Object.keys(validationErrors).length > 0;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">User Import Wizard</h1>
                    <p className="mt-2 text-gray-600">
                        Import users from Excel files with advanced validation and error handling
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex flex-col items-center flex-1">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                    currentStep >= step.number
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-500'
                                }`}>
                                    {currentStep > step.number ? (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        step.number
                                    )}
                                </div>
                                <div className="mt-2 text-center">
                                    <div className="text-sm font-medium text-gray-900">{step.title}</div>
                                    <div className="text-xs text-gray-500">{step.description}</div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`absolute top-5 left-1/2 w-full h-0.5 ${
                                        currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                                    }`} style={{ marginLeft: '2.5rem', width: 'calc(100% - 5rem)' }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-white rounded-lg shadow-sm border">
                    {currentStep === 1 && (
                        <div className="p-6">
                            <FileUploader
                                onFileUpload={handleFileUpload}
                                validationMetadata={validationMetadata}
                                acceptedFormats={['.xlsx', '.xls']}
                                maxFileSize={10} // 10MB
                            />
                        </div>
                    )}

                    {currentStep === 2 && previewData && (
                        <div className="p-6">
                            <DataGrid
                                data={previewData.rows}
                                columns={previewData.columns}
                                errors={validationErrors}
                                onCellEdit={handleCellEdit}
                                validationMetadata={validationMetadata}
                                onBack={() => setCurrentStep(1)}
                                onImport={startImport}
                                canImport={!hasValidationErrors}
                            />
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="p-6">
                            <ImportProgress
                                progress={importProgress.progress}
                                status={importProgress.status}
                                currentBatch={importProgress.currentBatch}
                                totalBatches={importProgress.totalBatches}
                                processedRows={importProgress.processedRows}
                                totalRows={importProgress.totalRows}
                                errors={importProgress.errors}
                            />
                        </div>
                    )}

                    {currentStep === 4 && importResults && (
                        <div className="p-6">
                            <ImportSummary
                                results={importResults}
                                onNewImport={handleNewImport}
                                onViewUsers={handleViewUsers}
                                onDownloadErrorReport={handleDownloadErrorReport}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
