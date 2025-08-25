<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class UserRoleManagementExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    protected $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = User::with(['designation'])
            ->select(['id', 'name', 'email', 'member_id', 'usertype', 'designation_id', 'created_at'])
            ->where('usertype', 'executive'); // Only show executive users

        // Apply filters
        if (!empty($this->filters['search'])) {
            $query->where(function($q) {
                $search = $this->filters['search'];
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%')
                  ->orWhere('member_id', 'like', '%' . $search . '%');
            });
        }

        if (!empty($this->filters['usertype']) && $this->filters['usertype'] !== 'all') {
            $query->where('usertype', $this->filters['usertype']);
        }

        if (!empty($this->filters['designation_id']) && $this->filters['designation_id'] !== 'all') {
            $query->where('designation_id', $this->filters['designation_id']);
        }

        return $query->get();
    }

    public function map($user): array
    {
        return [
            $user->id,
            $user->name,
            $user->email,
            $user->member_id ?? 'N/A',
            $user->usertype ?? 'N/A',
            $user->designation ? $user->designation->name : 'No Designation',
            $user->created_at ? $user->created_at->format('Y-m-d H:i:s') : 'N/A',
        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Email',
            'Member ID',
            'User Type',
            'Designation',
            'Member Since',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1 => ['font' => ['bold' => true]],
        ];
    }
}
