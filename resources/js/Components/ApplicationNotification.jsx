import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import StatusBadge, { NotificationDot } from '@/Components/StatusBadge';
import { 
    Bell, 
    UserPlus, 
    UserCheck, 
    Clock, 
    Eye, 
    Users,
    FileText,
    UserCog
} from 'lucide-react';

export default function ApplicationNotification({ 
    volunteerApplications = [], 
    executiveApplications = [], 
    showModal = false, 
    onClose 
}) {
    const [isOpen, setIsOpen] = useState(showModal);
    const [activeTab, setActiveTab] = useState('volunteer');

    useEffect(() => {
        setIsOpen(showModal);
    }, [showModal]);

    const handleClose = () => {
        setIsOpen(false);
        if (onClose) onClose();
    };

    const pendingVolunteerApps = volunteerApplications.filter(app => app.status === 'pending');
    const pendingExecutiveApps = executiveApplications.filter(app => app.status === 'pending');
    const totalPending = pendingVolunteerApps.length + pendingExecutiveApps.length;

    const handleViewVolunteerApplications = () => {
        handleClose();
        router.visit('/admin/applications/volunteer');
    };

    const handleViewExecutiveApplications = () => {
        handleClose();
        router.visit('/admin/applications/executive');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (totalPending === 0) return null;

    const renderApplications = (applications, type) => {
        const pendingApps = applications.filter(app => app.status === 'pending');
        
        if (pendingApps.length === 0) {
            return (
                <div className="text-center py-4 text-gray-500">
                    <p>No pending {type} applications</p>
                </div>
            );
        }

        return (
            <div className="space-y-3">
                {pendingApps.slice(0, 5).map((app) => (
                    <div key={app.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                        <Avatar className="h-10 w-10 ring-2 ring-blue-200">
                            <AvatarImage src={app.user.image} alt={app.user.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                                {app.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900 truncate">{app.user.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                    {app.user.usertype || 'Member'}
                                </Badge>
                                {type === 'executive' && app.designation && (
                                    <Badge variant="secondary" className="text-xs">
                                        {app.designation.name}
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">{app.user.email}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDate(app.created_at)}
                                </span>
                                {app.user.department && (
                                    <span>{app.user.department}</span>
                                )}
                                {app.user.session && (
                                    <span>Session: {app.user.session}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <StatusBadge status="pending" size="sm" />
                        </div>
                    </div>
                ))}

                {pendingApps.length > 5 && (
                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-700">
                            And {pendingApps.length - 5} more {type} application{pendingApps.length - 5 > 1 ? 's' : ''} waiting for approval...
                        </p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <Bell className="h-6 w-6 text-blue-600 animate-pulse" />
                        </div>
                        Application Management Center
                        <NotificationDot count={totalPending} variant="error" />
                    </DialogTitle>
                    <DialogDescription>
                        You have {totalPending} pending application{totalPending > 1 ? 's' : ''} waiting for review.
                    </DialogDescription>
                </DialogHeader>

                {/* Tab Navigation */}
                <div className="flex space-x-4 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('volunteer')}
                        className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'volunteer'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            Volunteer Applications
                            {pendingVolunteerApps.length > 0 && (
                                <NotificationDot count={pendingVolunteerApps.length} variant="warning" />
                            )}
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('executive')}
                        className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'executive'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <UserCog className="h-4 w-4" />
                            Executive Applications
                            {pendingExecutiveApps.length > 0 && (
                                <NotificationDot count={pendingExecutiveApps.length} variant="error" />
                            )}
                        </div>
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-96 overflow-y-auto">
                    {activeTab === 'volunteer' && renderApplications(volunteerApplications, 'volunteer')}
                    {activeTab === 'executive' && renderApplications(executiveApplications, 'executive')}
                </div>

                {/* Summary */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-1">
                            <UserPlus className="h-4 w-4" />
                            Volunteer pending: <strong>{pendingVolunteerApps.length}</strong>
                        </div>
                        <div className="flex items-center gap-1">
                            <UserCog className="h-4 w-4" />
                            Executive pending: <strong>{pendingExecutiveApps.length}</strong>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={handleClose}>
                            Later
                        </Button>
                        {activeTab === 'volunteer' ? (
                            <Button onClick={handleViewVolunteerApplications} className="bg-blue-600 hover:bg-blue-700">
                                <Eye className="h-4 w-4 mr-2" />
                                Review Volunteer Apps
                            </Button>
                        ) : (
                            <Button onClick={handleViewExecutiveApplications} className="bg-blue-600 hover:bg-blue-700">
                                <Eye className="h-4 w-4 mr-2" />
                                Review Executive Apps
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
