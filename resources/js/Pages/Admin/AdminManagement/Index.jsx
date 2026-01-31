import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Badge } from '@/Components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Plus, Edit, Trash2, Shield, UserCog } from 'lucide-react';
import { toast } from 'sonner';

export default function Index({ admins, roles, users }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    const createForm = useForm({
        user_id: '',
        role: '',
    });

    const editForm = useForm({
        name: '',
        username: '',
        email: '',
        status: 'active',
    });

    const roleForm = useForm({
        role: '',
    });

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('admin.admin-management.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
                toast.success('Admin created successfully!');
            },
        });
    };

    const handleEdit = (admin) => {
        setSelectedAdmin(admin);
        editForm.setData({
            name: admin.name,
            username: admin.username,
            email: admin.email,
            status: admin.status,
        });
        setIsEditOpen(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.put(route('admin.admin-management.update', selectedAdmin.id), {
            onSuccess: () => {
                setIsEditOpen(false);
                editForm.reset();
                toast.success('Admin updated successfully!');
            },
        });
    };

    const handleAssignRole = (admin) => {
        setSelectedAdmin(admin);
        roleForm.setData('role', admin.roles[0]?.name || '');
        setIsRoleOpen(true);
    };

    const handleRoleUpdate = (e) => {
        e.preventDefault();
        roleForm.put(route('admin.admin-management.assign-role', selectedAdmin.id), {
            onSuccess: () => {
                setIsRoleOpen(false);
                roleForm.reset();
                toast.success('Role assigned successfully!');
            },
        });
    };

    const handleDelete = (admin) => {
        if (confirm(`Are you sure you want to delete admin "${admin.name}"?`)) {
            router.delete(route('admin.admin-management.destroy', admin.id), {
                onSuccess: () => toast.success('Admin deleted successfully!'),
            });
        }
    };

    const handleStatusChange = (admin, status) => {
        router.put(route('admin.admin-management.change-status', admin.id), { status }, {
            onSuccess: () => toast.success('Status updated successfully!'),
        });
    };

    const getStatusBadge = (status) => {
        const variants = {
            active: 'default',
            inactive: 'secondary',
            suspended: 'destructive',
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
    };

    return (
        <AdminAuthenticatedLayout>
            <Head title="Admin Management" />

            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Role Assignment</h1>
                        <p className="text-gray-600 mt-1">Select existing users and assign them admin roles</p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-red-600 hover:bg-red-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Assign User as Admin
                            </Button>
                        </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <form onSubmit={handleCreate}>
                                    <DialogHeader>
                                        <DialogTitle>Assign User as Admin</DialogTitle>
                                        <DialogDescription>
                                            Select an existing user and assign them an admin role
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div>
                                            <Label htmlFor="user">Select User</Label>
                                            <Select value={createForm.data.user_id} onValueChange={value => createForm.setData('user_id', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose a user" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {users.map(user => (
                                                        <SelectItem key={user.id} value={user.id.toString()}>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{user.name}</span>
                                                                <span className="text-xs text-gray-500">
                                                                    {user.email} • {user.member_id || 'No ID'} • {user.department}
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="role">Assign Role</Label>
                                            <Select value={createForm.data.role} onValueChange={value => createForm.setData('role', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map(role => (
                                                        <SelectItem key={role.id} value={role.name}>
                                                            <div className="flex items-center gap-2">
                                                                <Shield className="h-4 w-4" />
                                                                {role.name}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={createForm.processing}>
                                            Assign as Admin
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Admins</CardTitle>
                        <CardDescription>Assign roles to admins - each admin can have one role with specific permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {admins.map((admin) => (
                                    <TableRow key={admin.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-red-600" />
                                                <div>
                                                    <div>{admin.name}</div>
                                                    <div className="text-xs text-gray-500">@{admin.username}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{admin.email}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {admin.roles[0]?.name || 'No role'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(admin.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={() => handleAssignRole(admin)}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    <UserCog className="h-4 w-4 mr-1" />
                                                    Assign Role
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(admin)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(admin)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="max-w-md">
                        <form onSubmit={handleUpdate}>
                            <DialogHeader>
                                <DialogTitle>Edit Admin</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div>
                                    <Label>Name</Label>
                                    <Input value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} />
                                </div>
                                <div>
                                    <Label>Username</Label>
                                    <Input value={editForm.data.username} onChange={e => editForm.setData('username', e.target.value)} />
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <Input value={editForm.data.email} onChange={e => editForm.setData('email', e.target.value)} />
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <Select value={editForm.data.status} onValueChange={value => editForm.setData('status', value)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                            <SelectItem value="suspended">Suspended</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={editForm.processing}>Update</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Assign Role Dialog */}
                <Dialog open={isRoleOpen} onOpenChange={setIsRoleOpen}>
                    <DialogContent className="max-w-md">
                        <form onSubmit={handleRoleUpdate}>
                            <DialogHeader>
                                <DialogTitle>Assign Role to {selectedAdmin?.name}</DialogTitle>
                                <DialogDescription>
                                    Select a role to assign to this admin. The role determines what permissions they have.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div>
                                    <Label htmlFor="role">Select Role</Label>
                                    <Select value={roleForm.data.role} onValueChange={value => roleForm.setData('role', value)}>
                                        <SelectTrigger id="role">
                                            <SelectValue placeholder="Choose a role..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map(role => (
                                                <SelectItem key={role.id} value={role.name}>
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="h-4 w-4" />
                                                        <span className="font-medium">{role.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Current role: <span className="font-medium">{selectedAdmin?.roles[0]?.name || 'None'}</span>
                                    </p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={roleForm.processing}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Assign Role
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminAuthenticatedLayout>
    );
}

