<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\CertificateType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\CertificateTemplateDesign;

class CertificateTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'certificate_type_id',
        'layout',
        'width',
        'height',
        'user_photo_style',
        'user_image_size',
        'qr_code',
        'qr_image_size',
        'background_image',
        'logo_image',
        'signature_image',
        'signature_name',
        'content',
        'status',
        'school_id'
    ];
    protected $casts = ['qr_code' => 'array'];
    
    public function type(){
        return $this->belongsTo(CertificateType::class,'certificate_type_id','id');
    }

    public function design(){
        return $this->hasOne(CertificateTemplateDesign::class,'certificate_template_id','id');
    }

    public function generatedCertificates(){
        return $this->hasMany(CertificateRecord::class,'template_id','id');
    }

    public function getLayoutStringAttribute(){
        $layout = $this->layout;
        switch ($layout) {
            case 1:
                $layout = 'A4 (Portrait)';
                break;
            case 2:
                $layout = 'A4 (Landscape)';
                break;
            default:
                $layout = 'Custom';
                break;
        }
        return $layout;
    }
    
}
