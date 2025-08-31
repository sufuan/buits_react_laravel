<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommitteeAssignment;
use App\Models\PreviousCommitteeMember;
use App\Models\User;
use App\Models\Designation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;

class CommitteeController extends Controller
{
    /**
     * Display current committee management page
     */
    public function currentCommittee()
    {
        $currentCommitteeNumber = CommitteeAssignment::getCurrentCommitteeNumber();
        
        // Get all executive members with designations and active committee status - they are automatically committee members
        $currentMembers = User::where('usertype', 'executive')
            ->where('is_approved', true)
            ->whereNotNull('designation_id')
            ->where('committee_status', 'active')
            ->with(['designation'])
            ->orderBy('name')
            ->get()
            ->map(function ($user, $index) use ($currentCommitteeNumber) {
                return [
                    'id' => 'exec_' . $user->id, // Prefix to distinguish from manual assignments
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'user_email' => $user->email,
                    'user_image' => $user->image,
                    'designation_name' => $user->designation->name,
                    'designation_id' => $user->designation_id,
                    'committee_number' => $currentCommitteeNumber ?: 1,
                    'tenure_start' => $user->updated_at, // When they got the designation
                    'member_order' => $index + 1,
                    'status' => 'current',
                    'is_auto_assigned' => true // Flag to show they're auto-assigned
                ];
            });

        $designations = Designation::active()
            ->orderBy('sort_order')
            ->select('id', 'name', 'level')
            ->get();

        // No available users needed since all executives are automatically members
        $availableUsers = collect([]);

        return Inertia::render('Admin/Committee/CurrentCommittee', [
            'currentMembers' => $currentMembers,
            'currentCommitteeNumber' => $currentCommitteeNumber ?: 1,
            'designations' => $designations,
            'availableUsers' => $availableUsers,
            'totalCurrentMembers' => $currentMembers->count(),
            'flash' => session()->get('flash', [])
        ]);
    }

    /**
     * Add a member to current committee
     */
    public function addMember(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'designation_id' => 'required|exists:designations,id',
            'member_order' => 'integer|min:1'
        ]);

        try {
            DB::beginTransaction();

            // Check if user is already in current committee
            $existingAssignment = CommitteeAssignment::current()
                ->where('user_id', $request->user_id)
                ->first();

            if ($existingAssignment) {
                return back()->with('error', 'This user is already in the current committee.');
            }

            // Get or create current committee number
            $currentCommitteeNumber = CommitteeAssignment::getCurrentCommitteeNumber() 
                ?? $this->generateNewCommitteeNumber();

            // Determine member order
            $memberOrder = $request->member_order ?? $this->getNextMemberOrder();

            // Create committee assignment
            CommitteeAssignment::create([
                'user_id' => $request->user_id,
                'designation_id' => $request->designation_id,
                'committee_number' => $currentCommitteeNumber,
                'tenure_start' => now(),
                'status' => 'current',
                'member_order' => $memberOrder
            ]);

            DB::commit();

            return back()->with('success', 'Member added to current committee successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to add member: ' . $e->getMessage());
        }
    }

    /**
     * Remove a member from current committee
     */
    public function removeMember(CommitteeAssignment $assignment)
    {
        if ($assignment->status !== 'current') {
            return back()->with('error', 'Can only remove current committee members.');
        }

        try {
            $assignment->delete();
            return back()->with('success', 'Member removed from committee successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to remove member: ' . $e->getMessage());
        }
    }

    /**
     * Update member order
     */
    public function updateMemberOrder(Request $request)
    {
        $request->validate([
            'members' => 'required|array',
            'members.*.id' => 'required|exists:committee_assignments,id',
            'members.*.member_order' => 'required|integer|min:1'
        ]);

        try {
            DB::beginTransaction();

            foreach ($request->members as $memberData) {
                CommitteeAssignment::where('id', $memberData['id'])
                    ->where('status', 'current')
                    ->update(['member_order' => $memberData['member_order']]);
            }

            DB::commit();

            return back()->with('success', 'Member order updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update member order: ' . $e->getMessage());
        }
    }

    /**
     * End current tenure and archive all current members
     */
    public function endTenure(Request $request)
    {
        Log::info('End Tenure called with data: ' . json_encode($request->all()));
        
        $request->validate([
            'confirmation' => 'required|in:CONFIRM',
            'new_committee_number' => 'required|string|max:50'
        ]);

        try {
            DB::beginTransaction();

            $currentCommitteeNumber = CommitteeAssignment::getCurrentCommitteeNumber() ?: 1;

            // Get all current executive members with designations and active committee status (auto-assigned committee members)
            $currentExecutives = User::where('usertype', 'executive')
                ->where('is_approved', true)
                ->whereNotNull('designation_id')
                ->where('committee_status', 'active')
                ->with(['designation'])
                ->orderBy('name')
                ->get();

            Log::info('Found ' . $currentExecutives->count() . ' active executives for end tenure');

            if ($currentExecutives->isEmpty()) {
                Log::warning('No active executive committee members found');
                return back()->with('error', 'No active executive committee members found to archive.');
            }

            $today = now();

            // 1. Archive current executives to previous_committee_members (frozen snapshots)
            foreach ($currentExecutives as $index => $user) {
                PreviousCommitteeMember::create([
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'designation' => $user->designation->name,
                    'designation_title' => $user->designation->name,
                    'designation_id_snapshot' => $user->designation_id,
                    'photo' => $user->image,
                    'committee_number' => $currentCommitteeNumber,
                    'member_order' => $index + 1,
                    'tenure_start' => $user->updated_at,
                    'tenure_end' => $today->toDateString()
                ]);
            }

            // 2. Set all current executive committee members to inactive status
            $updatedCount = User::where('usertype', 'executive')
                ->where('is_approved', true)
                ->whereNotNull('designation_id')
                ->where('committee_status', 'active')
                ->update(['committee_status' => 'inactive']);
                
            Log::info('Set ' . $updatedCount . ' executives to inactive status');

            // 3. Update any existing committee assignments to previous (cleanup for legacy data)
            CommitteeAssignment::where('status', 'current')->update([
                'status' => 'previous',
                'tenure_end' => $today->toDateString()
            ]);

            // 4. Store the new committee number for the next committee cycle
            // We'll use a simple approach by creating a dummy assignment record to track committee number
            // or update the getCurrentCommitteeNumber method
            
            // For now, let's store it in cache or create a simple setting record
            cache(['current_committee_number' => $request->new_committee_number], now()->addYears(1));

            DB::commit();
            
            Log::info('End tenure completed successfully. Committee cycle: ' . $request->new_committee_number);

            return back()->with('success', 
                'Committee tenure ended successfully! All ' . $currentExecutives->count() . ' executive members have been archived and removed from current committee. ' .
                'New committee cycle "' . $request->new_committee_number . '" has started. ' .
                'To add members to the new committee, approve executives with designations in User Role Management.'
            );

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to end committee tenure: ' . $e->getMessage());
            return back()->with('error', 'Failed to end committee tenure: ' . $e->getMessage());
        }
    }

    /**
     * Display previous committees
     */
    public function previousCommittees()
    {
        // Get committee numbers directly from PreviousCommitteeMember table
        $committeeNumbers = PreviousCommitteeMember::distinct('committee_number')
            ->orderBy('committee_number', 'desc')
            ->pluck('committee_number');

        $previousCommittees = [];

        foreach ($committeeNumbers as $number) {
            $members = PreviousCommitteeMember::where('committee_number', $number)
                ->orderBy('member_order')
                ->get()
                ->map(function ($member) {
                    return [
                        'id' => $member->id,
                        'name' => $member->name,
                        'designation' => $member->designation,
                        'photo' => $member->photo,
                        'member_order' => $member->member_order
                    ];
                });

            $previousCommittees[] = [
                'committee_number' => $number,
                'members' => $members,
                'member_count' => $members->count()
            ];
        }

        return Inertia::render('Admin/Committee/PreviousCommittees', [
            'previousCommittees' => $previousCommittees
        ]);
    }

    /**
     * Auto-approve executive application and add to committee
     */
    public function approveExecutiveApplication(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'designation_id' => 'required|exists:designations,id'
        ]);

        try {
            DB::beginTransaction();

            // Get or create current committee number
            $currentCommitteeNumber = CommitteeAssignment::getCurrentCommitteeNumber() 
                ?? $this->generateNewCommitteeNumber();

            // Check if user already has current assignment
            $existingAssignment = CommitteeAssignment::current()
                ->where('user_id', $request->user_id)
                ->first();

            if ($existingAssignment) {
                return back()->with('error', 'User is already in the current committee.');
            }

            // Create committee assignment
            CommitteeAssignment::create([
                'user_id' => $request->user_id,
                'designation_id' => $request->designation_id,
                'committee_number' => $currentCommitteeNumber,
                'tenure_start' => now(),
                'status' => 'current',
                'member_order' => $this->getNextMemberOrder()
            ]);

            DB::commit();

            return back()->with('success', 'Executive application approved and member added to committee.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to approve application: ' . $e->getMessage());
        }
    }

    /**
     * Get committee statistics
     */
    public function getCommitteeStats()
    {
        $currentCount = CommitteeAssignment::current()->count();
        $totalCommittees = CommitteeAssignment::distinct('committee_number')->count();
        $currentCommitteeNumber = CommitteeAssignment::getCurrentCommitteeNumber();
        
        return response()->json([
            'current_members_count' => $currentCount,
            'total_committees_history' => $totalCommittees,
            'current_committee_number' => $currentCommitteeNumber,
            'has_current_committee' => $currentCount > 0
        ]);
    }

    /**
     * Generate new committee number based on academic year
     */
    private function generateNewCommitteeNumber(): string
    {
        $sessionFromConfig = session('new_committee_number');
        if ($sessionFromConfig) {
            session()->forget('new_committee_number');
            return $sessionFromConfig;
        }

        $currentYear = now()->year;
        $nextYear = $currentYear + 1;
        return "{$currentYear}-{$nextYear}";
    }

    /**
     * Get next available member order
     */
    private function getNextMemberOrder(): int
    {
        $maxOrder = CommitteeAssignment::current()->max('member_order') ?? 0;
        return $maxOrder + 1;
    }



    /**
     * Phase 4 Route Aliases - Matching exact specification
     */
    
    /**
     * Alias for currentCommittee() to match Phase 4 route specification
     */
    public function current()
    {
        return $this->currentCommittee();
    }

    /**
     * Alias for addMember() to match Phase 4 route specification
     */
    public function add(Request $request)
    {
        return $this->addMember($request);
    }

    /**
     * Alias for previousCommittees() to match Phase 4 route specification
     */
    public function previous()
    {
        return $this->previousCommittees();
    }

    /**
     * Get specific previous committee by committee number
     * Phase 4 route: /admin/committee/previous/{number}
     */
    public function previousByCommittee($committeeNumber)
    {
        $members = PreviousCommitteeMember::where('committee_number', $committeeNumber)
            ->orderBy('member_order')
            ->get()
            ->map(function ($member) {
                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'designation' => $member->designation,
                    'photo' => $member->photo,
                    'member_order' => $member->member_order
                ];
            });

        if ($members->isEmpty()) {
            return response()->json([
                'error' => 'Committee not found',
                'committee_number' => $committeeNumber
            ], 404);
        }

        $committeeData = [
            'committee_number' => $committeeNumber,
            'members' => $members,
            'member_count' => $members->count()
        ];

        // If request wants JSON (API call), return JSON
        if (request()->wantsJson() || request()->is('api/*')) {
            return response()->json($committeeData);
        }

        // Otherwise return Inertia page
        return Inertia::render('Admin/Committee/CommitteeDetail', [
            'committee' => $committeeData
        ]);
    }

    /**
     * Auto-add executive member to current committee when approved
     * This method is called from UserRoleManagement when an executive is approved
     */
    public function autoAddExecutiveToCommittee($userId, $designationId = null)
    {
        try {
            $user = User::findOrFail($userId);
            
            // Verify user is an executive (case-insensitive)
            if (strtolower($user->usertype) !== 'executive') {
                return false;
            }

            // Check if user is already in current committee
            $existingAssignment = CommitteeAssignment::where('user_id', $userId)
                ->where('status', 'current')
                ->first();

            if ($existingAssignment) {
                return false; // Already in committee
            }

            // Get current committee number or create one
            $currentCommitteeNumber = CommitteeAssignment::getCurrentCommitteeNumber() ?? $this->generateNewCommitteeNumber();

            // Get next member order (handle null)
            $maxOrder = CommitteeAssignment::where('status', 'current')->max('member_order') ?? 0;
            $nextOrder = $maxOrder + 1;

            // Create committee assignment
            CommitteeAssignment::create([
                'user_id' => $userId,
                'designation_id' => $designationId,
                'committee_number' => $currentCommitteeNumber,
                'status' => 'current',
                'member_order' => $nextOrder,
                'tenure_start' => now(),
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to auto-add executive to committee: ' . $e->getMessage());
            return false;
        }
    }
}
