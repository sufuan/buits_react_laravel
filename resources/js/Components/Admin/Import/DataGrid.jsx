import React, { useState, useMemo, useEffect } from 'react';
import ValidationCell from './ValidationCell';
import MobileDataGrid from './MobileDataGrid';

export default function DataGrid({ 
    data, 
    errors, 
    onCellEdit, 
    onImport, 
    canImport, 
    onBack, 
    validationMetadata,
    fileName 
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filterErrors, setFilterErrors] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile screen size
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    // Calculate error statistics
    const errorStats = useMemo(() => {
        const totalRows = data.length;
        const errorRows = Object.keys(errors).length;
        const validRows = totalRows - errorRows;
        
        const errorsByField = {};
        Object.values(errors).forEach(rowErrors => {
            Object.keys(rowErrors).forEach(field => {
                errorsByField[field] = (errorsByField[field] || 0) + 1;
            });
        });

        return { totalRows, errorRows, validRows, errorsByField };
    }, [data, errors]);

    // Filter and sort data
    const processedData = useMemo(() => {
        let filtered = data;
        
        if (filterErrors) {
            filtered = data.filter(row => errors[row.row_id]);
        }

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aVal = a[sortConfig.key] || '';
                const bVal = b[sortConfig.key] || '';
                
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [data, errors, filterErrors, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(processedData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentPageData = processedData.slice(startIndex, endIndex);

    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const columns = [
        { key: 'row_id', label: 'Row', width: 'w-16' },
        { key: 'name', label: 'Name', width: 'w-48', required: true },
        { key: 'email', label: 'Email', width: 'w-64', required: true },
        { key: 'phone', label: 'Phone', width: 'w-32', required: true },
        { key: 'department', label: 'Department', width: 'w-48', required: true },
        { key: 'session', label: 'Session', width: 'w-24', required: true },
        { key: 'gender', label: 'Gender', width: 'w-24', required: true },
        { key: 'class_roll', label: 'Roll', width: 'w-24' },
        { key: 'blood_group', label: 'Blood', width: 'w-20' },
        { key: 'member_id', label: 'Member ID', width: 'w-32' }
    ];

    // If mobile, use the mobile component
    if (isMobile) {
        return (
            <MobileDataGrid
                data={data}
                columns={columns}
                errors={errors}
                onCellEdit={onCellEdit}
                validationMetadata={validationMetadata}
                onBack={onBack}
                onImport={onImport}
                canImport={canImport}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">
                        Preview: {fileName}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {errorStats.totalRows} rows • {errorStats.validRows} valid • {errorStats.errorRows} with errors
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        Back
                    </button>
                    <button
                        onClick={onImport}
                        disabled={!canImport}
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150 ${
                            canImport
                                ? 'bg-green-600 hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:ring-green-500'
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {canImport ? 'Import Data' : 'Fix Errors First'}
                    </button>
                </div>
            </div>

            {/* Error Summary */}
            {errorStats.errorRows > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-2">Validation Errors Found</h4>
                    <div className="text-sm text-red-800">
                        <p className="mb-2">
                            {errorStats.errorRows} row(s) have validation errors. Please fix them before importing.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(errorStats.errorsByField).map(([field, count]) => (
                                <span key={field} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                                    {field}: {count} error(s)
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={filterErrors}
                            onChange={(e) => setFilterErrors(e.target.checked)}
                            className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">Show only rows with errors</span>
                    </label>
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="rounded border-gray-300 text-sm"
                    >
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                    </select>
                </div>
                
                {/* Pagination */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${column.width}`}
                                    onClick={() => handleSort(column.key)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>
                                            {column.label}
                                            {column.required && <span className="text-red-500">*</span>}
                                        </span>
                                        {sortConfig.key === column.key && (
                                            <span className="text-gray-400">
                                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentPageData.map((row) => (
                            <tr
                                key={row.row_id}
                                className={`hover:bg-gray-50 ${errors[row.row_id] ? 'bg-red-50' : ''}`}
                            >
                                {columns.map((column) => (
                                    <td key={column.key} className="px-3 py-2 whitespace-nowrap text-sm">
                                        <ValidationCell
                                            value={row[column.key] || ''}
                                            field={column.key}
                                            rowId={row.row_id}
                                            error={errors[row.row_id]?.[column.key]}
                                            onEdit={(field, value) => onCellEdit(row.row_id, field, value)}
                                            validationMetadata={validationMetadata}
                                            isRequired={column.required}
                                            readOnly={column.key === 'row_id' || column.key === 'member_id'}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></div>
                    <span className="text-gray-600">Rows with errors</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-200 rounded mr-2"></div>
                    <span className="text-gray-600">Cells with errors</span>
                </div>
                <div className="flex items-center">
                    <span className="text-red-500 mr-1">*</span>
                    <span className="text-gray-600">Required fields</span>
                </div>
            </div>
        </div>
    );
}
