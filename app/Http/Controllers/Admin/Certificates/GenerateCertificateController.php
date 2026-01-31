<?php

namespace App\Http\Controllers\Admin\Certificates;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\CertificateTemplate;
use App\Models\CertificateRecord;
use App\Models\CertificateType;
// use SimpleSoftwareIO\QrCode\Facades\QrCode;

class GenerateCertificateController extends Controller
{
    /**
     * Display the certificate generation page
     */
    public function index()
    {
        $templates = CertificateTemplate::with(['type', 'design'])
            ->where('status', 1)
            ->get();

        $certificateTypes = CertificateType::all();

        // Get departments for filtering
        $departments = User::select('department')
            ->whereNotNull('department')
            ->where('department', '!=', '')
            ->distinct()
            ->pluck('department');

        // Get sessions for filtering
        $sessions = User::select('session')
            ->whereNotNull('session')
            ->where('session', '!=', '')
            ->distinct()
            ->orderBy('session', 'desc')
            ->pluck('session');

        return Inertia::render('Admin/Certificates/Generate/Index', [
            'templates' => $templates,
            'certificateTypes' => $certificateTypes,
            'departments' => $departments,
            'sessions' => $sessions,
        ]);
    }

    /**
     * Get users list based on filters
     */
    public function getUsersList(Request $request)
    {
        $query = User::where('is_approved', true);

        // Apply filters
        if ($request->filled('department')) {
            $query->where('department', $request->department);
        }

        if ($request->filled('session')) {
            $query->where('session', $request->session);
        }

        if ($request->filled('usertype')) {
            $query->where('usertype', $request->usertype);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('member_id', 'like', '%' . $request->search . '%');
            });
        }

        $users = $query->select('id', 'name', 'email', 'member_id', 'department', 'session', 'usertype', 'image')
            ->paginate(20);

        // Get existing certificates for these users
        $userIds = $users->pluck('id')->toArray();
        $templateId = $request->template_id;

        $existingCertificates = [];
        if ($templateId) {
            $existingCertificates = CertificateRecord::where('template_id', $templateId)
                ->whereIn('user_id', $userIds)
                ->pluck('user_id')
                ->toArray();
        }

        return response()->json([
            'users' => $users,
            'existing_certificates' => $existingCertificates,
        ]);
    }

    /**
     * Generate QR Code for certificate
     */
    private function generateQRCode($template, $user, $certificateNumber)
    {
        try {
            $qrText = "Certificate Verification\n";
            $qrCodes = json_decode($template->qr_code, true) ?? [];

            foreach ($qrCodes as $qrCode) {
                switch ($qrCode) {
                    case 'member_id':
                        if ($user->member_id) {
                            $qrText .= "Member ID: " . $user->member_id . "\n";
                        }
                        break;
                    case 'email':
                        $qrText .= "Email: " . $user->email . "\n";
                        break;
                    case 'phone':
                        if ($user->phone) {
                            $qrText .= "Phone: " . $user->phone . "\n";
                        }
                        break;
                    case 'department':
                        if ($user->department) {
                            $qrText .= "Department: " . $user->department . "\n";
                        }
                        break;
                    case 'session':
                        if ($user->session) {
                            $qrText .= "Session: " . $user->session . "\n";
                        }
                        break;
                    case 'date_of_birth':
                        if ($user->date_of_birth) {
                            $qrText .= "Date of Birth: " . $user->date_of_birth->format('d-m-Y') . "\n";
                        }
                        break;
                    case 'class_roll':
                        if ($user->class_roll) {
                            $qrText .= "Roll No: " . $user->class_roll . "\n";
                        }
                        break;
                    case 'certificate_number':
                        $qrText .= "Certificate No: " . $certificateNumber . "\n";
                        break;
                    case 'link':
                        // Assuming public profile route is 'public.profile' and uses member_id
                        $url = route('public.profile', ['member_id' => $user->member_id ?? $user->id]);
                        $qrText .= "Profile: " . $url . "\n";
                        break;
                    default:
                        break;
                }
            }

            // Generate a simple QR code using a free online service
            $size = $template->qr_image_size ?? 100;
            $encodedText = urlencode(trim($qrText));

            // Using QR Server API (free service)
            $qrImageUrl = "https://api.qrserver.com/v1/create-qr-code/?size={$size}x{$size}&data={$encodedText}";

            return '<img src="' . $qrImageUrl . '" style="width:' . $size . 'px; height:' . $size . 'px; object-fit: contain;" alt="QR Code" />';

        } catch (\Exception) {
            // Fallback to placeholder if QR generation fails
            $size = $template->qr_image_size ?? 100;
            return '<div style="width:' . $size . 'px; height:' . $size . 'px; background-color:#f0f0f0; border:2px dashed #ccc; display:flex; align-items:center; justify-content:center; font-size:12px; color:#666; text-align:center;">QR Code<br/>Error</div>';
        }
    }

    /**
     * Generate unique certificate number
     */
    private function generateCertificateNumber($templateId, $userId)
    {
        $prefix = 'CERT';
        $timestamp = now()->format('Ymd');
        $uniqueId = str_pad($userId, 4, '0', STR_PAD_LEFT);
        $templateCode = str_pad($templateId, 2, '0', STR_PAD_LEFT);

        return $prefix . $timestamp . $templateCode . $uniqueId;
    }

    /**
     * Replace placeholders in certificate content
     */
    /**
     * Replace placeholders in certificate content
     */
    private function replacePlaceholders($content, $user, $certificateNumber, $template)
    {
        // Get designation (either from relation or fallback to usertype)
        $designation = $user->designation ? $user->designation->name : ucfirst($user->usertype ?? 'Member');
        
        // Define all available data mappings
        $data = [
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone ?? '',
            'member_id' => $user->member_id ?? '',
            'department' => $user->department ?? '',
            'session' => $user->session ?? '',
            'usertype' => ucfirst($user->usertype ?? ''),
            'designation' => $designation,
            'committee_status' => $user->committee_status ? 'Active Committee Member' : 'General Member',
            'gender' => ucfirst($user->gender ?? ''),
            'date_of_birth' => $user->date_of_birth?->format('d-m-Y') ?? '',
            'blood_group' => $user->blood_group ?? '',
            'father_name' => $user->father_name ?? '',
            'mother_name' => $user->mother_name ?? '',
            'current_address' => $user->current_address ?? '',
            'permanent_address' => $user->permanent_address ?? '',
            'class_roll' => $user->class_roll ?? '',
            'certificate_number' => $certificateNumber,
            'certificate_name' => $template->name,
            'issue_date' => now()->format('d-m-Y'),
            'signature_name' => $template->signature_name ?? '',
            'skills' => $user->skills ?? '',
            // Legacy/Duplicate mappings if needed
            'student_name' => $user->name,
            'staff_name' => $user->name,
        ];

        // Replace Double Curly Braces {{ key }} (with optional spaces)
        $content = preg_replace_callback('/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/', function($matches) use ($data) {
            $key = $matches[1];
            return isset($data[$key]) ? $data[$key] : $matches[0];
        }, $content);

        // Replace Single Curly Braces { key } (with optional spaces)
        // We run this second to avoid replacing inner parts of double braces constructs if they partially match,
        // although the regex engines usually differentiate.
        // Actually, {{key}} matches {key} pattern? 
        // \{ matches {. If we have {{key}}, the first { matches. 
        // regex: /\{\s*([a-zA-Z0-9_]+)\s*\}/ matches {key}.
        // If we have {{key}}, it might match the inner {key}.
        // To prevent this, we can ensure it's NOT double braces: (?<!\{)\{\s*([a-zA-Z0-9_]+)\s*\}(?!\})
        $content = preg_replace_callback('/(?<!\{)\{\s*([a-zA-Z0-9_]+)\s*\}(?!\})/', function($matches) use ($data) {
            $key = $matches[1];
            return isset($data[$key]) ? $data[$key] : $matches[0];
        }, $content);

        // Clean up any remaining unmatched placeholders
        $content = $this->cleanupUnmatchedPlaceholders($content);

        return $content;
    }

    /**
     * Clean up any remaining unmatched placeholders
     */
    private function cleanupUnmatchedPlaceholders($content)
    {
        // Remove any remaining single or double brace placeholders that weren't matched
        $content = preg_replace('/\{\{[^}]+\}\}/', '', $content);
        $content = preg_replace('/\{[^}]+\}/', '', $content);

        // Clean up extra spaces that might be left
        $content = preg_replace('/\s+/', ' ', $content);
        $content = trim($content);

        return $content;
    }

    /**
     * Generate complete certificate HTML
     */
    private function generateCertificateHtml($template, $user, $certificateNumber)
    {
        // Get the design content (positioned elements)
        $designContent = $template->design->design_content ?? null;

        if ($designContent) {
            // If we have design content (from the drag-and-drop designer)
            return $this->generateFromDesignContent($template, $user, $certificateNumber, $designContent);
        } else {
            // If no design content, generate from template properties
            return $this->generateFromTemplateProperties($template, $user, $certificateNumber);
        }
    }

    /**
     * Generate certificate from design content (drag-and-drop elements)
     */
    private function generateFromDesignContent($template, $user, $certificateNumber, $designContent)
    {
        try {
            // Parse the design content (should be JSON array of elements)
            $elements = json_decode($designContent, true);

            if (!is_array($elements)) {
                // Fallback to template properties if design content is invalid
                return $this->generateFromTemplateProperties($template, $user, $certificateNumber);
            }

            // Create the main container
            $width = floatval(str_replace('mm', '', $template->width ?? '297'));
            $height = floatval(str_replace('mm', '', $template->height ?? '210'));

            $html = '<div style="position: relative; width: ' . $width . 'mm; height: ' . $height . 'mm; margin: 0; padding: 0; overflow: hidden;">';

            // Add background image if exists
            if ($template->background_image) {
                $backgroundUrl = asset('storage/' . $template->background_image);
                $html .= '<img src="' . $backgroundUrl . '" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;" />';
            }

            // Process each element
            foreach ($elements as $element) {
                $html .= $this->generateElementHtml($element, $template, $user, $certificateNumber);
            }

            $html .= '</div>';
            return $html;

        } catch (\Exception) {
            // Fallback to template properties if anything goes wrong
            return $this->generateFromTemplateProperties($template, $user, $certificateNumber);
        }
    }

    /**
     * Generate HTML for individual design element
     */
    private function generateElementHtml($element, $template, $user, $certificateNumber)
    {
        $style = sprintf(
            'position: absolute; left: %spx; top: %spx; width: %spx; height: %spx; z-index: 1;',
            $element['x'] ?? 0,
            $element['y'] ?? 0,
            $element['width'] ?? 100,
            $element['height'] ?? 100
        );

        switch ($element['type'] ?? '') {
            case 'content':
            case 'text':
                $content = $this->replacePlaceholders($template->content ?? $element['text'] ?? '', $user, $certificateNumber, $template);
                return sprintf(
                    '<div style="%s font-size: %spx; font-family: %s; color: %s; text-align: %s; display: flex; flex-direction: column; justify-content: center; align-items: stretch;">%s</div>',
                    $style,
                    $element['fontSize'] ?? 16,
                    $element['fontFamily'] ?? 'Arial',
                    $element['color'] ?? '#000000',
                    $element['textAlign'] ?? 'center',
                    $content
                );

            case 'image':
                if ($element['id'] === 'logo' && $template->logo_image) {
                    $src = asset('storage/' . $template->logo_image);
                } elseif ($element['id'] === 'signature' && $template->signature_image) {
                    $src = asset('storage/' . $template->signature_image);
                } else {
                    $src = $element['src'] ?? '';
                }
                return sprintf('<img src="%s" style="%s object-fit: contain;" alt="%s" />', $src, $style, $element['alt'] ?? '');

            case 'photo':
                if ($user->image) {
                    $userImage = asset('storage/' . $user->image);
                } else {
                    // Create a placeholder div if no user image
                    $borderRadius = ($template->user_photo_style == 1) ? '50%' : '0';
                    return sprintf('<div style="%s background-color: #f0f0f0; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #666; border-radius: %s;">User Photo</div>', $style, $borderRadius);
                }
                $borderRadius = ($template->user_photo_style == 1) ? '50%' : '0';
                return sprintf('<img src="%s" style="%s object-fit: cover; border-radius: %s;" alt="User Photo" />', $userImage, $style, $borderRadius);

            case 'qr':
                $qrCode = $this->generateQRCode($template, $user, $certificateNumber);
                return sprintf('<div style="%s display: flex; align-items: center; justify-content: center;">%s</div>', $style, $qrCode);

            default:
                return '';
        }
    }

    /**
     * Generate certificate from template properties (fallback method)
     */
    private function generateFromTemplateProperties($template, $user, $certificateNumber)
    {
        $width = floatval(str_replace('mm', '', $template->width ?? '297'));
        $height = floatval(str_replace('mm', '', $template->height ?? '210'));

        $html = '<div style="position: relative; width: ' . $width . 'mm; height: ' . $height . 'mm; margin: 0; padding: 0; overflow: hidden; background: white;">';

        // Add background image
        if ($template->background_image) {
            $backgroundUrl = asset('storage/' . $template->background_image);
            $html .= '<img src="' . $backgroundUrl . '" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;" />';
        }

        // Add logo image (top-left)
        if ($template->logo_image) {
            $logoUrl = asset('storage/' . $template->logo_image);
            $html .= '<img src="' . $logoUrl . '" style="position: absolute; top: 30px; left: 30px; width: 80px; height: 80px; object-fit: contain; z-index: 1;" />';
        }

        // Add user photo (if enabled)
        if ($template->user_photo_style > 0) {
            $size = $template->user_image_size ?? 100;
            $borderRadius = ($template->user_photo_style == 1) ? '50%' : '0';

            if ($user->image) {
                $userImage = asset('storage/' . $user->image);
                $html .= '<img src="' . $userImage . '" style="position: absolute; top: 50px; right: 100px; width: ' . $size . 'px; height: ' . $size . 'px; object-fit: cover; border-radius: ' . $borderRadius . '; z-index: 1;" />';
            } else {
                $html .= '<div style="position: absolute; top: 50px; right: 100px; width: ' . $size . 'px; height: ' . $size . 'px; background-color: #f0f0f0; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #666; border-radius: ' . $borderRadius . '; z-index: 1;">User Photo</div>';
            }
        }

        // Add main content (center)
        $content = $this->replacePlaceholders($template->content ?? 'Certificate of Achievement', $user, $certificateNumber, $template);
        $html .= '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; text-align: center; font-size: 18px; font-family: Arial, sans-serif; color: #000; z-index: 1;">' . $content . '</div>';

        // Add signature (bottom-right)
        if ($template->signature_image) {
            $signatureUrl = asset('storage/' . $template->signature_image);
            $html .= '<img src="' . $signatureUrl . '" style="position: absolute; bottom: 80px; right: 100px; width: 100px; height: 80px; object-fit: contain; z-index: 1;" />';

            if ($template->signature_name) {
                $html .= '<div style="position: absolute; bottom: 50px; right: 100px; width: 100px; text-align: center; font-size: 12px; font-family: Arial, sans-serif; color: #000; z-index: 1;">' . $template->signature_name . '</div>';
            }
        }

        // Add QR code (bottom-left)
        if ($template->qr_code) {
            $qrCode = $this->generateQRCode($template, $user, $certificateNumber);
            $qrSize = $template->qr_image_size ?? 100;
            $html .= '<div style="position: absolute; bottom: 30px; left: 30px; width: ' . $qrSize . 'px; height: ' . $qrSize . 'px; z-index: 1;">' . $qrCode . '</div>';
        }

        // Add certificate number (bottom-center)
        $html .= '<div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); font-size: 10px; font-family: Arial, sans-serif; color: #666; z-index: 1;">Certificate No: ' . $certificateNumber . '</div>';

        $html .= '</div>';
        return $html;
    }

    /**
     * Generate certificates for selected users
     */
    public function generateCertificates(Request $request)
    {
        $request->validate([
            'template_id' => 'required|exists:certificate_templates,id',
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        try {
            $template = CertificateTemplate::with(['design', 'type'])->findOrFail($request->template_id);
            $users = User::whereIn('id', $request->user_ids)->get();

            $certificates = [];

            foreach ($users as $user) {
                // Check if certificate already exists
                $existingCertificate = CertificateRecord::where('template_id', $template->id)
                    ->where('user_id', $user->id)
                    ->first();

                if ($existingCertificate) {
                    continue; // Skip if certificate already exists
                }

                $certificateNumber = $this->generateCertificateNumber($template->id, $user->id);

                // Generate certificate HTML content
                $certificateHtml = $this->generateCertificateHtml($template, $user, $certificateNumber);

                $certificates[] = [
                    'user' => $user,
                    'certificate_number' => $certificateNumber,
                    'content' => $certificateHtml,
                ];
            }

            return Inertia::render('Admin/Certificates/Generate/Preview', [
                'template' => $template,
                'certificates' => $certificates,
            ]);

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to generate certificates: ' . $e->getMessage()]);
        }
    }

    /**
     * Save generated certificates
     */
    public function saveCertificates(Request $request)
    {
        $request->validate([
            'certificates' => 'required|array',
            'certificates.*.user_id' => 'required|exists:users,id',
            'certificates.*.template_id' => 'required|exists:certificate_templates,id',
            'certificates.*.certificate_number' => 'required|string',
            'certificates.*.image_data' => 'required|string',
        ]);

        try {
            foreach ($request->certificates as $certificateData) {
                // Check if certificate already exists
                $existingCertificate = CertificateRecord::where('certificate_number', $certificateData['certificate_number'])->first();

                if (!$existingCertificate) {
                    // Save certificate image
                    $imageData = $certificateData['image_data'];
                    $imageData = str_replace('data:image/png;base64,', '', $imageData);
                    $imageData = str_replace(' ', '+', $imageData);
                    $decodedImage = base64_decode($imageData);

                    $fileName = $certificateData['certificate_number'] . '.png';
                    $path = 'certificates/' . $fileName;

                    Storage::disk('public')->put($path, $decodedImage);

                    // Create certificate record
                    CertificateRecord::create([
                        'certificate_number' => $certificateData['certificate_number'],
                        'certificate_path' => $path,
                        'user_id' => $certificateData['user_id'],
                        'template_id' => $certificateData['template_id'],
                    ]);
                }
            }

            return response()->json(['success' => true, 'message' => 'Certificates saved successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to save certificates: ' . $e->getMessage()], 500);
        }
    }
}
