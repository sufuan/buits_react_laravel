<?php

namespace App\Validators;

use App\DTOs\ValidationErrorDTO;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class UserImportValidator
{
    /**
     * Valid department names
     */
    protected $validDepartments = [
        'Marketing',
        'Law',
        'Mathematics',
        'Physics',
        'History & Civilization',
        'Soil & Environmental Sciences',
        'Economics',
        'Geology & Mining',
        'Management Studies',
        'Statistics',
        'Chemistry',
        'Coastal Studies and Disaster Management',
        'Accounting & Information Systems',
        'Computer Science and Engineering',
        'Sociology',
        'Botany',
        'Public Administration',
        'Philosophy',
        'Political Science',
        'Biochemistry and Biotechnology',
        'Finance and Banking',
        'Mass Communication and Journalism',
        'English',
        'Bangla'
    ];

    /**
     * Valid blood groups
     */
    protected $validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    /**
     * Validate multiple rows and check for duplicates
     */
    public function validateRows(array $rows): array
    {
        $allErrors = [];
        $emails = [];
        
        // First, collect all emails for duplicate checking
        foreach ($rows as $index => $row) {
            $rowNumber = $index + 1; // Assuming 1-based row numbering
            if (!empty($row['email'])) {
                $emails[$rowNumber] = strtolower(trim($row['email']));
            }
        }
        
        // Check for duplicates within the dataset
        $duplicateErrors = $this->checkDuplicates($emails);
        $allErrors = array_merge($allErrors, $duplicateErrors);
        
        // Validate each row individually
        foreach ($rows as $index => $row) {
            $rowNumber = $index + 1; // Assuming 1-based row numbering
            $rowErrors = $this->validateRow($row, $rowNumber);
            $allErrors = array_merge($allErrors, $rowErrors);
        }
        
        return $allErrors;
    }

    /**
     * Validate a single row
     */
    public function validateRow(array $row, int $rowNumber): array
    {
        $errors = [];

        // Required field validation
        $errors = array_merge($errors, $this->validateRequiredFields($row, $rowNumber));

        // Email validation
        if (!empty($row['email'])) {
            $errors = array_merge($errors, $this->validateEmail($row['email'], $rowNumber));
        }

        // Department validation
        if (!empty($row['department'])) {
            $errors = array_merge($errors, $this->validateDepartment($row['department'], $rowNumber));
        }

        // Session validation
        if (!empty($row['session'])) {
            $errors = array_merge($errors, $this->validateSession($row['session'], $rowNumber));
        }

        // Gender validation
        if (!empty($row['gender'])) {
            $errors = array_merge($errors, $this->validateGender($row['gender'], $rowNumber));
        }

        // Phone validation
        if (!empty($row['phone'])) {
            $errors = array_merge($errors, $this->validatePhone($row['phone'], $rowNumber));
        }

        // Date of birth validation
        if (!empty($row['date_of_birth'])) {
            $errors = array_merge($errors, $this->validateDateOfBirth($row['date_of_birth'], $rowNumber));
        }

        // Blood group validation
        if (!empty($row['blood_group'])) {
            $errors = array_merge($errors, $this->validateBloodGroup($row['blood_group'], $rowNumber));
        }

        // Password validation (if provided)
        if (!empty($row['password'])) {
            $errors = array_merge($errors, $this->validatePassword($row['password'], $rowNumber));
        }

        // User type validation
        if (!empty($row['usertype'])) {
            $errors = array_merge($errors, $this->validateUserType($row['usertype'], $rowNumber));
        }

        // Member ID validation
        if (!empty($row['member_id'])) {
            $errors = array_merge($errors, $this->validateMemberId($row['member_id'], $rowNumber));
        }

        return $errors;
    }

    /**
     * Validate required fields
     */
    protected function validateRequiredFields(array $row, int $rowNumber): array
    {
        $errors = [];
        $requiredFields = [
            'name' => 'Name',
            'email' => 'Email',
            'phone' => 'Phone',
            'department' => 'Department',
            'session' => 'Session',
            'gender' => 'Gender'
        ];

        foreach ($requiredFields as $field => $label) {
            if (empty($row[$field])) {
                $errors[] = new ValidationErrorDTO(
                    $rowNumber,
                    $field,
                    "{$label} is required",
                    'error'
                );
            }
        }

        return $errors;
    }

    /**
     * Validate email
     */
    public function validateEmail(string $email, int $rowNumber): array
    {
        $errors = [];

        // Check email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = new ValidationErrorDTO(
                $rowNumber,
                'email',
                'Invalid email format',
                'error'
            );
        }

        // Check email length
        if (strlen($email) > 255) {
            $errors[] = new ValidationErrorDTO(
                $rowNumber,
                'email',
                'Email must not exceed 255 characters',
                'error'
            );
        }

        // Check if email already exists in database (case-insensitive)
        if (User::whereRaw('LOWER(email) = ?', [strtolower(trim($email))])->exists()) {
            $errors[] = new ValidationErrorDTO(
                $rowNumber,
                'email',
                'Email already exists in the system',
                'error'
            );
        }

        return $errors;
    }

    /**
     * Validate department with fuzzy matching - but only suggest, don't auto-correct
     */
    public function validateDepartment(string $department, int $rowNumber): array
    {
        $errors = [];
        
        // First check exact matches
        $isValid = false;
        
        foreach ($this->validDepartments as $validDept) {
            if (strcasecmp(trim($department), $validDept) === 0) {
                $isValid = true;
                break;
            }
            // Also check with & replaced by and
            $altDept = str_replace('&', 'and', $validDept);
            if (strcasecmp(trim($department), $altDept) === 0) {
                $isValid = true;
                break;
            }
        }

        // If not valid, show error (no auto-correction to avoid overwriting user input)
        if (!$isValid) {
            // Try fuzzy matching for suggestion only
            $bestMatch = $this->findBestDepartmentMatch($department);
            if ($bestMatch) {
                $errors[] = new ValidationErrorDTO(
                    $rowNumber,
                    'department',
                    "Invalid department '{$department}'. Did you mean '{$bestMatch}'? Please select from dropdown.",
                    'error'
                );
            } else {
                $errors[] = new ValidationErrorDTO(
                    $rowNumber,
                    'department',
                    "Invalid department '{$department}'. Must be exactly one of: " . implode(', ', array_slice($this->validDepartments, 0, 3)) . "...",
                    'error'
                );
            }
        }

        return $errors;
    }

    /**
     * Find best department match using fuzzy matching
     */
    private function findBestDepartmentMatch(string $department): ?string
    {
        $department = strtolower(trim($department));
        $bestMatch = null;
        $highestSimilarity = 0.7; // Minimum similarity threshold

        foreach ($this->validDepartments as $validDept) {
            $similarity = 0;
            similar_text(strtolower($validDept), $department, $similarity);
            
            if ($similarity > $highestSimilarity) {
                $highestSimilarity = $similarity;
                $bestMatch = $validDept;
            }
            
            // Also check with & replaced by and
            $altDept = str_replace('&', 'and', $validDept);
            similar_text(strtolower($altDept), $department, $similarity);
            
            if ($similarity > $highestSimilarity) {
                $highestSimilarity = $similarity;
                $bestMatch = $validDept;
            }
        }

        return $bestMatch;
    }

    /**
     * Validate session format
     */
    public function validateSession(string $session, int $rowNumber): array
    {
        $errors = [];
        
        // Check session format (should be YYYY-YY or YYYY-YYYY)
        if (!preg_match('/^\d{4}-\d{2,4}$/', $session)) {
            $errors[] = new ValidationErrorDTO(
                $rowNumber,
                'session',
                'Session must be in format YYYY-YY or YYYY-YYYY (e.g., 2023-24 or 2023-2024)',
                'error'
            );
        } else {
            // Validate year logic
            $parts = explode('-', $session);
            $startYear = (int)$parts[0];
            $endYearPart = $parts[1];
            
            // If end year is 2 digits, convert to full year
            if (strlen($endYearPart) === 2) {
                $endYear = 2000 + (int)$endYearPart;
            } else {
                $endYear = (int)$endYearPart;
            }
            
            // Check if years are valid
            $currentYear = date('Y');
            if ($startYear < 1990 || $startYear > $currentYear + 1) {
                $errors[] = new ValidationErrorDTO(
                    $rowNumber,
                    'session',
                    'Session start year must be between 1990 and ' . ($currentYear + 1),
                    'error'
                );
            }
            
            if ($endYear <= $startYear) {
                $errors[] = new ValidationErrorDTO(
                    $rowNumber,
                    'session',
                    'Session end year must be after start year',
                    'error'
                );
            }
            
            if ($endYear - $startYear > 5) {
                $errors[] = new ValidationErrorDTO(
                    $rowNumber,
                    'session',
                    'Session span cannot exceed 5 years',
                    'warning'
                );
            }
        }

        return $errors;
    }

    /**
     * Validate gender
     */
    protected function validateGender(string $gender, int $rowNumber): array
    {
        $errors = [];
        $validGenders = ['male', 'female', 'other'];
        
        if (!in_array(strtolower(trim($gender)), $validGenders)) {
            $errors[] = new ValidationErrorDTO(
                $rowNumber,
                'gender',
                'Gender must be one of: male, female, other',
                'error'
            );
        }

        return $errors;
    }

    /**
     * Validate phone number
     */
    protected function validatePhone(string $phone, int $rowNumber): array
    {
        $errors = [];
        
        // Remove spaces, dashes, and parentheses
        $cleanPhone = preg_replace('/[\s\-\(\)]/', '', $phone);
        
        // Remove country code if present
        if (str_starts_with($cleanPhone, '+880')) {
            $cleanPhone = substr($cleanPhone, 4);
        } elseif (str_starts_with($cleanPhone, '880')) {
            $cleanPhone = substr($cleanPhone, 3);
        }
        
        // Remove leading zero if present
        if (str_starts_with($cleanPhone, '0')) {
            $cleanPhone = substr($cleanPhone, 1);
        }
        
        // Now check if it's a valid 10-digit Bangladeshi mobile number
        // Valid patterns: 13XXXXXXXX, 14XXXXXXXX, 15XXXXXXXX, 16XXXXXXXX, 17XXXXXXXX, 18XXXXXXXX, 19XXXXXXXX
        if (!preg_match('/^1[3-9]\d{8}$/', $cleanPhone)) {
            $errors[] = new ValidationErrorDTO(
                $rowNumber,
                'phone',
                'Invalid phone number format. Use format: 01XXXXXXXXX (11 digits starting with 013-019)',
                'error'
            );
        }

        return $errors;
    }

    /**
     * Validate date of birth
     */
    protected function validateDateOfBirth($date, int $rowNumber): array
    {
        $errors = [];
        
        try {
            if (is_string($date)) {
                $parsedDate = Carbon::parse($date);
            } elseif (is_numeric($date)) {
                // Excel date format
                $parsedDate = Carbon::createFromDate(1900, 1, 1)->addDays($date - 2);
            } else {
                throw new \Exception('Invalid date format');
            }
            
            // Check if date is reasonable
            $minAge = 15;
            $maxAge = 100;
            $age = $parsedDate->age;
            
            if ($age < $minAge) {
                $errors[] = new ValidationErrorDTO(
                    $rowNumber,
                    'date_of_birth',
                    "Age must be at least {$minAge} years",
                    'warning'
                );
            }
            
            if ($age > $maxAge) {
                $errors[] = new ValidationErrorDTO(
                    $rowNumber,
                    'date_of_birth',
                    "Age cannot exceed {$maxAge} years",
                    'warning'
                );
            }
            
            // Check if date is in the future
            if ($parsedDate->isFuture()) {
                $errors[] = new ValidationErrorDTO(
                    $rowNumber,
                    'date_of_birth',
                    'Date of birth cannot be in the future',
                    'error'
                );
            }
            
        } catch (\Exception $e) {
            $errors[] = new ValidationErrorDTO(
                $rowNumber,
                'date_of_birth',
                'Invalid date format. Use format: YYYY-MM-DD',
                'error'
            );
        }

        return $errors;
    }

    /**
     * Validate blood group
     */
    protected function validateBloodGroup(string $bloodGroup, int $rowNumber): array
    {
        $errors = [];
        
        if (!in_array(strtoupper(trim($bloodGroup)), $this->validBloodGroups)) {
            $errors[] = new ValidationErrorDTO(
                $rowNumber,
                'blood_group',
                'Invalid blood group. Must be one of: ' . implode(', ', $this->validBloodGroups),
                'warning'
            );
        }

        return $errors;
    }

    /**
     * Validate password
     */
    protected function validatePassword(string $password, int $rowNumber): array
    {
        $errors = [];
        
        if (strlen($password) < 8) {
            $errors[] = new ValidationErrorDTO(
                $rowNumber,
                'password',
                'Password must be at least 8 characters long',
                'error'
            );
        }

        if (strlen($password) > 255) {
            $errors[] = new ValidationErrorDTO(
                $rowNumber,
                'password',
                'Password must not exceed 255 characters',
                'error'
            );
        }

        return $errors;
    }

    /**
     * Validate member ID format - STRICT validation for predefined department codes only
     */
    protected function validateMemberId(string $memberId, int $rowNumber): array
    {
        $errors = [];
        
        // Check member ID format (should be: 2-digit dept code + 2-digit year + 4-digit form number)
        if (!preg_match('/^\d{8}$/', $memberId)) {
            $errors[] = new ValidationErrorDTO(
                $rowNumber,
                'member_id',
                'Member ID must be 8 digits (Department Code + Year + Form Number)',
                'error'
            );
            return $errors;
        }
        
        // Extract department code from member ID
        $deptCode = substr($memberId, 0, 2);
        
        // Check if department code exists in our predefined list
        $validCodes = ["04", "15", "05", "18", "23", "10", "01", "17", "03", "24", "12", "19", "07", "13", "06", "11", "09", "20", "16", "21", "14", "22", "02", "08"];
        
        if (!in_array($deptCode, $validCodes)) {
            $errors[] = new ValidationErrorDTO(
                $rowNumber,
                'member_id',
                'Invalid department code in Member ID. Must use predefined department codes only.',
                'error'
            );
        }
        
        return $errors;
    }

    /**
     * Validate user type
     */
    protected function validateUserType(string $usertype, int $rowNumber): array
    {
        $errors = [];
        $validTypes = ['user', 'admin', 'moderator'];
        
        if (!in_array(strtolower(trim($usertype)), $validTypes)) {
            $errors[] = new ValidationErrorDTO(
                $rowNumber,
                'usertype',
                'User type must be one of: ' . implode(', ', $validTypes),
                'warning'
            );
        }

        return $errors;
    }

    /**
     * Check for duplicate emails within a dataset
     */
    public function checkDuplicates(array $emails): array
    {
        $errors = [];
        $seen = [];
        
        foreach ($emails as $rowNumber => $email) {
            if (isset($seen[$email])) {
                $errors[] = new ValidationErrorDTO(
                    $rowNumber,
                    'email',
                    "Duplicate email found (first occurrence at row {$seen[$email]})",
                    'error'
                );
            } else {
                $seen[$email] = $rowNumber;
            }
        }
        
        return $errors;
    }

    /**
     * Validate field length
     */
    protected function validateFieldLength(string $field, string $value, int $maxLength, int $rowNumber): array
    {
        $errors = [];
        
        if (strlen($value) > $maxLength) {
            $errors[] = new ValidationErrorDTO(
                $rowNumber,
                $field,
                ucfirst($field) . " must not exceed {$maxLength} characters",
                'error'
            );
        }
        
        return $errors;
    }

    /**
     * Get list of valid departments
     */
    public function getValidDepartments(): array
    {
        return $this->validDepartments;
    }

    /**
     * Get list of valid blood groups
     */
    public function getValidBloodGroups(): array
    {
        return $this->validBloodGroups;
    }
}