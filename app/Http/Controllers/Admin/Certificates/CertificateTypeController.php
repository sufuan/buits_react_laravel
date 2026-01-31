<?php

namespace App\Http\Controllers\Admin\Certificates;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CertificateType;
use Inertia\Inertia;

class CertificateTypeController extends Controller
{
    /**
     * Get available shortcodes for certificates.
     */
    private function getShortCodes()
    {
        // Relevant fields for User model (IT Society)
        return explode(',', preg_replace('/\s+/', '', "
            name, email, phone, member_id, department, session, usertype,
            designation, committee_status, gender, date_of_birth, blood_group,
            father_name, mother_name, current_address, permanent_address,
            created_at, skills, image, class_roll
        "));
    }

    /**
     * Show all certificate types.
     */
    public function index()
    {
        return Inertia::render('Admin/Certificates/Types/Index', [
            'types' => CertificateType::orderBy('id')->get(),
            'shortCodes' => $this->getShortCodes(),
        ]);
    }

    /**
     * Show the form for creating a new certificate type.
     */
    public function create()
    {
        return Inertia::render('Admin/Certificates/Types/Create', [
            'shortCodes' => $this->getShortCodes(),
        ]);
    }

    /**
     * Create or update a certificate type.
     */
    public function storeOrUpdate(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|unique:certificate_types,name,' . $request->id,
            'short_code' => 'required|array',
            'usertype' => 'required',
        ]);

        CertificateType::updateOrCreate(
            ['id' => $request->id],
            [
                'name' => $request->name,
                'usertype' => $request->usertype,
                'short_code' => json_encode($request->short_code),
            ]
        );

        return redirect()->route('admin.certificate.types.index');
    }

    /**
     * Edit a specific certificate type.
     */
    public function edit($type_id)
    {
        $type = CertificateType::findOrFail($type_id);

        return Inertia::render('Admin/Certificates/Types/Edit', [
            'type' => $type,
            'shortCodes' => $this->getShortCodes(),
        ]);
    }

    /**
     * Delete a certificate type if not used.
     */
public function delete($type_id)
{
    $type = CertificateType::with('templates')->findOrFail($type_id);

    if ($type->templates->count() > 0) {
        if (request()->wantsJson()) {
            return response()->json(['error' => 'This type is used in certificate templates.'], 422);
        }
        return back()->withErrors(['error' => 'This type is used in certificate templates.']);
    }

    $type->delete();

    if (request()->wantsJson()) {
        return response()->json(['success' => 'Certificate type deleted.']);
    }

    return redirect()->route('admin.certificate.types.index')->with('success', 'Certificate type deleted.');
}


}
