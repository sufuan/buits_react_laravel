import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    User, 
    Mail, 
    Phone, 
    GraduationCap, 
    Calendar, 
    MapPin, 
    ArrowLeft,
    Save,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

export default function Edit({ user, errors, departments = [] }) {
    const { data, setData, put, processing, reset } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        session: user.session || '',
        gender: user.gender || '',
        date_of_birth: user.date_of_birth || '',
        blood_group: user.blood_group || '',
        class_roll: user.class_roll || '',
        father_name: user.father_name || '',
        mother_name: user.mother_name || '',
        current_address: user.current_address || '',
        permanent_address: user.permanent_address || '',
        skills: user.skills || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const sessions = [];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 10; year--) {
        sessions.push(`${year}-${year + 1}`);
    }

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
                            Edit User: {user.name}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={route('admin.users.show', user.id)}>
                            <Button variant="outline" size="sm">
                                View Profile
                            </Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Edit User: ${user.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Basic Information
                                </CardTitle>
                                <CardDescription>
                                    Update the user's basic information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                                                required
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-red-500 text-sm">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                                                required
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="text-red-500 text-sm">{errors.phone}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Academic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5" />
                                    Academic Information
                                </CardTitle>
                                <CardDescription>
                                    Update academic and educational details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="department">Department *</Label>
                                        <Select value={data.department} onValueChange={(value) => setData('department', value)}>
                                            <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments && departments.length > 0 ? (
                                                    departments.map((dept) => (
                                                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="" disabled>No departments available</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {errors.department && (
                                            <p className="text-red-500 text-sm">{errors.department}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="session">Session *</Label>
                                        <Select value={data.session} onValueChange={(value) => setData('session', value)}>
                                            <SelectTrigger className={errors.session ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select session" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {sessions.map((session) => (
                                                    <SelectItem key={session} value={session}>{session}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.session && (
                                            <p className="text-red-500 text-sm">{errors.session}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="class_roll">Class Roll *</Label>
                                        <Input
                                            id="class_roll"
                                            value={data.class_roll}
                                            onChange={(e) => setData('class_roll', e.target.value)}
                                            className={errors.class_roll ? 'border-red-500' : ''}
                                            required
                                        />
                                        {errors.class_roll && (
                                            <p className="text-red-500 text-sm">{errors.class_roll}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Personal Information
                                </CardTitle>
                                <CardDescription>
                                    Update personal and family details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Gender *</Label>
                                        <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                            <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.gender && (
                                            <p className="text-red-500 text-sm">{errors.gender}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date_of_birth">Date of Birth</Label>
                                        <Input
                                            id="date_of_birth"
                                            type="date"
                                            value={data.date_of_birth}
                                            onChange={(e) => setData('date_of_birth', e.target.value)}
                                            className={errors.date_of_birth ? 'border-red-500' : ''}
                                        />
                                        {errors.date_of_birth && (
                                            <p className="text-red-500 text-sm">{errors.date_of_birth}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="blood_group">Blood Group</Label>
                                        <Select value={data.blood_group} onValueChange={(value) => setData('blood_group', value)}>
                                            <SelectTrigger className={errors.blood_group ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select blood group" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bloodGroups.map((group) => (
                                                    <SelectItem key={group} value={group}>{group}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.blood_group && (
                                            <p className="text-red-500 text-sm">{errors.blood_group}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="father_name">Father's Name</Label>
                                        <Input
                                            id="father_name"
                                            value={data.father_name}
                                            onChange={(e) => setData('father_name', e.target.value)}
                                            className={errors.father_name ? 'border-red-500' : ''}
                                        />
                                        {errors.father_name && (
                                            <p className="text-red-500 text-sm">{errors.father_name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mother_name">Mother's Name</Label>
                                        <Input
                                            id="mother_name"
                                            value={data.mother_name}
                                            onChange={(e) => setData('mother_name', e.target.value)}
                                            className={errors.mother_name ? 'border-red-500' : ''}
                                        />
                                        {errors.mother_name && (
                                            <p className="text-red-500 text-sm">{errors.mother_name}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Address Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Address Information
                                </CardTitle>
                                <CardDescription>
                                    Update address and location details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="current_address">Current Address</Label>
                                        <Textarea
                                            id="current_address"
                                            value={data.current_address}
                                            onChange={(e) => setData('current_address', e.target.value)}
                                            className={errors.current_address ? 'border-red-500' : ''}
                                            rows={3}
                                        />
                                        {errors.current_address && (
                                            <p className="text-red-500 text-sm">{errors.current_address}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="permanent_address">Permanent Address</Label>
                                        <Textarea
                                            id="permanent_address"
                                            value={data.permanent_address}
                                            onChange={(e) => setData('permanent_address', e.target.value)}
                                            className={errors.permanent_address ? 'border-red-500' : ''}
                                            rows={3}
                                        />
                                        {errors.permanent_address && (
                                            <p className="text-red-500 text-sm">{errors.permanent_address}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Information</CardTitle>
                                <CardDescription>
                                    Skills and other details
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label htmlFor="skills">Skills & Interests</Label>
                                    <Textarea
                                        id="skills"
                                        value={data.skills}
                                        onChange={(e) => setData('skills', e.target.value)}
                                        className={errors.skills ? 'border-red-500' : ''}
                                        placeholder="e.g., Web Development, Programming, Graphics Design..."
                                        rows={4}
                                    />
                                    {errors.skills && (
                                        <p className="text-red-500 text-sm">{errors.skills}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Form Actions */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        * Required fields
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Link href={route('admin.users.show', user.id)}>
                                            <Button type="button" variant="outline">
                                                Cancel
                                            </Button>
                                        </Link>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Update User
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
