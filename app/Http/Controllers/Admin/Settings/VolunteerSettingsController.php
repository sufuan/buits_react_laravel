<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\AdminLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class VolunteerSettingsController extends Controller
{
    public function index()
    {
        $setting = Setting::where('key', 'volunteer_applications_enabled')->first();
        
        return Inertia::render('Admin/Settings/Volunteer', [
            'volunteerEnabled' => $setting ? $setting->value === 'true' : false,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'enabled' => 'required|boolean',
        ]);

        $setting = Setting::updateOrCreate(
            ['key' => 'volunteer_applications_enabled'],
            ['value' => $request->boolean('enabled') ? 'true' : 'false']
        );

        // Log the action
        AdminLog::create([
            'admin_id' => Auth::guard('admin')->id(),
            'action' => 'toggle_volunteer_applications',
            'details' => [
                'old_value' => !$request->enabled,
                'new_value' => $request->enabled
            ],
            'ip_address' => $request->ip()
        ]);

        return back()->with('success', 'Volunteer application settings updated successfully.');
    }
}
