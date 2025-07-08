<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class UsersTemplateExport implements FromArray, WithHeadings
{
    public function array(): array
    {
        return [
            [
                'John Doe',
                'john@example.com',
                'password123',
                '1234567890',
                'user',
                '2020-2024',
                'Computer Science and Engineering',
                'male',
                '1995-01-15',
                'A+',
                'CSE001',
                'John Father',
                'John Mother',
                '123 Main St',
                '456 Home St',
                'profile.jpg',
                'Programming, Web Development',
                'TXN123456',
                'Custom form data',
                '1'
            ]
        ];
    }

    public function headings(): array
    {
        return [
            'name',
            'email',
            'password',
            'phone',
            'usertype',
            'session',
            'department',
            'gender',
            'date_of_birth',
            'blood_group',
            'class_roll',
            'father_name',
            'mother_name',
            'current_address',
            'permanent_address',
            'image',
            'skills',
            'transaction_id',
            'custom_form',
            'is_approved'
        ];
    }
}
