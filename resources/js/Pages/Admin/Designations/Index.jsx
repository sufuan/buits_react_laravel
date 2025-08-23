import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Eye, Trash2, Building2 } from 'lucide-react';

export default function Index({ designations }) {
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = (designation) => {
        router.delete(route('admin.admin.designations.destroy', designation.id), {
            onSuccess: () => setDeletingId(null),
            onError: () => setDeletingId(null)
        });
    };

    // Group designations by hierarchy
    const groupedDesignations = {
        1: designations.filter(d => parseInt(d.level) === 1), // President
        2: designations.filter(d => parseInt(d.level) === 2), // Vice Presidents  
        3: designations.filter(d => parseInt(d.level) === 3), // Secretaries
    };

    const getLevelBadgeVariant = (level) => {
        const levelNum = parseInt(level);
        switch(levelNum) {
            case 1: return 'default'; // Executive Leadership
            case 2: return 'secondary'; // Administrative Leadership
            case 3: return 'outline'; // Department Secretaries
            default: return 'outline';
        }
    };

    const getCategoryName = (level) => {
        const levelNum = parseInt(level);
        switch(levelNum) {
            case 1: return 'Executive Leadership';
            case 2: return 'Administrative Leadership';
            case 3: return 'Department Secretary';
            default: return 'Unknown';
        }
    };

    const renderDesignationRow = (designation, indent = 0) => (
        <TableRow key={designation.id} className={indent > 0 ? 'bg-muted/30' : ''}>
            <TableCell className="font-medium">
                <div style={{ paddingLeft: `${indent * 20}px` }} className="flex items-center">
                    {indent > 0 && <span className="text-muted-foreground mr-2">└─</span>}
                    <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    {designation.name}
                </div>
            </TableCell>
            <TableCell>
                <Badge variant={getLevelBadgeVariant(designation.level)}>
                    {getCategoryName(designation.level)}
                </Badge>
            </TableCell>
            <TableCell>
                <Badge variant={designation.is_active ? 'default' : 'destructive'}>
                    {designation.is_active ? 'Active' : 'Inactive'}
                </Badge>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href={route('admin.admin.designations.show', designation.id)}>
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                        <Link href={route('admin.admin.designations.edit', designation.id)}>
                            <Edit className="h-4 w-4" />
                        </Link>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Designation</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete "{designation.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={() => handleDelete(designation)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </TableCell>
        </TableRow>
    );

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">IT Society Executive Designations</h2>
                    <Button asChild>
                        <Link href={route('admin.admin.designations.create')}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Designation
                        </Link>
                    </Button>
                </div>
            }
        >
            <Head title="Designations Management" />

            <div className="space-y-6">
                {/* Organizational Structure Overview */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Executive Leadership</CardTitle>
                            <CardDescription>President & Vice Presidents</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">
                                {groupedDesignations[1]?.length || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">Top-level executives</p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Administrative Leadership</CardTitle>
                            <CardDescription>General Secretaries</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">
                                {groupedDesignations[2]?.length || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">Administrative coordinators</p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Department Secretaries</CardTitle>
                            <CardDescription>All Departments</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">
                                {groupedDesignations[3]?.length || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">Department operations</p>
                        </CardContent>
                    </Card>
                </div>

                {/* IT Society Structure Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            IT Society Structure
                        </CardTitle>
                        <CardDescription>
                            University club organizational hierarchy and positions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 md:grid-cols-3">
                            <div className="space-y-2">
                                <Badge variant="default">Executive Leadership</Badge>
                                <p className="text-sm font-medium">President & Vice Presidents</p>
                                <p className="text-xs text-muted-foreground">Strategic leadership and oversight</p>
                            </div>
                            <div className="space-y-2">
                                <Badge variant="secondary">Administrative Leadership</Badge>
                                <p className="text-sm font-medium">General Secretaries</p>
                                <p className="text-xs text-muted-foreground">Administrative coordination</p>
                            </div>
                            <div className="space-y-2">
                                <Badge variant="outline">Department Secretaries</Badge>
                                <p className="text-sm font-medium">All Department Heads</p>
                                <p className="text-xs text-muted-foreground">Departmental operations & joint positions</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Designations Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Designations</CardTitle>
                        <CardDescription>
                            Manage and organize executive positions within the IT Society
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {designations.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Designation Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* Level 1: President */}
                                    {groupedDesignations[1]?.map(designation => renderDesignationRow(designation, 0))}
                                    
                                    {/* Level 2: Vice Presidents */}
                                    {groupedDesignations[2]?.map(designation => renderDesignationRow(designation, 1))}
                                    
                                    {/* Level 3: Secretaries */}
                                    {groupedDesignations[3]?.map(designation => renderDesignationRow(designation, 2))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-8">
                                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold">No designations found</h3>
                                <p className="text-muted-foreground mb-4">Get started by creating your first designation</p>
                                <Button asChild>
                                    <Link href={route('admin.admin.designations.create')}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create First Designation
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
