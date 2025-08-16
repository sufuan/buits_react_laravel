import React, { useState, useMemo } from 'react';
import ValidationCell from './ValidationCell';

export default function MobileDataGrid({ 
    data, 
    columns, 
    errors, 
    onCellEdit, 
    validationMetadata, 
    onBack, 
    onImport, 
    canImport 
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10); // Smaller for mobile
    const [filterErrors, setFilterErrors] = useState(false);
    const [expandedRows, setExpandedRows] = useState(new Set());

    const filteredData = useMemo(() => {
        if (!filterErrors) return data;
        return data.filter(row => errors[row.row_id]);
    }, [data, errors, filterErrors]);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentPageData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const errorStats = useMemo(() => {
        const errorRows = Object.keys(errors).length;
        const totalErrors = Object.values(errors).reduce((sum, rowErrors) => 
            sum + Object.keys(rowErrors).length, 0
        );
        
        return { errorRows, totalErrors };
    }, [errors]);

    const toggleRowExpansion = (rowId) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(rowId)) {
            newExpanded.delete(rowId);
        } else {
            newExpanded.add(rowId);
        }
        setExpandedRows(newExpanded);
    };

    const getRowErrors = (rowId) => {
        return errors[rowId] || {};
    };

    const hasRowErrors = (rowId) => {
        return Object.keys(getRowErrors(rowId)).length > 0;
    };

    return (
        <div className="space-y-4">
            {/* Mobile Header */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Import Preview
                    </h2>
                    <span className="text-sm text-gray-500">
                        {filteredData.length} rows
                    </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onBack}
                            className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                        <button
                            onClick={onImport}
                            disabled={!canImport}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${
                                canImport
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {canImport ? 'Import Data' : 'Fix Errors First'}
                        </button>
                    </div>

                    {/* Error Summary */}
                    {errorStats.errorRows > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="text-sm text-red-800">
                                <div className="font-medium mb-1">
                                    {errorStats.errorRows} rows with {errorStats.totalErrors} errors
                                </div>
                                <p className="text-xs">Tap rows to expand and edit cells</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm">
                        <input
                            type="checkbox"
                            checked={filterErrors}
                            onChange={(e) => setFilterErrors(e.target.checked)}
                            className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Show only errors
                    </label>
                    
                    {totalPages > 1 && (
                        <div className="flex items-center space-x-2 text-sm">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-2 py-1 bg-white border border-gray-300 rounded text-xs disabled:opacity-50"
                            >
                                ‹
                            </button>
                            <span className="text-xs text-gray-600">
                                {currentPage}/{totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-2 py-1 bg-white border border-gray-300 rounded text-xs disabled:opacity-50"
                            >
                                ›
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Row Cards */}
            <div className="space-y-3">
                {currentPageData.map((row) => {
                    const rowErrors = getRowErrors(row.row_id);
                    const hasErrors = hasRowErrors(row.row_id);
                    const isExpanded = expandedRows.has(row.row_id);

                    return (
                        <div
                            key={row.row_id}
                            className={`bg-white rounded-lg shadow-sm border ${
                                hasErrors ? 'border-red-200 bg-red-50' : 'border-gray-200'
                            }`}
                        >
                            {/* Row Header */}
                            <div
                                className="p-4 cursor-pointer"
                                onClick={() => toggleRowExpansion(row.row_id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900">
                                            Row {row.row_id}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {/* Show key fields */}
                                            {row.name && <span className="mr-3">Name: {row.name}</span>}
                                            {row.email && <span>Email: {row.email}</span>}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        {hasErrors && (
                                            <div className="flex items-center text-red-600">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-xs">
                                                    {Object.keys(rowErrors).length}
                                                </span>
                                            </div>
                                        )}
                                        
                                        <svg 
                                            className={`w-5 h-5 text-gray-400 transform transition-transform ${
                                                isExpanded ? 'rotate-180' : ''
                                            }`} 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Row Content */}
                            {isExpanded && (
                                <div className="border-t border-gray-200 p-4 space-y-3">
                                    {columns.map((column) => {
                                        const error = rowErrors[column.key];
                                        return (
                                            <div key={column.key} className="space-y-1">
                                                <label className="text-xs font-medium text-gray-700">
                                                    {column.label}
                                                    {column.required && <span className="text-red-500 ml-1">*</span>}
                                                </label>
                                                <ValidationCell
                                                    value={row[column.key] || ''}
                                                    field={column.key}
                                                    rowId={row.row_id}
                                                    error={error}
                                                    onEdit={(field, value) => onCellEdit(row.row_id, field, value)}
                                                    validationMetadata={validationMetadata}
                                                    isRequired={column.required}
                                                    readOnly={column.key === 'row_id' || column.key === 'member_id'}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="text-xs text-gray-600 space-y-2">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-100 border border-red-300 rounded mr-2"></div>
                        <span>Rows with validation errors</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-red-500 mr-2">*</span>
                        <span>Required fields</span>
                    </div>
                    <p className="text-xs italic">
                        Tap on rows to expand and edit values. Double-tap cells to edit directly.
                    </p>
                </div>
            </div>
        </div>
    );
}
