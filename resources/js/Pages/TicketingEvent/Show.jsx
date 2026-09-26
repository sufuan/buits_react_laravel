import React from 'react';
import { Head } from '@inertiajs/react';

/**
 * Public ticketing event page — stub for Step 4.
 * Full UI implementation: Step 11.
 */
export default function Show({ event, htmlContent, formSchema, isClosed, isPreview }) {
    return (
        <>
            <Head title={event?.title ?? 'Event'} />

            {/* Preview Mode Banner */}
            {isPreview && (
                <div
                    style={{
                        background: '#f59e0b',
                        color: '#fff',
                        textAlign: 'center',
                        padding: '10px',
                        fontWeight: '600',
                        fontSize: '15px',
                    }}
                >
                    🔍 Preview Mode — This page has not been published yet
                </div>
            )}

            <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>
                    {event?.title ?? 'Untitled Event'}
                </h1>

                {event?.fee && (
                    <p style={{ color: '#6b7280', marginBottom: '8px' }}>
                        Fee: ৳{event.fee}
                    </p>
                )}

                {event?.deadline && (
                    <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                        Registration Deadline: {new Date(event.deadline).toLocaleString()}
                    </p>
                )}

                {/* HTML Content Section */}
                {htmlContent && (
                    <div
                        className="ticketing-event-content"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                        style={{ marginBottom: '32px' }}
                    />
                )}

                {/* Registration Form Placeholder */}
                <div
                    id="registration-form"
                    style={{
                        border: '2px dashed #d1d5db',
                        borderRadius: '8px',
                        padding: '32px',
                        textAlign: 'center',
                        color: '#9ca3af',
                    }}
                >
                    <p style={{ fontSize: '18px', marginBottom: '8px' }}>📋 Registration Form</p>
                    <p style={{ fontSize: '14px' }}>
                        Full registration form UI coming in Step 11.
                        {formSchema && formSchema.length > 0 && (
                            <> ({formSchema.length} custom field{formSchema.length !== 1 ? 's' : ''} defined)</>
                        )}
                    </p>
                    {isClosed && (
                        <div
                            style={{
                                marginTop: '16px',
                                padding: '12px',
                                background: '#fee2e2',
                                borderRadius: '6px',
                                color: '#dc2626',
                                fontWeight: '600',
                            }}
                        >
                            🔒 Registration Closed
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
