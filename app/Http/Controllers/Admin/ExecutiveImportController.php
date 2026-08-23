<?php

namespace App\Http\Controllers\Admin;

use App\Exports\ExecutiveMembersTemplateExport;
use App\Http\Controllers\Controller;
use App\Imports\ExecutiveMembersImport;
use App\Services\ExecutiveImportService;
use App\DTOs\ValidationErrorDTO;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

/**
 * ExecutiveImportController
 *
 * Handles importing previous executive committee members from Excel.
 * The sheet is expected to have columns:
 *   name | designation | department | session | contact_number | email_address
 *   (plus optional: member_order, tenure_start, tenure_end)
 *
 * Each row is matched to an existing user by email address and a
 * previous_committee_members record is created.
 */
class ExecutiveImportController extends Controller
{
    /**
     * Show the executive member import wizard page.
     */
    public function showImport()
    {
        return Inertia::render('Admin/Executive/Import');
    }

    /**
     * Handle the Excel file upload and import.
     */
    public function import(Request $request)
    {
        $request->validate([
            'file'             => 'required|file|max:10240',
            'committee_number' => 'required|string|max:50',
            'tenure_start'     => 'nullable|date',
            'tenure_end'       => 'nullable|date|after_or_equal:tenure_start',
        ]);

        $file = $request->file('file');
        $allowedExtensions = ['xlsx', 'xls', 'csv'];
        $ext = strtolower($file->getClientOriginalExtension());

        if (!in_array($ext, $allowedExtensions)) {
            return back()->withErrors([
                'file' => 'Please upload a valid Excel (.xlsx, .xls) or CSV file.',
            ]);
        }

        try {
            $importer = new ExecutiveMembersImport(
                committeeNumber: $request->committee_number,
                tenureStart: $request->tenure_start,
                tenureEnd: $request->tenure_end,
            );

            Excel::import($importer, $file);

            $stats = $importer->getImportStats();

            Log::info('Executive import complete', $stats);

            if ($stats['imported'] === 0) {
                $detail = !empty($stats['errors'])
                    ? ' Details: ' . implode(' | ', array_slice($stats['errors'], 0, 3))
                    : '';
                return back()->withErrors([
                    'file' => 'No members were imported. All rows were skipped.' . $detail,
                ]);
            }

            $message = "Import complete! Imported {$stats['imported']} member(s).";
            if ($stats['skipped'] > 0) {
                $message .= " Skipped {$stats['skipped']} row(s).";
            }

            return back()->with('success', $message)->with('import_stats', $stats);

        } catch (\Exception $e) {
            Log::error('Executive import failed: ' . $e->getMessage());
            return back()->withErrors([
                'file' => 'Import failed: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Download the blank Excel template.
     */
    public function template()
    {
        return Excel::download(
            new ExecutiveMembersTemplateExport(),
            'executive_members_template.xlsx'
        );
    }

    public function preview(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'excel_file' => 'required|file|max:10240',
                'committee_number' => 'required|string',
            ]);

            $file = $request->file('excel_file');
            
            $allowedExtensions = ['xlsx', 'xls'];
            $fileExtension = strtolower($file->getClientOriginalExtension());
            
            if (!in_array($fileExtension, $allowedExtensions)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please upload a valid Excel file (.xlsx or .xls).'
                ], 422);
            }

            $importService = new ExecutiveImportService();
            $previewData = $importService->parseExcelFile($file, $request->committee_number);

            $sessionId = Str::uuid()->toString();
            Session::put('import_preview_exec_' . $sessionId, [
                'data' => $previewData,
                'expires_at' => now()->addMinutes(30)
            ]);

            return response()->json([
                'success' => true,
                'session_id' => $sessionId,
                'data' => $previewData->toArray(),
                'message' => $previewData->getSummaryMessage()
            ]);

        } catch (\Exception $e) {
            Log::error('Executive Preview failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to process file: ' . $e->getMessage()
            ], 500);
        }
    }

    public function validateRow(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'row_id' => 'required',
                'data' => 'required|array',
                'committee_number' => 'required|string'
            ]);

            $importService = new ExecutiveImportService();
            $validation = $importService->validateSingleRow($request->data, $request->committee_number);

            return response()->json([
                'success' => true,
                'valid' => $validation['valid'],
                'member_id' => $validation['member_id'] ?? null,
                'errors' => array_map(function($error) {
                    return $error instanceof ValidationErrorDTO ? $error->toArray() : $error;
                }, $validation['errors'])
            ]);

        } catch (\Exception $e) {
            Log::error('Executive Row validation failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to validate row: ' . $e->getMessage()
            ], 500);
        }
    }

    public function importBatch(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'rows' => 'required|array',
                'chunk_size' => 'integer|min:1|max:500',
                'session_id' => 'nullable|string',
                'committee_number' => 'required|string',
                'tenure_start' => 'nullable|date',
                'tenure_end' => 'nullable|date'
            ]);

            $importService = new ExecutiveImportService();
            $chunkSize = $request->chunk_size ?? 100;
            
            $errors = $importService->validateRows($request->rows, $request->committee_number);
            
            $blockingErrors = array_filter($errors, function($error) {
                if ($error instanceof ValidationErrorDTO) {
                    return $error->severity === 'error';
                }
                return isset($error['severity']) && $error['severity'] === 'error';
            });
            
            if (!empty($blockingErrors)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation errors found. Please fix them before importing.',
                    'errors' => array_map(function($error) {
                        return $error instanceof ValidationErrorDTO ? $error->toArray() : $error;
                    }, $errors)
                ], 422);
            }

            $result = $importService->importBatch(
                $request->rows,
                $request->committee_number,
                $request->tenure_start,
                $request->tenure_end,
                $chunkSize,
                $request->session_id
            );

            if ($request->session_id) {
                Session::forget('import_preview_exec_' . $request->session_id);
            }

            return response()->json([
                'success' => true,
                'imported' => $result['imported'],
                'failed' => $result['failed'],
                'failed_rows' => $result['failed_rows'],
                'progress' => [
                    'total' => $result['total'],
                    'processed' => $result['imported'] + $result['failed'],
                    'percentage' => round((($result['imported'] + $result['failed']) / $result['total']) * 100, 2)
                ],
                'message' => "Successfully imported {$result['imported']} executive member(s)."
            ]);

        } catch (\Exception $e) {
            Log::error('Executive Batch import failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function clearImportSession(Request $request): JsonResponse
    {
        try {
            $sessionId = $request->session_id;
            if ($sessionId) {
                Session::forget('import_preview_exec_' . $sessionId);
            }
            
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['success' => false], 500);
        }
    }
}
