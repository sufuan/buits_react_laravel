import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Badge } from '@/Components/ui/badge';
import { ClipboardList, Clock, CheckCircle2, XCircle, Copy, MoreVertical } from 'lucide-react';

export default function EventRegistrationsIndex({ registrations, ticketingEvents, stats, filters }) {
    const { flash } = usePage().props;
    const [selectedEventId, setSelectedEventId] = useState(filters.event_id || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedMemberType, setSelectedMemberType] = useState(filters.member_type || '');
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [detailsData, setDetailsData] = useState(null);

    // Show flash messages
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);

    const handleFilterChange = (eventId, status, memberType) => {
        router.get(
            route('admin.event-registrations.index'),
            { 
                event_id: eventId || undefined, 
                status: status || undefined,
                member_type: memberType || undefined 
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleVerify = (registration) => {
        router.post(
            route('admin.event-registrations.verify', registration.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Payment verified! Ticket email sent.'),
                onError: (errors) => toast.error(errors.error || 'Could not verify.'),
            }
        );
    };

    const handleRejectConfirm = () => {
        if (!selectedRegistration) return;
        
        router.post(
            route('admin.event-registrations.reject', selectedRegistration.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Registration rejected.');
                    setRejectDialogOpen(false);
                    setSelectedRegistration(null);
                },
            }
        );
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    const showDetails = (registration) => {
        setDetailsData(registration);
        setDetailsDialogOpen(true);
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: { variant: 'warning', label: 'Pending', className: 'bg-amber-100 text-amber-800 border-amber-300' },
            verified: { variant: 'success', label: 'Verified', className: 'bg-green-100 text-green-800 border-green-300' },
            rejected: { variant: 'destructive', label: 'Rejected', className: 'bg-red-100 text-red-800 border-red-300' },
        };
        const config = variants[status] || variants.pending;
        return <Badge className={config.className}>{config.label}</Badge>;
    };

    const getPaymentMethodLabel = (method) => {
        const labels = { bkash: 'bKash', nagad: 'Nagad', rocket: 'Rocket', bank: 'Bank Transfer' };
        return labels[method] || method;
    };

    const statusTabs = [
        { value: '', label: 'All', count: stats.total },
        { value: 'pending', label: 'Pending', count: stats.pending },
        { value: 'verified', label: 'Verified', count: stats.verified },
        { value: 'rejected', label: 'Rejected', count: stats.rejected },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-xl opacity-50 animate-pulse"></div>
                            <ClipboardList className="relative h-10 w-10 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Event Registrations
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Verify payments and manage ticket issuance</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Event Registrations" />

            <div className="p-6 space-y-6 min-w-0 w-full">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <ClipboardList className="h-8 w-8 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-amber-500 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pending</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
                                </div>
                                <div className="p-3 bg-amber-100 rounded-full">
                                    <Clock className="h-8 w-8 text-amber-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Verified</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.verified}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-red-500 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Rejected</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.rejected}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-full">
                                    <XCircle className="h-8 w-8 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter Bar */}
                <Card className="shadow-md">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                                {/* Event Filter */}
                                <div className="w-full sm:w-64">
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Event</label>
                                    <Select
                                        value={selectedEventId || 'all'}
                                        onValueChange={(value) => {
                                            const eventId = value === 'all' ? '' : value;
                                            setSelectedEventId(eventId);
                                            handleFilterChange(eventId, selectedStatus, selectedMemberType);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Events" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Events</SelectItem>
                                            {ticketingEvents.map((event) => (
                                                <SelectItem key={event.id} value={event.id.toString()}>
                                                    {event.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                {/* Member Type Filter */}
                                <div className="w-full sm:w-48">
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Member Type</label>
                                    <Select
                                        value={selectedMemberType || 'all'}
                                        onValueChange={(value) => {
                                            const memberType = value === 'all' ? '' : value;
                                            setSelectedMemberType(memberType);
                                            handleFilterChange(selectedEventId, selectedStatus, memberType);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="members">Members Only</SelectItem>
                                            <SelectItem value="non-members">Non-Members Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Status Filter Tabs */}
                            <div className="flex gap-2 flex-wrap">
                                {statusTabs.map((tab) => (
                                    <Button
                                        key={tab.value}
                                        variant={selectedStatus === tab.value ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => {
                                            setSelectedStatus(tab.value);
                                            handleFilterChange(selectedEventId, tab.value, selectedMemberType);
                                        }}
                                        className="min-w-[90px]"
                                    >
                                        {tab.label} ({tab.count})
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Registrations Table */}
                <Card className="shadow-md min-w-0 w-full">
                    <CardHeader className="border-b bg-gray-50">
                        <CardTitle>Registrations List</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto w-full">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="w-12">#</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Member Status</TableHead>
                                        <TableHead>Fee Charged</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>TrxID</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {registrations.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={10} className="text-center py-12">
                                                <div className="flex flex-col items-center gap-3">
                                                    <ClipboardList className="h-12 w-12 text-gray-400" />
                                                    <p className="text-gray-500">No registrations found</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        registrations.data.map((registration, index) => (
                                            <TableRow key={registration.id} className="hover:bg-gray-50">
                                                <TableCell className="font-medium">
                                                    {registrations.from + index}
                                                </TableCell>
                                                <TableCell className="font-medium">{registration.name}</TableCell>
                                                <TableCell className="text-sm text-gray-600">{registration.email}</TableCell>
                                                <TableCell className="text-sm">{registration.phone}</TableCell>
                                                
                                                {/* Member Status */}
                                                <TableCell>
                                                    {registration.is_member ? (
                                                        <Badge className="bg-green-100 text-green-800 border-green-200">
                                                            Member
                                                            {registration.member_id && (
                                                                <span className="ml-1 text-xs">({registration.member_id})</span>
                                                            )}
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                                                            Non-Member
                                                        </Badge>
                                                    )}
                                                </TableCell>

                                                {/* Fee Charged */}
                                                <TableCell>
                                                    {registration.fee_charged ? (
                                                        <span className="font-medium">৳ {parseFloat(registration.fee_charged).toFixed(2)}</span>
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">Free</span>
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    <span className="capitalize">{getPaymentMethodLabel(registration.payment_method)}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                            {registration.transaction_id.substring(0, 12)}
                                                            {registration.transaction_id.length > 12 && '...'}
                                                        </code>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 w-6 p-0"
                                                            onClick={() => copyToClipboard(registration.transaction_id)}
                                                        >
                                                            <Copy className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(registration.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex flex-col xl:flex-row items-end justify-end gap-2">
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() => handleVerify(registration)}
                                                            disabled={registration.status !== 'pending'}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            <CheckCircle2 className="h-4 w-4 mr-1" />
                                                            Verify
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedRegistration(registration);
                                                                setRejectDialogOpen(true);
                                                            }}
                                                            disabled={registration.status !== 'pending'}
                                                            className="text-red-600 border-red-300 hover:bg-red-50"
                                                        >
                                                            <XCircle className="h-4 w-4 mr-1" />
                                                            Reject
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                        {/* Pagination */}
                        {registrations.last_page > 1 && (
                            <div className="border-t p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Showing {registrations.from} to {registrations.to} of {registrations.total} results
                                    </p>
                                    <div className="flex gap-2">
                                        {registrations.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.visit(link.url)}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Reject Confirmation Dialog */}
            <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reject Registration?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to reject {selectedRegistration?.name}'s registration? This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedRegistration(null)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRejectConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Reject
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Custom Fields Details Dialog */}
            <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Custom Field Responses</DialogTitle>
                        <DialogDescription>
                            Additional information submitted by {detailsData?.name}
                        </DialogDescription>
                    </DialogHeader>
                    {detailsData?.custom_field_responses && (
                        <div className="space-y-3">
                            {Object.entries(detailsData.custom_field_responses).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-2 gap-4 py-2 border-b last:border-0">
                                    <div className="font-semibold text-gray-700">{key}</div>
                                    <div className="text-gray-900">{value}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminAuthenticatedLayout>
    );
}
