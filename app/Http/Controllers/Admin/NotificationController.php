<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ExecutiveApplication;
use App\Models\PendingUser;
use App\Models\VolunteerApplication;
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
            // Get current pending counts
            $pendingUsersCount = PendingUser::count();
            $pendingVolunteerApplications = VolunteerApplication::where('status', 'pending')->count();
            $pendingExecutiveApplications = ExecutiveApplication::where('status', 'pending')->count();

            // Combine all pending counts for a total
            $totalPending = $pendingUsersCount + $pendingVolunteerApplications + $pendingExecutiveApplications;

            // Get the last known total count from session
            $lastKnownTotalCount = $request->session()->get('last_total_pending_count', 0);

            // Check if there are new notifications
            $hasNewNotifications = $totalPending > $lastKnownTotalCount;

            // Update the session with the current total count
            $request->session()->put('last_total_pending_count', $totalPending);

            return response()->json([
                'hasNewNotifications' => $hasNewNotifications,
                'newCount' => $totalPending - $lastKnownTotalCount,
                'notifications' => [
                    'pendingUsers' => $pendingUsersCount,
                    'pendingVolunteerApplications' => $pendingVolunteerApplications,
                    'pendingExecutiveApplications' => $pendingExecutiveApplications,
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
            $totalPending = PendingUser::count() +
                            VolunteerApplication::where('status', 'pending')->count() +
                            ExecutiveApplication::where('status', 'pending')->count();
                            
            $request->session()->put('last_total_pending_count', $totalPending);

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
