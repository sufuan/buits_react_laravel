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
        $committees = PreviousCommitteeMember::getAllCommittees();
        
        return Inertia::render('PreviousCommittee/Index', [
            'committees' => $committees
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
