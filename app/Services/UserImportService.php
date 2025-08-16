<?php

namespace App\Services;

use App\Models\User;
use App\DTOs\ImportPreviewDTO;
use App\DTOs\ValidationErrorDTO;
use App\Validators\UserImportValidator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;

class UserImportService
{
    protected $validator;
    protected $departmentCodes = [
        "Marketing" => "04",
        "Law" => "15",
        "Mathematics" => "05",
        "Physics" => "18",
        "History & Civilization" => "23",
        "Soil & Environmental Sciences" => "10",
        "Economics" => "01",
        "Geology & Mining" => "17",
        "Management Studies" => "03",
        "Statistics" => "24",
        "Chemistry" => "12",
        "Coastal Studies and Disaster Management" => "19",
        "Accounting & Information Systems" => "07",
        "Computer Science and Engineering" => "13",
        "Sociology" => "06",
        "Botany" => "11",
        "Public Administration" => "09",
        "Philosophy" => "20",
        "Political Science" => "16",
        "Biochemistry and Biotechnology" => "21",
        "Finance and Banking" => "14",
        "Mass Communication and Journalism" => "22",
        "English" => "02",
        "Bangla" => "08"
    ];

    public function __construct()
    {
        $this->validator = new UserImportValidator();
    }

    /**
     * Parse Excel file and return preview data with validation
     */
    public function parseExcelFile($file): ImportPreviewDTO
    {
        try {
            $data = Excel::toArray(null, $file);
            
            if (empty($data) || empty($data[0])) {
                throw new \Exception('The file appears to be empty');
            }

            $rows = $data[0];
            $headers = array_shift($rows); // Remove header row
            
            // Normalize headers
            $headers = array_map(function($header) {
                return strtolower(str_replace(' ', '_', trim($header)));
            }, $headers);

            $parsedRows = [];
            $errors = [];
            $rowNumber = 2; // Start from 2 since row 1 is headers

            foreach ($rows as $index => $row) {
                // Skip completely empty rows
                if (empty(array_filter($row))) {
                    continue;
                }

                // Map row data to associative array
                $rowData = [];
                foreach ($headers as $i => $header) {
                    $rowData[$header] = isset($row[$i]) ? trim($row[$i]) : null;
                }

                // Add row metadata
                $rowData['row_id'] = $rowNumber;
                $rowData['row_number'] = $rowNumber;
                
                // Pre-generate member ID if valid department and session
                if (!empty($rowData['department']) && !empty($rowData['session'])) {
                    $rowData['member_id'] = $this->generateMemberId($rowData['department'], $rowData['session']);
                }

                // Parse date if present
                if (!empty($rowData['date_of_birth'])) {
                    $rowData['date_of_birth'] = $this->parseDate($rowData['date_of_birth']);
                }

                $parsedRows[] = $rowData;

                // Validate row
                $rowErrors = $this->validator->validateRow($rowData, $rowNumber);
                if (!empty($rowErrors)) {
                    $errors = array_merge($errors, $rowErrors);
                }

                $rowNumber++;
            }

            // Check for duplicates within the file
            $duplicateErrors = $this->checkInternalDuplicates($parsedRows);
            $errors = array_merge($errors, $duplicateErrors);

            // Calculate statistics
            $statistics = [
                'total_rows' => count($parsedRows),
                'valid_rows' => count($parsedRows) - count(array_unique(array_column($errors, 'row'))),
                'error_rows' => count(array_unique(array_column($errors, 'row'))),
                'total_errors' => count($errors)
            ];

            return new ImportPreviewDTO($parsedRows, $errors, $statistics);

        } catch (\Exception $e) {
            Log::error('Error parsing Excel file: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Validate all rows
     */
    public function validateRows(array $rows): array
    {
        $errors = [];
        
        foreach ($rows as $row) {
            $rowErrors = $this->validator->validateRow($row, $row['row_number'] ?? 0);
            $errors = array_merge($errors, $rowErrors);
        }

        // Check for duplicates
        $duplicateErrors = $this->checkInternalDuplicates($rows);
        $errors = array_merge($errors, $duplicateErrors);

        return $errors;
    }

    /**
     * Validate a single row with real-time member ID generation
     */
    public function validateSingleRow(array $rowData): array
    {
        $errors = $this->validator->validateRow($rowData, $rowData['row_number'] ?? $rowData['row_id'] ?? 0);
        
        // Check if email already exists in database
        if (!empty($rowData['email'])) {
            $existingUser = User::where('email', $rowData['email']);
            
            // If row_id exists, exclude current user from duplicate check
            if (!empty($rowData['id'])) {
                $existingUser->where('id', '!=', $rowData['id']);
            }
            
            if ($existingUser->exists()) {
                $errors[] = new ValidationErrorDTO(
                    $rowData['row_number'] ?? 0,
                    'email',
                    'Email already exists in the system',
                    'error'
                );
            }
        }

        // Generate member ID if department and session are valid
        $memberId = null;
        if (!empty($rowData['department']) && !empty($rowData['session'])) {
            try {
                $memberId = $this->generateMemberId($rowData['department'], $rowData['session']);
                
                // If member ID is null, it means invalid department
                if ($memberId === null) {
                    $errors[] = new ValidationErrorDTO(
                        $rowData['row_number'] ?? 0,
                        'department',
                        'Invalid department. Must be exactly one of the predefined departments.',
                        'error'
                    );
                }
            } catch (\Exception $e) {
                $errors[] = new ValidationErrorDTO(
                    $rowData['row_number'] ?? 0,
                    'member_id',
                    'Failed to generate member ID: ' . $e->getMessage(),
                    'error'
                );
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
            'member_id' => $memberId
        ];
    }

    /**
     * Import validated data in batches
     */
    public function importBatch(array $rows, int $chunkSize = 100, ?string $sessionId = null): array
    {
        $imported = 0;
        $failed = 0;
        $failedRows = [];
        
        try {
            $chunks = array_chunk($rows, $chunkSize);
            
            foreach ($chunks as $chunk) {
                DB::beginTransaction();
                
                try {
                    foreach ($chunk as $row) {
                        // Validate row one more time before import
                        $validation = $this->validateSingleRow($row);
                        
                        if (!$validation['valid']) {
                            $failed++;
                            $failedRows[] = [
                                'row' => $row['row_number'] ?? 0,
                                'errors' => $validation['errors']
                            ];
                            continue;
                        }

                        // Create user
                        $userData = $this->prepareUserData($row);
                        User::create($userData);
                        $imported++;
                    }
                    
                    DB::commit();
                    
                } catch (\Exception $e) {
                    DB::rollBack();
                    Log::error('Batch import failed: ' . $e->getMessage());
                    throw $e;
                }
            }
            
            return [
                'imported' => $imported,
                'failed' => $failed,
                'failed_rows' => $failedRows,
                'total' => count($rows)
            ];
            
        } catch (\Exception $e) {
            Log::error('Import batch error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Generate member ID - ONLY if department code is valid
     */
    public function generateMemberId(string $department, string $session): ?string
    {
        // Normalize department name for lookup
        $normalizedDepartment = $this->normalizeDepartmentName($department);
        $departmentCode = $this->getDepartmentCode($normalizedDepartment);

        // If no valid department code found, return null
        if ($departmentCode === null) {
            return null;
        }

        // Extract session year
        $sessionParts = explode('-', $session);
        $sessionYear = substr(end($sessionParts), -2);

        // Get next form number
        $lastMember = User::orderBy('id', 'desc')->first();
        $newFormNumber = 1130;

        if ($lastMember && $lastMember->member_id) {
            $lastFormNumber = (int)substr($lastMember->member_id, -4);
            $newFormNumber = $lastFormNumber + 1;
        }

        return $departmentCode . $sessionYear . str_pad($newFormNumber, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Pre-generate member IDs for a batch - ONLY for valid departments
     */
    public function generateMemberIds(array $rows): array
    {
        $memberIds = [];
        $lastFormNumber = $this->getLastFormNumber();
        
        foreach ($rows as $index => $row) {
            if (!empty($row['department']) && !empty($row['session'])) {
                $departmentCode = $this->getDepartmentCode($this->normalizeDepartmentName($row['department']));
                
                // Only generate if department code is valid
                if ($departmentCode !== null) {
                    $sessionParts = explode('-', $row['session']);
                    $sessionYear = substr(end($sessionParts), -2);
                    
                    $newFormNumber = $lastFormNumber + $index + 1;
                    $memberIds[$row['row_id'] ?? $index] = $departmentCode . $sessionYear . str_pad($newFormNumber, 4, '0', STR_PAD_LEFT);
                }
            }
        }
        
        return $memberIds;
    }

    /**
     * Prepare user data for database insertion
     */
    protected function prepareUserData(array $row): array
    {
        return [
            'name' => $row['name'],
            'email' => $row['email'],
            'password' => Hash::make($row['password'] ?? 'password123'),
            'phone' => $row['phone'] ?? '',
            'department' => $row['department'],
            'session' => $row['session'],
            'usertype' => $row['usertype'] ?? 'user',
            'gender' => strtolower($row['gender'] ?? 'other'),
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
            'member_id' => $row['member_id'] ?? $this->generateMemberId($row['department'], $row['session']),
            'is_approved' => true,
        ];
    }

    /**
     * Check for duplicate emails within the imported data
     */
    protected function checkInternalDuplicates(array $rows): array
    {
        $errors = [];
        $emails = [];
        
        foreach ($rows as $row) {
            if (!empty($row['email'])) {
                if (isset($emails[$row['email']])) {
                    $errors[] = new ValidationErrorDTO(
                        $row['row_number'] ?? $row['row_id'] ?? 0,
                        'email',
                        'Duplicate email within the import file (first occurrence at row ' . $emails[$row['email']] . ')',
                        'error'
                    );
                } else {
                    $emails[$row['email']] = $row['row_number'] ?? $row['row_id'] ?? 0;
                }
            }
        }
        
        return $errors;
    }

    /**
     * Normalize department name
     */
    protected function normalizeDepartmentName(string $department): string
    {
        // Preserve original casing but trim spaces
        return trim($department);
    }

    /**
     * Get department code with strict validation - ONLY predefined codes allowed
     */
    protected function getDepartmentCode(string $department): ?string
    {
        // Try exact match first
        if (isset($this->departmentCodes[$department])) {
            return $this->departmentCodes[$department];
        }
        
        // Try case-insensitive match
        foreach ($this->departmentCodes as $key => $code) {
            if (strcasecmp($key, $department) === 0) {
                return $code;
            }
        }
        
        // Try with & replaced by and
        $altDepartment = str_replace('&', 'and', $department);
        foreach ($this->departmentCodes as $key => $code) {
            if (strcasecmp($key, $altDepartment) === 0) {
                return $code;
            }
        }
        
        Log::warning('Unknown department: ' . $department);
        return null; // Return NULL - no member ID generation for invalid departments
    }

    /**
     * Get last form number from database
     */
    protected function getLastFormNumber(): int
    {
        $lastMember = User::orderBy('id', 'desc')->first();
        
        if ($lastMember && $lastMember->member_id) {
            return (int)substr($lastMember->member_id, -4);
        }
        
        return 1129; // Will start from 1130
    }

    /**
     * Parse date from various formats
     */
    protected function parseDate($date)
    {
        if (empty($date)) {
            return null;
        }

        // Check if the date is a numeric Excel date
        if (is_numeric($date)) {
            // Convert Excel numeric date to a PHP date
            return Carbon::createFromDate(1900, 1, 1)->addDays($date - 2)->format('Y-m-d');
        }
        
        try {
            return Carbon::parse($date)->format('Y-m-d');
        } catch (\Exception $e) {
            Log::warning('Could not parse date: ' . $date);
            return null;
        }
    }
}