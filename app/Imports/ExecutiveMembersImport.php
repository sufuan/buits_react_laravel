<?php

namespace App\Imports;

use App\Models\PreviousCommitteeMember;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

/**
 * ExecutiveMembersImport
 *
 * Imports executive committee members from an Excel sheet into the
 * previous_committee_members table.
 *
 * Expected sheet columns (flexible — matched by heading):
 *   name | designation | department | session | contact_number | email_address
 *   (and optionally: member_order, tenure_start, tenure_end)
 *
 * The committee_number is supplied at runtime (from the import form).
 * Each row is matched to an existing user by email. If no matching user
 * is found the row is skipped and logged.
 */
class ExecutiveMembersImport implements ToModel, WithHeadingRow
{
    protected string $committeeNumber;
    protected ?string $tenureStart;
    protected ?string $tenureEnd;

    protected int $importedCount = 0;
    protected int $skippedCount  = 0;
    protected array $errors      = [];

    // Running order counter so we preserve the Excel row order
    protected int $currentOrder = 1;

    public function __construct(
        string $committeeNumber,
        ?string $tenureStart = null,
        ?string $tenureEnd   = null
    ) {
        $this->committeeNumber = $committeeNumber;
        $this->tenureStart     = $tenureStart;
        $this->tenureEnd       = $tenureEnd;
    }

    /**
     * Process a single Excel row.
     */
    public function model(array $row): ?PreviousCommitteeMember
    {
        try {
            // Clean up all values
            $row = array_map(fn($v) => is_string($v) ? trim($v) : $v, $row);

            // Skip completely blank rows
            if (empty(array_filter($row))) {
                $this->skippedCount++;
                return null;
            }

            // Resolve email — the heading may be "email_address" or "email"
            $email = $row['email_address'] ?? $row['email'] ?? null;

            if (empty($email)) {
                $this->errors[]   = 'Row ' . $this->currentOrder . ': missing email — skipped.';
                $this->skippedCount++;
                $this->currentOrder++;
                return null;
            }

            // Find the matching registered user
            $user = User::where('email', $email)->first();

            if (!$user) {
                $this->errors[] = "Row {$this->currentOrder}: no user found for email \"{$email}\" — skipped.";
                $this->skippedCount++;
                $this->currentOrder++;
                return null;
            }

            // Prevent duplicate entries (same user + same committee)
            $exists = PreviousCommitteeMember::where('user_id', $user->id)
                ->where('committee_number', $this->committeeNumber)
                ->exists();

            if ($exists) {
                $this->errors[] = "Row {$this->currentOrder}: \"{$email}\" already exists in committee {$this->committeeNumber} — skipped.";
                $this->skippedCount++;
                $this->currentOrder++;
                return null;
            }

            // Resolve designation — may be "designation" or "designation_title"
            $designation = $row['designation'] ?? $row['designation_title'] ?? '';

            // Resolve member order — from sheet or auto-incremented
            $memberOrder = !empty($row['member_order']) && is_numeric($row['member_order'])
                ? (int) $row['member_order']
                : $this->currentOrder;

            // Tenure dates — prefer sheet values, fall back to form values
            $tenureStart = $row['tenure_start'] ?? $this->tenureStart ?? null;
            $tenureEnd   = $row['tenure_end']   ?? $this->tenureEnd   ?? null;

            $tenureStart = $this->parseDate($tenureStart);
            $tenureEnd   = $this->parseDate($tenureEnd);

            Log::info("ExecutiveMembersImport: importing \"{$email}\" → committee {$this->committeeNumber}");

            $this->importedCount++;
            $this->currentOrder++;

            return new PreviousCommitteeMember([
                'user_id'                 => $user->id,
                'name'                    => $row['name'] ?? $user->name,
                'email'                   => $email,
                'designation'             => $designation,
                'designation_title'       => $designation,
                'designation_id_snapshot' => $user->designation_id,
                'photo'                   => $user->image,  // copy current photo if available
                'committee_number'        => $this->committeeNumber,
                'member_order'            => $memberOrder,
                'tenure_start'            => $tenureStart,
                'tenure_end'              => $tenureEnd,
            ]);

        } catch (\Exception $e) {
            Log::error('ExecutiveMembersImport row error: ' . $e->getMessage());
            $this->errors[] = "Row {$this->currentOrder}: " . $e->getMessage();
            $this->skippedCount++;
            $this->currentOrder++;
            return null;
        }
    }

    // ─── Helpers ────────────────────────────────────────────────────────────

    private function parseDate($value): ?string
    {
        if (empty($value)) {
            return null;
        }

        // Excel serial date (numeric)
        if (is_numeric($value)) {
            return \Carbon\Carbon::createFromDate(1900, 1, 1)
                ->addDays((int) $value - 2)
                ->toDateString();
        }

        try {
            return \Carbon\Carbon::parse($value)->toDateString();
        } catch (\Exception $e) {
            return null;
        }
    }

    // ─── Stats ──────────────────────────────────────────────────────────────

    public function getImportStats(): array
    {
        return [
            'imported' => $this->importedCount,
            'skipped'  => $this->skippedCount,
            'errors'   => $this->errors,
        ];
    }
}
