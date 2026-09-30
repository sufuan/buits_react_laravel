<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EventRegistration;
use App\Models\TicketingEvent;
use App\Mail\TicketVerifiedMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
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
            'ticketingEvents' => TicketingEvent::select('id', 'title')->orderBy('title')->get(),
            'stats'           => $stats,
            'filters'         => $request->only(['event_id', 'status', 'member_type']),
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

        Mail::to($registration->email)
            ->queue(new TicketVerifiedMail($registration->load('ticketingEvent')));

        return redirect()->back()->with('success', 'Payment verified! Ticket email dispatched.');
    }

    /**
     * Reject a pending registration.
     */
    public function reject(EventRegistration $registration)
    {
        $registration->status = 'rejected';
        $registration->save();

        return redirect()->back()->with('success', 'Registration rejected.');
    }
}
