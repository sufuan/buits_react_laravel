import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Clock, 
  Eye, 
  CheckCircle, 
  XCircle,
  Bell,
  UserPlus
} from 'lucide-react';

export default function NewUserRequestNotification({ 
  pendingUsers = [], 
  showModal = false, 
  onClose 
}) {
  const [isOpen, setIsOpen] = useState(showModal);

  useEffect(() => {
    setIsOpen(showModal);
  }, [showModal]);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleViewRequests = () => {
    handleClose();
    router.visit('/admin/users/pending');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (pendingUsers.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-full">
              <Bell className="h-6 w-6 text-blue-600 animate-pulse" />
            </div>
            New User Registration Requests
            <Badge variant="destructive" className="ml-auto">
              {pendingUsers.length} Pending
            </Badge>
          </DialogTitle>
          <DialogDescription>
            You have {pendingUsers.length} new user registration{pendingUsers.length > 1 ? 's' : ''} waiting for approval.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {pendingUsers.slice(0, 5).map((user) => (
            <div key={user.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
              <Avatar className="h-12 w-12 ring-2 ring-blue-200">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 truncate">{user.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {user.usertype || 'User'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 truncate">{user.email}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(user.created_at)}
                  </span>
                  {user.department && (
                    <span>{user.department}</span>
                  )}
                  {user.session && (
                    <span>Session: {user.session}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" title="Pending Approval"></div>
              </div>
            </div>
          ))}

          {pendingUsers.length > 5 && (
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                And {pendingUsers.length - 5} more user{pendingUsers.length - 5 > 1 ? 's' : ''} waiting for approval...
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            <UserPlus className="h-4 w-4 inline mr-1" />
            Total pending: <strong>{pendingUsers.length}</strong>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose}>
              Later
            </Button>
            <Button onClick={handleViewRequests} className="bg-blue-600 hover:bg-blue-700">
              <Eye className="h-4 w-4 mr-2" />
              Review Requests
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
