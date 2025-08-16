import React from 'react';

export default function ImportProgress({ 
    progress, 
    status, 
    currentBatch, 
    totalBatches, 
    processedRows, 
    totalRows, 
    errors 
}) {
    const getStatusIcon = () => {
        switch (status) {
            case 'processing':
                return (
                    <svg className="animate-spin w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                );
            case 'completed':
                return (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                );
            case 'error':
                return (
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const getStatusMessage = () => {
        switch (status) {
            case 'processing':
                return `Processing batch ${currentBatch} of ${totalBatches}...`;
            case 'completed':
                return 'Import completed successfully!';
            case 'error':
                return 'Import failed with errors';
            default:
                return 'Preparing import...';
        }
    };

    const getProgressBarColor = () => {
        switch (status) {
            case 'completed':
                return 'bg-green-500';
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-blue-500';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Import Progress</h3>
                {getStatusIcon()}
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                        className={`h-3 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Status Message */}
            <div className="mb-4">
                <p className="text-sm text-gray-700">{getStatusMessage()}</p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{processedRows}</div>
                    <div className="text-xs text-gray-500">Processed</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">{totalRows}</div>
                    <div className="text-xs text-gray-500">Total Rows</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{currentBatch}</div>
                    <div className="text-xs text-gray-500">Current Batch</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{totalBatches}</div>
                    <div className="text-xs text-gray-500">Total Batches</div>
                </div>
            </div>

            {/* Error Count */}
            {errors && errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-red-800">
                            {errors.length} row{errors.length !== 1 ? 's' : ''} with errors
                        </span>
                    </div>
                </div>
            )}

            {/* Real-time Updates */}
            {status === 'processing' && (
                <div className="mt-4 text-xs text-gray-500 text-center">
                    Updates every few seconds...
                </div>
            )}
        </div>
    );
}
