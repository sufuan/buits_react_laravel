<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'name',
        'email',
        'phone',
        'payment_method',
        'transaction_id',
        'sender_number',
        'custom_field_responses',
        'status',
        'ticket_no',
        'is_member',
        'member_id',
        'fee_charged',
    ];

    protected $casts = [
        'custom_field_responses' => 'array',
        'is_member'              => 'boolean',
        'fee_charged'            => 'decimal:2',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    /**
     * The ticketing event this registration belongs to.
     */
    public function ticketingEvent()
    {
        return $this->belongsTo(TicketingEvent::class, 'event_id');
    }
}
