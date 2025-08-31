<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PreviousCommitteeMember;
use Inertia\Inertia;

class PreviousCommitteeController extends Controller
{
    /**
     * Display the previous committee page
     */
    public function index()
    {
        // Get current committee members (auto-assigned executives)
        $currentMembers = \App\Models\User::where('usertype', 'executive')
            ->where('is_approved', true)
            ->whereNotNull('designation_id')
            ->where('committee_status', 'active')
            ->with(['designation'])
            ->orderBy('name')
            ->get()
            ->map(function ($user, $index) {
                return [
                    'id' => $user->id,
                    'user_name' => $user->name,
                    'designation_name' => $user->designation->name,
                    'user_image' => $user->image,
                    'user_email' => $user->email,
                    'member_order' => $index + 1,
                    'tenure_start' => $user->updated_at,
                    'status' => 'current',
                    'is_auto_assigned' => true
                ];
            });

        // Get current committee number
        $currentCommitteeNumber = \App\Models\CommitteeAssignment::getCurrentCommitteeNumber();

        // Get previous committees data
        $previousCommittees = PreviousCommitteeMember::distinct('committee_number')
            ->orderBy('committee_number', 'desc')
            ->pluck('committee_number')
            ->map(function ($number) {
                $members = PreviousCommitteeMember::where('committee_number', $number)
                    ->orderBy('member_order')
                    ->get()
                    ->map(function ($member) {
                        return [
                            'id' => $member->id,
                            'name' => $member->name,
                            'designation' => $member->designation,
                            'photo' => $member->photo,
                            'member_order' => $member->member_order,
                            'email' => $member->email,
                            'tenure_start' => $member->tenure_start,
                            'tenure_end' => $member->tenure_end,
                        ];
                    });

                return [
                    'committee_number' => $number,
                    'members' => $members,
                    'member_count' => $members->count()
                ];
            });

        return Inertia::render('PreviousCommittee/Index', [
            'currentMembers' => $currentMembers,
            'currentCommitteeNumber' => $currentCommitteeNumber,
            'previousCommittees' => $previousCommittees,
            'totalCurrentMembers' => $currentMembers->count()
        ]);
    }

    /**
     * Show specific committee members
     */
    public function show($committeeNumber)
    {
        $members = PreviousCommitteeMember::getByCommittee($committeeNumber);
        
        return Inertia::render('PreviousCommittee/Show', [
            'committeeNumber' => $committeeNumber,
            'members' => $members
        ]);
    }

    /**
     * API endpoint to get committee data
     */
    public function getCommitteeData($committeeNumber = null)
    {
        if ($committeeNumber) {
            return response()->json([
                'committee' => $committeeNumber,
                'members' => PreviousCommitteeMember::getByCommittee($committeeNumber)
            ]);
        }
        
        return response()->json([
            'committees' => PreviousCommitteeMember::getAllCommittees()
        ]);
    }
}
