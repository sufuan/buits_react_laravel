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
    ];

    protected $casts = [
        'custom_field_responses' => 'array',   // same pattern as Payment::metadata
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
