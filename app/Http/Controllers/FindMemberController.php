<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;

class FindMemberController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('query');

        if (empty($query)) {
            return response()->json([]);
        }

        $members = User::where('email', 'like', "%{$query}%")
            ->orWhere('phone', 'like', "%{$query}%")
            ->select('id', 'name', 'member_id', 'department', 'session', 'email', 'phone', 'image', 'usertype', 'designation_id')
            ->with('designation')
            ->limit(10)
            ->get();

        // Format the output
        $formattedMembers = $members->map(function ($member) {
            return [
                'id' => $member->member_id ?? 'Pending',
                'name' => $member->name,
                'department' => $member->department ?? 'N/A',
                'session' => $member->session ?? 'N/A',
                'email' => $member->email,
                'phone' => $member->phone ?? 'N/A',
                'position' => $member->designation ? $member->designation->name : ($member->usertype === 'executive' ? 'Executive Member' : 'General Member'),
                'image' => $member->image ? '/storage/' . $member->image : null,
                'usertype' => $member->usertype,
            ];
        });

        return response()->json($formattedMembers);
    }
}
