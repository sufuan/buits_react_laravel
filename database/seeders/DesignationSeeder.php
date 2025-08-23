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
        // Disable foreign key checks temporarily
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Clear existing designations
        Designation::truncate();
        
        // Re-enable foreign key checks
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Level 1: Executive Leadership (President + Vice Presidents)
        $president = Designation::create([
            'name' => 'President',
            'level' => 1,
            'parent_id' => null,
            'sort_order' => 1,
            'is_active' => true
        ]);

        $vpAdmin = Designation::create([
            'name' => 'Vice President (Admin)',
            'level' => 1,
            'parent_id' => null,
            'sort_order' => 2,
            'is_active' => true
        ]);

        $vpTechnical = Designation::create([
            'name' => 'Vice President (Technical)',
            'level' => 1,
            'parent_id' => null,
            'sort_order' => 3,
            'is_active' => true
        ]);

        $vpFinance = Designation::create([
            'name' => 'Vice President (Finance)',
            'level' => 1,
            'parent_id' => null,
            'sort_order' => 4,
            'is_active' => true
        ]);

        // Level 2: Administrative Leadership (General Secretaries)
        $generalSecretary = Designation::create([
            'name' => 'General Secretary',
            'level' => 2,
            'parent_id' => $vpAdmin->id,
            'sort_order' => 1,
            'is_active' => true
        ]);

        $additionalGeneralSecretary = Designation::create([
            'name' => 'Additional General Secretary',
            'level' => 2,
            'parent_id' => $vpAdmin->id,
            'sort_order' => 2,
            'is_active' => true
        ]);

        $jointGeneralSecretary = Designation::create([
            'name' => 'Joint General Secretary',
            'level' => 2,
            'parent_id' => $vpAdmin->id,
            'sort_order' => 3,
            'is_active' => true
        ]);

        // Level 3: Department Secretaries with their Joint Secretaries
        
        // Finance Department
        $financeSecretary = Designation::create([
            'name' => 'Finance Secretary',
            'level' => 3,
            'parent_id' => $vpFinance->id,
            'sort_order' => 1,
            'is_active' => true
        ]);

        Designation::create([
            'name' => 'Joint Finance Secretary',
            'level' => 3,
            'parent_id' => $vpFinance->id,
            'sort_order' => 2,
            'is_active' => true
        ]);

        // Human Resource Department
        $hrSecretary = Designation::create([
            'name' => 'Human Resource Secretary',
            'level' => 3,
            'parent_id' => $generalSecretary->id,
            'sort_order' => 1,
            'is_active' => true
        ]);

        Designation::create([
            'name' => 'Joint Human Resource Secretary',
            'level' => 3,
            'parent_id' => $generalSecretary->id,
            'sort_order' => 2,
            'is_active' => true
        ]);

        // Event Organization Department
        $eventSecretary = Designation::create([
            'name' => 'Event Organizer Secretary',
            'level' => 3,
            'parent_id' => $generalSecretary->id,
            'sort_order' => 3,
            'is_active' => true
        ]);

        Designation::create([
            'name' => 'Joint Event Organizer Secretary',
            'level' => 3,
            'parent_id' => $generalSecretary->id,
            'sort_order' => 4,
            'is_active' => true
        ]);

        // Office Maintenance Department
        $officeSecretary = Designation::create([
            'name' => 'Office Maintenance Secretary',
            'level' => 3,
            'parent_id' => $generalSecretary->id,
            'sort_order' => 5,
            'is_active' => true
        ]);

        Designation::create([
            'name' => 'Joint Office Maintenance Secretary',
            'level' => 3,
            'parent_id' => $generalSecretary->id,
            'sort_order' => 6,
            'is_active' => true
        ]);

        // Public Relations Department
        $prSecretary = Designation::create([
            'name' => 'Public Relations Secretary',
            'level' => 3,
            'parent_id' => $generalSecretary->id,
            'sort_order' => 7,
            'is_active' => true
        ]);

        Designation::create([
            'name' => 'Joint Public Relations Secretary',
            'level' => 3,
            'parent_id' => $generalSecretary->id,
            'sort_order' => 8,
            'is_active' => true
        ]);

        // Graphics & Designing Department
        $graphicsSecretary = Designation::create([
            'name' => 'Graphics & Designing Secretary',
            'level' => 3,
            'parent_id' => $vpTechnical->id,
            'sort_order' => 1,
            'is_active' => true
        ]);

        Designation::create([
            'name' => 'Joint Graphics & Designing Secretary',
            'level' => 3,
            'parent_id' => $vpTechnical->id,
            'sort_order' => 2,
            'is_active' => true
        ]);

        // Research & Development Department
        $rdSecretary = Designation::create([
            'name' => 'Research & Development Secretary',
            'level' => 3,
            'parent_id' => $vpTechnical->id,
            'sort_order' => 3,
            'is_active' => true
        ]);

        Designation::create([
            'name' => 'Joint Research & Development Secretary',
            'level' => 3,
            'parent_id' => $vpTechnical->id,
            'sort_order' => 4,
            'is_active' => true
        ]);
    }
}
