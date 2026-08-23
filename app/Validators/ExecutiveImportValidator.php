<?php

namespace App\Validators;

use App\DTOs\ValidationErrorDTO;
use App\Models\User;
use App\Models\PreviousCommitteeMember;
use Carbon\Carbon;

class ExecutiveImportValidator
{
    public function validateRow(array $row, int $rowNumber, string $committeeNumber): array
    {
        $errors = [];

        // Required field validation (Basic fields)
        $errors = array_merge($errors, $this->validateRequiredFields($row, $rowNumber));

        // Email & User Existence Check
        $userExists = false;
        if (!empty($row['email_address'])) {
            $emailResult = $this->validateEmail($row['email_address'], $rowNumber, $committeeNumber);
            $errors = array_merge($errors, $emailResult['errors']);
            $userExists = $emailResult['user_exists'];
        }

        // Session validation (Format check)
        if (!empty($row['session'])) {
            $errors = array_merge($errors, $this->validateSession($row['session'], $rowNumber));
        }

        // Contact Number validation (Format check)
        if (!empty($row['contact_number'])) {
            $errors = array_merge($errors, $this->validatePhone($row['contact_number'], $rowNumber));
        }


        // Tenure Date validation
        if (!empty($row['tenure_start']) && !empty($row['tenure_end'])) {
            $errors = array_merge($errors, $this->validateTenureDates($row['tenure_start'], $row['tenure_end'], $rowNumber));
        }

        // Auto-create logic: if user doesn't exist, check if we can auto-create
        if (!$userExists) {
            $canAutoCreate = !empty($row['department']) && !empty($row['session']) && !empty($row['gender']) && !empty($row['contact_number']);
            
            if ($canAutoCreate) {
                // Remove the "No registered user found" error from the email field
                $errors = array_filter($errors, function($e) {
                    return !($e->column === 'email_address' && str_contains($e->message, 'No registered user found'));
                });
                $errors = array_values($errors); // Re-index array
                
                // Verify we can generate a member ID
                $deptCode = \App\Helpers\MemberIdHelper::class ? \App\Helpers\MemberIdHelper::class : null;
                $generated = generate_member_id($row['department'], $row['session']);
                if (str_starts_with($generated, '00')) {
                    $errors[] = new ValidationErrorDTO(
                        $rowNumber,
                        'department',
                        "Invalid department for member ID generation.",
                        'error'
                    );
                }
            }
        }

        return $errors;
    }

    protected function validateRequiredFields(array $row, int $rowNumber): array
    {
        $errors = [];
        $requiredFields = [
            'name' => 'Name',
            'email_address' => 'Email',
            'designation' => 'Designation'
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

    public function validateEmail(string $email, int $rowNumber, string $committeeNumber): array
    {
        $errors = [];
        $userExists = false;

        // Check email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = new ValidationErrorDTO(
                $rowNumber,
                'email_address',
                'Invalid email format',
                'error'
            );
            return ['errors' => $errors, 'user_exists' => false];
        }

        // Check if exists in users table
        $user = User::whereRaw('LOWER(email) = ?', [strtolower(trim($email))])->first();
        if ($user) {
            $userExists = true;
            // Check if user already in THIS committee
            $exists = PreviousCommitteeMember::where('user_id', $user->id)
                ->where('committee_number', $committeeNumber)
                ->exists();

            if ($exists) {
                $errors[] = new ValidationErrorDTO(
                    $rowNumber,
                    'email_address',
                    "User already exists in committee {$committeeNumber}",
                    'error'
                );
            }
        } else {
            $errors[] = new ValidationErrorDTO(
                $rowNumber,
                'email_address',
                'No registered user found. Provide Department, Session, Gender, and Contact to auto-create.',
                'error'
            );
        }

        return ['errors' => $errors, 'user_exists' => $userExists];
    }

    public function validateSession(string $session, int $rowNumber): array
    {
        $errors = [];
        
        if (!preg_match('/^\d{4}-\d{2,4}$/', $session)) {
            $errors[] = new ValidationErrorDTO(
                $rowNumber,
                'session',
                'Session must be in format YYYY-YY or YYYY-YYYY (e.g., 2023-24 or 2023-2024)',
                'error'
            );
        }

        return $errors;
    }

    protected function validatePhone(string $phone, int $rowNumber): array
    {
        $errors = [];
        $cleanPhone = preg_replace('/[\s\-\(\)]/', '', $phone);
        
        if (str_starts_with($cleanPhone, '+880')) {
            $cleanPhone = substr($cleanPhone, 4);
        } elseif (str_starts_with($cleanPhone, '880')) {
            $cleanPhone = substr($cleanPhone, 3);
        }
        
        if (str_starts_with($cleanPhone, '0')) {
            $cleanPhone = substr($cleanPhone, 1);
        }
        
        if (!preg_match('/^1[3-9]\d{8}$/', $cleanPhone)) {
            $errors[] = new ValidationErrorDTO(
                $rowNumber,
                'contact_number',
                'Invalid phone format',
                'error'
            );
        }

        return $errors;
    }

    protected function validateTenureDates($start, $end, int $rowNumber): array
    {
        $errors = [];

        try {
            $startDate = $this->parseDate($start);
            $endDate = $this->parseDate($end);

            if ($startDate && $endDate && $endDate->lessThan($startDate)) {
                $errors[] = new ValidationErrorDTO(
                    $rowNumber,
                    'tenure_end',
                    'Tenure end date must be after start date',
                    'error'
                );
            }
        } catch (\Exception $e) {
            // Invalid date format
        }

        return $errors;
    }

    private function parseDate($value): ?Carbon
    {
        if (empty($value)) return null;

        if (is_numeric($value)) {
            return Carbon::createFromDate(1900, 1, 1)->addDays((int) $value - 2);
        }

        return Carbon::parse($value);
    }
}
