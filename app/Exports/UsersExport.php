<?php

namespace App\Exports;

use App\Models\User;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class UsersExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return User::all();
    }

    public function map($user): array
    {
        return [
            $user->member_id,
            $user->name,
            $user->email,
            $user->phone,
            $user->usertype,
            $user->session,
            $user->department,
            $user->gender,
            $user->date_of_birth,
            $user->blood_group,
            $user->class_roll,
            $user->father_name,
            $user->mother_name,
            $user->current_address,
            $user->permanent_address,
            $user->image,
            $user->skills,
            $user->transaction_id,
            $user['custom-form'],
            $user->is_approved ? 'Yes' : 'No',
        ];
    }

    public function headings(): array
    {
        return [
            'Member ID', 
            'Name', 
            'Email', 
            'Phone', 
            'User Type', 
            'Session', 
            'Department', 
            'Gender', 
            'Date of Birth', 
            'Blood Group', 
            'Class Roll', 
            'Father Name', 
            'Mother Name', 
            'Current Address', 
            'Permanent Address', 
            'Image', 
            'Skills', 
            'Transaction ID', 
            'Custom Form', 
            'Is Approved',
        ];
    }
}
