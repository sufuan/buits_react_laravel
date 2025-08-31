<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreviousCommitteeMember extends Model
{
    use HasFactory;

    protected $fillable = [
    'user_id',
    'name',
    'email',
    'designation',
    'designation_title',
    'designation_id_snapshot',
    'photo',
    'committee_number',
    'member_order',
    'tenure_start',
    'tenure_end',
    ];

    protected $casts = [
        'tenure_start' => 'datetime',
        'tenure_end' => 'datetime',
    ];

    /**
     * Scope to order by member order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('member_order', 'asc');
    }

    /**
     * Scope to filter by committee number
     */
    public function scopeByCommittee($query, $committeeNumber)
    {
        return $query->where('committee_number', $committeeNumber);
    }

    /**
     * Get all committee numbers
     */
    public static function getAllCommitteeNumbers()
    {
        return static::distinct()
            ->orderBy('committee_number', 'desc')
            ->pluck('committee_number');
    }

    /**
     * Get all committees grouped by committee number
     */
    public static function getAllCommittees()
    {
        $committees = static::orderBy('committee_number', 'desc')
            ->orderBy('member_order', 'asc')
            ->get()
            ->groupBy('committee_number');

        return $committees;
    }

    /**
     * Get committee data for display
     */
    public static function getCommitteeData($committeeNumber = null)
    {
        $query = static::ordered();
        
        if ($committeeNumber) {
            $query->byCommittee($committeeNumber);
        }

        return $query->get()->groupBy('committee_number')->map(function ($members, $number) {
            return [
                'committee_number' => $number,
                'member_count' => $members->count(),
                'members' => $members->map(function ($member) {
                    return [
                        'id' => $member->id,
                        'name' => $member->name,
                        'designation' => $member->designation,
                        'photo' => $member->photo,
                        'member_order' => $member->member_order,
                        'email' => $member->email,
                        'tenure_start' => $member->tenure_start,
                        'tenure_end' => $member->tenure_end,
                    ];
                })
            ];
        })->values();
    }
}
