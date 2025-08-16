import React from 'react';

export default function ImportSummary({ 
    results, 
    onNewImport, 
    onViewUsers, 
    onDownloadErrorReport 
}) {
    const {
        total_processed = 0,
        successful_imports = 0,
        failed_imports = 0,
        skipped_rows = 0,
        errors = [],
        processing_time = 0,
        import_session_id = null
    } = results || {};

    const successRate = total_processed > 0 ? Math.round((successful_imports / total_processed) * 100) : 0;

    const getStatusIcon = () => {
        if (failed_imports === 0) {
            return (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                </div>
            );
        } else if (successful_imports > 0) {
            return (
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
            );
        } else {
            return (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
            );
        }
    };

    const getStatusMessage = () => {
        if (failed_imports === 0) {
            return 'Import completed successfully!';
        } else if (successful_imports > 0) {
            return 'Import completed with some errors';
        } else {
            return 'Import failed';
        }
    };

    const formatTime = (seconds) => {
        if (seconds < 60) {
            return `${seconds}s`;
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                {getStatusIcon()}
                <h2 className="text-2xl font-bold text-gray-900 mt-4">
                    {getStatusMessage()}
                </h2>
                <p className="text-gray-600 mt-2">
                    Import session completed in {formatTime(processing_time)}
                </p>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{total_processed}</div>
                    <div className="text-sm text-blue-800 font-medium">Total Processed</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{successful_imports}</div>
                    <div className="text-sm text-green-800 font-medium">Successful</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-3xl font-bold text-red-600">{failed_imports}</div>
                    <div className="text-sm text-red-800 font-medium">Failed</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-gray-600">{skipped_rows}</div>
                    <div className="text-sm text-gray-800 font-medium">Skipped</div>
                </div>
            </div>

            {/* Success Rate */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Success Rate</span>
                    <span className="text-sm text-gray-600">{successRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                        className="h-3 rounded-full bg-green-500"
                        style={{ width: `${successRate}%` }}
                    ></div>
                </div>
            </div>

            {/* Error Summary */}
            {errors && errors.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Summary</h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="space-y-2">
                            {errors.slice(0, 5).map((error, index) => (
                                <div key={index} className="text-sm text-red-800">
                                    <span className="font-medium">Row {error.row}:</span> {error.message}
                                </div>
                            ))}
                            {errors.length > 5 && (
                                <div className="text-sm text-red-600 font-medium">
                                    And {errors.length - 5} more errors...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={onNewImport}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    Import Another File
                </button>
                
                {successful_imports > 0 && (
                    <button
                        onClick={onViewUsers}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        View Imported Users
                    </button>
                )}
                
                {errors && errors.length > 0 && (
                    <button
                        onClick={onDownloadErrorReport}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                        Download Error Report
                    </button>
                )}
            </div>

            {/* Additional Info */}
            {import_session_id && (
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        Session ID: {import_session_id}
                    </p>
                </div>
            )}
        </div>
    );
}
