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
    Loader2,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

const paymentMethodColors = {
    bkash: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200', dot: 'bg-pink-500' },
    nagad: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200', dot: 'bg-orange-500' },
    rocket: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', dot: 'bg-purple-500' },
};

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

    const getPaymentBadge = (method) => {
        const colors = paymentMethodColors[method?.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', dot: 'bg-gray-500' };
        return colors;
    };

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

    return (
        <AdminAuthenticatedLayout pendingUsersCount={filteredUsers.length}>
            <Head title="New User Requests" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                .approval-page { font-family: 'Inter', sans-serif; }
                .glass-card {
                    background: #ffffff;
                    border: 1px solid rgba(226, 232, 240, 0.8);
                }
                .user-card {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid rgba(226, 232, 240, 0.8);
                }
                .user-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.12);
                    border-color: rgba(99, 102, 241, 0.3);
                }
                .user-card.selected {
                    border-color: rgba(99, 102, 241, 0.6);
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                }
                .stat-card {
                    background: linear-gradient(135deg, var(--from), var(--to));
                }
                .approve-btn {
                    background: linear-gradient(135deg, #059669, #10b981);
                    transition: all 0.2s;
                }
                .approve-btn:hover {
                    background: linear-gradient(135deg, #047857, #059669);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
                }
                .reject-btn {
                    transition: all 0.2s;
                }
                .reject-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
                }
                .search-input:focus {
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
                }
                .pulse-dot {
                    animation: pulse-glow 2s ease-in-out infinite;
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.1); }
                }
                .avatar-ring {
                    box-shadow: 0 0 0 3px white, 0 0 0 5px rgba(99, 102, 241, 0.2);
                }
            `}</style>

            <div className="approval-page min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #fafafa 40%, #f5f0ff 100%)' }}>

                {/* ── Hero Header ── */}
                <div className="relative overflow-hidden bg-white border-b border-gray-200 shadow-sm">
                    {/* Decorative blobs */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 70%)', width: '600px', height: '600px', top: '-200px', right: '-100px' }} className="absolute rounded-full" />
                        <div style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)', width: '400px', height: '400px', bottom: '-150px', left: '-50px' }} className="absolute rounded-full" />
                    </div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 shadow-sm">
                                    <ShieldCheck className="h-8 w-8 text-indigo-600" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Approval Center</h1>
                                    </div>
                                    <p className="text-gray-500 text-sm font-medium">Review, verify and approve new member registrations</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-amber-500 pulse-dot" />
                                    <span className="text-amber-800 font-semibold text-sm">{filteredUsers.length} Pending</span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                    className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-white shadow-sm"
                                >
                                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                            {[
                                { label: 'Total Pending', value: pendingUsers.length, icon: Clock, bg: 'bg-yellow-50/80', border: 'border-yellow-100', textLabel: 'text-yellow-700', textVal: 'text-yellow-900', iconColor: 'text-yellow-600' },
                                { label: 'Departments', value: departments.length, icon: Building2, bg: 'bg-blue-50/80', border: 'border-blue-100', textLabel: 'text-blue-700', textVal: 'text-blue-900', iconColor: 'text-blue-600' },
                                { label: 'User Types', value: userTypes.length, icon: Users, bg: 'bg-emerald-50/80', border: 'border-emerald-100', textLabel: 'text-emerald-700', textVal: 'text-emerald-900', iconColor: 'text-emerald-600' },
                                { label: 'Selected', value: selectedUsers.length, icon: CheckCircle, bg: 'bg-purple-50/80', border: 'border-purple-100', textLabel: 'text-purple-700', textVal: 'text-purple-900', iconColor: 'text-purple-600' },
                            ].map((stat) => (
                                <div key={stat.label} className={`px-4 py-3 rounded-xl border ${stat.bg} ${stat.border} shadow-sm`}>
                                    <div className="flex items-center gap-2">
                                        <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                                        <p className={`${stat.textLabel} text-xs font-semibold`}>{stat.label}</p>
                                    </div>
                                    <p className={`${stat.textVal} text-2xl font-bold mt-1`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Controls Section ── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="glass-card rounded-2xl shadow-lg p-5 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                            {/* Search */}
                            <div className="relative flex-1 max-w-lg">
                                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-400" />
                                <Input
                                    placeholder="Search by name, email, phone, or member ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 search-input border-gray-200 focus:border-indigo-400 rounded-xl h-10 bg-gray-50/60"
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap gap-3">
                                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                                    <SelectTrigger className="w-48 border-gray-200 rounded-xl h-10 bg-gray-50/60">
                                        <Filter className="h-3.5 w-3.5 mr-2 text-indigo-400" />
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
                                    <SelectTrigger className="w-40 border-gray-200 rounded-xl h-10 bg-gray-50/60">
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
                        </div>

                        {/* Bulk Actions + Select All */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
                            {filteredUsers.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                        onCheckedChange={toggleSelectAll}
                                        className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                    />
                                    <Label className="text-sm text-gray-600 cursor-pointer">
                                        Select all <span className="font-semibold text-gray-800">{filteredUsers.length}</span> users
                                    </Label>
                                </div>
                            )}
                            {selectedUsers.length > 0 && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-100">
                                    <span className="text-sm font-semibold text-indigo-700">{selectedUsers.length} selected</span>
                                    <div className="w-px h-4 bg-indigo-200 mx-1" />
                                    <Button
                                        size="sm"
                                        onClick={handleBulkApprove}
                                        disabled={processing}
                                        className="approve-btn text-white border-0 h-7 px-3 text-xs font-semibold"
                                    >
                                        {processing ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <UserCheck className="h-3 w-3 mr-1" />}
                                        Approve All
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={handleBulkReject}
                                        disabled={processing}
                                        className="h-7 px-3 text-xs font-semibold"
                                    >
                                        {processing ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <UserX className="h-3 w-3 mr-1" />}
                                        Reject All
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── User Cards ── */}
                    <div className="py-2">
                        {filteredUsers.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="glass-card rounded-3xl shadow-lg p-14 max-w-sm mx-auto">
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e0e7ff, #ede9fe)' }}>
                                        <Users className="h-10 w-10 text-indigo-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {pendingUsers.length === 0 ? 'All Clear!' : 'No matches found'}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-6">
                                        {pendingUsers.length === 0
                                            ? 'All registration requests have been processed. Great work!'
                                            : 'Try adjusting your search or filter criteria.'}
                                    </p>
                                    {pendingUsers.length > 0 && (
                                        <Button
                                            variant="outline"
                                            onClick={() => { setSearchTerm(''); setFilterDepartment('all'); setFilterUserType('all'); }}
                                            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                                        >
                                            Clear Filters
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                {filteredUsers.map((user) => {
                                    const pmColors = getPaymentBadge(user.payment_method);
                                    const isSelected = selectedUsers.includes(user.id);
                                    return (
                                        <div key={user.id} className={`user-card glass-card rounded-2xl overflow-hidden relative ${isSelected ? 'selected' : ''}`}>
                                            {/* Top accent bar */}
                                            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)' }} />

                                            {/* Selection checkbox */}
                                            <div className="absolute top-5 left-4 z-10">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() => toggleUserSelection(user.id)}
                                                    className="bg-white shadow-sm data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 border-gray-300"
                                                />
                                            </div>

                                            {/* Card Header */}
                                            <div className="px-5 pt-5 pb-4 pl-12">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="relative flex-shrink-0">
                                                            <Avatar className="h-14 w-14 avatar-ring">
                                                                <AvatarImage src={user.image} alt={user.name} />
                                                                <AvatarFallback className="text-white font-bold text-base" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                                                    {getInitials(user.name)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-sm">
                                                                <Clock className="h-2.5 w-2.5 text-amber-900" />
                                                            </div>
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="font-bold text-gray-900 text-base truncate leading-tight">{user.name}</h3>
                                                            <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                                                                <Mail className="h-3 w-3 flex-shrink-0 text-indigo-400" />
                                                                {user.email}
                                                            </p>
                                                            {user.member_id && (
                                                                <p className="text-xs text-indigo-600 font-medium mt-0.5 truncate">
                                                                    #{user.member_id}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg capitalize" style={{ background: 'linear-gradient(135deg, #e0e7ff, #ede9fe)', color: '#4338ca' }}>
                                                            {user.usertype || 'User'}
                                                        </span>
                                                        <button
                                                            onClick={() => { setSelectedUser(user); setShowUserDetails(true); }}
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Divider */}
                                            <div className="mx-5 border-t border-gray-100" />

                                            {/* Card Body */}
                                            <div className="px-5 py-4 space-y-3">
                                                {/* Info pills row */}
                                                <div className="grid grid-cols-2 gap-2">
                                                    {user.phone && (
                                                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                                                            <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                                <Phone className="h-3 w-3 text-emerald-600" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wide">Phone</p>
                                                                <p className="text-xs font-semibold text-gray-800 truncate">{user.phone}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {user.department && (
                                                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 border border-blue-100">
                                                            <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                                <Building2 className="h-3 w-3 text-blue-600" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wide">Dept</p>
                                                                <p className="text-xs font-semibold text-gray-800 truncate">{user.department}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {user.session && (
                                                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-violet-50 border border-violet-100">
                                                            <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                                                                <Calendar className="h-3 w-3 text-violet-600" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-[10px] text-violet-600 font-semibold uppercase tracking-wide">Session</p>
                                                                <p className="text-xs font-semibold text-gray-800 truncate">{user.session}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {user.gender && (
                                                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-pink-50 border border-pink-100">
                                                            <div className="w-6 h-6 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                                                                <User className="h-3 w-3 text-pink-600" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-[10px] text-pink-600 font-semibold uppercase tracking-wide">Gender</p>
                                                                <p className="text-xs font-semibold text-gray-800 capitalize truncate">{user.gender}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {user.blood_group && (
                                                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 border border-red-100">
                                                            <div className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                                                <Heart className="h-3 w-3 text-red-600" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-[10px] text-red-600 font-semibold uppercase tracking-wide">Blood</p>
                                                                <p className="text-xs font-semibold text-gray-800 truncate">{user.blood_group}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Registration date */}
                                                <div className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #e0e7ff, #ede9fe)' }}>
                                                    <span className="text-xs text-indigo-600 font-semibold">Registered</span>
                                                    <span className="text-xs font-bold text-indigo-900">{formatDate(user.created_at)}</span>
                                                </div>

                                                {/* Address */}
                                                {(user.current_address || user.permanent_address) && (
                                                    <div className="space-y-2">
                                                        <Separator className="bg-gray-100" />
                                                        {user.current_address && (
                                                            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-teal-50 border border-teal-100">
                                                                <MapPin className="h-3.5 w-3.5 text-teal-600 mt-0.5 flex-shrink-0" />
                                                                <div>
                                                                    <p className="text-[10px] text-teal-600 font-semibold uppercase tracking-wide">Current Address</p>
                                                                    <p className="text-xs text-gray-700 mt-0.5">{user.current_address}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {user.permanent_address && (
                                                            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-sky-50 border border-sky-100">
                                                                <MapPin className="h-3.5 w-3.5 text-sky-600 mt-0.5 flex-shrink-0" />
                                                                <div>
                                                                    <p className="text-[10px] text-sky-600 font-semibold uppercase tracking-wide">Permanent Address</p>
                                                                    <p className="text-xs text-gray-700 mt-0.5">{user.permanent_address}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Transaction ID */}
                                                {user.transaction_id && (
                                                    <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', borderColor: '#fde68a' }}>
                                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#fde68a' }}>
                                                            <CreditCard className="h-4 w-4 text-amber-700" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                                <p className="text-[10px] text-amber-700 font-semibold uppercase tracking-wide">Transaction ID</p>
                                                                {user.payment_method && (
                                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${pmColors.bg} ${pmColors.text} ${pmColors.border} border`}>
                                                                        {user.payment_method.charAt(0).toUpperCase() + user.payment_method.slice(1)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm font-mono font-bold text-amber-900 truncate">{user.transaction_id}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="flex gap-2 pt-1">
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <button
                                                                disabled={processing}
                                                                className="reject-btn flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 disabled:opacity-50"
                                                            >
                                                                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                                                Reject
                                                            </button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="sm:max-w-md rounded-2xl">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className="flex items-center gap-2 text-red-700">
                                                                    <div className="p-1.5 bg-red-100 rounded-lg"><XCircle className="h-5 w-5 text-red-600" /></div>
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
                                                            <button
                                                                disabled={processing}
                                                                className="approve-btn flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                                                            >
                                                                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                                                Approve
                                                            </button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="sm:max-w-md rounded-2xl">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className="flex items-center gap-2 text-emerald-700">
                                                                    <div className="p-1.5 bg-emerald-100 rounded-lg"><CheckCircle className="h-5 w-5 text-emerald-600" /></div>
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
                                                                    className="bg-emerald-600 hover:bg-emerald-700"
                                                                >
                                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                                    Approve User
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── User Details Modal ── */}
                <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-0 border-0 shadow-2xl">
                        {selectedUser && (
                            <>
                                {/* Modal Header */}
                                <div className="relative overflow-hidden rounded-t-2xl p-6 bg-white border-b border-gray-100">
                                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                        <div style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 70%)', width: '300px', height: '300px', top: '-100px', right: '-50px' }} className="absolute rounded-full" />
                                    </div>
                                    <div className="relative flex items-center gap-4">
                                        <Avatar className="h-16 w-16 shadow-xl" style={{ boxShadow: '0 0 0 3px white, 0 0 0 6px rgba(99,102,241,0.15)' }}>
                                            <AvatarImage src={selectedUser?.image} alt={selectedUser?.name} />
                                            <AvatarFallback className="text-white font-bold text-xl" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                                {getInitials(selectedUser?.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{selectedUser?.name}</h3>
                                            <p className="text-gray-500 text-sm">{selectedUser?.email}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg capitalize text-indigo-700 bg-indigo-50 border border-indigo-100">
                                                    {selectedUser?.usertype || 'User'}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg text-amber-800 bg-amber-50 border border-amber-200">
                                                    <Clock className="h-3 w-3" /> Pending Review
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="relative text-gray-400 text-xs mt-3">Complete user registration details and information</p>
                                </div>

                                <div className="p-6 space-y-5">
                                    {/* Personal Information */}
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                                            <div className="p-1.5 bg-indigo-100 rounded-lg"><User className="h-3.5 w-3.5 text-indigo-600" /></div>
                                            Personal Information
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2.5">
                                            {[
                                                { label: 'Full Name', value: selectedUser.name },
                                                { label: 'Email', value: selectedUser.email },
                                                selectedUser.phone && { label: 'Phone', value: selectedUser.phone },
                                                selectedUser.gender && { label: 'Gender', value: selectedUser.gender, capitalize: true },
                                                selectedUser.date_of_birth && { label: 'Date of Birth', value: formatDate(selectedUser.date_of_birth) },
                                                selectedUser.blood_group && { label: 'Blood Group', value: selectedUser.blood_group },
                                            ].filter(Boolean).map((item) => (
                                                <div key={item.label} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                                                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">{item.label}</p>
                                                    <p className={`font-semibold text-gray-800 text-sm mt-0.5 ${item.capitalize ? 'capitalize' : ''}`}>{item.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Academic Information */}
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                                            <div className="p-1.5 bg-blue-100 rounded-lg"><GraduationCap className="h-3.5 w-3.5 text-blue-600" /></div>
                                            Academic Information
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2.5">
                                            {[
                                                selectedUser.member_id && { label: 'Member ID', value: selectedUser.member_id },
                                                selectedUser.department && { label: 'Department', value: selectedUser.department },
                                                selectedUser.session && { label: 'Session', value: selectedUser.session },
                                                selectedUser.usertype && { label: 'User Type', value: selectedUser.usertype, capitalize: true },
                                            ].filter(Boolean).map((item) => (
                                                <div key={item.label} className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                                                    <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wide">{item.label}</p>
                                                    <p className={`font-semibold text-blue-900 text-sm mt-0.5 ${item.capitalize ? 'capitalize' : ''}`}>{item.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Address Information */}
                                    {(selectedUser.current_address || selectedUser.permanent_address) && (
                                        <div>
                                            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                                                <div className="p-1.5 bg-teal-100 rounded-lg"><MapPin className="h-3.5 w-3.5 text-teal-600" /></div>
                                                Address Information
                                            </h4>
                                            <div className="space-y-2.5">
                                                {selectedUser.current_address && (
                                                    <div className="p-3 rounded-xl bg-teal-50 border border-teal-100">
                                                        <p className="text-[10px] text-teal-600 font-semibold uppercase tracking-wide mb-1">Current Address</p>
                                                        <p className="text-sm text-gray-700">{selectedUser.current_address}</p>
                                                    </div>
                                                )}
                                                {selectedUser.permanent_address && (
                                                    <div className="p-3 rounded-xl bg-sky-50 border border-sky-100">
                                                        <p className="text-[10px] text-sky-600 font-semibold uppercase tracking-wide mb-1">Permanent Address</p>
                                                        <p className="text-sm text-gray-700">{selectedUser.permanent_address}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Registration Details */}
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                                            <div className="p-1.5 bg-amber-100 rounded-lg"><Clock className="h-3.5 w-3.5 text-amber-600" /></div>
                                            Registration Details
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2.5">
                                            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                                                <p className="text-[10px] text-amber-700 font-semibold uppercase tracking-wide">Registration Date</p>
                                                <p className="font-semibold text-amber-900 text-sm mt-0.5">{formatDate(selectedUser.created_at)}</p>
                                            </div>
                                            {selectedUser.transaction_id && (
                                                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                                                    <div className="flex items-center gap-1.5 mb-0.5">
                                                        <p className="text-[10px] text-amber-700 font-semibold uppercase tracking-wide">Transaction ID</p>
                                                        {selectedUser.payment_method && (
                                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${getPaymentBadge(selectedUser.payment_method).bg} ${getPaymentBadge(selectedUser.payment_method).text} border ${getPaymentBadge(selectedUser.payment_method).border}`}>
                                                                {selectedUser.payment_method.charAt(0).toUpperCase() + selectedUser.payment_method.slice(1)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="font-bold text-amber-900 font-mono text-sm mt-0.5">{selectedUser.transaction_id}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-2 border-t border-gray-100">
                                        <button
                                            variant="outline"
                                            onClick={() => handleReject(selectedUser.id)}
                                            disabled={processing}
                                            className="reject-btn flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 disabled:opacity-50"
                                        >
                                            <XCircle className="h-4 w-4" />
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleApprove(selectedUser.id)}
                                            disabled={processing}
                                            className="approve-btn flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                            Approve
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AdminAuthenticatedLayout>
    );
}
