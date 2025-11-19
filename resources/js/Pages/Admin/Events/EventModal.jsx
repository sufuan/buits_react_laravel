import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar, MapPin, Users, Link as LinkIcon, Palette, Sparkles, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export default function EventModal({ isOpen, onClose, event = null, initialDate = null, isEditMode = false }) {
    // Helper function to convert date to local datetime-local format
    const toLocalDateTimeString = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Format initialDate if provided (from calendar date click)
    const formatInitialDate = (dateStr) => {
        if (!dateStr) return '';
        // If it's just a date (YYYY-MM-DD), add default time 09:00
        if (dateStr.length === 10) {
            return `${dateStr}T09:00`;
        }
        return dateStr;
    };

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: event?.title || '',
        description: event?.description || '',
        start_date: event?.start_date ? toLocalDateTimeString(event.start_date) : formatInitialDate(initialDate),
        end_date: event?.end_date ? toLocalDateTimeString(event.end_date) : '',
        all_day: event?.all_day || false,
        location: event?.location || '',
        type: event?.type || 'other',
        status: event?.status || 'upcoming',
        color: event?.color || '#3b82f6',
        max_attendees: event?.max_attendees || '',
        registration_link: event?.registration_link || '',
        registration_deadline: event?.registration_deadline ? toLocalDateTimeString(event.registration_deadline) : '',
        requires_registration: event?.requires_registration || false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditMode && event) {
            put(route('admin.events.update', event.id), {
                onSuccess: () => {
                    toast.success('Event updated successfully!');
                    reset();
                    onClose();
                },
                onError: (errors) => {
                    // Display specific error messages
                    const errorMessages = Object.values(errors).flat();
                    if (errorMessages.length > 0) {
                        errorMessages.forEach(message => {
                            toast.error(message);
                        });
                    } else {
                        toast.error('Failed to update event. Please check your inputs.');
                    }
                }
            });
        } else {
            post(route('admin.events.store'), {
                onSuccess: () => {
                    toast.success('Event created successfully!');
                    reset();
                    onClose();
                },
                onError: (errors) => {
                    // Display specific error messages
                    const errorMessages = Object.values(errors).flat();
                    if (errorMessages.length > 0) {
                        errorMessages.forEach(message => {
                            toast.error(message);
                        });
                    } else {
                        toast.error('Failed to create event. Please check your inputs.');
                    }
                }
            });
        }
    };

    const eventTypes = [
        { value: 'workshop', label: 'Workshop', color: '#8b5cf6', emoji: '🛠️' },
        { value: 'seminar', label: 'Seminar', color: '#3b82f6', emoji: '🎓' },
        { value: 'competition', label: 'Competition', color: '#ef4444', emoji: '🏆' },
        { value: 'training', label: 'Training', color: '#10b981', emoji: '📚' },
        { value: 'meeting', label: 'Meeting', color: '#f59e0b', emoji: '💼' },
        { value: 'other', label: 'Other', color: '#6b7280', emoji: '📅' },
    ];

    const statusOptions = [
        { value: 'upcoming', label: 'Upcoming', color: '#3b82f6' },
        { value: 'ongoing', label: 'Ongoing', color: '#f59e0b' },
        { value: 'completed', label: 'Completed', color: '#10b981' },
        { value: 'cancelled', label: 'Cancelled', color: '#ef4444' },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50 -z-10"></div>
                
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-lg opacity-50 animate-pulse"></div>
                            <Sparkles className="relative h-8 w-8 text-purple-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {isEditMode ? 'Edit Event' : 'Create New Event'}
                            </DialogTitle>
                            <DialogDescription>
                                {isEditMode ? 'Update event details below' : 'Fill in the details to create an amazing event'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-semibold flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            Event Title *
                        </Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            placeholder="Enter event title..."
                            className="border-2 focus:border-blue-500 transition-colors"
                            required
                        />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-semibold">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            placeholder="Describe your event..."
                            rows={4}
                            className="border-2 focus:border-purple-500 transition-colors resize-none"
                        />
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start_date" className="text-sm font-semibold">
                                Start Date & Time *
                            </Label>
                            <Input
                                type="datetime-local"
                                id="start_date"
                                value={data.start_date}
                                onChange={e => setData('start_date', e.target.value)}
                                className={`border-2 focus:border-blue-500 transition-colors ${errors.start_date ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.start_date && <p className="text-sm text-red-500 font-medium">{errors.start_date}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end_date" className="text-sm font-semibold">
                                End Date & Time
                            </Label>
                            <Input
                                type="datetime-local"
                                id="end_date"
                                value={data.end_date}
                                onChange={e => setData('end_date', e.target.value)}
                                className={`border-2 focus:border-purple-500 transition-colors ${errors.end_date ? 'border-red-500' : ''}`}
                            />
                            {errors.end_date && <p className="text-sm text-red-500 font-medium">{errors.end_date}</p>}
                        </div>
                    </div>

                    {/* All Day Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                        <Label htmlFor="all_day" className="text-sm font-semibold cursor-pointer">
                            All Day Event
                        </Label>
                        <Switch
                            id="all_day"
                            checked={data.all_day}
                            onCheckedChange={checked => setData('all_day', checked)}
                        />
                    </div>

                    {/* Type & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Event Type *</Label>
                            <Select value={data.type} onValueChange={v => setData('type', v)}>
                                <SelectTrigger className="border-2 focus:border-blue-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {eventTypes.map(type => (
                                        <SelectItem key={type.value} value={type.value}>
                                            <span className="flex items-center gap-2">
                                                <span>{type.emoji}</span>
                                                <span>{type.label}</span>
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Status *</Label>
                            <Select value={data.status} onValueChange={v => setData('status', v)}>
                                <SelectTrigger className="border-2 focus:border-purple-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map(status => (
                                        <SelectItem key={status.value} value={status.value}>
                                            <span className="flex items-center gap-2">
                                                <span 
                                                    className="w-3 h-3 rounded-full" 
                                                    style={{ backgroundColor: status.color }}
                                                ></span>
                                                <span>{status.label}</span>
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Location & Color */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-sm font-semibold flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-red-500" />
                                Location
                            </Label>
                            <Input
                                id="location"
                                value={data.location}
                                onChange={e => setData('location', e.target.value)}
                                placeholder="Event venue..."
                                className="border-2 focus:border-red-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="color" className="text-sm font-semibold flex items-center gap-2">
                                <Palette className="h-4 w-4 text-purple-500" />
                                Calendar Color
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    id="color"
                                    value={data.color}
                                    onChange={e => setData('color', e.target.value)}
                                    className="h-10 w-20 cursor-pointer"
                                />
                                <Input
                                    type="text"
                                    value={data.color}
                                    onChange={e => setData('color', e.target.value)}
                                    className="flex-1 border-2 focus:border-purple-500"
                                    placeholder="#3b82f6"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Max Attendees */}
                    <div className="space-y-2">
                        <Label htmlFor="max_attendees" className="text-sm font-semibold flex items-center gap-2">
                            <Users className="h-4 w-4 text-green-500" />
                            Max Attendees
                        </Label>
                        <Input
                            type="number"
                            id="max_attendees"
                            value={data.max_attendees}
                            onChange={e => setData('max_attendees', e.target.value)}
                            placeholder="Leave empty for unlimited"
                            className={`border-2 focus:border-green-500 transition-colors ${errors.max_attendees ? 'border-red-500' : ''}`}
                            min="1"
                        />
                        {errors.max_attendees && <p className="text-sm text-red-500 font-medium">{errors.max_attendees}</p>}
                    </div>

                    {/* Registration Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
                        <div>
                            <Label htmlFor="requires_registration" className="text-sm font-semibold cursor-pointer">
                                Requires Registration
                            </Label>
                            <p className="text-xs text-gray-500 mt-1">Enable registration for this event</p>
                        </div>
                        <Switch
                            id="requires_registration"
                            checked={data.requires_registration}
                            onCheckedChange={checked => setData('requires_registration', checked)}
                        />
                    </div>

                    {/* Registration Fields (shown only when registration is enabled) */}
                    {data.requires_registration && (
                        <div className="space-y-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                            <div className="space-y-2">
                                <Label htmlFor="registration_link" className="text-sm font-semibold flex items-center gap-2">
                                    <LinkIcon className="h-4 w-4 text-blue-500" />
                                    Registration Link *
                                </Label>
                                <Input
                                    type="url"
                                    id="registration_link"
                                    value={data.registration_link}
                                    onChange={e => setData('registration_link', e.target.value)}
                                    placeholder="https://..."
                                    className={`border-2 focus:border-blue-500 transition-colors ${errors.registration_link ? 'border-red-500' : ''}`}
                                    required={data.requires_registration}
                                />
                                {errors.registration_link && <p className="text-sm text-red-500 font-medium">{errors.registration_link}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registration_deadline" className="text-sm font-semibold flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-orange-500" />
                                    Registration Deadline
                                </Label>
                                <Input
                                    type="datetime-local"
                                    id="registration_deadline"
                                    value={data.registration_deadline}
                                    onChange={e => setData('registration_deadline', e.target.value)}
                                    className={`border-2 focus:border-orange-500 transition-colors ${errors.registration_deadline ? 'border-red-500' : ''}`}
                                />
                                {errors.registration_deadline && <p className="text-sm text-red-500 font-medium">{errors.registration_deadline}</p>}
                                <p className="text-xs text-gray-500">Must be before or equal to event start date (leave empty for no deadline)</p>
                            </div>
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose}
                            className="border-2 hover:bg-gray-100"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={processing}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {processing ? 'Saving...' : (isEditMode ? 'Update Event' : 'Create Event')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

