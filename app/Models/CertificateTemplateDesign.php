<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CertificateTemplateDesign extends Model
{
    use HasFactory;

    protected $fillable = [
        'certificate_template_id',
        'design_content'
    ];

}
