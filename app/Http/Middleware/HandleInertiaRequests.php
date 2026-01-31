<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $admin = Auth::guard('admin')->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? $request->user()->load('volunteerApplication') : null,
                'admin' => $admin ? [
                    'id' => $admin->id,
                    'name' => $admin->name,
                    'email' => $admin->email,
                    'username' => $admin->username,
                    'status' => $admin->status,
                    'permissions' => $admin->getAllPermissions()->pluck('name'),
                    'roles' => $admin->getRoleNames(),
                ] : null,
            ],
            // Share notification counts globally for admin pages
            'upcomingEventsCount' => $admin ? \App\Models\Event::upcoming()->count() : 0,

            'settings' => [
                'volunteer_applications_enabled' => \App\Models\Setting::where('key', 'volunteer_applications_enabled')->value('value') === 'true',
            ],
        ];
    }
}
