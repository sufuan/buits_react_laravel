import { useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function NotificationPoller({ 
  enabled = true, 
  interval = 60000, // 1 minute
  onNewNotifications 
}) {
  useEffect(() => {
    if (!enabled) return;

    const pollForNotifications = async () => {
      try {
        // Make a request to check for new notifications
        const response = await fetch('/admin/notifications/check', {
          method: 'GET',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.hasNewNotifications && onNewNotifications) {
            onNewNotifications(data);
          }
        }
      } catch (error) {
        console.error('Failed to check notifications:', error);
      }
    };

    // Poll immediately and then at intervals
    pollForNotifications();
    const intervalId = setInterval(pollForNotifications, interval);

    return () => clearInterval(intervalId);
  }, [enabled, interval, onNewNotifications]);

  return null; // This component doesn't render anything
}
