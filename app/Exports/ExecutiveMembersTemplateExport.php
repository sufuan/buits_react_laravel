<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * Generates a blank Excel template for importing executive committee members.
 *
 * Columns match what the ExecutiveMembersImport class expects.
 * The first row is a filled example so admins know the format.
 */
class ExecutiveMembersTemplateExport implements FromArray, WithHeadings, WithStyles
{
    public function array(): array
    {
        return [
            // Example row
            [
                'Abu Sufian',
                'President',
                'Computer Science and Engineering',
                '2021-22',
                '01712345678',
                'sufian@example.com',
                '1',      // member_order
                '2023-01-01',  // tenure_start
                '2024-01-01',  // tenure_end
            ],
        ];
    }

    public function headings(): array
    {
        return [
            'name',
            'designation',
            'department',
            'session',
            'contact_number',
            'email_address',
            'member_order',
            'tenure_start',
            'tenure_end',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            // Bold the heading row
            1 => ['font' => ['bold' => true]],
        ];
    }
}
