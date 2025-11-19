import React, { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Plus, TrendingUp, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import EventModal from './EventModal';
import EventDetailsModal from './EventDetailsModal';
import { toast } from 'sonner';
import axios from 'axios';

export default function EventsIndex({ 
    events, 
    upcomingEventsCount, 
    ongoingEventsCount, 
    totalEventsCount,
    completedEventsCount 
}) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const calendarRef = useRef(null);

    // Handle date click (create new event)
    const handleDateClick = (info) => {
        setSelectedDate(info.dateStr);
        setSelectedEvent(null);
        setIsEditMode(false);
        setShowCreateModal(true);
    };

    // Handle event click (view/edit event)
    const handleEventClick = (info) => {
        const eventId = info.event.id;
        // Fetch full event details
        axios.get(route('admin.events.show', eventId))
            .then(response => {
                setSelectedEvent(response.data.event);
                setShowDetailsModal(true);
            })
            .catch(error => {
                toast.error('Failed to load event details');
            });
    };

    // Handle event drag & drop
    const handleEventDrop = (info) => {
        const event = info.event;
        axios.patch(route('admin.events.update-dates', event.id), {
            start_date: event.start.toISOString(),
            end_date: event.end?.toISOString(),
        })
        .then(() => {
            toast.success('Event rescheduled successfully!');
        })
        .catch(() => {
            toast.error('Failed to reschedule event');
            info.revert();
        });
    };

    // Handle edit from details modal
    const handleEdit = (event) => {
        setShowDetailsModal(false);
        setSelectedEvent(event);
        setIsEditMode(true);
        setShowCreateModal(true);
    };

    const stats = [
        {
            title: 'Total Events',
            value: totalEventsCount,
            icon: Calendar,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
            iconColor: 'text-blue-500'
        },
        {
            title: 'Upcoming',
            value: upcomingEventsCount,
            icon: Clock,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-500/10',
            iconColor: 'text-purple-500'
        },
        {
            title: 'Ongoing',
            value: ongoingEventsCount,
            icon: TrendingUp,
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-500/10',
            iconColor: 'text-orange-500'
        },
        {
            title: 'Completed',
            value: completedEventsCount,
            icon: CheckCircle2,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-500/10',
            iconColor: 'text-green-500'
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-xl opacity-50 animate-pulse"></div>
                            <Calendar className="relative h-10 w-10 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Event Management
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Manage and organize all your events</p>
                        </div>
                    </div>
                    <Button 
                        onClick={() => {
                            setSelectedEvent(null);
                            setIsEditMode(false);
                            setSelectedDate(null);
                            setShowCreateModal(true);
                        }}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event
                    </Button>
                </div>
            }
        >
            <Head title="Event Management" />

            <div className="p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group">
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Calendar Card */}
                <Card className="border-0 shadow-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Sparkles className="h-6 w-6" />
                                <div>
                                    <CardTitle className="text-2xl">Event Calendar</CardTitle>
                                    <CardDescription className="text-blue-100">
                                        Click on any date to create an event, drag to reschedule
                                    </CardDescription>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="fullcalendar-wrapper">
                            <FullCalendar
                                ref={calendarRef}
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                                initialView="dayGridMonth"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                                }}
                                events={events}
                                editable={true}
                                selectable={true}
                                selectMirror={true}
                                dayMaxEvents={true}
                                weekends={true}
                                dateClick={handleDateClick}
                                eventClick={handleEventClick}
                                eventDrop={handleEventDrop}
                                height="auto"
                                timeZone="Asia/Dhaka"
                                eventTimeFormat={{
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    meridiem: 'short',
                                    hour12: true
                                }}
                                slotLabelFormat={{
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    meridiem: 'short',
                                    hour12: true
                                }}
                                eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Create/Edit Event Modal */}
            {showCreateModal && (
                <EventModal
                    isOpen={showCreateModal}
                    onClose={() => {
                        setShowCreateModal(false);
                        setSelectedDate(null);
                        setSelectedEvent(null);
                        setIsEditMode(false);
                    }}
                    initialDate={selectedDate}
                    event={selectedEvent}
                    isEditMode={isEditMode}
                />
            )}

            {/* Event Details Modal */}
            {showDetailsModal && selectedEvent && (
                <EventDetailsModal
                    isOpen={showDetailsModal}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedEvent(null);
                    }}
                    event={selectedEvent}
                    onEdit={handleEdit}
                />
            )}
        </AdminAuthenticatedLayout>
    );
}

