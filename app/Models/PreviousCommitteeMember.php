<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreviousCommitteeMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'designation',
        'photo',
        'committee_number',
        'member_order'
    ];

    /**
     * Get members by committee number
     */
    public static function getByCommittee($committeeNumber)
    {
        return self::where('committee_number', $committeeNumber)
                   ->orderBy('member_order')
                   ->get();
    }

    /**
     * Get all committees with their members
     */
    public static function getAllCommittees()
    {
        $committees = [];
        for ($i = 1; $i <= 6; $i++) {
            $committees[$i] = self::getByCommittee($i);
        }
        return $committees;
    }

    /**
     * Scope to filter by committee
     */
    public function scopeCommittee($query, $committeeNumber)
    {
        return $query->where('committee_number', $committeeNumber);
    }
}
