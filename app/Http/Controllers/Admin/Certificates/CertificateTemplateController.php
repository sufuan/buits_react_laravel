<?php

namespace App\Http\Controllers\Admin\Certificates;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
            'editData' => CertificateTemplate::with(['type', 'design'])->findOrFail($id),
        ]);
    }

    public function designReset($id)
    {
        try {
            $template = CertificateTemplate::findOrFail($id);
            if ($template->design) {
                $template->design->design_content = null;
                $template->design->save();
            } else {
                // Create design record if it doesn't exist
                CertificateTemplateDesign::create([
                    'certificate_template_id' => $template->id,
                    'design_content' => null
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Certificate Template Design Reset Successfully'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage()
            ], 500);
        }
    }

  public function updateDesign(Request $request)
    {
      
        Log::info('UpdateDesign Method Called', [
            'method' => $request->method(),
            'url' => $request->url(),
            'all_data' => $request->all(),
            'headers' => $request->headers->all()
        ]);

        try {
            // Basic validation
            if (!$request->has('template_id')) {
                throw new \Exception('Template ID is required');
            }

            if (!$request->has('design_content')) {
                throw new \Exception('Design content is required');
            }

            $templateId = $request->template_id;
            $designContent = $request->design_content;

            Log::info('Processing Design Update', [
                'template_id' => $templateId,
                'design_content_length' => strlen($designContent),
                'design_content_preview' => substr($designContent, 0, 200) . '...'
            ]);

            // Check if template exists
            $template = CertificateTemplate::find($templateId);
            if (!$template) {
                throw new \Exception('Template not found with ID: ' . $templateId);
            }

            Log::info('Template Found', ['template_name' => $template->name]);

            // Find or create design record
            $design = CertificateTemplateDesign::where('certificate_template_id', $templateId)->first();

            if (!$design) {
                Log::info('Creating new design record');
                $design = new CertificateTemplateDesign();
                $design->certificate_template_id = $templateId;
            } else {
                Log::info('Updating existing design record', ['design_id' => $design->id]);
            }

            $design->design_content = $designContent;
            $saved = $design->save();

            Log::info('Design Save Result', [
                'saved' => $saved,
                'design_id' => $design->id,
                'template_id' => $design->certificate_template_id
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Design updated successfully',
                'design_id' => $design->id,
                'template_id' => $templateId,
            ]);
        } catch (\Throwable $th) {
            Log::error('UpdateDesign Error', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString(),
                'request_data' => $request->all(),
                'file' => $th->getFile(),
                'line' => $th->getLine()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
                'debug' => [
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ], 500);
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

            // Get asset URLs
            $logoUrl = $certificate->logo_image ? asset('storage/' . $certificate->logo_image) : '';
            $signatureUrl = $certificate->signature_image ? asset('storage/' . $certificate->signature_image) : '';
            $backgroundUrl = $certificate->background_image ? asset('storage/' . $certificate->background_image) : '';

            // Default placeholder images
            $defaultQrImg = asset('storage/certificate/qr-placeholder.png');
            $defaultUserImg = asset('storage/certificate/user-placeholder.png');

            // Create user image HTML
            $userImageStyle = 'width:' . ($certificate->user_image_size ?: '100') . 'px; height:' . ($certificate->user_image_size ?: '100') . 'px;';
            if ($certificate->user_photo_style == 1) {
                $userImageStyle .= ' border-radius: 50%;';
            }
            $user_image = '<img src="' . $defaultUserImg . '" style="' . $userImageStyle . ' object-fit: cover;">';

            // Create QR code HTML
            $qrSize = $certificate->qr_image_size ?: '100';
            $qr_image = '<img src="' . $defaultQrImg . '" style="width:' . $qrSize . 'px; height:' . $qrSize . 'px;">';

            // Certificate number
            $certificateNumber = ($certificate_setting ? $certificate_setting->value : 'CERT') . '-' . date('Y') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

            // Sample data for preview
            $sampleData = [
                '{certificate_logo}' => $logoUrl ? '<img src="' . $logoUrl . '" style="max-width: 100px; max-height: 100px;">' : '',
                '{user_image}' => $user_image,
                '{certificate_no}' => $certificateNumber,
                '{logo_image}' => $logoUrl ? '<img src="' . $logoUrl . '" style="max-width: 100px; max-height: 100px;">' : '',
                '{issue_date}' => now()->format('d-m-Y'),
                '{qrCode}' => $qr_image,
                '{student_name}' => 'John Doe',
                '{staff_name}' => 'Jane Smith',
                '{course_name}' => 'Sample Course',
                '{designation}' => 'Sample Designation',
                '{certificate_date}' => now()->format('d-m-Y'),
                '{{student_name}}' => 'John Doe',
                '{{staff_name}}' => 'Jane Smith',
                '{{course_name}}' => 'Sample Course',
                '{{designation}}' => 'Sample Designation',
                '{{certificate_date}}' => now()->format('d-m-Y'),
            ];

            // Replace placeholders in design
            $final_html = str_replace(array_keys($sampleData), array_values($sampleData), $design);

            // Wrap in a container with background
            $containerStyle = 'position: relative; width: 100%; height: 100%;';
            if ($backgroundUrl) {
                $containerStyle .= ' background-image: url(' . $backgroundUrl . '); background-size: cover; background-position: center;';
            }

            $final_html = '<div style="' . $containerStyle . '">' . $final_html . '</div>';

            // Default placeholder images
            $defaultQrImg = asset('placeholders/qr-placeholder.svg');
            $defaultUserImg = asset('placeholders/user-placeholder.svg');

            // Create user image HTML
            $userImageStyle = 'width:' . ($certificate->user_image_size ?: '100') . 'px; height:' . ($certificate->user_image_size ?: '100') . 'px;';
            if ($certificate->user_photo_style == 1) {
                $userImageStyle .= ' border-radius: 50%;';
            }
            $user_image = '<img src="' . $defaultUserImg . '" style="' . $userImageStyle . ' object-fit: cover;">';

            // Create QR code HTML
            $qrSize = $certificate->qr_image_size ?: '100';
            $qr_image = '<img src="' . $defaultQrImg . '" style="width:' . $qrSize . 'px; height:' . $qrSize . 'px;">';

            // Certificate number
            $certificateNumber = ($certificate_setting ? $certificate_setting->value : 'CERT') . '-' . date('Y') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

            // Sample data for preview
            $sampleData = [
                '{certificate_logo}' => $logoUrl ? '<img src="' . $logoUrl . '" style="max-width: 100px; max-height: 100px;">' : '',
                '{user_image}' => $user_image,
                '{certificate_no}' => $certificateNumber,
                '{logo_image}' => $logoUrl ? '<img src="' . $logoUrl . '" style="max-width: 100px; max-height: 100px;">' : '',
                '{issue_date}' => now()->format('d-m-Y'),
                '{qrCode}' => $qr_image,
                '{student_name}' => 'John Doe',
                '{staff_name}' => 'Jane Smith',
                '{course_name}' => 'Sample Course',
                '{designation}' => 'Sample Designation',
                '{certificate_date}' => now()->format('d-m-Y'),
                '{{student_name}}' => 'John Doe',
                '{{staff_name}}' => 'Jane Smith',
                '{{course_name}}' => 'Sample Course',
                '{{designation}}' => 'Sample Designation',
                '{{certificate_date}}' => now()->format('d-m-Y'),
            ];

            // Replace placeholders in design
            $final_html = str_replace(array_keys($sampleData), array_values($sampleData), $design);

            // Wrap in a container with background and proper constraints
            $containerStyle = 'position: relative; width: ' . $certificate->width . '; height: ' . $certificate->height . '; overflow: hidden; margin: 0 auto;';
            if ($backgroundUrl) {
                $containerStyle .= ' background-image: url(' . $backgroundUrl . '); background-size: cover; background-position: center; background-repeat: no-repeat;';
            } else {
                $containerStyle .= ' background-color: #ffffff; border: 1px solid #e5e7eb;';
            }

            $final_html = '<div style="' . $containerStyle . '">' . $final_html . '</div>';

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
