import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

/**
 * Public ticketing event page with enhanced form display
 * Updated for Steps 5-8 to show custom form fields in preview
 */
export default function Show({ event, htmlContent, formSchema, isClosed, isPreview }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        ...Object.fromEntries((formSchema || []).map(field => [field.id, field.type === 'checkbox' ? [] : '']))
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isPreview) {
            post(route('ticketing-event.register', event.slug));
        } else {
            alert('This is preview mode - registration is not functional.');
        }
    };

    const renderCustomField = (field) => {
        const fieldValue = data[field.id] || (field.type === 'checkbox' ? [] : '');
        
        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        value={fieldValue}
                        onChange={(e) => setData(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                        rows={parseInt(field.rows) || 3}
                        maxLength={field.maxLength ? parseInt(field.maxLength) : undefined}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                        }}
                    />
                );

            case 'select':
                return (
                    <select
                        value={fieldValue}
                        onChange={(e) => setData(field.id, e.target.value)}
                        required={field.required}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontFamily: 'inherit',
                            backgroundColor: 'white'
                        }}
                    >
                        <option value="">{field.placeholder || 'Select an option'}</option>
                        {(field.options || []).map((option, idx) => (
                            <option key={idx} value={option}>{option}</option>
                        ))}
                    </select>
                );

            case 'radio':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(field.options || []).map((option, idx) => (
                            <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name={field.id}
                                    value={option}
                                    checked={fieldValue === option}
                                    onChange={(e) => setData(field.id, e.target.value)}
                                    required={field.required}
                                    style={{ margin: 0 }}
                                />
                                <span style={{ fontSize: '14px' }}>{option}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'checkbox':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(field.options || []).map((option, idx) => (
                            <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={Array.isArray(fieldValue) && fieldValue.includes(option)}
                                    onChange={(e) => {
                                        const current = Array.isArray(fieldValue) ? fieldValue : [];
                                        if (e.target.checked) {
                                            setData(field.id, [...current, option]);
                                        } else {
                                            setData(field.id, current.filter(v => v !== option));
                                        }
                                    }}
                                    style={{ margin: 0 }}
                                />
                                <span style={{ fontSize: '14px' }}>{option}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'file':
                return (
                    <div>
                        <input
                            type="file"
                            onChange={(e) => setData(field.id, e.target.files[0])}
                            required={field.required}
                            accept={field.accept}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                                backgroundColor: 'white'
                            }}
                        />
                        {field.accept && (
                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                Accepted files: {field.accept}
                            </div>
                        )}
                        {field.maxSize && (
                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                Maximum size: {field.maxSize}MB
                            </div>
                        )}
                    </div>
                );

            case 'range':
                return (
                    <div>
                        <input
                            type="range"
                            value={fieldValue}
                            onChange={(e) => setData(field.id, e.target.value)}
                            min={field.min}
                            max={field.max}
                            step={field.step}
                            required={field.required}
                            style={{ width: '100%', margin: '8px 0' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
                            <span>{field.min || 0}</span>
                            <span>Current: {fieldValue || field.min || 0}</span>
                            <span>{field.max || 100}</span>
                        </div>
                    </div>
                );

            case 'color':
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="color"
                            value={fieldValue || '#000000'}
                            onChange={(e) => setData(field.id, e.target.value)}
                            required={field.required}
                            style={{ width: '50px', height: '40px', border: 'none', borderRadius: '4px' }}
                        />
                        <input
                            type="text"
                            value={fieldValue || '#000000'}
                            onChange={(e) => setData(field.id, e.target.value)}
                            placeholder="#000000"
                            style={{
                                flex: 1,
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontFamily: 'monospace'
                            }}
                        />
                    </div>
                );

            default:
                return (
                    <input
                        type={field.type}
                        value={fieldValue}
                        onChange={(e) => setData(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        maxLength={field.maxLength ? parseInt(field.maxLength) : undefined}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontFamily: 'inherit'
                        }}
                    />
                );
        }
    };

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
                        padding: '12px',
                        fontWeight: '600',
                        fontSize: '15px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    PREVIEW MODE — This page has not been published yet
                </div>
            )}

            <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
                {/* Event Header */}
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#111827' }}>
                        {event?.title ?? 'Untitled Event'}
                    </h1>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '16px' }}>
                        {event?.fee && (
                            <div style={{ 
                                background: '#dcfce7', 
                                color: '#166534', 
                                padding: '8px 16px', 
                                borderRadius: '20px',
                                fontWeight: '600',
                                fontSize: '14px'
                            }}>
                                Registration Fee: ৳{event.fee}
                            </div>
                        )}

                        {event?.deadline && (
                            <div style={{ 
                                background: '#fef3c7', 
                                color: '#92400e', 
                                padding: '8px 16px', 
                                borderRadius: '20px',
                                fontWeight: '600',
                                fontSize: '14px'
                            }}>
                                Deadline: {new Date(event.deadline).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                </div>

                {/* HTML Content Section */}
                {htmlContent && (
                    <div
                        className="event-content"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                        style={{ 
                            marginBottom: '40px',
                            lineHeight: '1.6',
                            color: '#374151'
                        }}
                    />
                )}

                {/* Registration Form */}
                <div style={{ 
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '32px',
                    marginTop: '32px'
                }}>
                    <h2 style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold', 
                        marginBottom: '24px',
                        color: '#111827',
                        textAlign: 'center'
                    }}>
                        Event Registration
                    </h2>

                    {isClosed ? (
                        <div style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '8px',
                            padding: '16px',
                            textAlign: 'center',
                            color: '#dc2626',
                            fontWeight: '600'
                        }}>
                            Registration is now closed
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Default Fields */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151' }}>
                                        Full Name <span style={{ color: '#dc2626' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        placeholder="Enter your full name"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            fontFamily: 'inherit'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151' }}>
                                        Email Address <span style={{ color: '#dc2626' }}>*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        placeholder="your.email@example.com"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            fontFamily: 'inherit'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151' }}>
                                        Phone Number <span style={{ color: '#dc2626' }}>*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        required
                                        placeholder="+880 1XXX-XXXXXX"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            fontFamily: 'inherit'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Custom Fields */}
                            {formSchema && formSchema.length > 0 && (
                                <div style={{ marginTop: '20px' }}>
                                    <div style={{ 
                                        borderTop: '1px solid #e5e7eb', 
                                        paddingTop: '20px',
                                        marginBottom: '20px'
                                    }}>
                                        <h3 style={{ 
                                            fontSize: '1.1rem', 
                                            fontWeight: '600', 
                                            color: '#374151',
                                            marginBottom: '16px'
                                        }}>
                                            Additional Information
                                        </h3>
                                    </div>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {formSchema.map((field, index) => (
                                            <div key={field.id || index}>
                                                <label style={{ 
                                                    display: 'block', 
                                                    marginBottom: '6px', 
                                                    fontWeight: '600', 
                                                    color: '#374151' 
                                                }}>
                                                    {field.label || `Field ${index + 1}`}
                                                    {field.required && <span style={{ color: '#dc2626' }}> *</span>}
                                                </label>
                                                {renderCustomField(field)}
                                                {field.helpText && (
                                                    <div style={{ 
                                                        fontSize: '12px', 
                                                        color: '#6b7280', 
                                                        marginTop: '4px' 
                                                    }}>
                                                        {field.helpText}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                disabled={processing || isPreview}
                                                style={{
                                                    marginTop: '24px',
                                                    padding: '14px 28px',
                                                    background: isPreview ? '#6b7280' : '#3b82f6',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    fontSize: '16px',
                                                    fontWeight: '600',
                                                    cursor: isPreview ? 'not-allowed' : 'pointer',
                                                    transition: 'all 0.2s',
                                                    alignSelf: 'flex-start'
                                                }}
                                            >
                                                {isPreview ? 'Preview Mode' : processing ? 'Submitting...' : 'Register for Event'}
                                            </button>

                            {isPreview && (
                                <div style={{ 
                                    fontSize: '14px', 
                                    color: '#6b7280', 
                                    fontStyle: 'italic',
                                    marginTop: '8px'
                                }}>
                                    * Registration form is not functional in preview mode
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}
