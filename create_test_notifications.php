<?php

require_once 'vendor/autoload.php';

use App\Models\User;
use App\Models\VolunteerApplication;
use App\Models\ExecutiveApplication;
use App\Models\PendingUser;

// Boot Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    // Create test volunteer application
    $user = User::where('usertype', 'member')->first();
    if ($user) {
        VolunteerApplication::create([
            'user_id' => $user->id,
            'reason' => 'I want to contribute to the organization',
            'status' => 'pending'
        ]);
        echo "Created volunteer application for {$user->name}\n";
    } else {
        echo "No member users found\n";
    }

    // Create test pending user
    PendingUser::create([
        'name' => 'Test User',
        'email' => 'test' . time() . '@example.com',
        'department' => 'Computer Science',
        'session' => '2023-24',
        'usertype' => 'member'
    ]);
    echo "Created pending user\n";

    // Show final counts
    echo "\nFinal counts:\n";
    echo "Volunteer Applications: " . VolunteerApplication::where('status', 'pending')->count() . "\n";
    echo "Executive Applications: " . ExecutiveApplication::where('status', 'pending')->count() . "\n";
    echo "Pending Users: " . PendingUser::count() . "\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
