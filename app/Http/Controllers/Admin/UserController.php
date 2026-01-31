<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Exports\UsersExport;
use App\Exports\UsersTemplateExport;
use App\Imports\UsersImport;
use App\Services\UserImportService;
use App\DTOs\ImportPreviewDTO;
use App\DTOs\ValidationErrorDTO;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;


class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request)
    {
        $users = User::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'departments' => $this->getDepartments()
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'phone' => 'required|string|max:20',
                'department' => 'required|string|max:255',
                'session' => 'required|string|max:255',
                'gender' => 'required|string|in:male,female,other',
                'date_of_birth' => 'nullable|date',
                'blood_group' => 'nullable|string|max:10',
                'class_roll' => 'nullable|string|max:20',
                'father_name' => 'nullable|string|max:255',
                'mother_name' => 'nullable|string|max:255',
                'current_address' => 'nullable|string|max:500',
                'permanent_address' => 'nullable|string|max:500',
                'skills' => 'nullable|string|max:1000',
                'usertype' => 'nullable|string|max:50',
                'transaction_id' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return back()->withErrors($validator)->withInput();
            }

            // Generate member ID
            $memberId = $this->generateNewMemberId($request->department, $request->session);

            // Create the user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'department' => $request->department,
                'session' => $request->session,
                'gender' => $request->gender,
                'date_of_birth' => $request->date_of_birth,
                'blood_group' => $request->blood_group,
                'class_roll' => $request->class_roll,
                'father_name' => $request->father_name,
                'mother_name' => $request->mother_name,
                'current_address' => $request->current_address,
                'permanent_address' => $request->permanent_address,
                'skills' => $request->skills,
                'usertype' => $request->usertype ?? 'member',
                'transaction_id' => $request->transaction_id,
                'is_approved' => true,
                'member_id' => $memberId,
            ]);

            Log::info('User created successfully by admin: ' . $user->email);

            return redirect()->route('admin.users.index')->with('success', 'User created successfully! Member ID: ' . $memberId);

        } catch (\Exception $e) {
            Log::error('User creation failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'An error occurred while creating the user: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        return Inertia::render('Admin/Users/Show', [
            'user' => $user
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'departments' => $this->getDepartments()
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
                'password' => 'nullable|string|min:8|confirmed',
                'phone' => 'required|string|max:20',
                'department' => 'required|string|max:255',
                'session' => 'required|string|max:255',
                'gender' => 'required|string|in:male,female,other',
                'date_of_birth' => 'nullable|date',
                'blood_group' => 'nullable|string|max:10',
                'class_roll' => 'nullable|string|max:20',
                'father_name' => 'nullable|string|max:255',
                'mother_name' => 'nullable|string|max:255',
                'current_address' => 'nullable|string|max:500',
                'permanent_address' => 'nullable|string|max:500',
                'skills' => 'nullable|string|max:1000',
                'usertype' => 'nullable|string|max:50',
                'transaction_id' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return back()->withErrors($validator)->withInput();
            }

            // Check if department or session has changed to update member_id
            if ($user->department !== $request->department || $user->session !== $request->session) {
                $memberId = $this->generateNewMemberId($request->department, $request->session);
            } else {
                $memberId = $user->member_id;
            }

            // Update the user
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->filled('password') ? Hash::make($request->password) : $user->password,
                'phone' => $request->phone,
                'department' => $request->department,
                'session' => $request->session,
                'gender' => $request->gender,
                'date_of_birth' => $request->date_of_birth,
                'blood_group' => $request->blood_group,
                'class_roll' => $request->class_roll,
                'father_name' => $request->father_name,
                'mother_name' => $request->mother_name,
                'current_address' => $request->current_address,
                'permanent_address' => $request->permanent_address,
                'skills' => $request->skills,
                'usertype' => $request->usertype ?? $user->usertype,
                'transaction_id' => $request->transaction_id,
                'member_id' => $memberId,
            ]);

            Log::info('User updated successfully by admin: ' . $user->email);

            return redirect()->route('admin.users.index')->with('success', 'User updated successfully!');

        } catch (\Exception $e) {
            Log::error('User update failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'An error occurred while updating the user: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Get list of departments.
     */
    private function getDepartments()
    {
        return [
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
            'Bangla',
        ];
    }

    /**
     * Generate a new unique member ID based on department and session.
     */
    private function generateNewMemberId($department, $session)
    {
        // Define department codes
        $departmentCodes = [
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

        // Get department code
        $departmentCode = $departmentCodes[$department] ?? "00";

        // Extract last two digits of the session (assuming session format is YYYY-YYYY)
        $sessionYear = explode('-', $session);
        $lastTwoDigitsOfSession = substr(end($sessionYear), -2);

        // Fetch the last member ID by ordering the users table in descending order
        $lastMember = User::orderBy('id', 'desc')->first();

        // Initialize the default starting number
        $newFormNumber = 1130;

        if ($lastMember && $lastMember->member_id) {
            // Extract the last four digits of the member_id from the last record
            $lastFormNumber = (int)substr($lastMember->member_id, -4);
            // Increment the last form number by 1
            $newFormNumber = $lastFormNumber + 1;
        }

        // Return the new member ID with department code, session year, and the new form number
        $newMemberId = $departmentCode . $lastTwoDigitsOfSession . str_pad($newFormNumber, 4, '0', STR_PAD_LEFT);

        return $newMemberId;
    }

    /**
     * Export users to Excel.
     */
    public function export()
    {
        return Excel::download(new UsersExport, 'users.xlsx');
    }

    /**
     * Import users from Excel.
     */
    public function import(Request $request)
    {
        try {
            // More flexible validation - check file extension rather than strict MIME type
            $request->validate([
                'file' => 'required|file|max:10240' // Max 10MB
            ]);

            $file = $request->file('file');
            
            // Additional validation for Excel files
            $allowedExtensions = ['xlsx', 'xls', 'csv'];
            $fileExtension = strtolower($file->getClientOriginalExtension());
            
            if (!in_array($fileExtension, $allowedExtensions)) {
                return back()->withErrors(['error' => 'Please upload a valid Excel file (.xlsx, .xls) or CSV file. Uploaded file: ' . $file->getClientOriginalName()]);
            }

            Log::info('Starting user import from file: ' . $file->getClientOriginalName() . ' (Type: ' . $file->getMimeType() . ', Extension: ' . $fileExtension . ')');

            $import = new UsersImport;
            
            try {
                Excel::import($import, $request->file('file'));
                
                // Get import statistics
                $stats = $import->getImportStats();
                
                Log::info('User import completed. Imported: ' . $stats['imported'] . ', Skipped: ' . $stats['skipped']);
                
                if (!empty($stats['errors'])) {
                    Log::warning('Import errors: ' . json_encode($stats['errors']));
                }
                
                // Build success message
                $message = "Import completed! ";
                if ($stats['imported'] > 0) {
                    $message .= "Successfully imported {$stats['imported']} user(s). ";
                }
                if ($stats['skipped'] > 0) {
                    $message .= "Skipped {$stats['skipped']} row(s). ";
                }
                
                if ($stats['imported'] === 0 && $stats['skipped'] > 0) {
                    // All rows were skipped
                    $errorDetails = !empty($stats['errors']) ? ' Details: ' . implode('; ', array_slice($stats['errors'], 0, 3)) : '';
                    return back()->withErrors(['error' => 'No users were imported. All rows were skipped due to validation errors or duplicates.' . $errorDetails]);
                }
                
                return back()->with('success', $message);
                
            } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
                $failures = $e->failures();
                $errors = [];
                foreach ($failures as $failure) {
                    $row = $failure->row();
                    $attribute = $failure->attribute();
                    $errorMessages = $failure->errors();
                    $errors[] = "Row {$row} - {$attribute}: " . implode(', ', $errorMessages);
                }
                Log::error('Import validation failed: ' . implode(' | ', $errors));
                
                // Provide helpful message about the error
                $errorMessage = 'Validation failed. Please check your Excel file: ';
                $errorMessage .= implode(' | ', array_slice($errors, 0, 3)); // Show first 3 errors
                if (count($errors) > 3) {
                    $errorMessage .= ' ... and ' . (count($errors) - 3) . ' more errors.';
                }
                
                return back()->withErrors(['error' => $errorMessage]);
            }
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors(['error' => 'Invalid file. Please upload an Excel file (xlsx, xls) or CSV file.']);
        } catch (\Exception $e) {
            Log::error('User import failed: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            // Provide user-friendly error message
            $errorMessage = 'Import failed: ';
            if (strpos($e->getMessage(), 'Could not open') !== false) {
                $errorMessage .= 'Unable to read the file. Please ensure it is a valid Excel file.';
            } elseif (strpos($e->getMessage(), 'does not exist') !== false) {
                $errorMessage .= 'Some required columns are missing in your Excel file. Please use the template.';
            } else {
                $errorMessage .= $e->getMessage();
            }
            
            return back()->withErrors(['error' => $errorMessage]);
        }
    }

    /**
     * Show the import wizard page
     */
    public function showImport()
    {
        try {
            $validator = new \App\Validators\UserImportValidator();
            
            $validationMetadata = [
                'departments' => $validator->getValidDepartments(),
                'blood_groups' => $validator->getValidBloodGroups(),
                'genders' => ['male', 'female', 'other'],
                'user_types' => ['member', 'alumni', 'volunteer'],
                'session_format' => 'YYYY-YY or YYYY-YYYY',
                'phone_format' => '01XXXXXXXXX'
            ];

            return Inertia::render('Admin/Users/Import', [
                'validationMetadata' => $validationMetadata
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to load import page: ' . $e->getMessage());
            
            return back()->withErrors(['error' => 'Failed to load import page']);
        }
    }

    /**
     * Download Excel template for import.
     */
    public function template()
    {
        return Excel::download(new UsersTemplateExport, 'users_template.xlsx');
    }

    /**
     * Preview Excel file without importing
     * Parse and validate Excel file, return preview data
     */
    public function preview(Request $request): JsonResponse
    {
        try {
            // More flexible validation - check file extension rather than strict MIME type
            $request->validate([
                'excel_file' => 'required|file|max:10240', // Max 10MB
            ]);

            $file = $request->file('excel_file');
            
            // Additional validation for Excel files
            $allowedExtensions = ['xlsx', 'xls'];
            $fileExtension = strtolower($file->getClientOriginalExtension());
            
            if (!in_array($fileExtension, $allowedExtensions)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please upload a valid Excel file (.xlsx or .xls). Uploaded file: ' . $file->getClientOriginalName()
                ], 422);
            }

            Log::info('Starting file preview: ' . $file->getClientOriginalName() . ' (Type: ' . $file->getMimeType() . ', Extension: ' . $fileExtension . ')');

            $importService = new UserImportService();
            $previewData = $importService->parseExcelFile($file);

            // Store preview data in session for later import
            $sessionId = Str::uuid()->toString();
            Session::put('import_preview_' . $sessionId, [
                'data' => $previewData,
                'expires_at' => now()->addMinutes(30)
            ]);

            Log::info('Preview generated successfully. Rows: ' . count($previewData->rows) . ', Errors: ' . count($previewData->errors));

            return response()->json([
                'success' => true,
                'session_id' => $sessionId,
                'data' => $previewData->toArray(),
                'message' => $previewData->getSummaryMessage()
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in preview: ' . json_encode($e->errors()));
            return response()->json([
                'success' => false,
                'message' => 'File validation failed. Please ensure you upload a valid Excel file.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Preview failed: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            $errorMessage = 'Failed to process file. ';
            if (strpos($e->getMessage(), 'could not be opened') !== false || 
                strpos($e->getMessage(), 'corrupted') !== false) {
                $errorMessage .= 'The file appears to be corrupted or in an unsupported format. Please save your Excel file again and try uploading.';
            } else {
                $errorMessage .= $e->getMessage();
            }
            
            return response()->json([
                'success' => false,
                'message' => $errorMessage
            ], 500);
        }
    }

    /**
     * Validate a single row after editing
     */
    public function validateRow(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'row_id' => 'required',
                'data' => 'required|array'
            ]);

            $importService = new UserImportService();
            $validation = $importService->validateSingleRow($request->data);

            return response()->json([
                'success' => true,
                'valid' => $validation['valid'],
                'errors' => array_map(function($error) {
                    return $error instanceof ValidationErrorDTO ? $error->toArray() : $error;
                }, $validation['errors']),
                'member_id' => $validation['member_id']
            ]);

        } catch (\Exception $e) {
            Log::error('Row validation failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to validate row: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Import validated data in batches
     */
    public function importBatch(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'rows' => 'required|array',
                'chunk_size' => 'integer|min:1|max:500',
                'session_id' => 'nullable|string'
            ]);

            $importService = new UserImportService();
            $chunkSize = $request->chunk_size ?? 100;
            
            // Validate all rows before import
            $errors = $importService->validateRows($request->rows);
            if (!empty($errors)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation errors found. Please fix them before importing.',
                    'errors' => array_map(function($error) {
                        return $error instanceof ValidationErrorDTO ? $error->toArray() : $error;
                    }, $errors)
                ], 422);
            }

            // Perform batch import
            $result = $importService->importBatch(
                $request->rows,
                $chunkSize,
                $request->session_id
            );

            // Clear session data if exists
            if ($request->session_id) {
                Session::forget('import_preview_' . $request->session_id);
            }

            Log::info('Batch import completed. Imported: ' . $result['imported'] . ', Failed: ' . $result['failed']);

            return response()->json([
                'success' => true,
                'imported' => $result['imported'],
                'failed' => $result['failed'],
                'failed_rows' => $result['failed_rows'],
                'progress' => [
                    'total' => $result['total'],
                    'processed' => $result['imported'] + $result['failed'],
                    'percentage' => round((($result['imported'] + $result['failed']) / $result['total']) * 100, 2)
                ],
                'message' => "Successfully imported {$result['imported']} user(s)."
            ]);

        } catch (\Exception $e) {
            Log::error('Batch import failed: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get import session data
     */
    public function getImportSession(Request $request, string $sessionId): JsonResponse
    {
        try {
            $sessionData = Session::get('import_preview_' . $sessionId);
            
            if (!$sessionData) {
                return response()->json([
                    'success' => false,
                    'message' => 'Import session not found or expired'
                ], 404);
            }

            // Check if session has expired
            if ($sessionData['expires_at']->isPast()) {
                Session::forget('import_preview_' . $sessionId);
                return response()->json([
                    'success' => false,
                    'message' => 'Import session has expired'
                ], 410);
            }

            return response()->json([
                'success' => true,
                'data' => $sessionData['data']->toArray(),
                'expires_at' => $sessionData['expires_at']->toIso8601String()
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get import session: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve import session'
            ], 500);
        }
    }

    /**
     * Clear import session
     */
    public function clearImportSession(Request $request, string $sessionId): JsonResponse
    {
        try {
            Session::forget('import_preview_' . $sessionId);
            
            return response()->json([
                'success' => true,
                'message' => 'Import session cleared successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to clear import session: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear import session'
            ], 500);
        }
    }

    /**
     * Get validation metadata (departments, blood groups, etc.)
     */
    public function getValidationMetadata(): JsonResponse
    {
        try {
            $validator = new \App\Validators\UserImportValidator();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'departments' => $validator->getValidDepartments(),
                    'blood_groups' => $validator->getValidBloodGroups(),
                    'genders' => ['male', 'female', 'other'],
                    'user_types' => ['member', 'alumni', 'volunteer'],
                    'session_format' => 'YYYY-YY or YYYY-YYYY',
                    'phone_format' => '01XXXXXXXXX'
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get validation metadata: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve validation metadata'
            ], 500);
        }
    }
}
