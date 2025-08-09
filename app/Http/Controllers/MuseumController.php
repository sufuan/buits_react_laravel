<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Committee;

class MuseumController extends Controller
{
    public function index()
    {
        // Since we don't have year column yet, let's provide rich mock data for the legendary museum
        // This matches your exact requirements for the immersive experience
        $legendaryYears = [
            [
                'year' => '2024',
                'theme' => 'Digital Innovation Era',
                'doorColor' => '#2C1810', // Modern dark wood
                'roomMood' => 'emerald', // Room lighting color
                'members' => [
                    ['id' => 1, 'name' => 'Sarah Chen', 'role' => 'President', 'avatar' => '/images/avatars/sarah.jpg'],
                    ['id' => 2, 'name' => 'Michael Rodriguez', 'role' => 'Vice President', 'avatar' => '/images/avatars/michael.jpg'],
                    ['id' => 3, 'name' => 'Aisha Patel', 'role' => 'Technical Director', 'avatar' => '/images/avatars/aisha.jpg'],
                    ['id' => 4, 'name' => 'James Wilson', 'role' => 'Secretary', 'avatar' => '/images/avatars/james.jpg'],
                    ['id' => 5, 'name' => 'Emma Thompson', 'role' => 'Treasurer', 'avatar' => '/images/avatars/emma.jpg'],
                    ['id' => 6, 'name' => 'David Kim', 'role' => 'Event Coordinator', 'avatar' => '/images/avatars/david.jpg'],
                    ['id' => 7, 'name' => 'Lisa Zhang', 'role' => 'Marketing Head', 'avatar' => '/images/avatars/lisa.jpg'],
                    ['id' => 8, 'name' => 'Robert Johnson', 'role' => 'Project Manager', 'avatar' => '/images/avatars/robert.jpg'],
                    ['id' => 9, 'name' => 'Maria Garcia', 'role' => 'Research Lead', 'avatar' => '/images/avatars/maria.jpg'],
                    ['id' => 10, 'name' => 'Ahmed Hassan', 'role' => 'Web Developer', 'avatar' => '/images/avatars/ahmed.jpg'],
                    ['id' => 11, 'name' => 'Sophie Martin', 'role' => 'UI/UX Designer', 'avatar' => '/images/avatars/sophie.jpg'],
                    ['id' => 12, 'name' => 'Carlos Rodriguez', 'role' => 'Database Admin', 'avatar' => '/images/avatars/carlos.jpg'],
                    ['id' => 13, 'name' => 'Priya Sharma', 'role' => 'AI Specialist', 'avatar' => '/images/avatars/priya.jpg'],
                    ['id' => 14, 'name' => 'Alex Turner', 'role' => 'Mobile Developer', 'avatar' => '/images/avatars/alex.jpg'],
                    ['id' => 15, 'name' => 'Nina Petrov', 'role' => 'Data Scientist', 'avatar' => '/images/avatars/nina.jpg'],
                    ['id' => 16, 'name' => 'Omar Ali', 'role' => 'DevOps Engineer', 'avatar' => '/images/avatars/omar.jpg'],
                    ['id' => 17, 'name' => 'Rachel Green', 'role' => 'Quality Assurance', 'avatar' => '/images/avatars/rachel.jpg'],
                    ['id' => 18, 'name' => 'Kevin Park', 'role' => 'System Analyst', 'avatar' => '/images/avatars/kevin.jpg'],
                    ['id' => 19, 'name' => 'Isabella Cruz', 'role' => 'Content Creator', 'avatar' => '/images/avatars/isabella.jpg'],
                    ['id' => 20, 'name' => 'Daniel Lee', 'role' => 'Network Admin', 'avatar' => '/images/avatars/daniel.jpg'],
                    ['id' => 21, 'name' => 'Fatima Al-Zahra', 'role' => 'Security Specialist', 'avatar' => '/images/avatars/fatima.jpg'],
                    ['id' => 22, 'name' => 'Lucas Silva', 'role' => 'Cloud Architect', 'avatar' => '/images/avatars/lucas.jpg']
                ],
                'roomAmbient' => 'Modern tech hub with holographic displays',
                'doorSound' => 'electronic-beep.mp3'
            ],
            [
                'year' => '2023',
                'theme' => 'Community Building Renaissance',
                'doorColor' => '#8B5A2B', // Contemporary brass
                'roomMood' => 'amber',
                'members' => [
                    ['id' => 23, 'name' => 'David Kim', 'role' => 'President', 'avatar' => '/images/avatars/david2023.jpg'],
                    ['id' => 24, 'name' => 'Emma Thompson', 'role' => 'Vice President', 'avatar' => '/images/avatars/emma2023.jpg'],
                    ['id' => 25, 'name' => 'Ryan O\'Connor', 'role' => 'Secretary', 'avatar' => '/images/avatars/ryan.jpg'],
                    ['id' => 26, 'name' => 'Zara Ahmed', 'role' => 'Treasurer', 'avatar' => '/images/avatars/zara.jpg'],
                    ['id' => 27, 'name' => 'Marcus Johnson', 'role' => 'Tech Lead', 'avatar' => '/images/avatars/marcus.jpg'],
                    ['id' => 28, 'name' => 'Lily Chen', 'role' => 'Design Head', 'avatar' => '/images/avatars/lily.jpg'],
                    ['id' => 29, 'name' => 'Hassan Ali', 'role' => 'Event Manager', 'avatar' => '/images/avatars/hassan.jpg'],
                    ['id' => 30, 'name' => 'Grace Williams', 'role' => 'PR Manager', 'avatar' => '/images/avatars/grace.jpg'],
                    ['id' => 31, 'name' => 'Diego Santos', 'role' => 'Developer', 'avatar' => '/images/avatars/diego.jpg'],
                    ['id' => 32, 'name' => 'Yuki Tanaka', 'role' => 'Data Analyst', 'avatar' => '/images/avatars/yuki.jpg'],
                    ['id' => 33, 'name' => 'Amara Okafor', 'role' => 'Community Manager', 'avatar' => '/images/avatars/amara.jpg'],
                    ['id' => 34, 'name' => 'Ethan Brown', 'role' => 'Workshop Coordinator', 'avatar' => '/images/avatars/ethan.jpg'],
                    ['id' => 35, 'name' => 'Ava Martinez', 'role' => 'Social Media Lead', 'avatar' => '/images/avatars/ava.jpg'],
                    ['id' => 36, 'name' => 'Noah Davis', 'role' => 'Tech Support', 'avatar' => '/images/avatars/noah.jpg'],
                    ['id' => 37, 'name' => 'Mia Wilson', 'role' => 'Content Writer', 'avatar' => '/images/avatars/mia.jpg'],
                    ['id' => 38, 'name' => 'Kai Nakamura', 'role' => 'Video Editor', 'avatar' => '/images/avatars/kai.jpg'],
                    ['id' => 39, 'name' => 'Zoe Taylor', 'role' => 'Graphic Designer', 'avatar' => '/images/avatars/zoe.jpg'],
                    ['id' => 40, 'name' => 'Liam Anderson', 'role' => 'Backend Developer', 'avatar' => '/images/avatars/liam.jpg'],
                    ['id' => 41, 'name' => 'Chloe Roberts', 'role' => 'Frontend Developer', 'avatar' => '/images/avatars/chloe.jpg'],
                    ['id' => 42, 'name' => 'Arjun Patel', 'role' => 'Mobile App Developer', 'avatar' => '/images/avatars/arjun.jpg'],
                    ['id' => 43, 'name' => 'Elena Volkov', 'role' => 'Research Assistant', 'avatar' => '/images/avatars/elena.jpg'],
                    ['id' => 44, 'name' => 'Tyler Mitchell', 'role' => 'Hardware Specialist', 'avatar' => '/images/avatars/tyler.jpg']
                ],
                'roomAmbient' => 'Warm collaborative space with community photos',
                'doorSound' => 'wooden-creak.mp3'
            ],
            [
                'year' => '2022',
                'theme' => 'Post-Pandemic Revival',
                'doorColor' => '#A0522D', // Transitional sienna
                'roomMood' => 'deep-red',
                'members' => [
                    ['id' => 45, 'name' => 'James Wilson', 'role' => 'President', 'avatar' => '/images/avatars/james2022.jpg'],
                    ['id' => 46, 'name' => 'Sophia Lee', 'role' => 'Vice President', 'avatar' => '/images/avatars/sophia.jpg'],
                    ['id' => 47, 'name' => 'Oliver Smith', 'role' => 'Secretary', 'avatar' => '/images/avatars/oliver.jpg'],
                    ['id' => 48, 'name' => 'Maya Patel', 'role' => 'Treasurer', 'avatar' => '/images/avatars/maya.jpg'],
                    ['id' => 49, 'name' => 'Jackson Brown', 'role' => 'Tech Coordinator', 'avatar' => '/images/avatars/jackson.jpg'],
                    ['id' => 50, 'name' => 'Aria Kim', 'role' => 'Event Planner', 'avatar' => '/images/avatars/aria.jpg'],
                    ['id' => 51, 'name' => 'Caleb Jones', 'role' => 'Marketing Lead', 'avatar' => '/images/avatars/caleb.jpg'],
                    ['id' => 52, 'name' => 'Luna Rodriguez', 'role' => 'Social Coordinator', 'avatar' => '/images/avatars/luna.jpg'],
                    ['id' => 53, 'name' => 'Ezra Thompson', 'role' => 'Web Developer', 'avatar' => '/images/avatars/ezra.jpg'],
                    ['id' => 54, 'name' => 'Nora Chen', 'role' => 'App Developer', 'avatar' => '/images/avatars/nora.jpg'],
                    ['id' => 55, 'name' => 'Felix Garcia', 'role' => 'Database Manager', 'avatar' => '/images/avatars/felix.jpg'],
                    ['id' => 56, 'name' => 'Ivy Martinez', 'role' => 'UI Designer', 'avatar' => '/images/avatars/ivy.jpg'],
                    ['id' => 57, 'name' => 'Leo Wang', 'role' => 'System Admin', 'avatar' => '/images/avatars/leo.jpg'],
                    ['id' => 58, 'name' => 'Ruby Johnson', 'role' => 'Content Manager', 'avatar' => '/images/avatars/ruby.jpg'],
                    ['id' => 59, 'name' => 'Atlas Davis', 'role' => 'Network Specialist', 'avatar' => '/images/avatars/atlas.jpg'],
                    ['id' => 60, 'name' => 'Sage Wilson', 'role' => 'Security Analyst', 'avatar' => '/images/avatars/sage.jpg'],
                    ['id' => 61, 'name' => 'River Taylor', 'role' => 'Data Manager', 'avatar' => '/images/avatars/river.jpg'],
                    ['id' => 62, 'name' => 'Phoenix Lee', 'role' => 'Cloud Engineer', 'avatar' => '/images/avatars/phoenix.jpg'],
                    ['id' => 63, 'name' => 'Sage Anderson', 'role' => 'DevOps Lead', 'avatar' => '/images/avatars/sage2.jpg'],
                    ['id' => 64, 'name' => 'Nova Roberts', 'role' => 'AI Researcher', 'avatar' => '/images/avatars/nova.jpg'],
                    ['id' => 65, 'name' => 'Orion Clark', 'role' => 'Machine Learning', 'avatar' => '/images/avatars/orion.jpg'],
                    ['id' => 66, 'name' => 'Iris White', 'role' => 'Quality Engineer', 'avatar' => '/images/avatars/iris.jpg']
                ],
                'roomAmbient' => 'Hybrid space blending digital and physical elements',
                'doorSound' => 'metal-click.mp3'
            ],
            [
                'year' => '2021',
                'theme' => 'Digital Adaptation Era',
                'doorColor' => '#CD853F', // Digital peru
                'roomMood' => 'blue',
                'members' => [
                    ['id' => 67, 'name' => 'Lisa Zhang', 'role' => 'President', 'avatar' => '/images/avatars/lisa2021.jpg'],
                    ['id' => 68, 'name' => 'Max Turner', 'role' => 'Vice President', 'avatar' => '/images/avatars/max.jpg'],
                    ['id' => 69, 'name' => 'Zara Khan', 'role' => 'Secretary', 'avatar' => '/images/avatars/zara2021.jpg'],
                    ['id' => 70, 'name' => 'Finn O\'Brien', 'role' => 'Treasurer', 'avatar' => '/images/avatars/finn.jpg'],
                    ['id' => 71, 'name' => 'Jade Liu', 'role' => 'Tech Lead', 'avatar' => '/images/avatars/jade.jpg'],
                    ['id' => 72, 'name' => 'Axel Schmidt', 'role' => 'Project Manager', 'avatar' => '/images/avatars/axel.jpg'],
                    ['id' => 73, 'name' => 'Vera Petrov', 'role' => 'Research Head', 'avatar' => '/images/avatars/vera.jpg'],
                    ['id' => 74, 'name' => 'Cruz Santos', 'role' => 'Developer', 'avatar' => '/images/avatars/cruz.jpg'],
                    ['id' => 75, 'name' => 'Skye Johnson', 'role' => 'Designer', 'avatar' => '/images/avatars/skye.jpg'],
                    ['id' => 76, 'name' => 'Jude Williams', 'role' => 'Analyst', 'avatar' => '/images/avatars/jude.jpg'],
                    ['id' => 77, 'name' => 'Wren Davis', 'role' => 'Coordinator', 'avatar' => '/images/avatars/wren.jpg'],
                    ['id' => 78, 'name' => 'Vale Martinez', 'role' => 'Specialist', 'avatar' => '/images/avatars/vale.jpg'],
                    ['id' => 79, 'name' => 'Knox Brown', 'role' => 'Engineer', 'avatar' => '/images/avatars/knox.jpg'],
                    ['id' => 80, 'name' => 'Sage Miller', 'role' => 'Architect', 'avatar' => '/images/avatars/sage3.jpg'],
                    ['id' => 81, 'name' => 'Remy Wilson', 'role' => 'Consultant', 'avatar' => '/images/avatars/remy.jpg'],
                    ['id' => 82, 'name' => 'Dex Taylor', 'role' => 'Advisor', 'avatar' => '/images/avatars/dex.jpg'],
                    ['id' => 83, 'name' => 'Blu Anderson', 'role' => 'Mentor', 'avatar' => '/images/avatars/blu.jpg'],
                    ['id' => 84, 'name' => 'Zen Roberts', 'role' => 'Guide', 'avatar' => '/images/avatars/zen.jpg'],
                    ['id' => 85, 'name' => 'Ray Clark', 'role' => 'Support', 'avatar' => '/images/avatars/ray.jpg'],
                    ['id' => 86, 'name' => 'Sky White', 'role' => 'Helper', 'avatar' => '/images/avatars/sky.jpg'],
                    ['id' => 87, 'name' => 'Neo Green', 'role' => 'Assistant', 'avatar' => '/images/avatars/neo.jpg'],
                    ['id' => 88, 'name' => 'Ace Black', 'role' => 'Volunteer', 'avatar' => '/images/avatars/ace.jpg']
                ],
                'roomAmbient' => 'Digital-first environment with virtual reality elements',
                'doorSound' => 'digital-chime.mp3'
            ],
            [
                'year' => '2020',
                'theme' => 'Foundation & Vision',
                'doorColor' => '#B8860B', // Classic dark goldenrod
                'roomMood' => 'golden',
                'members' => [
                    ['id' => 89, 'name' => 'Robert Johnson', 'role' => 'Founding President', 'avatar' => '/images/avatars/robert2020.jpg'],
                    ['id' => 90, 'name' => 'Maria Garcia', 'role' => 'Founding VP', 'avatar' => '/images/avatars/maria2020.jpg'],
                    ['id' => 91, 'name' => 'Ahmed Hassan', 'role' => 'Secretary', 'avatar' => '/images/avatars/ahmed2020.jpg'],
                    ['id' => 92, 'name' => 'Sarah Kim', 'role' => 'Treasurer', 'avatar' => '/images/avatars/sarah2020.jpg'],
                    ['id' => 93, 'name' => 'John Smith', 'role' => 'Tech Lead', 'avatar' => '/images/avatars/john.jpg'],
                    ['id' => 94, 'name' => 'Lisa Chen', 'role' => 'Event Manager', 'avatar' => '/images/avatars/lisa2020.jpg'],
                    ['id' => 95, 'name' => 'Mike Wilson', 'role' => 'PR Head', 'avatar' => '/images/avatars/mike.jpg'],
                    ['id' => 96, 'name' => 'Anna Petrov', 'role' => 'Designer', 'avatar' => '/images/avatars/anna.jpg'],
                    ['id' => 97, 'name' => 'David Lee', 'role' => 'Developer', 'avatar' => '/images/avatars/david2020.jpg'],
                    ['id' => 98, 'name' => 'Emma Brown', 'role' => 'Analyst', 'avatar' => '/images/avatars/emma2020.jpg'],
                    ['id' => 99, 'name' => 'James Taylor', 'role' => 'Coordinator', 'avatar' => '/images/avatars/james2020.jpg'],
                    ['id' => 100, 'name' => 'Sophie Davis', 'role' => 'Manager', 'avatar' => '/images/avatars/sophie2020.jpg'],
                    ['id' => 101, 'name' => 'Alex Martinez', 'role' => 'Specialist', 'avatar' => '/images/avatars/alex2020.jpg'],
                    ['id' => 102, 'name' => 'Nina Rodriguez', 'role' => 'Engineer', 'avatar' => '/images/avatars/nina2020.jpg'],
                    ['id' => 103, 'name' => 'Omar Wilson', 'role' => 'Architect', 'avatar' => '/images/avatars/omar2020.jpg'],
                    ['id' => 104, 'name' => 'Rachel Johnson', 'role' => 'Consultant', 'avatar' => '/images/avatars/rachel2020.jpg'],
                    ['id' => 105, 'name' => 'Kevin Garcia', 'role' => 'Advisor', 'avatar' => '/images/avatars/kevin2020.jpg'],
                    ['id' => 106, 'name' => 'Isabella Lee', 'role' => 'Mentor', 'avatar' => '/images/avatars/isabella2020.jpg'],
                    ['id' => 107, 'name' => 'Daniel Kim', 'role' => 'Guide', 'avatar' => '/images/avatars/daniel2020.jpg'],
                    ['id' => 108, 'name' => 'Fatima Ali', 'role' => 'Support', 'avatar' => '/images/avatars/fatima2020.jpg'],
                    ['id' => 109, 'name' => 'Lucas Chen', 'role' => 'Helper', 'avatar' => '/images/avatars/lucas2020.jpg'],
                    ['id' => 110, 'name' => 'Maya Singh', 'role' => 'Assistant', 'avatar' => '/images/avatars/maya2020.jpg']
                ],
                'roomAmbient' => 'Classic founding chamber with historical documents',
                'doorSound' => 'ancient-door.mp3'
            ]
        ];

        return Inertia::render('Museum', [
            'legendaryYears' => $legendaryYears,
            'emblem' => '/images/buits-emblem.svg',
            'totalMembers' => collect($legendaryYears)->sum(fn($year) => count($year['members'])),
            'totalArtifacts' => collect($legendaryYears)->sum(fn($year) =>
                collect($year['members'])->sum(fn($member) => count($member['artifacts'] ?? []))
            ),
            'foundingYear' => '2020',
            'currentYear' => date('Y')
        ]);
    }
}
