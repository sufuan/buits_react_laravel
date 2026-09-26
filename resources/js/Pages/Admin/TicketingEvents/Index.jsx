import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Tag, Plus, Edit, Trash2, Calendar, DollarSign, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function TicketingEventsIndex({ events, stats }) {
    const { flash } = usePage().props;

    const handleDelete = (event) => {
        if (confirm(`Are you sure you want to delete "${event.title}"? This will also delete all registrations for this event.`)) {
            router.delete(route('admin.ticketing-events.destroy', event.slug));
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            active: { variant: 'success', icon: CheckCircle, text: 'Active' },
            closed: { variant: 'destructive', icon: XCircle, text: 'Closed' }
        };

        const { variant, icon: Icon, text } = variants[status] || variants.active;
        
        return (
            <Badge variant={variant} className="flex items-center gap-1">
                <Icon className="h-3 w-3" />
                {text}
            </Badge>
        );
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-xl opacity-50 animate-pulse"></div>
                            <Tag className="relative h-10 w-10 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Ticketing Events
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Manage event registrations and ticketing</p>
                        </div>
                    </div>
                    <Link href={route('admin.ticketing-events.create')}>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Event
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Ticketing Events" />

            <div className="p-6 space-y-6">
                {flash?.success && (
                    <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            {flash.success}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Events</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <Calendar className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Active Events</p>
                                    <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Closed Events</p>
                                    <p className="text-3xl font-bold text-red-600">{stats.closed}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-full">
                                    <XCircle className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Events List */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                        <CardTitle className="text-xl">All Events</CardTitle>
                        <CardDescription>
                            Manage your ticketing events and registrations
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {events.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="p-4 bg-gray-50 rounded-full mb-4">
                                    <Tag className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No events yet</h3>
                                <p className="text-gray-600 mb-4">Create your first ticketing event to get started.</p>
                                <Link href={route('admin.ticketing-events.create')}>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Event
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b">
                                            <tr>
                                                <th className="text-left py-3 px-6 font-semibold text-gray-700">Event</th>
                                                <th className="text-left py-3 px-6 font-semibold text-gray-700">Status</th>
                                                <th className="text-left py-3 px-6 font-semibold text-gray-700">Fee</th>
                                                <th className="text-left py-3 px-6 font-semibold text-gray-700">Deadline</th>
                                                <th className="text-left py-3 px-6 font-semibold text-gray-700">Custom Fields</th>
                                                <th className="text-left py-3 px-6 font-semibold text-gray-700">Creator</th>
                                                <th className="text-right py-3 px-6 font-semibold text-gray-700">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {events.data.map((event) => (
                                                <tr key={event.id} className="border-b hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 px-6">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">{event.title}</h3>
                                                            <p className="text-sm text-gray-500">/{event.slug}</p>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        {getStatusBadge(event.status)}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        {event.fee ? (
                                                            <div className="flex items-center gap-1 text-green-600">
                                                                <DollarSign className="h-4 w-4" />
                                                                <span className="font-medium">{event.fee}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-500">Free</span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        {event.deadline ? (
                                                            <div className="text-sm">
                                                                {new Date(event.deadline).toLocaleDateString()}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-500">No deadline</span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-1 text-blue-600">
                                                            <Users className="h-4 w-4" />
                                                            <span className="font-medium">{event.custom_fields_count}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className="text-sm text-gray-600">{event.creator_name}</span>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-2 justify-end">
                                                            <Link href={route('admin.ticketing-events.edit', event.slug)}>
                                                                <Button variant="outline" size="sm">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDelete(event)}
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {events.links && events.links.length > 3 && (
                                    <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
                                        <div className="text-sm text-gray-600">
                                            Showing {events.from} to {events.to} of {events.total} results
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {events.links.map((link, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    disabled={!link.url}
                                                    className={`px-3 py-1 text-sm rounded-md ${
                                                        link.active
                                                            ? 'bg-blue-600 text-white'
                                                            : link.url
                                                            ? 'bg-white border hover:bg-gray-50'
                                                            : 'text-gray-400 cursor-not-allowed'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
