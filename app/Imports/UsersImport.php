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
     * Track import statistics
     */
    protected $importedCount = 0;
    protected $skippedCount = 0;
    protected $errors = [];

    /**
     * Define department codes.
     */
    protected $departmentCodes = [
        "marketing" => "04",
        "law" => "15",
        "mathematics" => "05",
        "physics" => "18",
        "history and civilization" => "23",
        "history & civilization" => "23", // Support both formats
        "soil and environmental sciences" => "10",
        "soil & environmental sciences" => "10", // Support both formats
        "economics" => "01",
        "geology and mining" => "17",
        "geology & mining" => "17", // Support both formats
        "management studies" => "03",
        "statistics" => "24",
        "chemistry" => "12",
        "coastal studies and disaster management" => "19",
        "accounting and information systems" => "07",
        "accounting & information systems" => "07", // Support both formats
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
        try {
            Log::info('Processing row: ' . json_encode($row));

            // Clean and validate row data
            $row = array_map('trim', $row);

            // Skip completely empty rows
            if (empty(array_filter($row))) {
                Log::info('Skipping completely empty row');
                $this->skippedCount++;
                return null;
            }

            // Check required fields
            if (empty($row['name']) || empty($row['email'])) {
                Log::warning('Skipping row with missing name or email');
                $this->errors[] = 'Row missing name or email: ' . json_encode($row);
                $this->skippedCount++;
                return null;
            }

            // Check if email already exists
            if (User::where('email', $row['email'])->exists()) {
                Log::warning('Skipping duplicate email: ' . $row['email']);
                $this->errors[] = 'Duplicate email: ' . $row['email'];
                $this->skippedCount++;
                return null;
            }

            // Validate required fields
            if (empty($row['department']) || empty($row['session']) || empty($row['gender'])) {
                Log::error('Missing required fields for user: ' . $row['email']);
                Log::error('Department: ' . ($row['department'] ?? 'MISSING'));
                Log::error('Session: ' . ($row['session'] ?? 'MISSING'));
                Log::error('Gender: ' . ($row['gender'] ?? 'MISSING'));
                $this->errors[] = 'Missing required fields for: ' . $row['email'];
                $this->skippedCount++;
                return null;
            }

            // Normalize department name for lookup
            $normalizedDepartment = $this->normalizeDepartmentName($row['department']);
            $departmentCode = $this->departmentCodes[$normalizedDepartment] ?? null;
            
            if ($departmentCode === null) {
                Log::warning('Unknown department: ' . $row['department'] . ' (normalized: ' . $normalizedDepartment . ')');
                Log::info('Available departments: ' . json_encode(array_keys($this->departmentCodes)));
                // Use default code but continue
                $departmentCode = '00';
            }

            // Extract session year - handle different formats
            $sessionParts = explode('-', $row['session']);
            $sessionYear = substr(end($sessionParts), -2); // Get last 2 digits of last part
            
            $memberId = $this->generateNewMemberId($departmentCode, $sessionYear);

            // Normalize gender value
            $gender = strtolower(trim($row['gender']));
            if (!in_array($gender, ['male', 'female', 'other'])) {
                Log::warning('Invalid gender value: ' . $row['gender'] . ', defaulting to "other"');
                $gender = 'other';
            }

            $userData = [
                'name' => $row['name'],
                'email' => $row['email'],
                'password' => Hash::make($row['password'] ?? 'password123'),
                'phone' => $row['phone'] ?? '',
                'department' => $row['department'], // Keep original department name
                'session' => $row['session'],
                'usertype' => $row['usertype'] ?? 'user',
                'gender' => $gender,
                'class_roll' => $row['class_roll'] ?? null,
                'father_name' => $row['father_name'] ?? null,
                'mother_name' => $row['mother_name'] ?? null,
                'current_address' => $row['current_address'] ?? null,
                'permanent_address' => $row['permanent_address'] ?? null,
                'blood_group' => $row['blood_group'] ?? null,
                'date_of_birth' => !empty($row['date_of_birth']) ? $this->parseDate($row['date_of_birth']) : null,
                'transaction_id' => $row['transaction_id'] ?? null,
                'to_account' => $row['to_account'] ?? null,
                'skills' => $row['skills'] ?? null,
                'member_id' => $memberId,
                'is_approved' => true, // Imported users are automatically approved
            ];

            Log::info('Creating user with data: ' . json_encode($userData));
            
            $user = new User($userData);
            
            Log::info('User created successfully: ' . $row['email'] . ' with member_id: ' . $memberId);
            $this->importedCount++;
            
            return $user;
            
        } catch (\Exception $e) {
            Log::error('Error processing row: ' . $e->getMessage());
            Log::error('Row data: ' . json_encode($row));
            Log::error('Stack trace: ' . $e->getTraceAsString());
            $this->errors[] = 'Error processing ' . ($row['email'] ?? 'unknown') . ': ' . $e->getMessage();
            $this->skippedCount++;
            return null; // Skip this row but continue with others
        }
    }

    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            '*.name' => 'required|string|max:255',
            '*.email' => 'required|email|max:255',
            '*.department' => 'required|string|max:255',
            '*.session' => 'required|string|max:255',
            '*.gender' => 'required|string',
        ];
    }

    /**
     * Custom validation messages
     */
    public function customValidationMessages()
    {
        return [
            '*.name.required' => 'The name field is required for row :row',
            '*.email.required' => 'The email field is required for row :row',
            '*.email.email' => 'The email must be a valid email address for row :row',
            '*.department.required' => 'The department field is required for row :row',
            '*.session.required' => 'The session field is required for row :row',
            '*.gender.required' => 'The gender field is required for row :row',
        ];
    }

    /**
     * Get import statistics
     */
    public function getImportStats()
    {
        return [
            'imported' => $this->importedCount,
            'skipped' => $this->skippedCount,
            'errors' => $this->errors
        ];
    }

    /**
     * Normalize department names.
     */
    private function normalizeDepartmentName($department)
    {
        // Trim spaces and convert to lowercase
        $normalized = strtolower(trim($department));
        
        // Try both with original "&" and replaced with "and"
        // This allows matching both formats
        return $normalized;
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
