<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Manager
        $manager = Admin::firstOrCreate(
            ['email' => 'manager@buits.com'],
            [
                'name' => 'Manager User',
                'username' => 'manager',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );
        $manager->assignRole('manager');

        // 2. Editor
        $editor = Admin::firstOrCreate(
            ['email' => 'editor@buits.com'],
            [
                'name' => 'Editor User',
                'username' => 'editor',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );
        $editor->assignRole('editor');

        // 3. Viewer
        $viewer = Admin::firstOrCreate(
            ['email' => 'viewer@buits.com'],
            [
                'name' => 'Viewer User',
                'username' => 'viewer',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );
        $viewer->assignRole('viewer');
    }
}
