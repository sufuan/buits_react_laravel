<?php

if (! function_exists('generate_member_id')) {
    /**
     * Generate a new unique member ID based on department and session.
     *
     * Format: {dept_code}{last_2_digits_of_session_end_year}{4_digit_sequence}
     * Example: 1326 1130 → department 13 (CSE), session ending 26, sequence 1130
     *
     * Extracted from Admin\UserController::generateNewMemberId() so that
     * PaymentController@webhook can also call it without creating a circular
     * dependency or duplicating logic.
     *
     * @param  string  $department  Full department name (e.g. "Computer Science and Engineering")
     * @param  string  $session     Session in YYYY-YYYY format (e.g. "2024-2025")
     * @return string               Generated member ID
     */
    function generate_member_id(string $department, string $session): string
    {
        // Define department codes
        $departmentCodes = [
            'Marketing'                              => '04',
            'Law'                                    => '15',
            'Mathematics'                            => '05',
            'Physics'                                => '18',
            'History & Civilization'                 => '23',
            'Soil & Environmental Sciences'          => '10',
            'Economics'                              => '01',
            'Geology & Mining'                       => '17',
            'Management Studies'                     => '03',
            'Statistics'                             => '24',
            'Chemistry'                              => '12',
            'Coastal Studies and Disaster Management'=> '19',
            'Accounting & Information Systems'       => '07',
            'Computer Science and Engineering'       => '13',
            'Sociology'                              => '06',
            'Botany'                                 => '11',
            'Public Administration'                  => '09',
            'Philosophy'                             => '20',
            'Political Science'                      => '16',
            'Biochemistry and Biotechnology'         => '21',
            'Finance and Banking'                    => '14',
            'Mass Communication and Journalism'      => '22',
            'English'                                => '02',
            'Bangla'                                 => '08',
        ];

        // Get department code
        $departmentCode = $departmentCodes[$department] ?? '00';

        // Extract last two digits of the session end year (format: YYYY-YYYY)
        $sessionYear = explode('-', $session);
        $lastTwoDigitsOfSession = substr(end($sessionYear), -2);

        // Fetch the last member to determine the next sequence number
        $lastMember = \App\Models\User::orderBy('id', 'desc')->first();

        // Default starting sequence number
        $newFormNumber = 1130;

        if ($lastMember && $lastMember->member_id) {
            // Extract the last four digits of the most recent member_id and increment
            $lastFormNumber = (int) substr($lastMember->member_id, -4);
            $newFormNumber  = $lastFormNumber + 1;
        }

        // Combine: dept code + session year digits + zero-padded sequence
        return $departmentCode . $lastTwoDigitsOfSession . str_pad($newFormNumber, 4, '0', STR_PAD_LEFT);
    }
}
