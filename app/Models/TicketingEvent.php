<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketingEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'event_html_content',
        'form_schema',
        'fee',
        'deadline',
        'status',
        'created_by',
        'requires_payment',
        'member_fee',
        'non_member_fee',
        'enabled_payment_methods',
    ];

    protected $casts = [
        'deadline'                => 'datetime',
        'fee'                     => 'decimal:2',
        'form_schema'             => 'array',
        'requires_payment'        => 'boolean',
        'member_fee'              => 'decimal:2',
        'non_member_fee'          => 'decimal:2',
        'enabled_payment_methods' => 'array',
    ];

    /**
     * Route model binding resolves by slug, not id.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    /**
     * Scope: only active events.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    /**
     * An event has many registrations.
     */
    public function registrations()
    {
        return $this->hasMany(EventRegistration::class, 'event_id');
    }

    /**
     * The admin who created this event.
     */
    public function creator()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    /**
     * Returns true when the event is closed OR its deadline has passed.
     */
    public function isClosed(): bool
    {
        return $this->status === 'closed'
            || ($this->deadline !== null && now()->gt($this->deadline));
    }
}
