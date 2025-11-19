<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventAttendee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    /**
     * Display calendar view with all events
     */
    public function index()
    {
        $events = Event::with('creator')
            ->get()
            ->map(fn($event) => $event->toFullCalendarEvent());

        $upcomingEventsCount = Event::upcoming()->count();
        $ongoingEventsCount = Event::ongoing()->count();
        $totalEventsCount = Event::count();
        $completedEventsCount = Event::completed()->count();

        return Inertia::render('Admin/Events/Index', [
            'events' => $events,
            'upcomingEventsCount' => $upcomingEventsCount,
            'ongoingEventsCount' => $ongoingEventsCount,
            'totalEventsCount' => $totalEventsCount,
            'completedEventsCount' => $completedEventsCount,
        ]);
    }

    /**
     * Get events as JSON for FullCalendar
     */
    public function getEvents(Request $request)
    {
        $events = Event::query()
            ->when($request->start, fn($q) => $q->where('start_date', '>=', $request->start))
            ->when($request->end, fn($q) => $q->where('end_date', '<=', $request->end))
            ->get()
            ->map(fn($event) => $event->toFullCalendarEvent());

        return response()->json($events);
    }

    /**
     * Store a new event
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date|after_or_equal:now',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'all_day' => 'boolean',
            'location' => 'nullable|string|max:255',
            'type' => 'required|in:workshop,seminar,competition,training,meeting,other',
            'status' => 'required|in:upcoming,ongoing,completed,cancelled',
            'color' => 'nullable|string|max:7',
            'max_attendees' => 'nullable|integer|min:1',
            'registration_link' => 'nullable|url',
            'registration_deadline' => 'nullable|date|before_or_equal:start_date',
            'requires_registration' => 'boolean',
            'banner_image' => 'nullable|image|max:2048',
        ], [
            'title.required' => 'Event title is required.',
            'title.max' => 'Event title cannot exceed 255 characters.',
            'start_date.required' => 'Start date and time is required.',
            'start_date.date' => 'Start date must be a valid date.',
            'start_date.after_or_equal' => 'Start date cannot be in the past.',
            'end_date.date' => 'End date must be a valid date.',
            'end_date.after_or_equal' => 'End date must be after or equal to start date.',
            'type.required' => 'Event type is required.',
            'type.in' => 'Invalid event type selected.',
            'status.required' => 'Event status is required.',
            'status.in' => 'Invalid event status selected.',
            'max_attendees.integer' => 'Max attendees must be a number.',
            'max_attendees.min' => 'Max attendees must be at least 1.',
            'registration_link.url' => 'Registration link must be a valid URL.',
            'registration_deadline.date' => 'Registration deadline must be a valid date.',
            'registration_deadline.before_or_equal' => 'Registration deadline must be before or equal to event start date.',
            'banner_image.image' => 'Banner must be an image file.',
            'banner_image.max' => 'Banner image size cannot exceed 2MB.',
        ]);

        // Additional validation for registration
        if ($request->requires_registration && empty($request->registration_link)) {
            return redirect()->back()
                ->withErrors(['registration_link' => 'Registration link is required when registration is enabled.'])
                ->withInput();
        }

        if ($request->hasFile('banner_image')) {
            $validated['banner_image'] = $request->file('banner_image')
                ->store('events/banners', 'public');
        }

        $validated['created_by'] = Auth::guard('admin')->id();

        $event = Event::create($validated);

        return redirect()->back()->with('success', 'Event created successfully!');
    }

    /**
     * Show single event details
     */
    public function show(Event $event)
    {
        $event->load(['creator', 'attendees.user']);

        return response()->json([
            'event' => $event,
            'fullCalendarEvent' => $event->toFullCalendarEvent(),
        ]);
    }

    /**
     * Update an existing event
     */
    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'all_day' => 'boolean',
            'location' => 'nullable|string|max:255',
            'type' => 'required|in:workshop,seminar,competition,training,meeting,other',
            'status' => 'required|in:upcoming,ongoing,completed,cancelled',
            'color' => 'nullable|string|max:7',
            'max_attendees' => 'nullable|integer|min:1',
            'registration_link' => 'nullable|url',
            'registration_deadline' => 'nullable|date|before_or_equal:start_date',
            'requires_registration' => 'boolean',
            'banner_image' => 'nullable|image|max:2048',
        ], [
            'title.required' => 'Event title is required.',
            'title.max' => 'Event title cannot exceed 255 characters.',
            'start_date.required' => 'Start date and time is required.',
            'start_date.date' => 'Start date must be a valid date.',
            'end_date.date' => 'End date must be a valid date.',
            'end_date.after_or_equal' => 'End date must be after or equal to start date.',
            'type.required' => 'Event type is required.',
            'type.in' => 'Invalid event type selected.',
            'status.required' => 'Event status is required.',
            'status.in' => 'Invalid event status selected.',
            'max_attendees.integer' => 'Max attendees must be a number.',
            'max_attendees.min' => 'Max attendees must be at least 1.',
            'registration_link.url' => 'Registration link must be a valid URL.',
            'registration_deadline.date' => 'Registration deadline must be a valid date.',
            'registration_deadline.before_or_equal' => 'Registration deadline must be before or equal to event start date.',
            'banner_image.image' => 'Banner must be an image file.',
            'banner_image.max' => 'Banner image size cannot exceed 2MB.',
        ]);

        // Additional validation for registration
        if ($request->requires_registration && empty($request->registration_link)) {
            return redirect()->back()
                ->withErrors(['registration_link' => 'Registration link is required when registration is enabled.'])
                ->withInput();
        }

        if ($request->hasFile('banner_image')) {
            // Delete old image
            if ($event->banner_image) {
                Storage::disk('public')->delete($event->banner_image);
            }
            $validated['banner_image'] = $request->file('banner_image')
                ->store('events/banners', 'public');
        }

        $event->update($validated);

        return redirect()->back()->with('success', 'Event updated successfully!');
    }

    /**
     * Delete an event
     */
    public function destroy(Event $event)
    {
        if ($event->banner_image) {
            Storage::disk('public')->delete($event->banner_image);
        }

        $event->delete();

        return redirect()->back()->with('success', 'Event deleted successfully!');
    }

    /**
     * Update event dates via drag & drop
     */
    public function updateDates(Request $request, Event $event)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $event->update($validated);

        return response()->json(['message' => 'Event dates updated successfully!']);
    }

    /**
     * Get event statistics
     */
    public function statistics()
    {
        $stats = [
            'total' => Event::count(),
            'upcoming' => Event::upcoming()->count(),
            'ongoing' => Event::ongoing()->count(),
            'completed' => Event::completed()->count(),
            'by_type' => Event::selectRaw('type, COUNT(*) as count')
                ->groupBy('type')
                ->get()
                ->pluck('count', 'type'),
        ];

        return response()->json($stats);
    }
}

