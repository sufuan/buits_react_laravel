import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function StatusBadge({ status, showIcon = true, size = 'default' }) {
    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                variant: 'outline',
                className: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
                icon: Clock,
                label: 'Pending'
            },
            approved: {
                variant: 'default',
                className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
                icon: CheckCircle,
                label: 'Approved'
            },
            rejected: {
                variant: 'destructive',
                className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
                icon: XCircle,
                label: 'Rejected'
            },
            processing: {
                variant: 'secondary',
                className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
                icon: AlertCircle,
                label: 'Processing'
            }
        };
        
        return configs[status] || configs.pending;
    };

    const config = getStatusConfig(status);
    const Icon = config.icon;
    
    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        default: 'text-sm px-2.5 py-0.5',
        lg: 'text-base px-3 py-1'
    };

    return (
        <Badge 
            variant={config.variant} 
            className={`${config.className} ${sizeClasses[size]} inline-flex items-center gap-1.5 font-medium`}
        >
            {showIcon && <Icon className="h-3 w-3" />}
            {config.label}
        </Badge>
    );
}

// Progress indicator for multi-step applications
export function ProgressIndicator({ steps, currentStep, completedSteps = [] }) {
    return (
        <div className="flex items-center justify-between">
            {steps.map((step, index) => {
                const isActive = currentStep === index;
                const isCompleted = completedSteps.includes(index);
                const isLast = index === steps.length - 1;
                
                return (
                    <div key={index} className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                            isCompleted 
                                ? 'bg-green-100 border-green-500 text-green-700' 
                                : isActive 
                                ? 'bg-blue-100 border-blue-500 text-blue-700' 
                                : 'bg-gray-100 border-gray-300 text-gray-500'
                        }`}>
                            {isCompleted ? (
                                <CheckCircle className="h-4 w-4" />
                            ) : (
                                <span className="text-xs font-medium">{index + 1}</span>
                            )}
                        </div>
                        <div className="ml-2 text-sm">
                            <p className={`font-medium ${
                                isCompleted ? 'text-green-700' : isActive ? 'text-blue-700' : 'text-gray-500'
                            }`}>
                                {step.title}
                            </p>
                            <p className="text-xs text-gray-500">{step.description}</p>
                        </div>
                        {!isLast && (
                            <div className={`flex-1 h-0.5 mx-4 ${
                                isCompleted || (isActive && index < currentStep) ? 'bg-green-200' : 'bg-gray-200'
                            }`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// Notification dot for status changes
export function NotificationDot({ count, variant = 'default' }) {
    if (!count || count === 0) return null;
    
    const variantClasses = {
        default: 'bg-blue-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500',
        success: 'bg-green-500'
    };
    
    return (
        <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white rounded-full ${variantClasses[variant]} animate-pulse`}>
            {count > 99 ? '99+' : count}
        </span>
    );
}
