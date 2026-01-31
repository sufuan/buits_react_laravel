<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PublicProfileController extends Controller
{
    public function show($member_id)
    {
        $user = User::where('member_id', $member_id)->firstOrFail();

        return Inertia::render('Public/Profile', [
            'user' => $user->only([
                'name', 'email', 'member_id', 'designation', 'image',
                'department', 'session', 'about', 'skills', 'created_at'
            ]),
        ]);
    }
}
