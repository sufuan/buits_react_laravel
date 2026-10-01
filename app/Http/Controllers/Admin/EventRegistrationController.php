<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EventRegistration;
use App\Models\TicketingEvent;
use App\Mail\RegistrationRejectedMail;
use App\Mail\TicketVerifiedMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;


class EventRegistrationController extends Controller
{
    /**
     * Display a listing of event registrations.
     */
    public function index(Request $request)
    {
        $query = EventRegistration::with('ticketingEvent');

        if ($request->event_id) {
            $query->where('event_id', $request->event_id);
        }
        if ($request->status && in_array($request->status, ['pending', 'verified', 'rejected'])) {
            $query->where('status', $request->status);
        }
        if ($request->member_type) {
            if ($request->member_type === 'members') {
                $query->where('is_member', true);
            } elseif ($request->member_type === 'non-members') {
                $query->where('is_member', false);
            }
        }

        $registrations = $query->latest()->paginate(20)->withQueryString();

        $stats = [
            'total'    => EventRegistration::count(),
            'pending'  => EventRegistration::where('status', 'pending')->count(),
            'verified' => EventRegistration::where('status', 'verified')->count(),
            'rejected' => EventRegistration::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/EventRegistrations/Index', [
            'registrations'   => $registrations,
            'ticketingEvents' => TicketingEvent::select('id', 'title', 'form_schema')->orderBy('title')->get()->map(fn($e) => [
                'id'          => $e->id,
                'title'       => $e->title,
                'form_schema' => is_array($e->form_schema) ? $e->form_schema : [],
            ]),
            'stats'           => $stats,
            'filters'         => $request->only(['event_id', 'status', 'member_type']),
        ]);
    }

    /**
     * Export registrations for a specific event to Excel/CSV.
     * Only columns selected by the admin are included.
     */
    public function export(Request $request)
    {
        $eventId = $request->event_id;
        if (!$eventId) {
            abort(400, 'event_id is required for export.');
        }

        $event = TicketingEvent::findOrFail($eventId);

        // Columns the user selected (sent as JSON array in query string)
        $selectedColumns = json_decode($request->columns ?? '[]', true);
        if (empty($selectedColumns)) {
            abort(400, 'No columns selected.');
        }

        $registrations = EventRegistration::with('ticketingEvent')
            ->where('event_id', $eventId)
            ->when($request->status && in_array($request->status, ['pending', 'verified', 'rejected']),
                fn($q) => $q->where('status', $request->status))
            ->latest()
            ->get();

        // Define all possible base columns
        $baseColumns = [
            'name'           => 'Full Name',
            'email'          => 'Email',
            'phone'          => 'Phone',
            'is_member'      => 'Member',
            'member_id'      => 'Member ID',
            'fee_charged'    => 'Fee Charged',
            'payment_method' => 'Payment Method',
            'transaction_id' => 'Transaction ID',
            'sender_number'  => 'Sender Number',
            'status'         => 'Status',
            'ticket_no'      => 'Ticket No',
            'created_at'     => 'Registered At',
        ];

        // Build custom field labels from the event's form schema
        $formSchema = is_array($event->form_schema) ? $event->form_schema : [];
        $customFieldLabels = collect($formSchema)->pluck('label')->filter()->values()->toArray();

        // Build header row — only selected columns
        $headers = [];
        foreach ($selectedColumns as $col) {
            if (isset($baseColumns[$col])) {
                $headers[$col] = $baseColumns[$col];
            } elseif (in_array($col, $customFieldLabels)) {
                $headers['custom:' . $col] = $col;
            }
        }

        // Build rows
        $rows = $registrations->map(function ($reg) use ($headers) {
            $row = [];
            foreach ($headers as $key => $label) {
                if (str_starts_with($key, 'custom:')) {
                    $fieldLabel = substr($key, 7);
                    $val = $reg->custom_field_responses[$fieldLabel] ?? '';
                    $row[] = is_array($val) ? implode(', ', $val) : (string) $val;
                } else {
                    switch ($key) {
                        case 'is_member':
                            $row[] = $reg->is_member ? 'Member' : 'Non-Member';
                            break;
                        case 'fee_charged':
                            $row[] = $reg->fee_charged ? number_format((float)$reg->fee_charged, 2) : 'Free';
                            break;
                        case 'created_at':
                            $row[] = $reg->created_at?->format('Y-m-d H:i:s') ?? '';
                            break;
                        default:
                            $row[] = (string) ($reg->{$key} ?? '');
                    }
                }
            }
            return $row;
        });

        // Prepend header row
        $data = collect([array_values($headers)])->merge($rows);

        $filename = 'registrations_' . str_replace(' ', '_', $event->title) . '_' . now()->format('Ymd_His') . '.xlsx';

        return Excel::download(new class($data) implements \Maatwebsite\Excel\Concerns\FromCollection, \Maatwebsite\Excel\Concerns\WithStyles, \Maatwebsite\Excel\Concerns\ShouldAutoSize {
            public function __construct(private $data) {}
            public function collection() { return $this->data; }
            public function styles(\PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet) {
                return [1 => ['font' => ['bold' => true, 'size' => 11], 'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => 'EFF6FF']]]];
            }
        }, $filename);
    }

    /**
     * Look up a registration by the ticket number encoded in the email barcode.
     */
    public function scan(Request $request)
    {
        $validated = $request->validate([
            'ticket_no' => 'required|string|max:100',
        ]);

        $registration = EventRegistration::with('ticketingEvent')
            ->where('ticket_no', $validated['ticket_no'])
            ->first();

        if (!$registration) {
            return response()->json(['message' => 'No registration was found for this ticket.'], 404);
        }

        return response()->json([
            'registration' => [
                'id'              => $registration->id,
                'ticket_no'       => $registration->ticket_no,
                'name'            => $registration->name,
                'email'           => $registration->email,
                'phone'           => $registration->phone,
                'event_title'     => $registration->ticketingEvent?->title,
                'status'          => $registration->status,
                'member_id'       => $registration->member_id,
                'is_member'       => $registration->is_member,
                'payment_method'  => $registration->payment_method,
                'transaction_id'  => $registration->transaction_id,
                'fee_charged'     => $registration->fee_charged,
                'registered_at'   => $registration->created_at?->toIso8601String(),
            ],
        ]);
    }

    /**
     * Verify a pending registration.
     */
    public function verify(EventRegistration $registration)
    {
        if ($registration->status !== 'pending') {
            return redirect()->back()->withErrors(['error' => 'Only pending registrations can be verified.']);
        }

        $registration->status   = 'verified';
        $registration->ticket_no = 'BUITS-TICK-' . str_pad($registration->id, 4, '0', STR_PAD_LEFT);
        $registration->save();

        try {
            Mail::to($registration->email)
                ->send(new TicketVerifiedMail($registration->load('ticketingEvent')));
        } catch (\Throwable $exception) {
            Log::error('Event registration approval email failed.', [
                'registration_id' => $registration->id,
                'recipient' => $registration->email,
                'error' => $exception->getMessage(),
            ]);

            return redirect()->back()->with('error', 'Registration approved, but the ticket email could not be sent. Check the mail configuration and logs.');
        }

        return redirect()->back()->with('success', 'Registration approved and ticket email sent.');
    }

    /**
     * Reject a pending registration.
     */
    public function reject(EventRegistration $registration)
    {
        $registration->status = 'rejected';
        $registration->save();

        try {
            Mail::to($registration->email)
                ->send(new RegistrationRejectedMail($registration->load('ticketingEvent')));
        } catch (\Throwable $exception) {
            Log::error('Event registration rejection email failed.', [
                'registration_id' => $registration->id,
                'recipient' => $registration->email,
                'error' => $exception->getMessage(),
            ]);

            return redirect()->back()->with('error', 'Registration rejected, but the rejection email could not be sent. Check the mail configuration and logs.');
        }

        return redirect()->back()->with('success', 'Registration rejected and email sent.');
    }
}
