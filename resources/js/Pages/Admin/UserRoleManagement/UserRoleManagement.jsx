import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Crown, UserCog, Users, Activity, Search, Download, FileText, Edit } from 'lucide-react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function UserRoleManagement() {
    const { users, designations, filters, userTypes, statistics } = usePage().props;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedRole, setSelectedRole] = useState(filters.usertype || 'all');
    const [selectedDesignation, setSelectedDesignation] = useState(filters.designation_id || 'all');
    const [editingUser, setEditingUser] = useState(null);
    const [newDesignation, setNewDesignation] = useState('');
    const [changeReason, setChangeReason] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Apply filters when they change
    useEffect(() => {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (selectedRole && selectedRole !== 'all') params.usertype = selectedRole;
        if (selectedDesignation && selectedDesignation !== 'all') params.designation_id = selectedDesignation;

        router.get(route('admin.user-role-management.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    }, [searchTerm, selectedRole, selectedDesignation]);

    const handleDesignationChange = (e) => {
        e.preventDefault();
        
        if (!newDesignation || !changeReason.trim()) {
            alert('Please select a designation and provide a reason for the change.');
            return;
        }

        router.put(route('admin.user-role-management.update-role', editingUser.id), {
            designation_id: newDesignation,
            reason: changeReason,
        }, {
            onSuccess: () => {
                setIsDialogOpen(false);
                setEditingUser(null);
                setNewDesignation('');
                setChangeReason('');
            },
            onError: (errors) => {
                console.error('Error updating designation:', errors);
            }
        });
    };

    const handleExport = (format) => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedRole) params.append('usertype', selectedRole);
        if (selectedDesignation) params.append('designation_id', selectedDesignation);

        const url = format === 'excel' 
            ? route('admin.user-role-management.export.excel') 
            : route('admin.user-role-management.export.csv');
        
        window.location.href = `${url}?${params.toString()}`;
    };

    const openChangeDialog = (user) => {
        setEditingUser(user);
        setNewDesignation(user.designation?.id || '');
        setChangeReason('');
        setIsDialogOpen(true);
    };

    const getInitials = (name) => {
        return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    };

    const getRoleBadgeVariant = (role) => {
        switch (role) {
            case 'Executive': return 'default';
            case 'Volunteer': return 'secondary';
            case 'Member': return 'outline';
            default: return 'outline';
        }
    };

    const handleExportCSV = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedRole && selectedRole !== 'all') params.append('usertype', selectedRole);
        if (selectedDesignation && selectedDesignation !== 'all') params.append('designation_id', selectedDesignation);
        
        window.location.href = route('admin.user-role-management.export-csv') + '?' + params.toString();
    };

    const handleExportExcel = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedRole && selectedRole !== 'all') params.append('usertype', selectedRole);
        if (selectedDesignation && selectedDesignation !== 'all') params.append('designation_id', selectedDesignation);
        
        window.location.href = route('admin.user-role-management.export-excel') + '?' + params.toString();
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Executive Role Management</h2>
                    <div className="flex items-center gap-2">
                        <Button onClick={handleExportCSV} variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Export CSV
                        </Button>
                        <Button onClick={handleExportExcel} variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export Excel
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="Executive Role Management" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Executive Role Management</h1>
                        <p className="text-muted-foreground">
                            Manage executive designations and roles within the organization
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Executives</CardTitle>
                            <Crown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics?.total_executives || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Executive members
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">With Designations</CardTitle>
                            <UserCog className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics?.with_designations || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Assigned positions
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Without Designations</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics?.without_designations || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Pending assignment
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Recent Changes</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics?.recent_changes || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Last 30 days
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Controls */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters & Actions</CardTitle>
                        <CardDescription>
                            Filter users and export data
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
                            {/* Search */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name, email, or student ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>

                            {/* Role Filter */}
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger className="w-full lg:w-[180px]">
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    {userTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Designation Filter */}
                            <Select value={selectedDesignation} onValueChange={setSelectedDesignation}>
                                <SelectTrigger className="w-full lg:w-[180px]">
                                    <SelectValue placeholder="Filter by designation" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Designations</SelectItem>
                                    {designations.map((designation) => (
                                        <SelectItem key={designation.id} value={designation.id.toString()}>
                                            {designation.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Export Buttons */}
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleExport('csv')}
                                    className="flex items-center space-x-2"
                                >
                                    <FileText className="h-4 w-4" />
                                    <span>CSV</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleExport('excel')}
                                    className="flex items-center space-x-2"
                                >
                                    <Download className="h-4 w-4" />
                                    <span>Excel</span>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Users ({users.total})</CardTitle>
                        <CardDescription>
                            Manage user roles and designations
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Designation</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.avatar} alt={user.name} />
                                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        ID: {user.member_id || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div>{user.email}</div>
                                                <div className="text-muted-foreground">{user.phone || 'No phone'}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getRoleBadgeVariant(user.usertype)}>
                                                {user.usertype || 'No Role'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">
                                                {user.designation ? user.designation.name : 'No Designation'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openChangeDialog(user)}
                                                className="flex items-center space-x-1"
                                            >
                                                <Edit className="h-3 w-3" />
                                                <span>Change</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="flex items-center justify-between space-x-2 py-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing {users.from} to {users.to} of {users.total} results
                                </div>
                                <div className="flex space-x-2">
                                    {users.prev_page_url && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(users.prev_page_url)}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {users.next_page_url && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(users.next_page_url)}
                                        >
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Change Designation Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Change User Designation</DialogTitle>
                            <DialogDescription>
                                Update the designation for {editingUser?.name}. This action will be logged for audit purposes.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleDesignationChange}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="designation">New Designation</Label>
                                    <Select value={newDesignation} onValueChange={setNewDesignation}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select designation" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No Designation</SelectItem>
                                            {designations.map((designation) => (
                                                <SelectItem key={designation.id} value={designation.id.toString()}>
                                                    {designation.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="reason">Reason for Change</Label>
                                    <Textarea
                                        id="reason"
                                        placeholder="Enter the reason for this designation change..."
                                        value={changeReason}
                                        onChange={(e) => setChangeReason(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Update Designation
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminAuthenticatedLayout>
    );
}
