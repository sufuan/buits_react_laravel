<?php

namespace App\Services;

use App\Models\User;
use App\Models\PreviousCommitteeMember;
use App\DTOs\ImportPreviewDTO;
use App\DTOs\ValidationErrorDTO;
use App\Validators\ExecutiveImportValidator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;

class ExecutiveImportService
{
    protected $validator;

    public function __construct()
    {
        $this->validator = new ExecutiveImportValidator();
    }

    public function parseExcelFile($file, string $committeeNumber): ImportPreviewDTO
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

            // If the sheet uses "email", convert it to "email_address" to standardize
            foreach ($headers as &$h) {
                if ($h === 'email') $h = 'email_address';
                if ($h === 'designation_title') $h = 'designation';
            }

            $parsedRows = [];
            $errors = [];
            $rowNumber = 2;

            foreach ($rows as $index => $row) {
                if (empty(array_filter($row))) {
                    $rowNumber++;
                    continue;
                }

                $rowData = [];
                foreach ($headers as $i => $header) {
                    $rowData[$header] = isset($row[$i]) ? trim($row[$i]) : null;
                }

                $rowData['row_id'] = $rowNumber;
                $rowData['row_number'] = $rowNumber;

                // Populate member_id if user exists
                if (!empty($rowData['email_address'])) {
                    $user = User::whereRaw('LOWER(email) = ?', [strtolower(trim($rowData['email_address']))])->first();
                    if ($user) {
                        $rowData['member_id'] = $user->member_id;
                        // If user exists but member_id is null, generate one if dept/session are available
                        if (empty($user->member_id) && !empty($rowData['department']) && !empty($rowData['session'])) {
                            $generated = generate_member_id($rowData['department'], $rowData['session']);
                            if (!str_starts_with($generated, '00')) {
                                $rowData['member_id'] = $generated;
                            }
                        }
                    }
                }

                $parsedRows[] = $rowData;

                $rowErrors = $this->validator->validateRow($rowData, $rowNumber, $committeeNumber);
                if (!empty($rowErrors)) {
                    $errors = array_merge($errors, $rowErrors);
                }

                $rowNumber++;
            }

            $duplicateErrors = $this->checkInternalDuplicates($parsedRows);
            $errors = array_merge($errors, $duplicateErrors);

            $statistics = [
                'total_rows' => count($parsedRows),
                'valid_rows' => count($parsedRows) - count(array_unique(array_column($errors, 'row'))),
                'error_rows' => count(array_unique(array_column($errors, 'row'))),
                'total_errors' => count($errors)
            ];

            return new ImportPreviewDTO($parsedRows, $errors, $statistics);

        } catch (\Exception $e) {
            Log::error('Error parsing Executive Excel file: ' . $e->getMessage());
            throw $e;
        }
    }

    public function validateRows(array $rows, string $committeeNumber): array
    {
        $errors = [];
        
        foreach ($rows as $row) {
            $rowErrors = $this->validator->validateRow($row, $row['row_number'] ?? 0, $committeeNumber);
            $errors = array_merge($errors, $rowErrors);
        }

        $duplicateErrors = $this->checkInternalDuplicates($rows);
        $errors = array_merge($errors, $duplicateErrors);

        return $errors;
    }

    public function validateSingleRow(array $rowData, string $committeeNumber): array
    {
        $errors = $this->validator->validateRow($rowData, $rowData['row_number'] ?? $rowData['row_id'] ?? 0, $committeeNumber);
        
        $memberId = null;
        if (!empty($rowData['email_address'])) {
            $user = User::whereRaw('LOWER(email) = ?', [strtolower(trim($rowData['email_address']))])->first();
            
            if ($user) {
                $memberId = $user->member_id;
                // If user exists but has no member_id, generate a preview one if we have dept and session
                if (empty($memberId) && !empty($rowData['department']) && !empty($rowData['session'])) {
                    $generated = generate_member_id($rowData['department'], $rowData['session']);
                    if (!str_starts_with($generated, '00')) {
                        $memberId = $generated;
                    }
                }
            } else if (empty($errors)) {
                // Generate a temporary preview member_id for new users
                if (!empty($rowData['department']) && !empty($rowData['session'])) {
                    $generated = generate_member_id($rowData['department'], $rowData['session']);
                    if (!str_starts_with($generated, '00')) {
                        $memberId = $generated;
                    }
                }
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
            'member_id' => $memberId
        ];
    }

    public function importBatch(array $rows, string $committeeNumber, ?string $globalTenureStart, ?string $globalTenureEnd, int $chunkSize = 100, ?string $sessionId = null): array
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
                        $validation = $this->validateSingleRow($row, $committeeNumber);
                        
                        if (!$validation['valid']) {
                            $failed++;
                            $failedRows[] = [
                                'row' => $row['row_number'] ?? 0,
                                'errors' => $validation['errors']
                            ];
                            continue;
                        }

                        // Check if user exists
                        $user = User::whereRaw('LOWER(email) = ?', [strtolower(trim($row['email_address']))])->first();
                        
                        if ($user) {
                            $updates = [];
                            // User already exists, update usertype to executive
                            if ($user->usertype !== 'executive') {
                                $updates['usertype'] = 'executive';
                            }
                            // If member_id is missing, generate and save it
                            if (empty($user->member_id) && !empty($row['department']) && !empty($row['session'])) {
                                $generated = generate_member_id($row['department'], $row['session']);
                                if (!str_starts_with($generated, '00')) {
                                    $updates['member_id'] = $generated;
                                    $updates['department'] = $row['department'];
                                    $updates['session'] = $row['session'];
                                }
                            }
                            if (!empty($updates)) {
                                $user->update($updates);
                            }
                        } else {
                            // User does not exist, so we auto-create them!
                            $memberId = generate_member_id($row['department'], $row['session']);
                            $user = User::create([
                                'name' => $row['name'],
                                'email' => strtolower(trim($row['email_address'])),
                                'password' => bcrypt('12345678'), // Default password
                                'department' => $row['department'],
                                'session' => $row['session'],
                                'gender' => $row['gender'] ?? 'male',
                                'phone' => $row['contact_number'],
                                'member_id' => $memberId,
                                'usertype' => 'executive',
                                'is_approved' => 1,
                            ]);
                        }

                        // Create previous committee member
                        $memberOrder = !empty($row['member_order']) && is_numeric($row['member_order']) 
                            ? (int) $row['member_order'] 
                            : ($imported + 1);

                        $tStart = $row['tenure_start'] ?? $globalTenureStart ?? null;
                        $tEnd = $row['tenure_end'] ?? $globalTenureEnd ?? null;

                        PreviousCommitteeMember::create([
                            'user_id'                 => $user->id,
                            'name'                    => $row['name'] ?? $user->name,
                            'email'                   => $user->email,
                            'designation'             => $row['designation'],
                            'designation_title'       => $row['designation'],
                            'designation_id_snapshot' => $user->designation_id,
                            'photo'                   => $user->image,
                            'committee_number'        => $committeeNumber,
                            'member_order'            => $memberOrder,
                            'tenure_start'            => $this->parseDate($tStart),
                            'tenure_end'              => $this->parseDate($tEnd),
                        ]);
                        $imported++;
                    }
                    
                    DB::commit();
                    
                } catch (\Exception $e) {
                    DB::rollBack();
                    Log::error('Executive Batch import failed: ' . $e->getMessage());
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
            Log::error('Executive Import batch error: ' . $e->getMessage());
            throw $e;
        }
    }

    protected function checkInternalDuplicates(array $rows): array
    {
        $errors = [];
        $emails = [];
        
        foreach ($rows as $row) {
            if (!empty($row['email_address'])) {
                $normalizedEmail = strtolower(trim($row['email_address']));
                
                if (isset($emails[$normalizedEmail])) {
                    $errors[] = new ValidationErrorDTO(
                        $row['row_number'] ?? $row['row_id'] ?? 0,
                        'email_address',
                        'Duplicate email within the import file (first occurrence at row ' . $emails[$normalizedEmail] . ')',
                        'error'
                    );
                } else {
                    $emails[$normalizedEmail] = $row['row_number'] ?? $row['row_id'] ?? 0;
                }
            }
        }
        
        return $errors;
    }

    private function parseDate($value): ?string
    {
        if (empty($value)) return null;

        if (is_numeric($value)) {
            return Carbon::createFromDate(1900, 1, 1)
                ->addDays((int) $value - 2)
                ->toDateString();
        }

        try {
            return Carbon::parse($value)->toDateString();
        } catch (\Exception $e) {
            return null;
        }
    }
}
