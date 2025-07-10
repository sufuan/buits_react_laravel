<?php 
namespace App\Http\Controllers\Admin\Certificates;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\CertificateTemplate;

class GenerateCertificateController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Certificates/Generate/Index', [
            'templates' => CertificateTemplate::with('type')->get()
        ]);
    }
}
