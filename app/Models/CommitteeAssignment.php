<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CommitteeAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'designation_id',
        'committee_number',
        'tenure_start',
        'tenure_end',
        'status',
        'member_order'
    ];

    protected $casts = [
        'tenure_start' => 'date',
        'tenure_end' => 'date',
        'member_order' => 'integer'
    ];

    /**
     * Get the user that belongs to this committee assignment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the designation for this committee assignment.
     */
    public function designation(): BelongsTo
    {
        return $this->belongsTo(Designation::class);
    }

    /**
     * Scope a query to only include current committee members.
     */
    public function scopeCurrent($query)
    {
        return $query->where('status', 'current');
    }

    /**
     * Scope a query to only include previous committee members.
     */
    public function scopePrevious($query)
    {
        return $query->where('status', 'previous');
    }

    /**
     * Scope a query to filter by committee number.
     */
    public function scopeByCommitteeNumber($query, $committeeNumber)
    {
        return $query->where('committee_number', $committeeNumber);
    }

    /**
     * Scope a query to order by member order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('member_order');
    }

    /**
     * Get the current active committee number.
     */
    public static function getCurrentCommitteeNumber(): ?string
    {
        // Prefer committee number from an existing current assignment (latest)
        $fromAssignments = self::current()->orderByDesc('id')->first()?->committee_number;
        if ($fromAssignments) {
            return $fromAssignments;
        }

        // Next check cache for a stored committee number (after tenure ends)
        $cachedNumber = cache('current_committee_number');
        if ($cachedNumber) {
            return $cachedNumber;
        }

        // Default to a generated committee number based on current year
        $currentYear = now()->year;
        $nextYear = $currentYear + 1;
        return "{$currentYear}-{$nextYear}";
    }

    /**
     * Get all unique committee numbers.
     */
    public static function getAllCommitteeNumbers(): array
    {
        return self::distinct('committee_number')
            ->orderBy('committee_number', 'desc')
            ->pluck('committee_number')
            ->toArray();
    }

    /**
     * Check if this assignment is currently active.
     */
    public function isActive(): bool
    {
        return $this->status === 'current';
    }

    /**
     * Mark this assignment as previous and set end date.
     */
    public function markAsPrevious(): bool
    {
        return $this->update([
            'status' => 'previous',
            'tenure_end' => now()->toDateString()
        ]);
    }
}
