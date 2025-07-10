<?php

namespace App\Http\Controllers\Admin\Certificates;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CertificateType;
use Inertia\Inertia;

class CertificateTypeController extends Controller
{
    /**
     * Get student-related shortcodes.
     */
    private function shortCodes()
    {
        return explode(',', preg_replace('/\s+/', '', "
            name, dob, present_address, guardian, created_at, admission_no, roll_no,
            gender, admission_date, category, cast, father_name, mother_name, religion,
            email, phone, average_mark, grade, gpa_with_optional, gpa_without_optional,
            evaluation, exam_total_mark, std_total_mark, position, exam, class, section
        "));
    }

    /**
     * Get staff-related shortcodes.
     */
    private function shortCodesStaff()
    {
        return explode(',', preg_replace('/\s+/', '', "
            name, gender, staff_id, joining_date, designation, department, qualification,
            total_experience, birthday, email, mobileno, present_address, permanent_address
        "));
    }

    /**
     * Show all certificate types.
     */
    public function index()
    {
        return Inertia::render('Admin/Certificates/Types/Index', [
            'types' => CertificateType::orderBy('id')->get(),
            'shortCodes' => $this->shortCodes(),
            'staffShortCodes' => $this->shortCodesStaff(),
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
            'shortCodes' => $this->shortCodes(),
            'staffShortCodes' => $this->shortCodesStaff(),
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
