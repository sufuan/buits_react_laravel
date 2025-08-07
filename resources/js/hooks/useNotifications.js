import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export function useNotifications() {
  const { props } = usePage();
  
  // Get pending users count from various sources
  const pendingUsers = props.pendingUsers || [];
  const pendingUsersCount = pendingUsers.length;
  
  // Calculate other notification counts here
  // const pendingEvents = props.pendingEvents || [];
  // const pendingVolunteers = props.pendingVolunteers || [];
  
  const notifications = useMemo(() => ({
    pendingUsers: pendingUsersCount,
    // Add other notification types here
    // pendingEvents: pendingEvents.length,
    // pendingVolunteers: pendingVolunteers.length,
  }), [pendingUsersCount]);
  
  return {
    notifications,
    pendingUsers,
    pendingUsersCount,
    hasNotifications: pendingUsersCount > 0,
  };
}
