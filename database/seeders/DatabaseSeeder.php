<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed designations first
        $this->call([
            DesignationSeeder::class,
        ]);

        // Seed the test user with proper usertype
        \App\Models\User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'usertype' => 'member', // Explicitly set usertype
        ]);

        // Call other seeders
        $this->call([
            AdminSeeder::class,
            CommitteeSeeder::class,
            PreviousCommitteeMemberSeeder::class,
        ]);
    }
}
