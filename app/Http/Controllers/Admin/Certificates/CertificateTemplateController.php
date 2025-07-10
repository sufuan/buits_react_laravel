<?php 
namespace App\Http\Controllers\Admin\Certificates;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CertificateTemplate;
use App\Models\CertificateType;
use Inertia\Inertia;

class CertificateTemplateController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Certificates/Templates/Index', [
            'templates' => CertificateTemplate::with('type')->get(),
            'types' => CertificateType::all()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Certificates/Templates/CreateEdit', [
            'types' => CertificateType::all()
        ]);
    }

    public function storeOrUpdate(Request $req)
    {
        $req->validate(['name'=>'required','certificate_type_id'=>'required']);
        CertificateTemplate::updateOrCreate(
            ['id'=>$req->id],
            $req->only(['name','certificate_type_id','layout','content'])
        );
        return redirect()->route('admin.certificate.templates');
    }

    public function edit($id)
    {
        $template = CertificateTemplate::findOrFail($id);
        return Inertia::render('Admin/Certificates/Templates/CreateEdit', [
            'template',
            'types' => CertificateType::all()
        ]);
    }

    public function design($id)
    {
        $template = CertificateTemplate::findOrFail($id);
        return Inertia::render('Admin/Certificates/Templates/Design', compact('template'));
    }

    public function delete($id)
    {
        CertificateTemplate::destroy($id);
        return back();
    }
}
