<?php 
namespace App\Http\Controllers\Admin\Certificates;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\CertificateRecord;

class CertificateController extends Controller
{
    public function certificates()
    {
        return Inertia::render('Admin/Certificates/Records/Index', [
            'records' => CertificateRecord::with(['user','template'])->paginate(10)
        ]);
    }
}
