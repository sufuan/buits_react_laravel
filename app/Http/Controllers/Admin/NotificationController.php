<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PendingUser;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    /**
     * Check for new notifications
     */
    public function check(Request $request): JsonResponse
    {
        try {
            // Get current pending users count
            $pendingUsersCount = PendingUser::count();
            
            // Get the last known count from session or request
            $lastKnownCount = $request->session()->get('last_pending_users_count', 0);
            
            // Check if there are new notifications
            $hasNewNotifications = $pendingUsersCount > $lastKnownCount;
            
            // Update the session with current count
            $request->session()->put('last_pending_users_count', $pendingUsersCount);
            
            return response()->json([
                'hasNewNotifications' => $hasNewNotifications,
                'pendingUsersCount' => $pendingUsersCount,
                'newCount' => $pendingUsersCount - $lastKnownCount,
                'notifications' => [
                    'pendingUsers' => $pendingUsersCount,
                ],
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to check notifications',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Mark notifications as seen
     */
    public function markAsSeen(Request $request): JsonResponse
    {
        try {
            $request->session()->put('last_pending_users_count', PendingUser::count());
            
            return response()->json([
                'success' => true,
                'message' => 'Notifications marked as seen',
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to mark notifications as seen',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
