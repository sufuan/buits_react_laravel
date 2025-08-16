import React, { useState } from 'react';
import ExcelModal from './ExcelModal';

export default function ExcelImportButton({ validationMetadata, onImportComplete }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Get file extension
            const fileName = file.name.toLowerCase();
            const validExtensions = ['.xlsx', '.xls'];
            const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
            
            // Validate file type by extension and MIME type
            const validTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                'application/vnd.ms-excel', // .xls
                'application/excel',
                'application/x-excel',
                'application/x-msexcel',
                ''  // Some systems don't set MIME type
            ];

            if (!hasValidExtension && !validTypes.includes(file.type)) {
                alert(`Please select a valid Excel file (.xlsx or .xls). Selected file: ${fileName}`);
                return;
            }

            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                return;
            }

            console.log('File selected:', {
                name: file.name,
                type: file.type,
                size: file.size
            });

            setSelectedFile(file);
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedFile(null);
        // Reset the file input value so the same file can be selected again
        const fileInput = document.getElementById('excel-upload');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleImportComplete = (result) => {
        setShowModal(false);
        setSelectedFile(null);
        // Reset the file input value so the same file can be selected again
        const fileInput = document.getElementById('excel-upload');
        if (fileInput) {
            fileInput.value = '';
        }
        if (onImportComplete) {
            onImportComplete(result);
        }
    };

    return (
        <>
            {/* Upload Button */}
            <div className="relative">
                <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    id="excel-upload"
                />
                <label
                    htmlFor="excel-upload"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer shadow-lg hover:shadow-xl"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Excel File
                </label>
            </div>

            {/* Excel Modal */}
            <ExcelModal
                isOpen={showModal}
                onClose={handleCloseModal}
                file={selectedFile}
                validationMetadata={validationMetadata}
                onImport={handleImportComplete}
            />
        </>
    );
}
