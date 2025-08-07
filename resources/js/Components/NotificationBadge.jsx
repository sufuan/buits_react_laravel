import React from 'react';
import { Badge } from "@/components/ui/badge";

export default function NotificationBadge({ count, className = "" }) {
  // Debug: Log the count value
  console.log('NotificationBadge - count:', count, 'type:', typeof count);

  // Only show badge if count exists and is greater than 0
  if (!count || count <= 0) {
    console.log('NotificationBadge - returning null for count:', count);
    return null;
  }

  return (
    <Badge
      variant="destructive"
      className={`
        ml-auto min-w-[20px] h-5 px-1.5 text-xs font-bold
        bg-red-500 hover:bg-red-600 text-white
        animate-pulse shadow-lg
        ${className}
      `}
    >
      {count > 99 ? '99+' : count}
    </Badge>
  );
}
