<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Exports\UsersExport;
use App\Exports\UsersTemplateExport;
use App\Imports\UsersImport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
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
        return Inertia::render('Admin/Users/Create');
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
                'usertype' => $request->usertype ?? 'user',
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
            'user' => $user
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
                'usertype' => $request->usertype ?? 'user',
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
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        try {
            $userName = $user->name;
            $user->delete();

            Log::info('User deleted successfully by admin: ' . $userName);

            return back()->with('success', 'User deleted successfully!');

        } catch (\Exception $e) {
            Log::error('User deletion failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'An error occurred while deleting the user: ' . $e->getMessage()]);
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
            $request->validate([
                'file' => 'required|mimes:xlsx,xls,csv|max:10240' // Max 10MB
            ]);

            Log::info('Starting user import from file: ' . $request->file('file')->getClientOriginalName());

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
     * Download Excel template for import.
     */
    public function template()
    {
        return Excel::download(new UsersTemplateExport, 'users_template.xlsx');
    }
}
