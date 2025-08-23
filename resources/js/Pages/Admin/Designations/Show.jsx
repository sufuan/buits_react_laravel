import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Users, Calendar, Building2 } from 'lucide-react';

export default function Show({ designation, children, assignedUsers = [] }) {
    const getLevelBadgeVariant = (level) => {
        switch(level) {
            case 1: return 'default'; // President
            case 2: return 'secondary'; // Vice Presidents
            case 3: return 'outline'; // Secretaries
            default: return 'outline';
        }
    };

    const getLevelName = (level) => {
        switch(level) {
            case 1: return 'President';
            case 2: return 'Vice President';
            case 3: return 'Secretary';
            default: return 'Unknown';
        }
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="sm">
                        <Link href={route('admin.admin.designations.index')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Designations
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{designation.name}</h2>
                        <p className="text-muted-foreground">
                            Level {designation.level} - {getLevelName(designation.level)}
                        </p>
                    </div>
                    <div className="ml-auto">
                        <Button asChild>
                            <Link href={route('admin.admin.designations.edit', designation.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Designation
                            </Link>
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title={designation.name} />

            <div className="space-y-6">
                {/* Overview Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Level</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge variant={getLevelBadgeVariant(designation.level)} className="text-lg">
                                Level {designation.level}
                            </Badge>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Sort Order</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{designation.sort_order}</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge variant={designation.is_active ? 'default' : 'destructive'}>
                                {designation.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Assigned Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                {assignedUsers.length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Designation Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Designation Information
                        </CardTitle>
                        <CardDescription>
                            Detailed information about this executive position
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div>
                                    <p className="font-medium text-muted-foreground">Full Name</p>
                                    <p className="text-lg">{designation.name}</p>
                                </div>
                                
                                <div>
                                    <p className="font-medium text-muted-foreground">Hierarchy Level</p>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={getLevelBadgeVariant(designation.level)}>
                                            Level {designation.level}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                            ({getLevelName(designation.level)})
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <p className="font-medium text-muted-foreground">Parent Position</p>
                                    <p>{designation.parent ? designation.parent.name : 'None (Top Level)'}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="font-medium text-muted-foreground">Display Order</p>
                                    <p className="text-lg">{designation.sort_order}</p>
                                </div>

                                <div>
                                    <p className="font-medium text-muted-foreground">Created</p>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(designation.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div>
                                    <p className="font-medium text-muted-foreground">Last Updated</p>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(designation.updated_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sub-positions */}
                {children && children.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Sub-positions</CardTitle>
                            <CardDescription>
                                Positions that report to this designation
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {children.map((child) => (
                                    <div key={child.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">{child.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Level {child.level} • Sort Order: {child.sort_order}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={child.is_active ? 'default' : 'destructive'} className="text-xs">
                                                {child.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={route('admin.admin.designations.show', child.id)}>
                                                    View
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Assigned Users */}
                {assignedUsers.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Currently Assigned Users
                            </CardTitle>
                            <CardDescription>
                                Users who currently hold this executive position
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {assignedUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium">
                                                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary">
                                            {user.usertype}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
