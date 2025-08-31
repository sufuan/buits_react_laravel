<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CommitteeAssignment;
use App\Models\PreviousCommitteeMember;
use Inertia\Inertia;

class PublicCommitteeController extends Controller
{
    /**
     * Display the public committee page with current and previous committees
     */
    public function index()
    {
        // Get current committee members
        $currentMembers = CommitteeAssignment::current()
            ->with(['user', 'designation'])
            ->ordered()
            ->get()
            ->map(function ($assignment) {
                return [
                    'id' => $assignment->id,
                    'user_name' => $assignment->user->name,
                    'designation_name' => $assignment->designation->name,
                    'user_image' => $assignment->user->image,
                    'member_order' => $assignment->member_order,
                    'user_email' => $assignment->user->email,
                    'tenure_start' => $assignment->tenure_start
                ];
            });

        // Get current committee number
        $currentCommitteeNumber = CommitteeAssignment::getCurrentCommitteeNumber();

        // Get all previous committees data
        $previousCommittees = PreviousCommitteeMember::with(['user', 'designation'])
            ->orderBy('committee_number', 'desc')
            ->orderBy('member_order', 'asc')
            ->get()
            ->map(function ($member) {
                return [
                    'id' => $member->id,
                    'user_name' => $member->name,
                    'designation_name' => $member->designation,
                    'user_image' => $member->photo,
                    'member_order' => $member->member_order,
                    'user_email' => $member->email,
                    'committee_number' => $member->committee_number,
                    'tenure_start' => $member->tenure_start,
                    'tenure_end' => $member->tenure_end
                ];
            });

        // Get unique committee numbers for the filter
        $availableCommitteeNumbers = PreviousCommitteeMember::distinct()
            ->orderBy('committee_number', 'desc')
            ->pluck('committee_number');

        return Inertia::render('Public/Committees', [
            'currentMembers' => $currentMembers,
            'currentCommitteeNumber' => $currentCommitteeNumber,
            'previousCommittees' => $previousCommittees,
            'availableCommitteeNumbers' => $availableCommitteeNumbers
        ]);
    }

    /**
     * Get previous committee members by committee number (API endpoint)
     */
    public function getPreviousCommittee($committeeNumber)
    {
        $members = PreviousCommitteeMember::where('committee_number', $committeeNumber)
            ->ordered()
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

        return response()->json([
            'committee_number' => $committeeNumber,
            'members' => $members,
            'member_count' => $members->count()
        ]);
    }

    /**
     * Get all previous committees data (API endpoint)
     */
    public function getAllPreviousCommittees()
    {
        $committees = PreviousCommitteeMember::getAllCommittees();
        
        $formattedCommittees = [];
        foreach ($committees as $number => $members) {
            $formattedCommittees[] = [
                'committee_number' => $number,
                'members' => $members->map(function ($member) {
                    return [
                        'id' => $member->id,
                        'name' => $member->name,
                        'designation' => $member->designation,
                        'photo' => $member->photo,
                        'member_order' => $member->member_order
                    ];
                }),
                'member_count' => $members->count()
            ];
        }

        return response()->json($formattedCommittees);
    }
}
