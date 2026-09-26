<?php

namespace App\Http\Controllers;

use App\Models\TicketingEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Handles public-facing ticketing event pages.
 *
 * Step 4: Stub — routes registered so preview() in TicketingEventController
 *         can call route('ticketing-event.show', 'preview') without errors.
 *
 * Full implementation: Step 10.
 */
class PublicTicketingEventController extends Controller
{
    /**
     * Display the public event page.
     * Checks for preview session before hitting the DB.
     */
    public function show(string $slug)
    {
        // ── Preview mode ──────────────────────────────────────────────────────
        if (request()->query('preview') && str_starts_with($slug, 'preview_')) {
            $sessionKey = 'ticketing_event_preview_' . $slug;
            
            if (session()->has($sessionKey)) {
                $preview = session()->get($sessionKey);
                session()->forget($sessionKey); // single-use

                return Inertia::render('TicketingEvent/Show', [
                    'event'      => $preview,
                    'htmlContent'=> $preview['event_html_content'] ?? '',
                    'formSchema' => $preview['form_schema'] ?? [],
                    'isClosed'   => false,
                    'isPreview'  => true,
                ]);
            } else {
                // Preview session expired or not found
                abort(404, 'Preview session expired or not found.');
            }
        }

        // ── Live event ────────────────────────────────────────────────────────
        $event = TicketingEvent::where('slug', $slug)->firstOrFail();

        return Inertia::render('TicketingEvent/Show', [
            'event'       => $event->only(['id', 'title', 'slug', 'fee', 'deadline', 'status']),
            'htmlContent' => $event->event_html_content,
            'formSchema'  => $event->form_schema ?? [],
            'isClosed'    => $event->isClosed(),
            'isPreview'   => false,
        ]);
    }

    /**
     * Store a registration submission for a public event.
     * Full validation & custom-field handling implemented in Step 10.
     */
    public function storeRegistration(Request $request, string $slug)
    {
        // Stub — full implementation in Step 10.
        abort(501, 'Registration submission not yet implemented.');
    }
}
