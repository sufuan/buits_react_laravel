<?php

namespace App\Http\Controllers;

use App\Models\TicketingEvent;
use Inertia\Inertia;

class PublicProgramsController extends Controller
{
    public function index()
    {
        return Inertia::render('Programs/Index', [
            'events' => $this->runningEvents(),
        ]);
    }

    public static function runningEvents()
    {
        return TicketingEvent::query()
            ->where('status', 'active')
            ->where(fn ($query) => $query->whereNull('deadline')->orWhere('deadline', 'gte', now()))
            ->where('show_in_popup', true)
            ->whereNotNull('slug')
            ->latest()
            ->get()
            ->map(fn (TicketingEvent $event) => [
                'id' => $event->id,
                'title' => $event->title,
                'slug' => $event->slug,
                'deadline' => $event->deadline?->toIso8601String(),
                'popupImage' => $event->popup_image ? asset('storage/' . $event->popup_image) : null,
                'showInPopup' => (bool) $event->show_in_popup,
                'requiresPayment' => (bool) $event->requires_payment,
                'memberFee' => $event->member_fee,
                'nonMemberFee' => $event->non_member_fee,
                'content' => strip_tags((string) $event->event_html_content),
            ])
            ->values();
    }
}
