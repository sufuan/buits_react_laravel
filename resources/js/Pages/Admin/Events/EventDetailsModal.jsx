import React from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Calendar, 
    MapPin, 
    Users, 
    Trash2, 
    Edit, 
    Clock, 
    Link as LinkIcon,
    Sparkles,
    CheckCircle2,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EventDetailsModal({ isOpen, onClose, event, onEdit }) {
    const handleDelete = () => {
        router.delete(route('admin.events.destroy', event.id), {
            onSuccess: () => {
                toast.success('Event deleted successfully!');
                onClose();
            },
            onError: () => {
                toast.error('Failed to delete event');
            }
        });
    };

    const getStatusConfig = (status) => {
        const configs = {
            upcoming: {
                color: 'bg-blue-500',
                textColor: 'text-blue-700',
                bgColor: 'bg-blue-50',
                icon: Clock,
                label: 'Upcoming'
            },
            ongoing: {
                color: 'bg-orange-500',
                textColor: 'text-orange-700',
                bgColor: 'bg-orange-50',
                icon: Sparkles,
                label: 'Ongoing'
            },
            completed: {
                color: 'bg-green-500',
                textColor: 'text-green-700',
                bgColor: 'bg-green-50',
                icon: CheckCircle2,
                label: 'Completed'
            },
            cancelled: {
                color: 'bg-red-500',
                textColor: 'text-red-700',
                bgColor: 'bg-red-50',
                icon: XCircle,
                label: 'Cancelled'
            }
        };
        return configs[status] || configs.upcoming;
    };

    const getTypeEmoji = (type) => {
        const emojis = {
            workshop: '🛠️',
            seminar: '🎓',
            competition: '🏆',
            training: '📚',
            meeting: '💼',
            other: '📅'
        };
        return emojis[type] || '📅';
    };

    const statusConfig = getStatusConfig(event.status);
    const StatusIcon = statusConfig.icon;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl border-0 shadow-2xl overflow-hidden">
                {/* Animated Background */}
                <div 
                    className="absolute inset-0 opacity-10 -z-10"
                    style={{
                        background: `linear-gradient(135deg, ${event.color}22 0%, ${event.color}44 100%)`
                    }}
                ></div>

                <DialogHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-4xl">{getTypeEmoji(event.type)}</span>
                                <Badge 
                                    className={`${statusConfig.bgColor} ${statusConfig.textColor} border-0 px-3 py-1`}
                                >
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {statusConfig.label}
                                </Badge>
                            </div>
                            <DialogTitle className="text-3xl font-bold mb-2">
                                {event.title}
                            </DialogTitle>
                            {event.description && (
                                <p className="text-gray-600 leading-relaxed">
                                    {event.description}
                                </p>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                    {/* Event Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Start Date */}
                        <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
                            <div className="p-2 bg-blue-500 rounded-lg">
                                <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Start Date</p>
                                <p className="text-sm font-bold text-gray-900 mt-1">
                                    {format(new Date(event.start_date), 'PPpp')}
                                </p>
                            </div>
                        </div>

                        {/* End Date */}
                        {event.end_date && (
                            <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200">
                                <div className="p-2 bg-purple-500 rounded-lg">
                                    <Clock className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">End Date</p>
                                    <p className="text-sm font-bold text-gray-900 mt-1">
                                        {format(new Date(event.end_date), 'PPpp')}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Location */}
                        {event.location && (
                            <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border-2 border-red-200">
                                <div className="p-2 bg-red-500 rounded-lg">
                                    <MapPin className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Location</p>
                                    <p className="text-sm font-bold text-gray-900 mt-1">
                                        {event.location}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Attendees */}
                        {event.max_attendees && (
                            <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-200">
                                <div className="p-2 bg-green-500 rounded-lg">
                                    <Users className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Attendees</p>
                                    <p className="text-sm font-bold text-gray-900 mt-1">
                                        {event.attendees_count || 0} / {event.max_attendees}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Registration Link */}
                    {event.registration_link && (
                        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
                            <div className="flex items-center gap-2 mb-2">
                                <LinkIcon className="h-4 w-4 text-indigo-600" />
                                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                                    Registration Link
                                </p>
                            </div>
                            <a 
                                href={event.registration_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-indigo-600 hover:text-indigo-800 underline break-all"
                            >
                                {event.registration_link}
                            </a>
                        </div>
                    )}

                    {/* Event Type & Color */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Type:</span>
                            <Badge variant="outline" className="capitalize">
                                {event.type}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Color:</span>
                            <div 
                                className="w-6 h-6 rounded-full border-2 border-gray-300"
                                style={{ backgroundColor: event.color }}
                            ></div>
                            <span className="text-xs font-mono text-gray-600">{event.color}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-red-600" />
                                        Delete Event
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete "{event.title}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                        onClick={handleDelete}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Button 
                            onClick={() => onEdit(event)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Event
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

