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
    Eye,
    EyeOff,
    UserPlus,
    ArrowLeft,
    Lock,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

export default function CreateUser({ errors }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    
    const { data, setData, post, processing, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        department: '',
        session: '',
        gender: '',
        date_of_birth: '',
        blood_group: '',
        class_roll: '',
        father_name: '',
        mother_name: '',
        current_address: '',
        permanent_address: '',
        skills: '',
        usertype: 'user',
    });

    const departments = [
        "Marketing", "Law", "Mathematics", "Physics", "History & Civilization",
        "Soil & Environmental Sciences", "Economics", "Geology & Mining",
        "Management Studies", "Statistics", "Chemistry", "Coastal Studies and Disaster Management",
        "Accounting & Information Systems", "Computer Science and Engineering", "Sociology",
        "Botany", "Public Administration", "Philosophy", "Political Science",
        "Biochemistry and Biotechnology", "Finance and Banking", "Mass Communication and Journalism",
        "English", "Bangla"
    ];

    const sessions = [
        "2020-2021", "2021-2022", "2022-2023", "2023-2024", "2024-2025", "2025-2026"
    ];

    const bloodGroups = [
        "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
    ];

    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/)) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
        return strength;
    };

    const getPasswordStrengthColor = (strength) => {
        switch (strength) {
            case 0:
            case 1:
                return 'bg-red-500';
            case 2:
                return 'bg-orange-500';
            case 3:
                return 'bg-yellow-500';
            case 4:
                return 'bg-blue-500';
            case 5:
                return 'bg-green-500';
            default:
                return 'bg-gray-200';
        }
    };

    const getPasswordStrengthText = (strength) => {
        switch (strength) {
            case 0:
            case 1:
                return 'Very Weak';
            case 2:
                return 'Weak';
            case 3:
                return 'Fair';
            case 4:
                return 'Good';
            case 5:
                return 'Strong';
            default:
                return '';
        }
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic client-side validation
        const requiredFields = ['name', 'email', 'password', 'password_confirmation', 'phone', 'department', 'session', 'gender'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            // Focus on the first missing field
            const firstMissingField = document.getElementById(missingFields[0]);
            if (firstMissingField) {
                firstMissingField.focus();
            }
            return;
        }
        
        // Check if passwords match
        if (data.password !== data.password_confirmation) {
            document.getElementById('password_confirmation').focus();
            return;
        }
        
        post(route('admin.users.store'), {
            onSuccess: () => {
                reset();
            },
            onError: (errors) => {
                // Focus on the first field with an error
                const firstErrorField = Object.keys(errors)[0];
                if (firstErrorField) {
                    const element = document.getElementById(firstErrorField);
                    if (element) {
                        element.focus();
                    }
                }
            }
        });
    };

    const handleFieldChange = (field, value) => {
        setData(field, value);
        if (field === 'password') {
            setPasswordStrength(checkPasswordStrength(value));
        }
        if (errors[field]) {
            clearErrors(field);
        }
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/users/all">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Users
                            </Button>
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Add New User
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Add User" />

            <div className="py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Success/Error Messages */}
                    {Object.keys(errors).length > 0 && (
                        <Alert className="mb-6 border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800">
                                Please fix the following errors:
                                <ul className="mt-2 list-disc list-inside space-y-1">
                                    {Object.values(errors).map((error, index) => (
                                        <li key={index} className="text-sm">{error}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-blue-600" />
                                    Basic Information
                                </CardTitle>
                                <CardDescription>
                                    Enter the basic details for the new user
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => handleFieldChange('name', e.target.value)}
                                            className={errors.name ? 'border-red-500' : ''}
                                            placeholder="Enter full name"
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600">{errors.name}</p>
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
                                                onChange={(e) => handleFieldChange('email', e.target.value)}
                                                className={`pl-10 pr-10 ${errors.email ? 'border-red-500' : 
                                                    data.email && isValidEmail(data.email) ? 'border-green-500' : ''}`}
                                                placeholder="Enter email address"
                                            />
                                            {data.email && (
                                                <div className="absolute right-3 top-3">
                                                    {isValidEmail(data.email) ? (
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {errors.email && (
                                            <p className="text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password *</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                value={data.password}
                                                onChange={(e) => handleFieldChange('password', e.target.value)}
                                                className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                                                placeholder="Enter password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {data.password && (
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                                                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-600">
                                                        {getPasswordStrengthText(passwordStrength)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    Use 8+ characters with mix of letters, numbers & symbols
                                                </p>
                                            </div>
                                        )}
                                        {errors.password && (
                                            <p className="text-sm text-red-600">{errors.password}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirm Password *</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="password_confirmation"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={data.password_confirmation}
                                                onChange={(e) => handleFieldChange('password_confirmation', e.target.value)}
                                                className={`pl-10 pr-10 ${errors.password_confirmation ? 'border-red-500' : 
                                                    data.password_confirmation && data.password && data.password_confirmation === data.password ? 'border-green-500' : ''}`}
                                                placeholder="Confirm password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {data.password_confirmation && data.password && (
                                            <div className="flex items-center gap-2 text-sm">
                                                {data.password_confirmation === data.password ? (
                                                    <>
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                        <span className="text-green-600">Passwords match</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                                        <span className="text-red-600">Passwords do not match</span>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                        {errors.password_confirmation && (
                                            <p className="text-sm text-red-600">{errors.password_confirmation}</p>
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
                                                onChange={(e) => handleFieldChange('phone', e.target.value)}
                                                className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                                                placeholder="Enter phone number"
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="text-sm text-red-600">{errors.phone}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Gender *</Label>
                                        <Select value={data.gender} onValueChange={(value) => handleFieldChange('gender', value)}>
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
                                            <p className="text-sm text-red-600">{errors.gender}</p>
                                        )}
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
                                <CardDescription>
                                    Enter academic details for the user
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="department">Department *</Label>
                                        <Select value={data.department} onValueChange={(value) => handleFieldChange('department', value)}>
                                            <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map(dept => (
                                                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.department && (
                                            <p className="text-sm text-red-600">{errors.department}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="session">Session *</Label>
                                        <Select value={data.session} onValueChange={(value) => handleFieldChange('session', value)}>
                                            <SelectTrigger className={errors.session ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select session" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {sessions.map(session => (
                                                    <SelectItem key={session} value={session}>{session}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.session && (
                                            <p className="text-sm text-red-600">{errors.session}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="class_roll">Class Roll</Label>
                                        <Input
                                            id="class_roll"
                                            type="text"
                                            value={data.class_roll}
                                            onChange={(e) => handleFieldChange('class_roll', e.target.value)}
                                            className={errors.class_roll ? 'border-red-500' : ''}
                                            placeholder="Enter class roll"
                                        />
                                        {errors.class_roll && (
                                            <p className="text-sm text-red-600">{errors.class_roll}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="usertype">User Type</Label>
                                        <Select value={data.usertype} onValueChange={(value) => handleFieldChange('usertype', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select user type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="user">User</SelectItem>
                                                <SelectItem value="student">Student</SelectItem>
                                                <SelectItem value="alumni">Alumni</SelectItem>
                                                <SelectItem value="faculty">Faculty</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-purple-600" />
                                    Personal Information
                                </CardTitle>
                                <CardDescription>
                                    Additional personal details (optional)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="date_of_birth">Date of Birth</Label>
                                        <Input
                                            id="date_of_birth"
                                            type="date"
                                            value={data.date_of_birth}
                                            onChange={(e) => handleFieldChange('date_of_birth', e.target.value)}
                                            className={errors.date_of_birth ? 'border-red-500' : ''}
                                        />
                                        {errors.date_of_birth && (
                                            <p className="text-sm text-red-600">{errors.date_of_birth}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="blood_group">Blood Group</Label>
                                        <Select value={data.blood_group} onValueChange={(value) => handleFieldChange('blood_group', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select blood group" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bloodGroups.map(group => (
                                                    <SelectItem key={group} value={group}>{group}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="father_name">Father's Name</Label>
                                        <Input
                                            id="father_name"
                                            type="text"
                                            value={data.father_name}
                                            onChange={(e) => handleFieldChange('father_name', e.target.value)}
                                            placeholder="Enter father's name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mother_name">Mother's Name</Label>
                                        <Input
                                            id="mother_name"
                                            type="text"
                                            value={data.mother_name}
                                            onChange={(e) => handleFieldChange('mother_name', e.target.value)}
                                            placeholder="Enter mother's name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="skills">Skills & Interests</Label>
                                    <Textarea
                                        id="skills"
                                        value={data.skills}
                                        onChange={(e) => handleFieldChange('skills', e.target.value)}
                                        placeholder="List skills, interests, or specializations..."
                                        className="min-h-[100px]"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Address Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-red-600" />
                                    Address Information
                                </CardTitle>
                                <CardDescription>
                                    Current and permanent address details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="current_address">Current Address</Label>
                                    <Textarea
                                        id="current_address"
                                        value={data.current_address}
                                        onChange={(e) => handleFieldChange('current_address', e.target.value)}
                                        placeholder="Enter current address..."
                                        className="min-h-[80px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="permanent_address">Permanent Address</Label>
                                    <Textarea
                                        id="permanent_address"
                                        value={data.permanent_address}
                                        onChange={(e) => handleFieldChange('permanent_address', e.target.value)}
                                        placeholder="Enter permanent address..."
                                        className="min-h-[80px]"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Form Actions */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        User will be created with login credentials
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Link href="/admin/users/all">
                                            <Button type="button" variant="outline">
                                                Cancel
                                            </Button>
                                        </Link>
                                        <Button type="submit" disabled={processing} className="min-w-[120px]">
                                            {processing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus className="h-4 w-4 mr-2" />
                                                    Create User
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
