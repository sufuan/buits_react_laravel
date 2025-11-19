<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display public events calendar (read-only)
     */
    public function index()
    {
        // Only show upcoming and ongoing events to public
        $events = Event::whereIn('status', ['upcoming', 'ongoing'])
            ->with('creator')
            ->get()
            ->map(fn($event) => $event->toFullCalendarEvent());

        $upcomingEventsCount = Event::upcoming()->count();
        $ongoingEventsCount = Event::ongoing()->count();

        return Inertia::render('Events', [
            'events' => $events,
            'upcomingEventsCount' => $upcomingEventsCount,
            'ongoingEventsCount' => $ongoingEventsCount,
        ]);
    }

    /**
     * Show single event details
     */
    public function show(Event $event)
    {
        $event->load('creator');
        
        return Inertia::render('EventDetails', [
            'event' => $event,
        ]);
    }
}

