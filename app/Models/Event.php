<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'start_date',
        'end_date',
        'all_day',
        'location',
        'type',
        'status',
        'color',
        'max_attendees',
        'registration_link',
        'registration_deadline',
        'requires_registration',
        'banner_image',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'registration_deadline' => 'datetime',
        'all_day' => 'boolean',
        'requires_registration' => 'boolean',
    ];

    protected $appends = ['attendees_count'];

    /**
     * Relationship: Event belongs to Admin (creator)
     */
    public function creator()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    /**
     * Relationship: Event has many attendees
     */
    public function attendees()
    {
        return $this->hasMany(EventAttendee::class);
    }

    /**
     * Accessor: Get attendees count
     */
    public function getAttendeesCountAttribute()
    {
        return $this->attendees()->count();
    }

    /**
     * Scope: Get upcoming events
     */
    public function scopeUpcoming($query)
    {
        return $query->where('status', 'upcoming')
                     ->where('start_date', '>', now());
    }

    /**
     * Scope: Get ongoing events
     */
    public function scopeOngoing($query)
    {
        return $query->where('status', 'ongoing')
                     ->where('start_date', '<=', now())
                     ->where('end_date', '>=', now());
    }

    /**
     * Scope: Get completed events
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Check if registration is open
     */
    public function isRegistrationOpen()
    {
        if (!$this->requires_registration) {
            return false;
        }

        if ($this->registration_deadline) {
            return now()->lte($this->registration_deadline);
        }

        return true;
    }

    /**
     * Format event for FullCalendar
     */
    public function toFullCalendarEvent()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'start' => $this->start_date->toIso8601String(),
            'end' => $this->end_date?->toIso8601String(),
            'allDay' => $this->all_day,
            'backgroundColor' => $this->color,
            'borderColor' => $this->color,
            'extendedProps' => [
                'description' => $this->description,
                'location' => $this->location,
                'type' => $this->type,
                'status' => $this->status,
                'attendees_count' => $this->attendees_count,
                'max_attendees' => $this->max_attendees,
                'registration_link' => $this->registration_link,
                'registration_deadline' => $this->registration_deadline?->toIso8601String(),
                'requires_registration' => $this->requires_registration,
                'is_registration_open' => $this->isRegistrationOpen(),
                'banner_image' => $this->banner_image,
            ],
        ];
    }
}

