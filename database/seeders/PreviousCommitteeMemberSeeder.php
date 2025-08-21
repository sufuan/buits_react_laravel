<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PreviousCommitteeMember;

class PreviousCommitteeMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sample designations for committee members
        $designations = [
            'President', 'Vice President', 'General Secretary', 'Joint Secretary',
            'Treasurer', 'Assistant Treasurer', 'Organizing Secretary',
            'Cultural Secretary', 'Sports Secretary', 'Social Welfare Secretary',
            'Publication Secretary', 'Research Secretary', 'Executive Member',
            'Senior Executive Member', 'Committee Member', 'Advisory Member',
            'Senior Member', 'Associate Member', 'Special Member', 'Honorary Member'
        ];

        // Create 6 committees with 20 members each
        for ($committee = 1; $committee <= 6; $committee++) {
            for ($member = 1; $member <= 20; $member++) {
                PreviousCommitteeMember::create([
                    'name' => "Committee {$committee} Member {$member}",
                    'designation' => $designations[($member - 1) % count($designations)],
                    'photo' => "committee_{$committee}_member_{$member}.jpg", // Placeholder photo name
                    'committee_number' => $committee,
                    'member_order' => $member,
                ]);
            }
        }
    }
}
