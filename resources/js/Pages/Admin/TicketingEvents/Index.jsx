import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/Components/ui/alert-dialog';
import { Calendar, CheckCircle2, XCircle, Plus, Edit, Users, Trash2, ExternalLink, Copy, Check } from 'lucide-react';

export default function TicketingEventsIndex({ events, stats }) {
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [copiedSlug, setCopiedSlug] = useState(null);

    const handleCopyUrl = (slug) => {
        const url = window.location.origin + `/t/${slug}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopiedSlug(slug);
            setTimeout(() => setCopiedSlug(null), 1500);
        });
    };

    const handleDelete = (event) => {
        setDeleteLoading(event.id);
        router.delete(route('admin.ticketing-events.destroy', event.slug), {
            onSuccess: () => {
                toast.success('Event deleted successfully');
                setDeleteLoading(null);
            },
            onError: () => {
                toast.error('Failed to delete event');
                setDeleteLoading(null);
            },
            onFinish: () => setDeleteLoading(null)
        });
    };

    const formatDeadline = (deadline) => {
        if (!deadline) return 'No deadline';
        return new Date(deadline).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatFee = (event) => {
        if (!event.requires_payment) {
            return (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                    Free
                </Badge>
            );
        }
        // Payment is required — show Paid badge with fee info
        const memberFee    = event.member_fee    ? `৳${parseFloat(event.member_fee).toFixed(0)}` : null;
        const nonMemberFee = event.non_member_fee ? `৳${parseFloat(event.non_member_fee).toFixed(0)}` : null;
        return (
            <div className="flex flex-col gap-1">
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200 w-fit">
                    Paid
                </Badge>
                {(memberFee || nonMemberFee) && (
                    <span className="text-xs text-gray-500">
                        {memberFee && `M: ${memberFee}`}{memberFee && nonMemberFee && ' / '}{nonMemberFee && `NM: ${nonMemberFee}`}
                    </span>
                )}
            </div>
        );
    };

    const getStatusBadge = (status) => {
        if (status === 'active') {
            return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
        }
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600">Closed</Badge>;
    };

    const getCustomFieldsBadge = (count) => {
        if (count === 0) {
            return <Badge variant="outline" className="text-gray-500">No custom fields</Badge>;
        }
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{count} field{count !== 1 ? 's' : ''}</Badge>;
    };

    const openPublicUrl = (slug) => {
        const url = window.location.origin + `/t/${slug}`;
        window.open(url, '_blank');
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Ticketing Events
                    </h2>
                    <Link href={route('admin.ticketing-events.create')}>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Event
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Ticketing Events" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Calendar className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <CardDescription className="text-blue-600 font-medium">Total Events</CardDescription>
                                        <CardTitle className="text-3xl font-bold text-blue-700">{stats.total}</CardTitle>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <CardDescription className="text-green-600 font-medium">Active Events</CardDescription>
                                        <CardTitle className="text-3xl font-bold text-green-700">{stats.active}</CardTitle>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-50 border-gray-200">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <XCircle className="h-8 w-8 text-gray-600" />
                                    </div>
                                    <div className="ml-4">
                                        <CardDescription className="text-gray-600 font-medium">Closed Events</CardDescription>
                                        <CardTitle className="text-3xl font-bold text-gray-700">{stats.closed}</CardTitle>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Events Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>All Events</CardTitle>
                            <CardDescription>
                                Manage your ticketing events and view registration statistics
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {events.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events created yet</h3>
                                    <p className="text-gray-500 mb-6">Get started by creating your first ticketing event.</p>
                                    <Link href={route('admin.ticketing-events.create')}>
                                        <Button>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Your First Event
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[300px]">Title</TableHead>
                                                <TableHead>Slug</TableHead>
                                                <TableHead>Fee</TableHead>
                                                <TableHead>Deadline</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Custom Fields</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {events.data.map((event) => (
                                                <TableRow key={event.id} className="hover:bg-gray-50">
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{event.title}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="max-w-[260px]">
                                                        <div className="flex min-w-0 items-center gap-1.5">
                                                            <button
                                                                onClick={() => openPublicUrl(event.slug)}
                                                                title={`Open /t/${event.slug}`}
                                                                className="inline-flex min-w-0 max-w-[220px] items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-left font-mono text-xs text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                                                            >
                                                                <span className="truncate">/t/{event.slug}</span>
                                                                <ExternalLink className="h-3 w-3 shrink-0" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleCopyUrl(event.slug)}
                                                                title="Copy public URL"
                                                                className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                                            >
                                                                {copiedSlug === event.slug
                                                                    ? <Check className="h-3.5 w-3.5 text-emerald-600" />
                                                                    : <Copy className="h-3.5 w-3.5" />}
                                                            </button>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{formatFee(event)}</TableCell>
                                                    <TableCell>
                                                        <span className={event.deadline ? "text-gray-700" : "text-gray-500 italic"}>
                                                            {formatDeadline(event.deadline)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>{getStatusBadge(event.status)}</TableCell>
                                                    <TableCell>{getCustomFieldsBadge(event.custom_fields_count)}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link href={route('admin.ticketing-events.edit', event.slug)}>
                                                                <Button variant="outline" size="sm">
                                                                    <Edit className="h-4 w-4 mr-1" />
                                                                    Edit
                                                                </Button>
                                                            </Link>
                                                            <Link href={route('admin.event-registrations.index', { event_id: event.id })}>
                                                                <Button variant="outline" size="sm">
                                                                    <Users className="h-4 w-4 mr-1" />
                                                                    Registrations
                                                                </Button>
                                                            </Link>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button 
                                                                        variant="outline" 
                                                                        size="sm"
                                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                                        disabled={deleteLoading === event.id}
                                                                    >
                                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                                        Delete
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Delete Event?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Are you sure you want to delete "{event.title}"? All registrations for this event will also be deleted. This cannot be undone.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => handleDelete(event)}
                                                                            className="bg-red-600 hover:bg-red-700"
                                                                            disabled={deleteLoading === event.id}
                                                                        >
                                                                            {deleteLoading === event.id ? 'Deleting...' : 'Delete Event'}
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    {/* Pagination */}
                                    {events.links && events.links.length > 3 && (
                                        <div className="flex items-center justify-between px-2 py-4">
                                            <div className="flex-1 flex justify-between sm:hidden">
                                                {events.prev_page_url && (
                                                    <Link 
                                                        href={events.prev_page_url}
                                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        Previous
                                                    </Link>
                                                )}
                                                {events.next_page_url && (
                                                    <Link 
                                                        href={events.next_page_url}
                                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        Next
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-700">
                                                        Showing <span className="font-medium">{events.from}</span> to{' '}
                                                        <span className="font-medium">{events.to}</span> of{' '}
                                                        <span className="font-medium">{events.total}</span> results
                                                    </p>
                                                </div>
                                                <div>
                                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                        {events.links.map((link, index) => (
                                                            <Link
                                                                key={index}
                                                                href={link.url || '#'}
                                                                className={`relative inline-flex items-center px-2 py-2 border text-sm font-medium ${
                                                                    link.active
                                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                        : link.url
                                                                        ? 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                        : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                                                                } ${
                                                                    index === 0 ? 'rounded-l-md' : ''
                                                                } ${
                                                                    index === events.links.length - 1 ? 'rounded-r-md' : ''
                                                                }`}
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        ))}
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
