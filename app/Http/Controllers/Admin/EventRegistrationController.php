<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventRegistrationController extends Controller
{
    /**
     * Display a listing of event registrations.
     */
    public function index()
    {
        return Inertia::render('Admin/EventRegistrations/Index', [
            //
        ]);
    }
}
