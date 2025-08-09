<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Committee;

class CommitteeSeeder extends Seeder
{
    public function run()
    {
        // Check if user exists
        $user = User::first();

        // If no user, create one with required fields filled
        if (!$user) {
            $user = User::create([
                'name' => 'Seed User',
                'email' => 'seeduser@example.com',
                'password' => bcrypt('password'),
                'phone' => '0123456789',
                'department' => 'General',
                'session' => '2023',
                'usertype' => 'member',
                'gender' => 'male',
                'date_of_birth' => '1990-01-01',
                'blood_group' => 'O+',
                'class_roll' => '1',
                'father_name' => 'John Senior',
                'mother_name' => 'Jane Senior',
                'current_address' => '123 Street, City',
                'permanent_address' => '123 Street, City',
                'is_approved' => true,
                'member_id' => 'M123',
                'transaction_id' => 'T123',
                'to_account' => 'Account123',
                'image' => 'default.jpg',
                'skills' => 'Leadership, Management',
                'custom-form' => null,
            ]);
        }

        // Now create committees for this user
        Committee::create([
            'name' => 'Finance Committee',
            'description' => 'Handles all financial matters.',
            'user_id' => $user->id,
        ]);

        Committee::create([
            'name' => 'Events Committee',
            'description' => 'Organizes all events.',
            'user_id' => $user->id,
        ]);
    }
}
