import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
import { CheckCircle, XCircle, User, Mail, Phone, GraduationCap, Calendar, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function NewUserRequests({ pendingUsers }) {
    const [processing, setProcessing] = useState(false);

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
        <AdminAuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        New User Requests
                    </h2>
                    <Badge variant="secondary" className="text-sm">
                        {pendingUsers.length} Pending
                    </Badge>
                </div>
            }
        >
            <Head title="New User Requests" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {pendingUsers.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <User className="h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                                <p className="text-gray-500 text-center">
                                    All user registrations have been processed.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6">
                            {pendingUsers.map((user) => (
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
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                Registered {formatDate(user.created_at)}
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
                                                    {user.permanent_address && (
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

                                        <Separator />
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="text-sm text-gray-500">
                                                Transaction ID: {user.transaction_id}
                                            </div>
                                            <div className="flex gap-2">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button 
                                                            variant="destructive" 
                                                            size="sm"
                                                            disabled={processing}
                                                        >
                                                            <XCircle className="h-4 w-4 mr-2" />
                                                            Reject
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Reject Registration</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to reject {user.name}'s registration? 
                                                                This action cannot be undone and will permanently delete their application.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction 
                                                                onClick={() => handleReject(user.id)}
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Reject
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button 
                                                            variant="default" 
                                                            size="sm"
                                                            disabled={processing}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                            Approve
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Approve Registration</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to approve {user.name}'s registration? 
                                                                This will create their user account and send them a confirmation email.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction 
                                                                onClick={() => handleApprove(user.id)}
                                                                className="bg-green-600 hover:bg-green-700"
                                                            >
                                                                Approve
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
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
