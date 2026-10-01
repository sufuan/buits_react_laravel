import { useState, useMemo } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import BarcodeScanner from '@/Components/Admin/BarcodeScanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/Components/ui/dialog';
import { Badge } from '@/Components/ui/badge';
import { ClipboardList, Clock, CheckCircle2, XCircle, Copy, FileSpreadsheet, Download, ScanLine, Search, LoaderCircle } from 'lucide-react';

const BASE_COLUMNS = [
    { key: 'name',           label: 'Full Name' },
    { key: 'email',          label: 'Email' },
    { key: 'phone',          label: 'Phone' },
    { key: 'is_member',      label: 'Member Status' },
    { key: 'member_id',      label: 'Member ID' },
    { key: 'fee_charged',    label: 'Fee Charged' },
    { key: 'payment_method', label: 'Payment Method' },
    { key: 'transaction_id', label: 'Transaction ID' },
    { key: 'sender_number',  label: 'Sender Number' },
    { key: 'status',         label: 'Registration Status' },
    { key: 'ticket_no',      label: 'Ticket No' },
    { key: 'created_at',     label: 'Registered At' },
];

export default function EventRegistrationsIndex({ registrations, ticketingEvents, stats, filters }) {
    const { flash } = usePage().props;
    const [selectedEventId, setSelectedEventId]         = useState(filters.event_id || '');
    const [selectedStatus, setSelectedStatus]           = useState(filters.status || '');
    const [selectedMemberType, setSelectedMemberType]   = useState(filters.member_type || '');
    const [rejectDialogOpen, setRejectDialogOpen]       = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [detailsDialogOpen, setDetailsDialogOpen]     = useState(false);
    const [detailsData, setDetailsData]                 = useState(null);
    const [exportOpen, setExportOpen]                   = useState(false);
    const [exportLoading, setExportLoading]             = useState(false);
    const [selectedColumns, setSelectedColumns]         = useState(['name','email','phone','status','created_at']);
    const [scanDialogOpen, setScanDialogOpen]             = useState(false);
    const [scanResult, setScanResult]                     = useState(null);
    const [scanError, setScanError]                       = useState('');
    const [scanLoading, setScanLoading]                   = useState(false);
    const [manualTicketNo, setManualTicketNo]             = useState('');

    if (flash?.success) toast.success(flash.success);
    if (flash?.error)   toast.error(flash.error);

    const selectedEventObj = useMemo(() =>
        ticketingEvents.find(e => e.id.toString() === selectedEventId.toString()),
        [ticketingEvents, selectedEventId]
    );

    const customFields = useMemo(() =>
        (selectedEventObj?.form_schema || []).map(f => ({ key: f.label, label: f.label, isCustom: true })),
        [selectedEventObj]
    );

    const allColumns = [...BASE_COLUMNS, ...customFields];

    const handleFilterChange = (eventId, status, memberType) => {
        router.get(route('admin.event-registrations.index'),
            { event_id: eventId || undefined, status: status || undefined, member_type: memberType || undefined },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleVerify = (registration) => {
        router.post(route('admin.event-registrations.verify', registration.id), {},
            { preserveScroll: true, onSuccess: () => toast.success('Payment verified! Ticket email sent.'), onError: (e) => toast.error(e.error || 'Could not verify.') }
        );
    };

    const handleRejectConfirm = () => {
        if (!selectedRegistration) return;
        router.post(route('admin.event-registrations.reject', selectedRegistration.id), {},
            { preserveScroll: true, onSuccess: () => { toast.success('Registration rejected.'); setRejectDialogOpen(false); setSelectedRegistration(null); } }
        );
    };

    const lookupTicket = async (ticketNo) => {
        const normalizedTicketNo = ticketNo.trim();
        if (!normalizedTicketNo) {
            setScanError('Scan a barcode or enter a ticket number.');
            return;
        }

        setScanLoading(true);
        setScanError('');

        try {
            const response = await fetch(`${route('admin.event-registrations.scan')}?ticket_no=${encodeURIComponent(normalizedTicketNo)}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
            });
            const result = await response.json();

            if (!response.ok) throw new Error(result.message || 'Registration not found.');
            setScanResult(result.registration);
        } catch (error) {
            setScanResult(null);
            setScanError(error.message || 'Could not look up this ticket.');
        } finally {
            setScanLoading(false);
        }
    };

    const openScanDialog = () => {
        setScanResult(null);
        setScanError('');
        setManualTicketNo('');
        setScanDialogOpen(true);
    };

    const copyToClipboard = (text) => { navigator.clipboard.writeText(text); toast.success('Copied to clipboard'); };

    const toggleColumn = (key) => setSelectedColumns(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    const selectAll    = () => setSelectedColumns(allColumns.map(c => c.key));
    const deselectAll  = () => setSelectedColumns([]);

    const handleExport = () => {
        if (selectedColumns.length === 0) { toast.error('Please select at least one column.'); return; }
        setExportLoading(true);
        const params = new URLSearchParams({
            event_id: selectedEventId,
            columns:  JSON.stringify(selectedColumns),
            status:   selectedStatus || '',
        });
        window.location.href = route('admin.event-registrations.export') + '?' + params.toString();
        setTimeout(() => { setExportLoading(false); setExportOpen(false); }, 1800);
    };

    const getStatusBadge = (status) => {
        const v = { pending: 'bg-amber-100 text-amber-800 border-amber-300', verified: 'bg-green-100 text-green-800 border-green-300', rejected: 'bg-red-100 text-red-800 border-red-300' };
        const l = { pending: 'Pending', verified: 'Verified', rejected: 'Rejected' };
        return <Badge className={v[status] || v.pending}>{l[status] || 'Pending'}</Badge>;
    };

    const getPaymentMethodLabel = (method) => ({ bkash: 'bKash', nagad: 'Nagad', rocket: 'Rocket', bank: 'Bank Transfer' }[method] || method);

    const statusTabs = [
        { value: '',         label: 'All',      count: stats.total    },
        { value: 'pending',  label: 'Pending',  count: stats.pending  },
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
                            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Event Registrations</h2>
                            <p className="text-sm text-gray-500 mt-1">Verify payments and manage ticket issuance</p>
                        </div>
                    </div>
                    <Button type="button" onClick={openScanDialog} className="bg-blue-600 hover:bg-blue-700">
                        <ScanLine className="h-4 w-4 mr-2" /> Scan Ticket
                    </Button>
                </div>
            }
        >
            <Head title="Event Registrations" />

            <div className="p-6 space-y-6 min-w-0 w-full">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total',    count: stats.total,    color: 'blue',  Icon: ClipboardList },
                        { label: 'Pending',  count: stats.pending,  color: 'amber', Icon: Clock         },
                        { label: 'Verified', count: stats.verified, color: 'green', Icon: CheckCircle2  },
                        { label: 'Rejected', count: stats.rejected, color: 'red',   Icon: XCircle       },
                    ].map(({ label, count, color, Icon }) => (
                        <Card key={label} className={`border-l-4 border-l-${color}-500 shadow-md hover:shadow-lg transition-shadow`}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{label}</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">{count}</p>
                                    </div>
                                    <div className={`p-3 bg-${color}-100 rounded-full`}>
                                        <Icon className={`h-8 w-8 text-${color}-600`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filter Bar */}
                <Card className="shadow-md">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                                <div className="w-full sm:w-64">
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Event</label>
                                    <Select value={selectedEventId || 'all'} onValueChange={(v) => {
                                        const id = v === 'all' ? '' : v;
                                        setSelectedEventId(id);
                                        handleFilterChange(id, selectedStatus, selectedMemberType);
                                    }}>
                                        <SelectTrigger><SelectValue placeholder="All Events" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Events</SelectItem>
                                            {ticketingEvents.map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.title}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full sm:w-48">
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Member Type</label>
                                    <Select value={selectedMemberType || 'all'} onValueChange={(v) => {
                                        const mt = v === 'all' ? '' : v;
                                        setSelectedMemberType(mt);
                                        handleFilterChange(selectedEventId, selectedStatus, mt);
                                    }}>
                                        <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="members">Members Only</SelectItem>
                                            <SelectItem value="non-members">Non-Members Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full lg:w-auto">
                                <div className="flex gap-2 flex-wrap">
                                    {statusTabs.map(tab => (
                                        <Button key={tab.value} variant={selectedStatus === tab.value ? 'default' : 'outline'} size="sm"
                                            onClick={() => { setSelectedStatus(tab.value); handleFilterChange(selectedEventId, tab.value, selectedMemberType); }}
                                            className="min-w-[90px]">
                                            {tab.label} ({tab.count})
                                        </Button>
                                    ))}
                                </div>

                                {/* Export Button */}
                                <div className="relative group">
                                    <Button
                                        onClick={() => { setSelectedColumns(['name','email','phone','status','created_at']); setExportOpen(true); }}
                                        disabled={!selectedEventId}
                                        className={`flex items-center gap-2 font-semibold transition-all ${selectedEventId ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg' : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}`}
                                    >
                                        <FileSpreadsheet className="h-4 w-4" />
                                        Export Excel
                                    </Button>
                                    {!selectedEventId && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                            Select a single event to enable export
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card className="shadow-md min-w-0 w-full">
                    <CardHeader className="border-b bg-gray-50">
                        <div className="flex items-center justify-between">
                            <CardTitle>Registrations List</CardTitle>
                            {selectedEventId && selectedEventObj && (
                                <span className="text-sm text-gray-500">Filtered: <span className="font-semibold text-gray-800">{selectedEventObj.title}</span></span>
                            )}
                        </div>
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
                                    registrations.data.map((reg, index) => (
                                        <TableRow key={reg.id} className="hover:bg-gray-50">
                                            <TableCell className="font-medium">{registrations.from + index}</TableCell>
                                            <TableCell className="font-medium">{reg.name}</TableCell>
                                            <TableCell className="text-sm text-gray-600">{reg.email}</TableCell>
                                            <TableCell className="text-sm">{reg.phone}</TableCell>
                                            <TableCell>
                                                {reg.is_member
                                                    ? <Badge className="bg-green-100 text-green-800 border-green-200">Member{reg.member_id && <span className="ml-1 text-xs">({reg.member_id})</span>}</Badge>
                                                    : <Badge className="bg-gray-100 text-gray-700 border-gray-200">Non-Member</Badge>}
                                            </TableCell>
                                            <TableCell>
                                                {reg.fee_charged
                                                    ? <span className="font-medium">৳ {parseFloat(reg.fee_charged).toFixed(2)}</span>
                                                    : <span className="text-gray-500 text-sm">Free</span>}
                                            </TableCell>
                                            <TableCell><span className="capitalize">{getPaymentMethodLabel(reg.payment_method)}</span></TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                        {reg.transaction_id?.substring(0, 12)}{reg.transaction_id?.length > 12 && '...'}
                                                    </code>
                                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard(reg.transaction_id)}>
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(reg.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex flex-col xl:flex-row items-end justify-end gap-2">
                                                    <Button variant="default" size="sm" onClick={() => handleVerify(reg)} disabled={reg.status !== 'pending'} className="bg-green-600 hover:bg-green-700">
                                                        <CheckCircle2 className="h-4 w-4 mr-1" /> Verify
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => { setSelectedRegistration(reg); setRejectDialogOpen(true); }} disabled={reg.status !== 'pending'} className="text-red-600 border-red-300 hover:bg-red-50">
                                                        <XCircle className="h-4 w-4 mr-1" /> Reject
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {registrations.last_page > 1 && (
                            <div className="border-t p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">Showing {registrations.from} to {registrations.to} of {registrations.total} results</p>
                                    <div className="flex gap-2">
                                        {registrations.links.map((link, index) => (
                                            <Button key={index} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url}
                                                onClick={() => link.url && router.visit(link.url)} dangerouslySetInnerHTML={{ __html: link.label }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={scanDialogOpen} onOpenChange={(open) => {
                setScanDialogOpen(open);
                if (!open) {
                    setScanResult(null);
                    setScanError('');
                }
            }}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ScanLine className="h-5 w-5 text-blue-600" />
                            {scanResult ? 'Ticket Details' : 'Scan Registration Ticket'}
                        </DialogTitle>
                        <DialogDescription>
                            {scanResult ? 'Review the registration and payment status.' : 'Scan the Code 128 barcode from the approval email.'}
                        </DialogDescription>
                    </DialogHeader>

                    {!scanResult ? (
                        <div className="space-y-5">
                            <BarcodeScanner onDetected={lookupTicket} />
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                <div className="h-px flex-1 bg-gray-200" />
                                <span>OR ENTER MANUALLY</span>
                                <div className="h-px flex-1 bg-gray-200" />
                            </div>
                            <form onSubmit={(event) => { event.preventDefault(); lookupTicket(manualTicketNo); }} className="flex gap-2">
                                <input
                                    value={manualTicketNo}
                                    onChange={(event) => setManualTicketNo(event.target.value)}
                                    placeholder="BUITS-TICK-0001"
                                    className="h-10 min-w-0 flex-1 rounded-md border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                                <Button type="submit" disabled={scanLoading}>
                                    {scanLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-1" />}
                                    Find
                                </Button>
                            </form>
                            {scanError && <p className="text-sm text-red-600">{scanError}</p>}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className={`rounded-lg border p-4 ${scanResult.status === 'verified' ? 'border-green-200 bg-green-50' : scanResult.status === 'pending' ? 'border-amber-200 bg-amber-50' : 'border-red-200 bg-red-50'}`}>
                                <p className="text-sm font-semibold uppercase tracking-wide">{scanResult.status}</p>
                                <p className="mt-1 font-mono text-lg font-bold">{scanResult.ticket_no}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                <span className="text-gray-500">Registrant</span><span className="font-medium text-right">{scanResult.name}</span>
                                <span className="text-gray-500">Email</span><span className="font-medium text-right break-all">{scanResult.email}</span>
                                <span className="text-gray-500">Phone</span><span className="font-medium text-right">{scanResult.phone}</span>
                                <span className="text-gray-500">Event</span><span className="font-medium text-right">{scanResult.event_title}</span>
                                <span className="text-gray-500">Transaction ID</span><span className="font-mono text-right">{scanResult.transaction_id || 'N/A'}</span>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => { setScanResult(null); setScanError(''); }}>
                                    Scan Another
                                </Button>
                                <Button type="button" onClick={() => setScanDialogOpen(false)}>Done</Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* ═══ Export Modal ═══════════════════════════════════════════════════ */}
            <Dialog open={exportOpen} onOpenChange={setExportOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                            Export to Excel
                        </DialogTitle>
                        <DialogDescription>
                            Choose columns for <span className="font-semibold text-gray-800">{selectedEventObj?.title}</span>. Unchecked fields will not appear in the file.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="overflow-y-auto flex-1 space-y-5 py-2 pr-1">
                        {/* Select / Deselect All */}
                        <div className="flex items-center justify-between pb-2 border-b">
                            <span className="text-sm font-medium text-gray-500">{selectedColumns.length} of {allColumns.length} selected</span>
                            <div className="flex gap-3">
                                <button onClick={selectAll}   className="text-xs text-blue-600 hover:underline font-semibold">Select All</button>
                                <button onClick={deselectAll} className="text-xs text-gray-400 hover:underline font-semibold">Clear</button>
                            </div>
                        </div>

                        {/* Standard Fields */}
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Standard Fields</p>
                            <div className="grid grid-cols-2 gap-2">
                                {BASE_COLUMNS.map(col => (
                                    <label key={col.key} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all select-none ${selectedColumns.includes(col.key) ? 'bg-blue-50 border-blue-400 text-blue-900' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}>
                                        <input type="checkbox" checked={selectedColumns.includes(col.key)} onChange={() => toggleColumn(col.key)} className="h-4 w-4 rounded text-blue-600 border-gray-300 accent-blue-600" />
                                        <span className="text-sm font-medium">{col.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Custom Fields */}
                        {customFields.length > 0 && (
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Custom Form Fields</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {customFields.map(col => (
                                        <label key={col.key} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all select-none ${selectedColumns.includes(col.key) ? 'bg-purple-50 border-purple-400 text-purple-900' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}>
                                            <input type="checkbox" checked={selectedColumns.includes(col.key)} onChange={() => toggleColumn(col.key)} className="h-4 w-4 rounded text-purple-600 border-gray-300 accent-purple-600" />
                                            <span className="text-sm font-medium">{col.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Column order preview */}
                        {selectedColumns.length > 0 && (
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3.5 border border-gray-200">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5">Excel Column Order</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedColumns.map((key, idx) => {
                                        const col = allColumns.find(c => c.key === key);
                                        return col ? (
                                            <span key={key} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${col.isCustom ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                                                <span className="opacity-50 font-normal">{idx + 1}.</span>{col.label}
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 pt-4 border-t mt-2">
                        <Button variant="outline" onClick={() => setExportOpen(false)}>Cancel</Button>
                        <Button onClick={handleExport} disabled={selectedColumns.length === 0 || exportLoading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold">
                            <Download className="h-4 w-4" />
                            {exportLoading ? 'Preparing file...' : `Export ${selectedColumns.length} Column${selectedColumns.length !== 1 ? 's' : ''}`}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reject Registration?</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to reject {selectedRegistration?.name}'s registration? This cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedRegistration(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRejectConfirm} className="bg-red-600 hover:bg-red-700">Reject</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Custom Field Details Dialog */}
            <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Custom Field Responses</DialogTitle>
                        <DialogDescription>Additional information submitted by {detailsData?.name}</DialogDescription>
                    </DialogHeader>
                    {detailsData?.custom_field_responses && (
                        <div className="space-y-3">
                            {Object.entries(detailsData.custom_field_responses).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-2 gap-4 py-2 border-b last:border-0">
                                    <div className="font-semibold text-gray-700">{key}</div>
                                    <div className="text-gray-900">{Array.isArray(value) ? value.join(', ') : value}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminAuthenticatedLayout>
    );
}
