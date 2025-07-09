<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use App\Models\CertificateTemplate;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CertificateRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'certificate_number',
        'certificate_path',
        'user_id',
        'template_id',
        'class_id',
        'section_id',
        'exam_id',
        'academic_id',
        'school_id'
    ];
    
   public function user(){
         return $this->belongsTo(User::class,'user_id','id');
   }
   public function template(){
         return $this->belongsTo(CertificateTemplate::class,'template_id','id');
   }
}
