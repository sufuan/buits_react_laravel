<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class CommitteeSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Setting::updateOrCreate(
            ['key' => 'is_current_committee_published'],
            [
                'value' => 'false',
                'description' => 'Determines if the current executive committee is visible to the public'
            ]
        );
    }
}
