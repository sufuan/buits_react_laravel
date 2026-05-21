<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\AdminLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PaymentSettingsController extends Controller
{
    public function index()
    {
        $setting = Setting::where('key', 'payment_enabled')->first();
        
        return Inertia::render('Admin/Settings/PaymentSetting', [
            'paymentEnabled' => $setting ? $setting->value === 'true' : false,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'enabled' => 'required|boolean',
        ]);

        $setting = Setting::updateOrCreate(
            ['key' => 'payment_enabled'],
            ['value' => $request->boolean('enabled') ? 'true' : 'false']
        );

        // Log the action
        AdminLog::create([
            'admin_id' => Auth::guard('admin')->id(),
            'action' => 'toggle_payment_system',
            'details' => [
                'old_value' => !$request->enabled,
                'new_value' => $request->enabled
            ],
            'ip_address' => $request->ip()
        ]);

        return back()->with('success', 'Payment settings updated successfully.');
    }
}
