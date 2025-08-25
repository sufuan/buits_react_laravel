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
        // Real IT Society designations matching current structure
        $designations = [
            'President',
            'Vice President (Admin)',
            'Vice President (Technical)', 
            'Vice President (Finance)',
            'General Secretary',
            'Additional General Secretary',
            'Joint General Secretary',
            'Finance Secretary',
            'Joint Finance Secretary',
            'Human Resource Secretary',
            'Joint Human Resource Secretary',
            'Event Organizer Secretary',
            'Joint Event Organizer Secretary',
            'Office Maintenance Secretary',
            'Joint Office Maintenance Secretary',
            'Public Relations Secretary',
            'Joint Public Relations Secretary',
            'Graphics & Designing Secretary',
            'Joint Graphics & Designing Secretary',
            'Research & Development Secretary',
            'Joint Research & Development Secretary'
        ];

        // Real member names for different committees
        $memberNames = [
            // Committee 1 (2023-2024)
            [
                'Ahmed Hassan', 'Fatima Rahman', 'Mohammad Ali', 'Saira Khan', 'Tanvir Ahmed',
                'Nusrat Jahan', 'Rafi Uddin', 'Shabnam Akter', 'Karim Hasan', 'Rashida Begum',
                'Imran Sheikh', 'Salma Khatun', 'Nasir Uddin', 'Rubina Yasmin', 'Farhan Ahmed',
                'Ayesha Siddiqui', 'Mizanur Rahman', 'Taslima Akter', 'Shahid Islam', 'Farhana Begum'
            ],
            // Committee 2 (2022-2023) 
            [
                'Abdul Karim', 'Sultana Razia', 'Habibur Rahman', 'Nasreen Akter', 'Shamsul Haque',
                'Ruma Khatun', 'Alamgir Hossain', 'Shahana Begum', 'Rafiqul Islam', 'Mahmuda Khatun',
                'Golam Mostafa', 'Salina Begum', 'Asaduzzaman', 'Rashida Khatun', 'Delwar Hossain',
                'Nasima Begum', 'Mofazzal Hoque', 'Rabeya Khatun', 'Moklesur Rahman', 'Rahima Begum'
            ],
            // Committee 3 (2021-2022)
            [
                'Aminul Islam', 'Halima Khatun', 'Matiur Rahman', 'Kohinoor Begum', 'Sirajul Islam',
                'Forida Begum', 'Anwar Hossain', 'Morzina Khatun', 'Nazrul Islam', 'Salma Begum',
                'Bazlur Rahman', 'Fatema Khatun', 'Abdur Rahim', 'Rahela Begum', 'Harunur Rashid',
                'Monowara Begum', 'Mahbubur Rahman', 'Shahida Khatun', 'Nurul Amin', 'Rasheda Begum'
            ],
            // Committee 4 (2020-2021)
            [
                'Zakir Hossain', 'Kamrun Nahar', 'Abul Kalam', 'Feroza Begum', 'Mosharraf Hossain',
                'Nasreen Begum', 'Jalal Uddin', 'Rehana Khatun', 'Shahin Ahmed', 'Roksana Begum',
                'Jahangir Alam', 'Shirina Akter', 'Lutfar Rahman', 'Shamim Ara', 'Bellal Hossain',
                'Dilruba Begum', 'Rezaul Karim', 'Sufiya Khatun', 'Mokhlesur Rahman', 'Yasmin Akter'
            ],
            // Committee 5 (2019-2020)
            [
                'Shahadat Hossain', 'Rashida Akter', 'Azizul Haque', 'Rowshan Ara', 'Monir Hossain',
                'Kulsum Begum', 'Iqbal Hossain', 'Masuda Begum', 'Shafiq Ahmed', 'Ruma Begum',
                'Rafiq Uddin', 'Nasreen Sultana', 'Mahfuz Rahman', 'Razia Begum', 'Sultan Ahmed',
                'Saleha Khatun', 'Aziz Rahman', 'Kohinoor Akter', 'Riaz Uddin', 'Mahmuda Akter'
            ],
            // Committee 6 (2018-2019)
            [
                'Khorshed Alam', 'Rasheda Khatun', 'Abdus Sattar', 'Hosne Ara', 'Billal Ahmed',
                'Morsheda Begum', 'Hafez Uddin', 'Salma Akter', 'Rubel Hossain', 'Fatema Begum',
                'Nazim Uddin', 'Shirin Akter', 'Mostofa Kamal', 'Rahima Khatun', 'Saiful Islam',
                'Parvin Begum', 'Morshed Alam', 'Selina Khatun', 'Fazlul Haque', 'Rashida Sultana'
            ]
        ];

        // Create 6 committees with 20 members each
        for ($committee = 1; $committee <= 6; $committee++) {
            for ($member = 1; $member <= 20; $member++) {
                PreviousCommitteeMember::create([
                    'name' => $memberNames[$committee - 1][$member - 1],
                    'designation' => $designations[($member - 1) % count($designations)],
                    'committee_number' => $committee,
                    'member_order' => $member,
                ]);
            }
        }
    }
}
