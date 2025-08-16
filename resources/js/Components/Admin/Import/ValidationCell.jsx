import React, { useState, useRef, useEffect } from 'react';

export default function ValidationCell({ 
    value, 
    field, 
    rowId, 
    error, 
    onEdit, 
    validationMetadata, 
    isRequired, 
    readOnly 
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const [showTooltip, setShowTooltip] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        setEditValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleDoubleClick = () => {
        if (!readOnly) {
            setIsEditing(true);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setEditValue(value);
            setIsEditing(false);
        } else if (e.key === 'Tab') {
            handleSave();
        }
    };

    const handleBlur = () => {
        handleSave();
    };

    const handleSave = () => {
        if (editValue !== value) {
            onEdit(field, editValue);
        }
        setIsEditing(false);
    };

    const getFieldType = () => {
        switch (field) {
            case 'email':
                return 'email';
            case 'phone':
                return 'tel';
            case 'date_of_birth':
                return 'date';
            default:
                return 'text';
        }
    };

    const getDropdownOptions = () => {
        if (!validationMetadata) return null;

        switch (field) {
            case 'department':
                return validationMetadata.departments;
            case 'gender':
                return validationMetadata.genders;
            case 'blood_group':
                return validationMetadata.blood_groups;
            case 'usertype':
                return validationMetadata.user_types;
            default:
                return null;
        }
    };

    const dropdownOptions = getDropdownOptions();

    const cellClasses = [
        'relative min-h-[32px] px-2 py-1 rounded',
        error ? 'bg-red-100 border border-red-300' : 'border border-transparent',
        !readOnly && 'cursor-pointer hover:bg-gray-50',
        isEditing && 'bg-blue-50 border-blue-300'
    ].filter(Boolean).join(' ');

    if (isEditing) {
        if (dropdownOptions) {
            return (
                <div className={cellClasses}>
                    <select
                        ref={inputRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        className="w-full border-none bg-transparent focus:ring-0 p-0 text-sm"
                    >
                        <option value="">Select...</option>
                        {dropdownOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            );
        }

        return (
            <div className={cellClasses}>
                <input
                    ref={inputRef}
                    type={getFieldType()}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className="w-full border-none bg-transparent focus:ring-0 p-0 text-sm"
                    placeholder={isRequired ? 'Required' : 'Optional'}
                />
            </div>
        );
    }

    return (
        <div 
            className={cellClasses}
            onDoubleClick={handleDoubleClick}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div className="flex items-center justify-between">
                <span className={`text-sm ${!value && isRequired ? 'text-gray-400 italic' : 'text-gray-900'}`}>
                    {value || (isRequired ? 'Required' : 'Empty')}
                </span>
                
                {error && (
                    <div className="ml-2 relative">
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        
                        {/* Error Tooltip */}
                        {showTooltip && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                                <div className="bg-red-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                    {error.message}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-red-900"></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {!readOnly && !isEditing && (
                    <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Help Text */}
            {!readOnly && !isEditing && showTooltip && !error && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                    <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        Double-click to edit
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                    </div>
                </div>
            )}
        </div>
    );
}
