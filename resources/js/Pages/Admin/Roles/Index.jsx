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
import { Checkbox } from '@/Components/ui/checkbox';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Separator } from '@/Components/ui/separator';
import { Plus, Edit, Trash2, Shield, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Index({ roles, permissionGroups }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    const createForm = useForm({
        name: '',
        permissions: [],
    });

    const editForm = useForm({
        name: '',
        permissions: [],
    });

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('admin.roles.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
                toast.success('Role created successfully!');
            },
        });
    };

    const handleEdit = (role) => {
        setSelectedRole(role);
        editForm.setData({
            name: role.name,
            permissions: role.permissions.map(p => p.name),
        });
        setIsEditOpen(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.put(route('admin.roles.update', selectedRole.id), {
            onSuccess: () => {
                setIsEditOpen(false);
                editForm.reset();
                toast.success('Role updated successfully!');
            },
        });
    };

    const handleDelete = (role) => {
        if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
            router.delete(route('admin.roles.destroy', role.id), {
                onSuccess: () => toast.success('Role deleted successfully!'),
            });
        }
    };

    const togglePermission = (form, permissionName) => {
        const current = form.data.permissions;
        if (current.includes(permissionName)) {
            form.setData('permissions', current.filter(p => p !== permissionName));
        } else {
            form.setData('permissions', [...current, permissionName]);
        }
    };

    const toggleGroupPermissions = (form, groupPermissions) => {
        const groupNames = groupPermissions.map(p => p.name);
        const current = form.data.permissions;
        const allSelected = groupNames.every(name => current.includes(name));

        if (allSelected) {
            form.setData('permissions', current.filter(p => !groupNames.includes(p)));
        } else {
            const newPermissions = [...new Set([...current, ...groupNames])];
            form.setData('permissions', newPermissions);
        }
    };

    const PermissionSelector = ({ form, permissionGroups }) => (
        <ScrollArea className="h-[400px] pr-4">
            {(!permissionGroups || Object.keys(permissionGroups).length === 0) ? (
                <div className="text-center text-gray-500 py-4">No permissions found. Run seeders?</div>
            ) : (
                Object.entries(permissionGroups).map(([groupName, permissions]) => {
                    const allSelected = permissions.every(p => form.data.permissions.includes(p.name));
                    const someSelected = permissions.some(p => form.data.permissions.includes(p.name));

                    return (
                        <div key={groupName} className="mb-6">
                            <div className="flex items-center space-x-2 mb-3">
                                <Checkbox
                                    checked={allSelected}
                                    onCheckedChange={() => toggleGroupPermissions(form, permissions)}
                                    className={someSelected && !allSelected ? 'opacity-50' : ''}
                                />
                                <Label className="text-sm font-semibold text-gray-700">{groupName}</Label>
                                <Badge variant="outline" className="ml-auto">{permissions.length}</Badge>
                            </div>
                            <div className="ml-6 space-y-2">
                                {permissions.map((permission) => (
                                    <div key={permission.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={form.data.permissions.includes(permission.name)}
                                            onCheckedChange={() => togglePermission(form, permission.name)}
                                        />
                                        <Label className="text-sm text-gray-600 cursor-pointer">
                                            {permission.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <Separator className="mt-4" />
                        </div>
                    );
                }))}
        </ScrollArea>
    );

    // Debug log
    console.log('Permission Groups:', permissionGroups);

    return (
        <AdminAuthenticatedLayout>
            <Head title="Role Management" />

            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
                        <p className="text-gray-600 mt-1">Create roles and assign permissions to control access</p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-red-600 hover:bg-red-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Create New Role
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <form onSubmit={handleCreate}>
                                <DialogHeader>
                                    <DialogTitle>Create New Role</DialogTitle>
                                    <DialogDescription>
                                        Create a new role and assign permissions
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div>
                                        <Label htmlFor="name">Role Name</Label>
                                        <Input
                                            id="name"
                                            value={createForm.data.name}
                                            onChange={e => createForm.setData('name', e.target.value)}
                                            placeholder="e.g., moderator"
                                        />
                                    </div>
                                    <div>
                                        <Label>Permissions</Label>
                                        <PermissionSelector form={createForm} permissionGroups={permissionGroups} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={createForm.processing}>
                                        Create Role
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Roles</CardTitle>
                        <CardDescription>Edit existing roles and their permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Role Name</TableHead>
                                    <TableHead>Permissions</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roles.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-red-600" />
                                                {role.name}
                                                {role.name === 'superadmin' && (
                                                    <Badge variant="destructive">Super</Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {role.permissions_count} permissions
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {new Date(role.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(role)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            {role.name !== 'superadmin' && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(role)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="max-w-2xl">
                        <form onSubmit={handleUpdate}>
                            <DialogHeader>
                                <DialogTitle>Edit Role</DialogTitle>
                                <DialogDescription>
                                    Update role name and permissions
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div>
                                    <Label htmlFor="edit-name">Role Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={editForm.data.name}
                                        onChange={e => editForm.setData('name', e.target.value)}
                                        disabled={selectedRole?.name === 'superadmin'}
                                    />
                                </div>
                                <div>
                                    <Label>Permissions</Label>
                                    <PermissionSelector form={editForm} permissionGroups={permissionGroups} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={editForm.processing}>
                                    Update Role
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminAuthenticatedLayout>
    );
}

