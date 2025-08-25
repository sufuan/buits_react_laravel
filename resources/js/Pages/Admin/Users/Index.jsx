import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import ExcelImportButton from '@/Components/Admin/ExcelImport/ExcelImportButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
    User, 
    Mail, 
    Phone, 
    GraduationCap, 
    Calendar, 
    MapPin, 
    Search,
    Filter,
    Users,
    IdCard,
    UserPlus,
    Edit,
    Eye,
    Download,

    FileSpreadsheet,
    Loader2,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';

export default function Index({ users }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [sessionFilter, setSessionFilter] = useState('all');
    const [isImporting, setIsImporting] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const [validationMetadata, setValidationMetadata] = useState(null);

    // Load validation metadata on component mount
    useEffect(() => {
        loadValidationMetadata();
    }, []);

    const loadValidationMetadata = async () => {
        try {
            const response = await fetch(route('admin.users.import.validation-metadata'));
            const result = await response.json();
            if (result.success) {
                setValidationMetadata(result.data);
            }
        } catch (error) {
            console.error('Failed to load validation metadata:', error);
        }
    };
    const { flash, errors } = usePage().props;

    // Get unique departments and sessions for filters
    const departments = [...new Set(users.map(user => user.department))].sort();
    const sessions = [...new Set(users.map(user => user.session))].sort();

    // Show flash messages in modal
    useEffect(() => {
        if (flash?.success || flash?.error || errors?.error) {
            setImportResult({
                success: flash?.success || null,
                error: flash?.error || errors?.error || null
            });
            setShowResultModal(true);
            setIsImporting(false);
        }
    }, [flash, errors]);

    // Filter users based on search and filters
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.member_id?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
        const matchesSession = sessionFilter === 'all' || user.session === sessionFilter;

        return matchesSearch && matchesDepartment && matchesSession;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleExport = () => {
        window.location.href = route('admin.users.export');
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
            const fileExtension = file.name.split('.').pop().toLowerCase();
            
            if (!validTypes.includes(file.type) && !['xlsx', 'xls', 'csv'].includes(fileExtension)) {
                setImportResult({
                    success: null,
                    error: 'Please select a valid Excel or CSV file (.xlsx, .xls, .csv)'
                });
                setShowResultModal(true);
                event.target.value = '';
                return;
            }

            // Check file size (10MB max)
            if (file.size > 10 * 1024 * 1024) {
                setImportResult({
                    success: null,
                    error: 'File size must be less than 10MB'
                });
                setShowResultModal(true);
                event.target.value = '';
                return;
            }

            setIsImporting(true);
            const formData = new FormData();
            formData.append('file', file);
            
            router.post(route('admin.users.import'), formData, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    event.target.value = '';
                    setIsImporting(false);
                },
                onError: (errors) => {
                    event.target.value = '';
                    setIsImporting(false);
                    setImportResult({
                        success: null,
                        error: errors.error || 'An error occurred during import. Please check your file and try again.'
                    });
                    setShowResultModal(true);
                },
                onFinish: () => {
                    setIsImporting(false);
                }
            });
        }
    };

    const handleDownloadTemplate = () => {
        window.location.href = route('admin.users.template');
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        All Users
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <Button onClick={handleDownloadTemplate} variant="outline" className="flex items-center gap-2 text-xs sm:text-sm">
                            <FileSpreadsheet className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Template</span>
                        </Button>
                        <Button onClick={handleExport} variant="outline" className="flex items-center gap-2 text-xs sm:text-sm">
                            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Export</span>
                        </Button>
                      
                        
                        {/* New Excel Import with GUI */}
                        {validationMetadata && (
                            <ExcelImportButton
                                validationMetadata={validationMetadata}
                                onImportComplete={(result) => {
                                    setImportResult(result);
                                    setShowResultModal(true);
                                    // Refresh the page to show new users
                                    router.reload();
                                }}
                            />
                        )}
                        <Link href={route('admin.users.create')}>
                            <Button className="flex items-center gap-2 text-xs sm:text-sm">
                                <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Add User</span>
                                <span className="sm:hidden">Add</span>
                            </Button>
                        </Link>
                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                            {filteredUsers.length}/{users.length}
                        </Badge>
                    </div>
                </div>
            }
        >
            <Head title="All Users" />

            {/* Import Result Modal */}
            <Dialog open={showResultModal} onOpenChange={setShowResultModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {importResult?.success ? (
                                <>
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    Import Successful
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-5 w-5 text-red-500" />
                                    Import Failed
                                </>
                            )}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        {importResult?.success && (
                            <Alert className="border-green-200 bg-green-50">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertTitle className="text-green-800">Success</AlertTitle>
                                <AlertDescription className="text-green-700">
                                    {importResult.success}
                                </AlertDescription>
                            </Alert>
                        )}
                        {importResult?.error && (
                            <Alert className="border-red-200 bg-red-50">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <AlertTitle className="text-red-800">Error</AlertTitle>
                                <AlertDescription className="text-red-700">
                                    {importResult.error}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowResultModal(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="py-4 sm:py-8 lg:py-12">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                    {/* Filters */}
                    <Card className="mb-4 sm:mb-6">
                        <CardHeader className="pb-3 sm:pb-6">
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                                Filters
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search by name, email, or member ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Departments</SelectItem>
                                        {departments.map(dept => (
                                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={sessionFilter} onValueChange={setSessionFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by session" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Sessions</SelectItem>
                                        {sessions.map(session => (
                                            <SelectItem key={session} value={session}>{session}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Users List */}
                    {filteredUsers.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Users className="h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchTerm || departmentFilter !== 'all' || sessionFilter !== 'all' 
                                        ? 'No users found' 
                                        : 'No users yet'
                                    }
                                </h3>
                                <p className="text-gray-500 text-center">
                                    {searchTerm || departmentFilter !== 'all' || sessionFilter !== 'all'
                                        ? 'Try adjusting your search criteria.'
                                        : 'Users will appear here once they are approved.'
                                    }
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-3 sm:gap-4 lg:gap-6">
                            {filteredUsers.map((user) => (
                                <Card key={user.id} className="overflow-hidden">
                                    <CardHeader className="pb-3 sm:pb-4">
                                        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0">
                                            <div className="flex items-center space-x-3 sm:space-x-4 w-full">
                                                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                                                    <AvatarImage src={user.image} alt={user.name} />
                                                    <AvatarFallback className="text-xs sm:text-sm">
                                                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0 flex-1">
                                                    <CardTitle className="text-base sm:text-lg truncate">{user.name}</CardTitle>
                                                    <CardDescription className="flex items-center gap-2 text-xs sm:text-sm">
                                                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                        <span className="truncate">{user.email}</span>
                                                    </CardDescription>
                                                    {user.member_id && (
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <IdCard className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                                                            <span className="text-xs sm:text-sm font-mono text-blue-600 truncate">
                                                                {user.member_id}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-end">
                                                <Link href={route('admin.users.show', user.id)}>
                                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={route('admin.users.edit', user.id)}>
                                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <Badge variant="outline" className="text-xs">
                                                Joined {formatDate(user.created_at)}
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs">
                                                {user.usertype || 'User'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3 sm:space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                                                <span className="truncate">{user.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                                                <span className="truncate">{user.department}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                                                <span className="truncate">Session: {user.session}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500 flex-shrink-0">Roll:</span>
                                                <span className="truncate">{user.class_roll}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500 flex-shrink-0">Gender:</span>
                                                <span className="capitalize truncate">{user.gender}</span>
                                            </div>
                                            {user.blood_group && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500 flex-shrink-0">Blood:</span>
                                                    <span className="truncate">{user.blood_group}</span>
                                                </div>
                                            )}
                                        </div>

                                        {user.skills && (
                                            <>
                                                <Separator />
                                                <div className="text-xs sm:text-sm">
                                                    <span className="font-medium text-gray-700">Skills:</span>
                                                    <p className="text-gray-600 mt-1 break-words">{user.skills}</p>
                                                </div>
                                            </>
                                        )}

                                        {(user.current_address || user.permanent_address) && (
                                            <>
                                                <Separator />
                                                <div className="space-y-2 text-xs sm:text-sm">
                                                    {user.current_address && (
                                                        <div className="flex items-start gap-2">
                                                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                                            <div className="min-w-0 flex-1">
                                                                <span className="font-medium">Current Address:</span>
                                                                <p className="text-gray-600 break-words">{user.current_address}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {user.permanent_address && user.permanent_address !== user.current_address && (
                                                        <div className="flex items-start gap-2">
                                                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                                            <div className="min-w-0 flex-1">
                                                                <span className="font-medium">Permanent Address:</span>
                                                                <p className="text-gray-600 break-words">{user.permanent_address}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {user.transaction_id && (
                                            <>
                                                <Separator />
                                                <div className="text-xs sm:text-sm text-gray-500">
                                                    <span className="font-medium">Transaction ID:</span> 
                                                    <span className="break-all ml-1">{user.transaction_id}</span>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
