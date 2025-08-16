import React, { useState, useRef, useEffect } from 'react';

export default function ExcelSpreadsheet({ 
    data, 
    columns, 
    errors, 
    onCellEdit, 
    validationMetadata 
}) {
    const [activeCell, setActiveCell] = useState(null);
    const [editingCell, setEditingCell] = useState(null);
    const [editValue, setEditValue] = useState('');
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    // Define column structure like Excel
    const excelColumns = [
        { key: 'row_id', label: '#', width: 60, readOnly: true },
        { key: 'name', label: 'Name', width: 200, required: true },
        { key: 'email', label: 'Email', width: 250, required: true },
        { key: 'phone', label: 'Phone', width: 150, required: true },
        { key: 'department', label: 'Department', width: 180, required: true },
        { key: 'session', label: 'Session', width: 120, required: true },
        { key: 'gender', label: 'Gender', width: 100, required: true },
        { key: 'class_roll', label: 'Roll', width: 100 },
        { key: 'blood_group', label: 'Blood Group', width: 120 },
        { key: 'member_id', label: 'Member ID', width: 150, readOnly: true }
    ];

    useEffect(() => {
        if (editingCell && inputRef.current) {
            inputRef.current.focus();
            // Only call select() if it's available (input/textarea elements)
            if (typeof inputRef.current.select === 'function') {
                inputRef.current.select();
            }
        }
    }, [editingCell]);

    const handleCellClick = (rowId, field) => {
        setActiveCell({ rowId, field });
    };

    const handleCellDoubleClick = (rowId, field, currentValue) => {
        const column = excelColumns.find(col => col.key === field);
        if (column?.readOnly) return;

        setEditingCell({ rowId, field });
        setEditValue(currentValue || '');
    };

    const handleKeyDown = (e, rowIndex, colIndex) => {
        if (editingCell) {
            if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                saveEdit();
                
                // Navigate to next cell
                if (e.key === 'Enter') {
                    navigateCell(rowIndex + 1, colIndex);
                } else if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        navigateCell(rowIndex, colIndex - 1);
                    } else {
                        navigateCell(rowIndex, colIndex + 1);
                    }
                }
            } else if (e.key === 'Escape') {
                cancelEdit();
            }
        } else {
            // Navigation without editing
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                navigateCell(rowIndex - 1, colIndex);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                navigateCell(rowIndex + 1, colIndex);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                navigateCell(rowIndex, colIndex - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                navigateCell(rowIndex, colIndex + 1);
            } else if (e.key === 'Enter' || e.key === 'F2') {
                e.preventDefault();
                const row = data[rowIndex];
                const column = excelColumns[colIndex];
                if (row && column && !column.readOnly) {
                    handleCellDoubleClick(row.row_id, column.key, row[column.key]);
                }
            }
        }
    };

    const navigateCell = (newRowIndex, newColIndex) => {
        if (newRowIndex >= 0 && newRowIndex < data.length && 
            newColIndex >= 0 && newColIndex < excelColumns.length) {
            const row = data[newRowIndex];
            const column = excelColumns[newColIndex];
            setActiveCell({ rowId: row.row_id, field: column.key });
        }
    };

    const saveEdit = () => {
        if (editingCell) {
            onCellEdit(editingCell.rowId, editingCell.field, editValue);
            setEditingCell(null);
            setEditValue('');
        }
    };

    const cancelEdit = () => {
        setEditingCell(null);
        setEditValue('');
    };

    const getCellValue = (row, field) => {
        return row[field] || '';
    };

    const getCellError = (rowId, field) => {
        return errors[rowId]?.[field];
    };

    const getRowClass = (rowId) => {
        const hasErrors = errors[rowId] && Object.keys(errors[rowId]).length > 0;
        if (hasErrors) {
            return "bg-red-50 border-l-4 border-red-500"; // Red row background for errors
        }
        return "hover:bg-gray-50"; // Default hover effect
    };

    const getCellClass = (rowId, field, column) => {
        const isActive = activeCell?.rowId === rowId && activeCell?.field === field;
        const isEditing = editingCell?.rowId === rowId && editingCell?.field === field;
        const hasError = getCellError(rowId, field);
        const isEmpty = !getCellValue(data.find(r => r.row_id === rowId), field);
        const isRequired = column.required;

        let classes = [
            'border border-gray-300 h-8 text-sm relative cursor-cell',
            'hover:bg-blue-50 focus-within:bg-blue-50'
        ];

        if (isActive && !isEditing) {
            classes.push('ring-2 ring-blue-500 bg-blue-50');
        }

        if (isEditing) {
            classes.push('ring-2 ring-blue-600 bg-white');
        }

        if (hasError) {
            classes.push('bg-red-100 border-red-400');
        } else if (!isEmpty) {
            classes.push('bg-green-50 border-green-300');
        } else if (isRequired && isEmpty) {
            classes.push('bg-yellow-50 border-yellow-300');
        }

        if (column.readOnly) {
            classes.push('bg-gray-100 cursor-not-allowed');
        }

        return classes.join(' ');
    };

    const getDropdownOptions = (field) => {
        if (!validationMetadata) return null;

        switch (field) {
            case 'department':
                return validationMetadata.departments;
            case 'gender':
                return validationMetadata.genders;
            case 'blood_group':
                return validationMetadata.blood_groups;
            default:
                return null;
        }
    };

    const renderCellContent = (row, column, rowIndex, colIndex) => {
        const isEditing = editingCell?.rowId === row.row_id && editingCell?.field === column.key;
        const cellValue = getCellValue(row, column.key);
        const hasError = getCellError(row.row_id, column.key);
        const dropdownOptions = getDropdownOptions(column.key);

        if (isEditing) {
            if (dropdownOptions) {
                return (
                    <select
                        ref={inputRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                        className="w-full h-full border-none bg-transparent focus:ring-0 text-sm px-1"
                    >
                        <option value="">Select...</option>
                        {dropdownOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );
            }

            return (
                <input
                    ref={inputRef}
                    type={column.key === 'email' ? 'email' : column.key === 'phone' ? 'tel' : 'text'}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                    className="w-full h-full border-none bg-transparent focus:ring-0 text-sm px-1"
                    placeholder={column.required ? 'Required' : 'Optional'}
                />
            );
        }

        return (
            <div className="flex items-center justify-between w-full h-full px-1">
                <span className={`truncate ${!cellValue && column.required ? 'text-gray-400 italic' : 'text-gray-900'}`}>
                    {cellValue || (column.required ? 'Required' : '')}
                </span>
                
                {hasError && (
                    <div className="ml-1 relative group">
                        <svg className="w-3 h-3 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        
                        {/* Error tooltip */}
                        <div className="absolute bottom-full right-0 mb-1 hidden group-hover:block z-10">
                            <div className="bg-red-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap max-w-48">
                                {hasError.message}
                                <div className="absolute top-full right-2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-red-900"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Excel-like toolbar */}
            <div className="flex items-center justify-between p-2 bg-gray-100 border-b border-gray-300">
                <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-gray-700">
                        Excel Import Preview
                    </div>
                    
                    {activeCell && (
                        <div className="text-xs text-gray-600 bg-white px-2 py-1 rounded border">
                            Cell: {excelColumns.find(c => c.key === activeCell.field)?.label} - Row {data.findIndex(r => r.row_id === activeCell.rowId) + 1}
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <span>F2 or Double-click to edit</span>
                    <span>•</span>
                    <span>Enter/Tab to navigate</span>
                </div>
            </div>

            {/* Spreadsheet container */}
            <div 
                ref={containerRef}
                className="flex-1 overflow-auto bg-white"
                style={{ height: 'calc(100% - 48px)' }}
            >
                <table className="w-full border-collapse">
                    {/* Header row */}
                    <thead className="sticky top-0 bg-gray-200 z-10">
                        <tr>
                            {excelColumns.map((column) => (
                                <th
                                    key={column.key}
                                    className="border border-gray-400 bg-gray-200 text-left text-xs font-semibold text-gray-700 p-1"
                                    style={{ width: column.width, minWidth: column.width }}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{column.label}</span>
                                        {column.required && (
                                            <span className="text-red-500 text-xs">*</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Data rows */}
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={row.row_id} className={`group ${getRowClass(row.row_id)}`}>
                                {excelColumns.map((column, colIndex) => (
                                    <td
                                        key={`${row.row_id}-${column.key}`}
                                        className={getCellClass(row.row_id, column.key, column)}
                                        style={{ width: column.width, minWidth: column.width }}
                                        onClick={() => handleCellClick(row.row_id, column.key)}
                                        onDoubleClick={() => handleCellDoubleClick(row.row_id, column.key, getCellValue(row, column.key))}
                                        tabIndex={0}
                                        onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                                    >
                                        {renderCellContent(row, column, rowIndex, colIndex)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
