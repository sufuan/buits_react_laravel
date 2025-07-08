<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class UsersImport implements ToModel, WithHeadingRow, WithValidation
{
    /**
     * Define department codes.
     */
    protected $departmentCodes = [
        "marketing" => "04",
        "law" => "15",
        "mathematics" => "05",
        "physics" => "18",
        "history and civilization" => "23",
        "soil and environmental sciences" => "10",
        "economics" => "01",
        "geology and mining" => "17",
        "management studies" => "03",
        "statistics" => "24",
        "chemistry" => "12",
        "coastal studies and disaster management" => "19",
        "accounting and information systems" => "07",
        "computer science and engineering" => "13",
        "sociology" => "06",
        "botany" => "11",
        "public administration" => "09",
        "philosophy" => "20",
        "political science" => "16",
        "biochemistry and biotechnology" => "21",
        "finance and banking" => "14",
        "mass communication and journalism" => "22",
        "english" => "02",
        "bangla" => "08"
    ];

    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        Log::info('Processing row: ' . json_encode($row));

        // Skip empty rows
        if (empty($row['name']) || empty($row['email'])) {
            Log::info('Skipping empty row');
            return null;
        }

        // Check if email already exists
        if (User::where('email', $row['email'])->exists()) {
            Log::info('Skipping duplicate email: ' . $row['email']);
            return null; // Skip duplicate emails
        }

        $departmentCode = $this->departmentCodes[strtolower($row['department'])] ?? '00';
        $sessionYear = substr($row['session'], -2); // Get last 2 digits of session
        $memberId = $this->generateNewMemberId($departmentCode, $sessionYear);

        return new User([
            'name' => $row['name'],
            'email' => $row['email'],
            'password' => Hash::make($row['password'] ?? 'password'),
            'phone' => $row['phone'] ?? '',
            'department' => $row['department'],
            'session' => $row['session'],
            'usertype' => $row['usertype'] ?? 'user',
            'gender' => $row['gender'],
            'class_roll' => $row['class_roll'] ?? '',
            'father_name' => $row['father_name'] ?? '',
            'mother_name' => $row['mother_name'] ?? '',
            'current_address' => $row['current_address'] ?? '',
            'permanent_address' => $row['permanent_address'] ?? '',
            'blood_group' => $row['blood_group'] ?? '',
            'date_of_birth' => !empty($row['date_of_birth']) ? $this->parseDate($row['date_of_birth']) : null,
            'transaction_id' => $row['transaction_id'] ?? '',
            'to_account' => $row['to_account'] ?? '',
            'skills' => $row['skills'] ?? '',
            'member_id' => $memberId,
            'is_approved' => true, // Imported users are automatically approved
        ]);
    }

    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'department' => 'required|string|max:255',
            'session' => 'required|string',
            'gender' => 'required|string|in:male,female,other',
        ];
    }

    /**
     * Normalize department names.
     */
    private function normalizeDepartmentName($department)
    {
        // Replace "&" with "and", convert to lowercase, and trim spaces
        return strtolower(str_replace('&', 'and', trim($department)));
    }

    /**
     * Generate a new unique member ID based on the highest numeric part across all member IDs.
     */
    private function generateNewMemberId($departmentCode, $lastTwoDigitsOfSession)
    {
        // Fetch the last member ID by ordering the users table by 'id' in descending order
        $lastMember = User::orderBy('id', 'desc')->first();

        // Initialize the default starting number
        $newFormNumber = 1130;

        if ($lastMember) {
            // Extract the last four digits of the member_id from the last record
            $lastFormNumber = (int)substr($lastMember->member_id, -4);

            // Increment the last form number by 1
            $newFormNumber = $lastFormNumber + 1;
        }

        // Return the new member ID with department code, session year, and the new form number
        return $departmentCode . $lastTwoDigitsOfSession . str_pad($newFormNumber, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Helper function to parse date from various formats or Excel date format.
     */
    private function parseDate($date)
    {
        if (empty($date)) {
            return null;
        }

        // Check if the date is a numeric Excel date and convert it
        if (is_numeric($date)) {
            // Convert Excel numeric date to a PHP date
            return Carbon::createFromDate(1900, 1, 1)->addDays($date - 2); // Excel starts on 1/1/1900; subtract 2 for correct offset
        }
    
        // Otherwise, parse as a standard date string
        return Carbon::parse($date);
    }
}
