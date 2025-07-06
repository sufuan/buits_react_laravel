<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PendingUser extends Model
{
    use HasFactory;

    protected $table = 'pending_users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'department',
        'session',
        'usertype',
        'gender',
        'date_of_birth',
        'blood_group',
        'class_roll',
        'father_name',
        'mother_name',
        'current_address',
        'permanent_address',
        'is_approved',
        'transaction_id',
        'to_account',
        'image',
        'skills',
        'custom-form',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'is_approved' => 'boolean',
    ];
}
