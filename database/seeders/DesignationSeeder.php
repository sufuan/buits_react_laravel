<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Designation;

class DesignationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // President (Top Level)
        $president = Designation::create([
            'name' => 'President',
            'level' => 'president',
            'parent_id' => null,
            'sort_order' => 1,
            'is_active' => true
        ]);

        // Vice Presidents (Second Level)
        $vpAdmin = Designation::create([
            'name' => 'Vice President (Admin)',
            'level' => 'vice_president',
            'parent_id' => $president->id,
            'sort_order' => 1,
            'is_active' => true
        ]);

        $vpFinance = Designation::create([
            'name' => 'Vice President (Finance)',
            'level' => 'vice_president',
            'parent_id' => $president->id,
            'sort_order' => 2,
            'is_active' => true
        ]);

        // General Secretary
        $generalSecretary = Designation::create([
            'name' => 'General Secretary',
            'level' => 'secretary',
            'parent_id' => $vpAdmin->id,
            'sort_order' => 1,
            'is_active' => true
        ]);

        // Assistant Secretaries
        Designation::create([
            'name' => 'Assistant Secretary (Admin)',
            'level' => 'assistant_secretary',
            'parent_id' => $generalSecretary->id,
            'sort_order' => 1,
            'is_active' => true
        ]);

        Designation::create([
            'name' => 'Assistant Secretary (Finance)',
            'level' => 'assistant_secretary',
            'parent_id' => $vpFinance->id,
            'sort_order' => 2,
            'is_active' => true
        ]);

        // Treasurer
        $treasurer = Designation::create([
            'name' => 'Treasurer',
            'level' => 'treasurer',
            'parent_id' => $vpFinance->id,
            'sort_order' => 1,
            'is_active' => true
        ]);

        // Assistant Treasurer
        Designation::create([
            'name' => 'Assistant Treasurer',
            'level' => 'assistant_treasurer',
            'parent_id' => $treasurer->id,
            'sort_order' => 1,
            'is_active' => true
        ]);

        // Organizing Secretaries
        Designation::create([
            'name' => 'Organizing Secretary (Events)',
            'level' => 'organizing_secretary',
            'parent_id' => $generalSecretary->id,
            'sort_order' => 1,
            'is_active' => true
        ]);

        Designation::create([
            'name' => 'Organizing Secretary (Publications)',
            'level' => 'organizing_secretary',
            'parent_id' => $generalSecretary->id,
            'sort_order' => 2,
            'is_active' => true
        ]);

        Designation::create([
            'name' => 'Organizing Secretary (Sports)',
            'level' => 'organizing_secretary',
            'parent_id' => $generalSecretary->id,
            'sort_order' => 3,
            'is_active' => true
        ]);

        // Executive Members
        for ($i = 1; $i <= 5; $i++) {
            Designation::create([
                'name' => "Executive Member {$i}",
                'level' => 'executive_member',
                'parent_id' => $generalSecretary->id,
                'sort_order' => $i,
                'is_active' => true
            ]);
        }
    }
}
