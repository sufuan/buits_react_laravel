import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
    User, 
    Mail, 
    Phone, 
    GraduationCap, 
    Calendar, 
    MapPin,
    IdCard,
    ArrowLeft,
    Edit,
    Trash2,
    UserX
} from 'lucide-react';

export default function Show({ user }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'Not provided';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            router.delete(route('admin.users.destroy', user.id));
        }
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.users.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Users
                            </Button>
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            User Details
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={route('admin.users.edit', user.id)}>
                            <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </Link>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleDelete}
                            className="text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title={`${user.name} - User Details`} />

            <div className="py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* User Header */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center space-x-6">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={user.image} alt={user.name} />
                                    <AvatarFallback className="text-xl">
                                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                                    <CardDescription className="flex items-center gap-2 text-base mt-1">
                                        <Mail className="h-4 w-4" />
                                        {user.email}
                                    </CardDescription>
                                    {user.member_id && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <IdCard className="h-4 w-4 text-blue-500" />
                                            <span className="text-sm font-mono text-blue-600 font-medium">
                                                Member ID: {user.member_id}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 mt-3">
                                        <Badge variant="outline">
                                            Joined {formatDate(user.created_at)}
                                        </Badge>
                                        <Badge variant="secondary">
                                            {user.usertype || 'User'}
                                        </Badge>
                                        <Badge variant={user.is_approved ? "default" : "destructive"}>
                                            {user.is_approved ? 'Approved' : 'Pending'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-600" />
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Phone Number</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <span>{user.phone || 'Not provided'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Gender</label>
                                        <p className="mt-1 capitalize">{user.gender || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                                        <p className="mt-1">{formatDate(user.date_of_birth)}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Blood Group</label>
                                        <p className="mt-1">{user.blood_group || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Father's Name</label>
                                        <p className="mt-1">{user.father_name || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Mother's Name</label>
                                        <p className="mt-1">{user.mother_name || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Academic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-green-600" />
                                Academic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Department</label>
                                    <p className="mt-1 font-medium">{user.department || 'Not provided'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Session</label>
                                    <p className="mt-1 font-medium">{user.session || 'Not provided'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Class Roll</label>
                                    <p className="mt-1">{user.class_roll || 'Not provided'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                                    <p className="mt-1 font-mono text-sm">{user.transaction_id || 'Not provided'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skills */}
                    {user.skills && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-purple-600" />
                                    Skills & Interests
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed">{user.skills}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Address Information */}
                    {(user.current_address || user.permanent_address) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-red-600" />
                                    Address Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {user.current_address && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Current Address</label>
                                        <p className="mt-1 text-gray-700 leading-relaxed">{user.current_address}</p>
                                    </div>
                                )}
                                {user.permanent_address && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Permanent Address</label>
                                        <p className="mt-1 text-gray-700 leading-relaxed">{user.permanent_address}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* System Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-gray-500">System Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium">Created:</span> {formatDate(user.created_at)}
                                </div>
                                <div>
                                    <span className="font-medium">Last Updated:</span> {formatDate(user.updated_at)}
                                </div>
                                <div>
                                    <span className="font-medium">User ID:</span> {user.id}
                                </div>
                                <div>
                                    <span className="font-medium">Status:</span> 
                                    <Badge variant={user.is_approved ? "default" : "destructive"} className="ml-2">
                                        {user.is_approved ? 'Approved' : 'Pending'}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
