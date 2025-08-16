import React, { useState, useEffect, useRef } from 'react';
import ExcelSpreadsheet from './ExcelSpreadsheet';

export default function ExcelModal({ 
    isOpen, 
    onClose, 
    file, 
    validationMetadata, 
    onImport 
}) {
    const [previewData, setPreviewData] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);
    const modalRef = useRef(null);
    const validationTimeoutRef = useRef(null);

    useEffect(() => {
        if (isOpen && file) {
            loadFilePreview();
        }
    }, [isOpen, file]);

    useEffect(() => {
        // Check if there are any validation errors
        const errorCount = Object.keys(validationErrors || {}).reduce((count, rowId) => {
            return count + Object.keys(validationErrors[rowId] || {}).length;
        }, 0);
        setHasErrors(errorCount > 0);
    }, [validationErrors]);

    const loadFilePreview = async () => {
        setIsLoading(true);
        
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
            
            console.log('API Response:', result); // Debug log
            
            if (result.success) {
                console.log('Preview Data:', result.data); // Debug log
                setPreviewData(result.data);
                
                // Process initial validation errors from preview
                const processedErrors = {};
                if (result.data.errors && Array.isArray(result.data.errors)) {
                    result.data.errors.forEach(error => {
                        if (error.severity === 'error') {
                            if (!processedErrors[error.row]) {
                                processedErrors[error.row] = {};
                            }
                            processedErrors[error.row][error.column] = error;
                        }
                    });
                }
                setValidationErrors(processedErrors);
            } else {
                console.error('API Error:', result.message);
                alert(result.message || 'Error loading file preview');
            }
        } catch (error) {
            console.error('Preview error:', error);
            alert('Error loading file preview. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCellEdit = async (rowId, field, value) => {
        console.log('Cell edit:', { rowId, field, value }); // Debug log
        
        // First, update the preview data with the user's input immediately
        const updatedRows = previewData.rows.map(row => 
            row.row_id === rowId ? { ...row, [field]: value } : row
        );
        
        // Update state immediately for responsive UI
        setPreviewData({
            ...previewData,
            rows: updatedRows
        });

        // Clear any existing validation timeout
        if (validationTimeoutRef.current) {
            clearTimeout(validationTimeoutRef.current);
        }

        // Debounce validation API calls (wait 500ms after user stops typing)
        validationTimeoutRef.current = setTimeout(async () => {
            // Find the updated row for validation
            const updatedRow = updatedRows.find(row => row.row_id === rowId);

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
                        data: updatedRow
                    })
                });

                const result = await response.json();
                console.log('Validation result:', result); // Debug log
                
                if (result.success) {
                    // Update validation errors
                    const newErrors = { ...validationErrors };
                    
                    if (result.errors && result.errors.length > 0) {
                        // Group errors by field
                        const rowErrors = {};
                        result.errors.forEach(error => {
                            if (error.severity === 'error') {
                                rowErrors[error.column] = error;
                            }
                        });
                        
                        if (Object.keys(rowErrors).length > 0) {
                            newErrors[rowId] = rowErrors;
                        } else {
                            delete newErrors[rowId];
                        }
                    } else {
                        delete newErrors[rowId];
                    }
                    
                    setValidationErrors(newErrors);
                    
                    // ONLY update additional data (like member ID) - preserve user's input
                    setPreviewData(currentPreviewData => {
                        const finalUpdatedRows = currentPreviewData.rows.map(row => {
                            if (row.row_id === rowId) {
                                const updatedRowData = { ...row };
                                
                                // Only update member ID if it was generated
                                if (result.member_id && result.member_id !== row.member_id) {
                                    updatedRowData.member_id = result.member_id;
                                }
                                
                                return updatedRowData;
                            }
                            return row;
                        });
                        
                        return {
                            ...currentPreviewData,
                            rows: finalUpdatedRows
                        };
                    });
                }
            } catch (error) {
                console.error('Cell validation error:', error);
            }
        }, 500); // 500ms debounce
    };

    const handleImport = async () => {
        if (hasErrors) {
            alert('Please fix all validation errors before importing.');
            return;
        }

        setIsLoading(true);

        try {
            // Prepare rows data for import
            const rowsForImport = previewData.rows.map((row, index) => {
                // Remove row_id and other UI-specific fields, keep only data fields
                const { row_id, ...dataFields } = row;
                
                // Ensure row_number is properly set for backend validation
                return {
                    ...dataFields,
                    row_number: index + 1 // Backend expects 1-based row numbers
                };
            });

            const response = await fetch(route('admin.users.import.batch'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    rows: rowsForImport,
                    chunk_size: 50,
                    session_id: previewData.session_id
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Import response error:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            
            if (result.success) {
                onImport(result);
                onClose();
            } else {
                console.error('Import failed:', result);
                alert(result.message || 'Import failed');
            }
        } catch (error) {
            console.error('Import error:', error);
            alert('Import failed: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        // Clear server session when closing
        if (previewData?.session_id) {
            fetch(route('admin.users.import.clear-session'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                }
            });
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div 
                ref={modalRef}
                className="bg-white rounded-lg shadow-2xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col"
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Excel Import - {file?.name}
                            </h2>
                        </div>
                        
                        {previewData && previewData.rows && (
                            <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
                                {(previewData.rows?.length || 0)} rows • {(previewData.columns?.length || 0)} columns
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Error/Success Indicator */}
                        {previewData && (
                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                                hasErrors 
                                    ? 'bg-red-100 text-red-800 border border-red-200' 
                                    : 'bg-green-100 text-green-800 border border-green-200'
                            }`}>
                                {hasErrors ? (
                                    <>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>Has Errors</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Ready to Import</span>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Import Button */}
                        <button
                            onClick={handleImport}
                            disabled={hasErrors || isLoading || !previewData}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${
                                hasErrors || isLoading || !previewData
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                            }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                'Import to Database'
                            )}
                        </button>

                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-hidden">
                    {isLoading && !previewData ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <svg className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="text-lg font-medium text-gray-700">Loading Excel file...</p>
                                <p className="text-sm text-gray-500 mt-1">Parsing and validating data</p>
                            </div>
                        </div>
                    ) : previewData ? (
                        <ExcelSpreadsheet
                            data={previewData.rows}
                            columns={previewData.columns || []}
                            errors={validationErrors}
                            onCellEdit={handleCellEdit}
                            validationMetadata={validationMetadata}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-gray-500">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-lg">No file loaded</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                {previewData && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-red-100 border-2 border-red-500 rounded"></div>
                                    <span className="text-gray-600">Validation Error</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-100 border-2 border-green-500 rounded"></div>
                                    <span className="text-gray-600">Valid Data</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-red-500 font-bold">*</span>
                                    <span className="text-gray-600">Required Field</span>
                                </div>
                            </div>
                            
                            <div className="text-gray-600">
                                Double-click cells to edit • Tab/Enter to navigate
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
