<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\CertificateTemplate;
use App\Models\User;

class CertificateType extends Model
{
    use HasFactory;

    // Include name, usertype, and short_code
    protected $fillable = ['name', 'usertype', 'short_code'];

    /**
     * One certificate type can have many templates.
     */
    public function templates()
    {
        return $this->hasMany(CertificateTemplate::class, 'certificate_type_id', 'id');
    }

    /**
     * Relationship: users who belong to this usertype.
     */
    public function users()
    {
        return $this->hasMany(User::class, 'usertype', 'usertype');
    }
}
