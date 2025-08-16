import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import ExcelImportButton from '@/Components/Admin/Import/ExcelImportButton';
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
    Trash2,
    Eye,
    Download,
    Upload,
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

    const handleDelete = (user) => {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            router.delete(route('admin.users.destroy', user.id));
        }
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
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        All Users
                    </h2>
                    <div className="flex items-center gap-3">
                        <Button onClick={handleDownloadTemplate} variant="outline" className="flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4" />
                            Template
                        </Button>
                        <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleImport}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                id="import-file"
                                disabled={isImporting}
                            />
                            <Button variant="outline" className="flex items-center gap-2" disabled={isImporting}>
                                {isImporting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-4 w-4" />
                                        Quick Import
                                    </>
                                )}
                            </Button>
                        </div>
                        
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
                            <Button className="flex items-center gap-2">
                                <UserPlus className="h-4 w-4" />
                                Add User
                            </Button>
                        </Link>
                        <Badge variant="secondary" className="text-sm">
                            {filteredUsers.length} of {users.length} Users
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

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filters */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Filters
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <div className="grid gap-6">
                            {filteredUsers.map((user) => (
                                <Card key={user.id} className="overflow-hidden">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-4">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage src={user.image} alt={user.name} />
                                                    <AvatarFallback>
                                                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <CardTitle className="text-lg">{user.name}</CardTitle>
                                                    <CardDescription className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4" />
                                                        {user.email}
                                                    </CardDescription>
                                                    {user.member_id && (
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <IdCard className="h-4 w-4 text-blue-500" />
                                                            <span className="text-sm font-mono text-blue-600">
                                                                {user.member_id}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link href={route('admin.users.show', user.id)}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={route('admin.users.edit', user.id)}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => handleDelete(user)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 mt-2">
                                            <Badge variant="outline" className="text-xs">
                                                Joined {formatDate(user.created_at)}
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs">
                                                {user.usertype || 'User'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-500" />
                                                <span>{user.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="h-4 w-4 text-gray-500" />
                                                <span>{user.department}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                <span>Session: {user.session}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500">Roll:</span>
                                                <span>{user.class_roll}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500">Gender:</span>
                                                <span className="capitalize">{user.gender}</span>
                                            </div>
                                            {user.blood_group && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500">Blood:</span>
                                                    <span>{user.blood_group}</span>
                                                </div>
                                            )}
                                        </div>

                                        {user.skills && (
                                            <>
                                                <Separator />
                                                <div className="text-sm">
                                                    <span className="font-medium text-gray-700">Skills:</span>
                                                    <p className="text-gray-600 mt-1">{user.skills}</p>
                                                </div>
                                            </>
                                        )}

                                        {(user.current_address || user.permanent_address) && (
                                            <>
                                                <Separator />
                                                <div className="space-y-2 text-sm">
                                                    {user.current_address && (
                                                        <div className="flex items-start gap-2">
                                                            <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                                            <div>
                                                                <span className="font-medium">Current Address:</span>
                                                                <p className="text-gray-600">{user.current_address}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {user.permanent_address && user.permanent_address !== user.current_address && (
                                                        <div className="flex items-start gap-2">
                                                            <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                                            <div>
                                                                <span className="font-medium">Permanent Address:</span>
                                                                <p className="text-gray-600">{user.permanent_address}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {user.transaction_id && (
                                            <>
                                                <Separator />
                                                <div className="text-sm text-gray-500">
                                                    Transaction ID: {user.transaction_id}
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
