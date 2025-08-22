<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PendingUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class UserApprovalController extends Controller
{
    /**
     * Display a listing of users waiting for approval.
     */
    public function index(Request $request)
    {
        // Fetch users waiting for approval
        $pendingUsers = PendingUser::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Users/NewUserRequests', [
            'pendingUsers' => $pendingUsers
        ]);
    }

    /**
     * Display all approved users.
     */
    public function allUsers(Request $request)
    {
        $users = User::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Users/AllUsers', [
            'users' => $users
        ]);
    }

    /**
     * Approve a pending user and move them to the users table.
     */
    public function approve($id)
    {
        try {
            // Fetch the pending user by ID
            $pendingUser = PendingUser::findOrFail($id);

            // Validate required fields (password is already hashed, so we don't need to validate it)
            $validator = Validator::make($pendingUser->toArray(), [
                'name' => 'required|string',
                'email' => 'required|email',
            ]);

            if ($validator->fails()) {
                return back()->withErrors($validator->errors());
            }

            // Generate member ID
            $memberId = $this->generateNewMemberId($pendingUser->department, $pendingUser->session);

            // Create a new user based on the pending user's data
            $newUser = User::create([
                'name' => $pendingUser->name,
                'email' => $pendingUser->email,
                'password' => $pendingUser->password, // Already hashed
                'phone' => $pendingUser->phone,
                'department' => $pendingUser->department,
                'session' => $pendingUser->session,
                'usertype' => $pendingUser->usertype,
                'gender' => $pendingUser->gender,
                'date_of_birth' => $pendingUser->date_of_birth,
                'blood_group' => $pendingUser->blood_group,
                'class_roll' => $pendingUser->class_roll,
                'father_name' => $pendingUser->father_name,
                'mother_name' => $pendingUser->mother_name,
                'current_address' => $pendingUser->current_address,
                'permanent_address' => $pendingUser->permanent_address,
                'member_id' => $memberId,
                'transaction_id' => $pendingUser->transaction_id,
                'to_account' => $pendingUser->to_account,
                'image' => $pendingUser->image,
                'skills' => $pendingUser->skills,
                'custom-form' => $pendingUser['custom-form'],
                'is_approved' => true,
                'usertype' => 'member', // Set default usertype to member when approved
            ]);

            // TODO: Send approval emails
            // Mail::to($newUser->email)->send(new UserApprovedMail($newUser));
            // Mail::to('info.buits@gmail.com')->send(new AdminNotificationMail($newUser));

            // Remove the pending user after successful approval
            $pendingUser->delete();

            return back()->with('success', 'User approved successfully');

        } catch (\Exception $e) {
            Log::error('User approval failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'An error occurred during approval: ' . $e->getMessage()]);
        }
    }

    /**
     * Reject a pending user and delete their record.
     */
    public function reject($id)
    {
        try {
            $pendingUser = PendingUser::findOrFail($id);
            $pendingUser->delete();

            return back()->with('success', 'User registration rejected successfully');

        } catch (\Exception $e) {
            Log::error('User rejection failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'An error occurred during rejection: ' . $e->getMessage()]);
        }
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

        // Fetch the last member ID by ordering the users table by 'id' in descending order
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
     * Bulk approve multiple users
     */
    public function bulkApprove(Request $request)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:pending_users,id'
        ]);

        try {
            $approvedCount = 0;
            $errors = [];

            foreach ($request->user_ids as $id) {
                try {
                    $pendingUser = PendingUser::find($id);
                    if (!$pendingUser) continue;

                    // Check if user already exists
                    $existingUser = User::where('email', $pendingUser->email)->first();
                    if ($existingUser) {
                        $errors[] = "User {$pendingUser->name} already exists.";
                        continue;
                    }

                    // Generate member ID
                    $memberId = $this->generateNewMemberId($pendingUser->department, $pendingUser->session);

                    // Create user account
                    $newUser = User::create([
                        'name' => $pendingUser->name,
                        'email' => $pendingUser->email,
                        'password' => $pendingUser->password, // Already hashed
                        'phone' => $pendingUser->phone,
                        'department' => $pendingUser->department,
                        'session' => $pendingUser->session,
                        'usertype' => $pendingUser->usertype,
                        'gender' => $pendingUser->gender,
                        'date_of_birth' => $pendingUser->date_of_birth,
                        'blood_group' => $pendingUser->blood_group,
                        'class_roll' => $pendingUser->class_roll,
                        'father_name' => $pendingUser->father_name,
                        'mother_name' => $pendingUser->mother_name,
                        'current_address' => $pendingUser->current_address,
                        'permanent_address' => $pendingUser->permanent_address,
                        'member_id' => $memberId,
                        'transaction_id' => $pendingUser->transaction_id,
                        'to_account' => $pendingUser->to_account,
                        'image' => $pendingUser->image,
                        'skills' => $pendingUser->skills,
                        'custom-form' => $pendingUser['custom-form'],
                        'is_approved' => true,
                        'usertype' => 'member', // Set default usertype to member when approved
                    ]);

                    // Delete pending user record
                    $pendingUser->delete();
                    $approvedCount++;

                } catch (\Exception $e) {
                    $errors[] = "Failed to approve {$pendingUser->name}: " . $e->getMessage();
                }
            }

            $message = "{$approvedCount} users approved successfully!";
            if (!empty($errors)) {
                $message .= " Errors: " . implode(', ', array_slice($errors, 0, 3));
                if (count($errors) > 3) {
                    $message .= " and " . (count($errors) - 3) . " more...";
                }
            }

            return back()->with('success', $message);

        } catch (\Exception $e) {
            Log::error('Bulk approval failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Bulk approval failed: ' . $e->getMessage()]);
        }
    }

    /**
     * Bulk reject multiple users
     */
    public function bulkReject(Request $request)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:pending_users,id'
        ]);

        try {
            $rejectedCount = 0;

            foreach ($request->user_ids as $id) {
                $pendingUser = PendingUser::find($id);
                if ($pendingUser) {
                    $pendingUser->delete();
                    $rejectedCount++;
                }
            }

            return back()->with('success', "{$rejectedCount} users rejected successfully!");

        } catch (\Exception $e) {
            Log::error('Bulk rejection failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Bulk rejection failed: ' . $e->getMessage()]);
        }
    }
}
