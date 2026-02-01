<?php

namespace App\Http\Controllers;

use App\Models\CertificateRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CertificateVerificationController extends Controller
{
    /**
     * Verify a certificate by certificate number
     */
    public function verify($certificateNumber)
    {
        // Find the certificate record
        $certificate = CertificateRecord::with(['user', 'template'])
            ->where('certificate_number', $certificateNumber)
            ->first();

        if (!$certificate) {
            return Inertia::render('Certificate/Verify', [
                'certificate' => null,
                'error' => 'Certificate not found or invalid certificate number.',
            ]);
        }

        return Inertia::render('Certificate/Verify', [
            'certificate' => [
                'number' => $certificate->certificate_number,
                'issued_date' => $certificate->created_at->format('F d, Y'),
                'template_name' => $certificate->template->name ?? 'N/A',
                'certificate_path' => $certificate->certificate_path ? asset('storage/' . $certificate->certificate_path) : null,
                'user' => [
                    'id' => $certificate->user->id,
                    'name' => $certificate->user->name,
                    'email' => $certificate->user->email,
                    'member_id' => $certificate->user->member_id,
                    'image' => $certificate->user->image ? asset('storage/' . $certificate->user->image) : null,
                    'profile_url' => route('public.profile', ['member_id' => $certificate->user->member_id ?? $certificate->user->id]),
                ],
            ],
            'error' => null,
        ]);
    }
}
