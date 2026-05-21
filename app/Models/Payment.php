<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'pp_id',
        'customer_name',
        'customer_email_mobile',
        'payment_method',
        'amount',
        'fee',
        'refund_amount',
        'total',
        'currency',
        'transaction_id',
        'sender_number',
        'metadata',
        'status',
        'paid_at',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];
}
