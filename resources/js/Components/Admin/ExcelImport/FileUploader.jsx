import React from 'react';

export default function FileUploader({ onFileUpload, loading, validationMetadata }) {
    return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-gray-500">File Uploader Component - Placeholder</p>
            <p className="text-sm text-gray-400">This component is part of the wizard approach. Consider using ExcelImportButton instead.</p>
        </div>
    );
}
