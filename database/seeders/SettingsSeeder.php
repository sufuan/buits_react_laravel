<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Setting::updateOrCreate(
            ['key' => 'volunteer_applications_enabled'],
            [
                'value' => 'true',
                'description' => 'Toggle volunteer application system availability'
            ]
        );
    }
}
