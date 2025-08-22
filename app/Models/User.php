<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'department',
        'session',
        'usertype',
        'designation_id',
        'gender',
        'date_of_birth',
        'blood_group',
        'class_roll',
        'father_name',
        'mother_name',
        'current_address',
        'permanent_address',
        'is_approved',
        'member_id',
        'transaction_id',
        'to_account',
        'image',
        'skills',
        'custom-form',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'date_of_birth' => 'date',
            'is_approved' => 'boolean',
        ];
    }

    public function committees()
    {
        return $this->hasMany(Committee::class);
    }

    public function designation()
    {
        return $this->belongsTo(Designation::class);
    }

    public function volunteerApplication()
    {
        return $this->hasOne(VolunteerApplication::class);
    }

    public function executiveApplications()
    {
        return $this->hasMany(ExecutiveApplication::class);
    }

}
