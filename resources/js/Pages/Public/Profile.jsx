import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import {
    User,
    Mail,
    Phone,
    GraduationCap,
    Calendar,
    MapPin,
    IdCard,
    ArrowLeft
} from 'lucide-react';

export default function Profile({ user }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'Not provided';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <Head title={`${user.name} - Profile`} />

            {/* Header - Same as admin but public */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Home
                                </Button>
                            </Link>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                User Profile
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-8 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* User Header - EXACT same as admin */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center space-x-6">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={user.image ? `/storage/${user.image}` : undefined} alt={user.name} />
                                    <AvatarFallback className="text-2xl">
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
                                            {user.usertype ? user.usertype.charAt(0).toUpperCase() + user.usertype.slice(1) : 'Member'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Basic Information - EXACT same as admin */}
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

                    {/* Academic Information - EXACT same as admin */}
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
                                {user.designation?.name && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Designation</label>
                                        <p className="mt-1 font-medium">{user.designation.name}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skills - EXACT same as admin */}
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

                    {/* Address Information - EXACT same as admin */}
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
                </div>
            </div>
        </>
    );
}
