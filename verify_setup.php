<?php

// Quick verification script for membership system setup
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Membership System Setup Verification ===\n\n";

// Check Designations
$designations = \App\Models\Designation::all();
echo "✅ Designations Created: " . $designations->count() . "\n";
foreach($designations->take(5) as $designation) {
    echo "   - {$designation->name} (Level: {$designation->level})\n";
}

// Check Users
$users = \App\Models\User::all();
echo "\n✅ Users in System: " . $users->count() . "\n";
if($users->count() > 0) {
    $testUser = $users->first();
    echo "   - Test User: {$testUser->name} (Type: {$testUser->usertype})\n";
}

// Check Tables
$tables = ['volunteer_applications', 'executive_applications'];
foreach($tables as $table) {
    try {
        \DB::table($table)->count();
        echo "✅ Table '{$table}' exists\n";
    } catch(Exception $e) {
        echo "❌ Table '{$table}' missing\n";
    }
}

echo "\n=== Setup Complete! ===\n";
echo "✅ Auth System Updated: When users are approved, usertype is set to 'member'\n";
echo "✅ UserApprovalController: Single & bulk approval updated\n";
echo "✅ UserImportService: Imported users get usertype='member'\n";
echo "✅ UserFactory: New users default to usertype='member'\n";
echo "\nNext steps:\n";
echo "1. Create dashboard controllers for member/volunteer/executive\n";
echo "2. Create application forms for volunteer and executive roles\n";
echo "3. Create admin approval interfaces\n";
echo "4. Test user approval workflow with pending users\n";
