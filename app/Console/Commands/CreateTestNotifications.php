<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\VolunteerApplication;
use App\Models\ExecutiveApplication;
use App\Models\PendingUser;

class CreateTestNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:notifications';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create test notification data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            // Create test volunteer application
            $user = User::where('usertype', 'member')->first();
            if ($user) {
                VolunteerApplication::create([
                    'user_id' => $user->id,
                    'reason' => 'I want to contribute to the organization',
                    'status' => 'pending'
                ]);
                $this->info("Created volunteer application for {$user->name}");
            } else {
                $this->warn("No member users found");
            }

            // Create test pending user
            PendingUser::create([
                'name' => 'Test User',
                'email' => 'test' . time() . '@example.com',
                'department' => 'Computer Science',
                'session' => '2023-24',
                'usertype' => 'member'
            ]);
            $this->info("Created pending user");

            // Show final counts
            $volunteerCount = VolunteerApplication::where('status', 'pending')->count();
            $executiveCount = ExecutiveApplication::where('status', 'pending')->count();
            $pendingUserCount = PendingUser::count();

            $this->info("\nFinal counts:");
            $this->line("Volunteer Applications: {$volunteerCount}");
            $this->line("Executive Applications: {$executiveCount}");
            $this->line("Pending Users: {$pendingUserCount}");

            $this->info("\nNow go to admin dashboard to see notification badges!");

        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
        }
    }
}
