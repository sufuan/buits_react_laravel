import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
    CheckCircle,
    XCircle,
    User,
    Mail,
    Phone,
    GraduationCap,
    Calendar,
    MapPin,
    Search,
    Filter,
    Users,
    Eye,
    Download,
    RefreshCw,
    UserCheck,
    UserX,
    Clock,
    Building2,
    CreditCard,
    Heart,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function NewUserRequests({ pendingUsers = [] }) {
    const [processing, setProcessing] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [filterUserType, setFilterUserType] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Filter and search logic
    const filteredUsers = useMemo(() => {
        return pendingUsers.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                user.phone?.includes(searchTerm) ||
                                user.member_id?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesDepartment = filterDepartment === 'all' || user.department === filterDepartment;
            const matchesUserType = filterUserType === 'all' || user.usertype === filterUserType;

            return matchesSearch && matchesDepartment && matchesUserType;
        });
    }, [pendingUsers, searchTerm, filterDepartment, filterUserType]);

    // Get unique departments and user types for filters
    const departments = useMemo(() => {
        const depts = [...new Set(pendingUsers.map(user => user.department).filter(Boolean))];
        return depts.sort();
    }, [pendingUsers]);

    const userTypes = useMemo(() => {
        const types = [...new Set(pendingUsers.map(user => user.usertype).filter(Boolean))];
        return types.sort();
    }, [pendingUsers]);

    const handleRefresh = () => {
        setRefreshing(true);
        router.reload({ only: ['pendingUsers'] });
        setTimeout(() => setRefreshing(false), 1000);
    };

    const handleBulkApprove = async () => {
        if (selectedUsers.length === 0) {
            toast.error('Please select users to approve');
            return;
        }

        setProcessing(true);
        try {
            await router.post('/admin/users/bulk-approve', {
                user_ids: selectedUsers
            }, {
                onSuccess: () => {
                    toast.success(`${selectedUsers.length} users approved successfully!`);
                    setSelectedUsers([]);
                },
                onError: (errors) => {
                    toast.error('Failed to approve users: ' + (errors.message || 'Unknown error'));
                },
                onFinish: () => setProcessing(false)
            });
        } catch (error) {
            toast.error('An error occurred while approving users');
            setProcessing(false);
        }
    };

    const handleBulkReject = async () => {
        if (selectedUsers.length === 0) {
            toast.error('Please select users to reject');
            return;
        }

        setProcessing(true);
        try {
            await router.post('/admin/users/bulk-reject', {
                user_ids: selectedUsers
            }, {
                onSuccess: () => {
                    toast.success(`${selectedUsers.length} users rejected successfully!`);
                    setSelectedUsers([]);
                },
                onError: (errors) => {
                    toast.error('Failed to reject users: ' + (errors.message || 'Unknown error'));
                },
                onFinish: () => setProcessing(false)
            });
        } catch (error) {
            toast.error('An error occurred while rejecting users');
            setProcessing(false);
        }
    };

    const toggleUserSelection = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const toggleSelectAll = () => {
        setSelectedUsers(prev =>
            prev.length === filteredUsers.length
                ? []
                : filteredUsers.map(user => user.id)
        );
    };

    const handleApprove = async (userId) => {
        setProcessing(true);
        try {
            await router.post(`/admin/users/${userId}/approve`, {}, {
                onSuccess: () => {
                    toast.success('User approved successfully!');
                },
                onError: (errors) => {
                    toast.error('Failed to approve user: ' + (errors.message || 'Unknown error'));
                },
                onFinish: () => setProcessing(false)
            });
        } catch (error) {
            toast.error('An error occurred while approving the user');
            setProcessing(false);
        }
    };

    const handleReject = async (userId) => {
        setProcessing(true);
        try {
            await router.delete(`/admin/users/${userId}/reject`, {
                onSuccess: () => {
                    toast.success('User registration rejected successfully!');
                },
                onError: (errors) => {
                    toast.error('Failed to reject user: ' + (errors.message || 'Unknown error'));
                },
                onFinish: () => setProcessing(false)
            });
        } catch (error) {
            toast.error('An error occurred while rejecting the user');
            setProcessing(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <AdminAuthenticatedLayout>
            <Head title="New User Requests" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Header Section */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">User Approval Center</h1>
                                    <p className="text-sm text-gray-600">Review and approve new user registrations</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Badge variant="outline" className="text-sm px-3 py-1">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {filteredUsers.length} Pending
                                </Badge>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                    className="flex items-center space-x-2"
                                >
                                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                                    <span>Refresh</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Controls */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* Search and Filters */}
                            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search by name, email, phone, or member ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                                    <SelectTrigger className="w-full sm:w-48">
                                        <SelectValue placeholder="All Departments" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Departments</SelectItem>
                                        {departments.map(dept => (
                                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={filterUserType} onValueChange={setFilterUserType}>
                                    <SelectTrigger className="w-full sm:w-40">
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        {userTypes.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Bulk Actions */}
                            {selectedUsers.length > 0 && (
                                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <span className="text-sm font-medium text-blue-900">
                                        {selectedUsers.length} selected
                                    </span>
                                    <Button
                                        size="sm"
                                        onClick={handleBulkApprove}
                                        disabled={processing}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {processing ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : (
                                            <UserCheck className="h-4 w-4 mr-2" />
                                        )}
                                        Approve All
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={handleBulkReject}
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : (
                                            <UserX className="h-4 w-4 mr-2" />
                                        )}
                                        Reject All
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Select All Checkbox */}
                        {filteredUsers.length > 0 && (
                            <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
                                <Checkbox
                                    checked={selectedUsers.length === filteredUsers.length}
                                    onCheckedChange={toggleSelectAll}
                                />
                                <Label className="text-sm text-gray-600">
                                    Select all {filteredUsers.length} users
                                </Label>
                            </div>
                        )}
                    </div>

            <div className="py-4">
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
                                <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                                    <Users className="h-10 w-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {pendingUsers.length === 0 ? 'No pending requests' : 'No users match your filters'}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {pendingUsers.length === 0
                                        ? 'All user registration requests have been processed.'
                                        : 'Try adjusting your search or filter criteria.'}
                                </p>
                                {pendingUsers.length > 0 && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilterDepartment('all');
                                            setFilterUserType('all');
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredUsers.map((user) => (
                                <Card key={user.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:scale-[1.02] bg-white relative overflow-hidden">
                                    {/* Selection Checkbox */}
                                    <div className="absolute top-4 left-4 z-10">
                                        <Checkbox
                                            checked={selectedUsers.includes(user.id)}
                                            onCheckedChange={() => toggleUserSelection(user.id)}
                                            className="bg-white border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        />
                                    </div>

                                    <CardHeader className="pb-4 pl-12">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="relative">
                                                    <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
                                                        <AvatarImage src={user.image} alt={user.name} />
                                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                                                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                                        <Clock className="h-3 w-3 text-yellow-800" />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {user.name}
                                                    </CardTitle>
                                                    <CardDescription className="flex items-center mt-2 text-gray-600">
                                                        <Mail className="h-4 w-4 mr-2 text-blue-500" />
                                                        {user.email}
                                                    </CardDescription>
                                                    {user.member_id && (
                                                        <div className="flex items-center mt-1 text-sm text-gray-500">
                                                            <CreditCard className="h-4 w-4 mr-2" />
                                                            ID: {user.member_id}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end space-y-2">
                                                <Badge variant="outline" className="text-xs font-medium px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
                                                    {user.usertype || 'User'}
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowUserDetails(true);
                                                    }}
                                                    className="text-gray-500 hover:text-blue-600"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* User Details Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {user.phone && (
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className="p-2 bg-green-100 rounded-full">
                                                        <Phone className="h-4 w-4 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 font-medium">Phone</p>
                                                        <p className="text-sm font-semibold text-gray-900">{user.phone}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {user.department && (
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className="p-2 bg-blue-100 rounded-full">
                                                        <Building2 className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 font-medium">Department</p>
                                                        <p className="text-sm font-semibold text-gray-900">{user.department}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {user.session && (
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className="p-2 bg-purple-100 rounded-full">
                                                        <Calendar className="h-4 w-4 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 font-medium">Session</p>
                                                        <p className="text-sm font-semibold text-gray-900">{user.session}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {user.gender && (
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className="p-2 bg-pink-100 rounded-full">
                                                        <User className="h-4 w-4 text-pink-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 font-medium">Gender</p>
                                                        <p className="text-sm font-semibold text-gray-900 capitalize">{user.gender}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {user.blood_group && (
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className="p-2 bg-red-100 rounded-full">
                                                        <Heart className="h-4 w-4 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 font-medium">Blood Group</p>
                                                        <p className="text-sm font-semibold text-gray-900">{user.blood_group}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {user.class_roll && (
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className="p-2 bg-indigo-100 rounded-full">
                                                        <GraduationCap className="h-4 w-4 text-indigo-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 font-medium">Roll Number</p>
                                                        <p className="text-sm font-semibold text-gray-900">{user.class_roll}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Registration Date */}
                                        <div className="flex items-center justify-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                                            <div className="text-center">
                                                <p className="text-xs text-gray-500 font-medium">Registered</p>
                                                <p className="text-sm font-semibold text-gray-900">{formatDate(user.created_at)}</p>
                                            </div>
                                        </div>

                                        {/* Address Information */}
                                        {(user.current_address || user.permanent_address) && (
                                            <div className="space-y-3">
                                                <Separator />
                                                <div className="space-y-3">
                                                    {user.current_address && (
                                                        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                                                            <div className="p-2 bg-green-100 rounded-full">
                                                                <MapPin className="h-4 w-4 text-green-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-xs text-green-700 font-medium mb-1">Current Address</p>
                                                                <p className="text-sm text-gray-900">{user.current_address}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {user.permanent_address && (
                                                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                                            <div className="p-2 bg-blue-100 rounded-full">
                                                                <MapPin className="h-4 w-4 text-blue-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-xs text-blue-700 font-medium mb-1">Permanent Address</p>
                                                                <p className="text-sm text-gray-900">{user.permanent_address}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Transaction ID */}
                                        {user.transaction_id && (
                                            <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                                <div className="p-2 bg-yellow-100 rounded-full">
                                                    <CreditCard className="h-4 w-4 text-yellow-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-yellow-700 font-medium">Transaction ID</p>
                                                    <p className="text-sm font-mono text-gray-900">{user.transaction_id}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 pt-4">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={processing}
                                                        className="flex-1 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                                                    >
                                                        {processing ? (
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        ) : (
                                                            <XCircle className="h-4 w-4 mr-2" />
                                                        )}
                                                        Reject
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="sm:max-w-md">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="flex items-center gap-2">
                                                            <XCircle className="h-5 w-5 text-red-600" />
                                                            Reject Registration
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription className="text-left">
                                                            Are you sure you want to reject <strong>{user.name}'s</strong> registration?
                                                            <br /><br />
                                                            This action will:
                                                            <ul className="list-disc list-inside mt-2 space-y-1">
                                                                <li>Permanently delete their application</li>
                                                                <li>Send them a rejection notification</li>
                                                                <li>Cannot be undone</li>
                                                            </ul>
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleReject(user.id)}
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            <XCircle className="h-4 w-4 mr-2" />
                                                            Reject Application
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        disabled={processing}
                                                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
                                                    >
                                                        {processing ? (
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        ) : (
                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                        )}
                                                        Approve
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="sm:max-w-md">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="flex items-center gap-2">
                                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                                            Approve Registration
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription className="text-left">
                                                            Are you sure you want to approve <strong>{user.name}'s</strong> registration?
                                                            <br /><br />
                                                            This action will:
                                                            <ul className="list-disc list-inside mt-2 space-y-1">
                                                                <li>Create their user account</li>
                                                                <li>Set their status to approved</li>
                                                                <li>Send them a welcome email</li>
                                                                <li>Grant them access to the system</li>
                                                            </ul>
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleApprove(user.id)}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                            Approve User
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* User Details Modal */}
                <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={selectedUser?.image} alt={selectedUser?.name} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                        {selectedUser?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedUser?.name}</h3>
                                    <p className="text-sm text-gray-600">{selectedUser?.email}</p>
                                </div>
                            </DialogTitle>
                            <DialogDescription>
                                Complete user registration details and information
                            </DialogDescription>
                        </DialogHeader>

                        {selectedUser && (
                            <div className="space-y-6 py-4">
                                {/* Personal Information */}
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Personal Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <Label className="text-xs text-gray-500">Full Name</Label>
                                            <p className="font-medium">{selectedUser.name}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <Label className="text-xs text-gray-500">Email</Label>
                                            <p className="font-medium">{selectedUser.email}</p>
                                        </div>
                                        {selectedUser.phone && (
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <Label className="text-xs text-gray-500">Phone</Label>
                                                <p className="font-medium">{selectedUser.phone}</p>
                                            </div>
                                        )}
                                        {selectedUser.gender && (
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <Label className="text-xs text-gray-500">Gender</Label>
                                                <p className="font-medium capitalize">{selectedUser.gender}</p>
                                            </div>
                                        )}
                                        {selectedUser.date_of_birth && (
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <Label className="text-xs text-gray-500">Date of Birth</Label>
                                                <p className="font-medium">{formatDate(selectedUser.date_of_birth)}</p>
                                            </div>
                                        )}
                                        {selectedUser.blood_group && (
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <Label className="text-xs text-gray-500">Blood Group</Label>
                                                <p className="font-medium">{selectedUser.blood_group}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Academic Information */}
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4" />
                                        Academic Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedUser.member_id && (
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <Label className="text-xs text-blue-700">Member ID</Label>
                                                <p className="font-medium text-blue-900">{selectedUser.member_id}</p>
                                            </div>
                                        )}
                                        {selectedUser.department && (
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <Label className="text-xs text-blue-700">Department</Label>
                                                <p className="font-medium text-blue-900">{selectedUser.department}</p>
                                            </div>
                                        )}
                                        {selectedUser.session && (
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <Label className="text-xs text-blue-700">Session</Label>
                                                <p className="font-medium text-blue-900">{selectedUser.session}</p>
                                            </div>
                                        )}
                                        {selectedUser.class_roll && (
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <Label className="text-xs text-blue-700">Roll Number</Label>
                                                <p className="font-medium text-blue-900">{selectedUser.class_roll}</p>
                                            </div>
                                        )}
                                        {selectedUser.usertype && (
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <Label className="text-xs text-blue-700">User Type</Label>
                                                <p className="font-medium text-blue-900 capitalize">{selectedUser.usertype}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Address Information */}
                                {(selectedUser.current_address || selectedUser.permanent_address) && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            Address Information
                                        </h4>
                                        <div className="space-y-3">
                                            {selectedUser.current_address && (
                                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                                    <Label className="text-xs text-green-700 font-medium">Current Address</Label>
                                                    <p className="text-green-900 mt-1">{selectedUser.current_address}</p>
                                                </div>
                                            )}
                                            {selectedUser.permanent_address && (
                                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                    <Label className="text-xs text-blue-700 font-medium">Permanent Address</Label>
                                                    <p className="text-blue-900 mt-1">{selectedUser.permanent_address}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Registration Details */}
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Registration Details
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-3 bg-yellow-50 rounded-lg">
                                            <Label className="text-xs text-yellow-700">Registration Date</Label>
                                            <p className="font-medium text-yellow-900">{formatDate(selectedUser.created_at)}</p>
                                        </div>
                                        {selectedUser.transaction_id && (
                                            <div className="p-3 bg-yellow-50 rounded-lg">
                                                <Label className="text-xs text-yellow-700">Transaction ID</Label>
                                                <p className="font-medium text-yellow-900 font-mono">{selectedUser.transaction_id}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleReject(selectedUser.id)}
                                        disabled={processing}
                                        className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                    </Button>
                                    <Button
                                        onClick={() => handleApprove(selectedUser.id)}
                                        disabled={processing}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Approve
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
