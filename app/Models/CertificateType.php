<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CertificateType extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'usertype', 'short_code'];

    public function templates()
    {
        return $this->hasMany(CertificateTemplate::class, 'certificate_type_id', 'id');
    }
}
