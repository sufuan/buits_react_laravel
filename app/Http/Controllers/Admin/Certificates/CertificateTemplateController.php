<?php

namespace App\Http\Controllers\Admin\Certificates;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\CertificateType;
use App\Models\CertificateTemplate;
use App\Models\CertificateTemplateDesign;
use App\Models\CertificateSetting;

class CertificateTemplateController extends Controller
{
    private function common()
    {
        return [
            'templates' => CertificateTemplate::with('type')->get(),
            'types' => CertificateType::all(),
        ];
    }

    public function index(): Response
    {
        return Inertia::render('Admin/Certificates/Templates/Index', [
            'page_title' => 'Certificate Templates',
            ...$this->common(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Certificates/Templates/CreateEdit', [
            'page_title' => 'Create Certificate Template',
            'types' => CertificateType::all(),
            'canAdd' => true,
        ]);
    }



    public function edit($id): Response
    {
        return Inertia::render('Admin/Certificates/Templates/CreateEdit', [
            'page_title' => 'Edit Certificate Template',
            'types' => CertificateType::all(),
            'editData' => CertificateTemplate::with('type')->findOrFail($id),
        ]);
    }

    public function storeOrUpdate(Request $request)
    {

        $request->validate([
            'type_id' => 'required',
            'name' => 'required',
            'layout' => 'required',
            'height' => 'required',
            'width' => 'required',
            'background_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'signature_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'logo_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'user_photo_style' => 'required',
            'user_image_size' => 'required_unless:user_photo_style,0',
            'content' => [
                'required',
                function ($attribute, $value, $fail) {
                    // Check if content is just empty HTML tags
                    $cleanContent = trim(strip_tags($value));
                    if (empty($cleanContent) || $cleanContent === '') {
                        $fail('Certificate Content is required');
                    }
                }
            ],
            'qr_image_size' => 'required|integer|min:100',
        ], [
            'type_id.required' => 'Certificate Type is required',
            'name.required' => 'Certificate Name is required',
            'layout.required' => 'Certificate Layout is required',
            'height.required' => 'Certificate Height is required',
            'width.required' => 'Certificate Width is required',
            'content.required' => 'Certificate Content is required',
            'user_photo_style.required' => 'User Image Shape is required',
            'user_image_size.required' => 'User Image Size is required',
            'qr_image_size.required' => 'QR Image Size is required',
            'qr_image_size.integer' => 'QR Image Size must be a number',
            'qr_image_size.min' => 'QR Image Size must be at least 100',
        ]);

        DB::beginTransaction();
        try {
            // Fix: Use findOrNew properly - if id is empty, create new
            $template = $request->id ? CertificateTemplate::find($request->id) : new CertificateTemplate();

            if (!$template) {
                $template = new CertificateTemplate();
            }

            $template->certificate_type_id = $request->type_id;
            $template->name = $request->name;
            $template->status = $request->status ?? 1;
            $template->layout = $request->layout;
            $template->height = floatval($request->height) . 'mm';
            $template->width = floatval($request->width) . 'mm';

            // Determine QR code based on certificate type
            $certificateType = CertificateType::find($request->type_id);
            if ($certificateType && $certificateType->usertype === 'student') {
                $qrData = $request->qr_code_student ?: ['admission_no'];
                $template->qr_code = json_encode(array_values($qrData));
            } else {
                $qrData = $request->qr_code_staff ?: ['staff_id'];
                $template->qr_code = json_encode(array_values($qrData));
            }

            $template->qr_image_size = $request->qr_image_size;
            $template->user_photo_style = $request->user_photo_style;
            $template->user_image_size = $request->user_image_size ?: null;
            $template->content = $request->content;

            // Handle file uploads
            if ($request->hasFile('background_image')) {
                $path = $request->file('background_image')->store('certificate', 'public');
                $template->background_image = $path;
            }

            if ($request->hasFile('signature_image')) {
                $path = $request->file('signature_image')->store('certificate', 'public');
                $template->signature_image = $path;
            }

            if ($request->hasFile('logo_image')) {
                $path = $request->file('logo_image')->store('certificate', 'public');
                $template->logo_image = $path;
            }

            $template->save();

            // Create or update design record
            if (!$template->design) {
                CertificateTemplateDesign::create([
                    'certificate_template_id' => $template->id,
                    'design_content' => null
                ]);
            } else {
                $template->design->design_content = null;
                $template->design->save();
            }

            DB::commit();

            return redirect()->route('admin.certificate.templates.index')->with('success', $request->id
                ? 'Certificate Template Updated Successfully'
                : 'Certificate Template Created Successfully');
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with('error', $th->getMessage());
        }
    }

    public function design($id): Response
    {
        return Inertia::render('Admin/Certificates/Templates/Design', [
            'page_title' => 'Design Certificate Template',
            'types' => CertificateType::all(),
            'editData' => CertificateTemplate::with('type')->findOrFail($id),
        ]);
    }

    public function designReset($id)
    {
        try {
            $template = CertificateTemplate::findOrFail($id);
            if ($template->design) {
                $template->design->design_content = '';
                $template->design->save();
            }

            return back()->with('success', 'Certificate Template Design Reset Successfully');
        } catch (\Throwable $th) {
            return back()->with('error', $th->getMessage());
        }
    }

    public function updateDesign(Request $request)
    {
        try {
            $design = CertificateTemplateDesign::firstOrNew([
                'certificate_template_id' => $request->template_id,
            ]);

            $design->design_content = $request->design_content;
            $design->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Design updated successfully',
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
            ]);
        }
    }

    public function delete($id)
    {
        try {
            $template = CertificateTemplate::with('design')->findOrFail($id);
            if ($template->design) {
                $template->design->delete();
            }

            $template->delete();

            return redirect()->route('admin.certificate.templates.index')->with('success', 'Certificate Template Deleted Successfully');
        } catch (\Throwable $th) {
            return back()->with('error', $th->getMessage());
        }
    }

    public function templateType(Request $request)
    {
        try {
            $certificate_type = CertificateType::find($request->type_id);
            $html = view('admin.certificates.useable_tags', compact('certificate_type'))->render();

            return response()->json([
                'status' => 'success',
                'data' => $html,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'data' => $th->getMessage(),
            ]);
        }
    }

    public function preview(Request $request)
    {
        try {
            $certificate_setting = CertificateSetting::where('key', 'prefix')
                ->first();

            $certificate = CertificateTemplate::with('design')->findOrFail($request->template);

            $design = $request->design_content;
            $logo = asset($certificate->logo_image);
            $signature = asset($certificate->signature_image);
            $defaultLogo = asset('Modules/Certificate/Resources/assets/signature.png');
            $qrCodeImg = asset('Modules/Certificate/Resources/assets/qr.jpg');
            $userImg = asset('Modules/Certificate/Resources/assets/user.png');

            $user_image = '<img src="' . $userImg . '" style="width:' . $certificate->user_image_size . 'px; border-radius:' . ($certificate->user_photo_style == 1 ? '50%' : '0') . ';">';
            $qr_image = '<img src="' . $qrCodeImg . '" style="width:' . $certificate->qr_image_size . 'px;">';

            $final_html = str_replace([
                '{certificate_logo}',
                '{user_image}',
                '{certificate_no}',
                '{logo_image}',
                '{issue_date}',
                '{qrCode}',
            ], [
                $logo,
                $user_image,
                $certificate_setting->value . '445',
                '<img src="' . $defaultLogo . '">',
                now()->format('d-m-Y'),
                $qr_image,
            ], $design);

            return response()->json([
                'status' => 'success',
                'data' => $final_html,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'data' => $th->getMessage(),
            ]);
        }
    }
}
