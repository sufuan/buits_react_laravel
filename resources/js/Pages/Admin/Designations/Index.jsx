import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
    Plus, 
    Edit, 
    Eye, 
    Trash2, 
    Building2, 
    Users, 
    Search,
    Filter,
    Crown,
    UserCog,
    Award,
    Mail,
    Phone,
    Building
} from 'lucide-react';

export default function Index({ designations, executiveMembers = [] }) {
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');

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

    // Filter members for directory
    const filteredMembers = executiveMembers.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (member.designation && member.designation.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesRole = roleFilter === 'all' || member.usertype === roleFilter;
        const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
        
        return matchesSearch && matchesRole && matchesDepartment;
    });

    // Get unique departments and roles
    const departments = [...new Set(executiveMembers.map(m => m.department).filter(Boolean))];
    const roles = [...new Set(executiveMembers.map(m => m.usertype).filter(Boolean))];

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

                {/* Member Directory */}
                <div className="space-y-6">
                        {/* Search and Filter Controls */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Search & Filter Members</CardTitle>
                                <CardDescription>Find members by name, email, designation, or department</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Search by name, email, or designation..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    
                                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Filter by Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Roles</SelectItem>
                                            {roles.map(role => (
                                                <SelectItem key={role} value={role}>{role}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    
                                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Filter by Department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Departments</SelectItem>
                                            {departments.map(dept => (
                                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Member Directory */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Member Directory</CardTitle>
                                        <CardDescription>
                                            {filteredMembers.length} of {executiveMembers.length} members
                                        </CardDescription>
                                    </div>
                                    <Badge variant="outline" className="text-sm">
                                        {filteredMembers.length} Results
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="divide-y">
                                    {filteredMembers.length > 0 ? (
                                        filteredMembers.map(member => (
                                            <div key={member.id} className="py-4 hover:bg-gray-50 transition-colors rounded-lg px-2">
                                                <div className="flex items-center space-x-4">
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarImage src={member.image} alt={member.name} />
                                                        <AvatarFallback className="bg-blue-100 text-blue-700">
                                                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                                                                {member.name}
                                                            </h4>
                                                            <Badge variant="default" className="text-xs">
                                                                {member.usertype}
                                                            </Badge>
                                                        </div>
                                                        
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                                <Mail className="h-3 w-3" />
                                                                {member.email}
                                                            </p>
                                                            
                                                            {member.designation && (
                                                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                                                    <Award className="h-3 w-3" />
                                                                    {member.designation.name}
                                                                    <Badge variant={getLevelBadgeVariant(member.designation.level)} className="text-xs ml-2">
                                                                        Level {member.designation.level}
                                                                    </Badge>
                                                                </p>
                                                            )}
                                                            
                                                            {member.department && (
                                                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                                                    <Building className="h-3 w-3" />
                                                                    {member.department}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={route('admin.admin.users.show', member.id)}>
                                                                <Eye className="h-3 w-3 mr-1" />
                                                                View
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-gray-500">
                                            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p className="text-lg mb-2">No members found</p>
                                            <p className="text-sm">Try adjusting your search or filter criteria</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                </div>
        </AdminAuthenticatedLayout>
    );
}
