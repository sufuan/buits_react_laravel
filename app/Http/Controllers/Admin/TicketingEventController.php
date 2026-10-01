<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TicketingEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TicketingEventController extends Controller
{
    // ─── Shared validation rules ──────────────────────────────────────────────

    private function validationRules(?int $ignoreId = null, array $enabledPaymentMethods = []): array
    {
        $rules = [
            'title'                   => 'required|string|max:255',
            'slug'                    => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('ticketing_events', 'slug')->ignore($ignoreId),
            ],
            'fee'                     => 'nullable|numeric|min:0',
            'deadline'                => 'nullable|date',
            'status'                  => 'required|in:active,closed',
            'event_html_content'      => 'nullable|string',
            'html_file'               => 'nullable|file|mimes:html,txt|max:512',
            'form_schema'             => 'nullable|string',
            'requires_payment'        => 'boolean',
            'member_fee'              => 'nullable|numeric|min:0',
            'non_member_fee'          => 'nullable|numeric|min:0',
            'enabled_payment_methods' => 'nullable|array',
            'enabled_payment_methods.*' => 'in:bkash,nagad,rocket,bank',
            'payment_numbers'         => 'nullable|array',
            'payment_numbers.*'       => 'nullable|string|max:30|regex:/^[0-9+()\s-]+$/',
        ];

        foreach ($enabledPaymentMethods as $method) {
            $rules["payment_numbers.{$method}"] = 'required|string|max:30|regex:/^[0-9+()\s-]+$/';
        }

        return $rules;
    }

    private function validationMessages(): array
    {
        return [
            'title.required'                     => 'Event title is required.',
            'slug.required'                      => 'A URL slug is required.',
            'slug.unique'                        => 'This slug is already taken. Please choose another.',
            'slug.regex'                         => 'Slug may only contain lowercase letters, numbers, and hyphens.',
            'fee.numeric'                        => 'Fee must be a valid number.',
            'fee.min'                            => 'Fee cannot be negative.',
            'deadline.date'                      => 'Deadline must be a valid date.',
            'status.in'                          => 'Status must be either active or closed.',
            'html_file.mimes'                    => 'Only .html or .txt files are accepted.',
            'html_file.max'                      => 'HTML file must be smaller than 512 KB.',
            'member_fee.numeric'                 => 'Member fee must be a valid number.',
            'member_fee.min'                     => 'Member fee cannot be negative.',
            'non_member_fee.numeric'             => 'Non-member fee must be a valid number.',
            'non_member_fee.min'                 => 'Non-member fee cannot be negative.',
            'enabled_payment_methods.*.in'       => 'Invalid payment method selected.',
            'payment_numbers.*.regex'             => 'Payment number may only contain numbers, spaces, +, -, and parentheses.',
        ];
    }

    // ─── Process incoming HTML content ───────────────────────────────────────

    private function resolveHtmlContent(Request $request): ?string
    {
        if ($request->hasFile('html_file')) {
            return $request->file('html_file')->get();
        }

        return $request->input('event_html_content') ?: null;
    }

    // ─── Process incoming form schema ─────────────────────────────────────────

    private function resolveFormSchema(Request $request): ?array
    {
        $raw = $request->input('form_schema');

        if (empty($raw)) {
            return null;
        }

        $decoded = json_decode($raw, true);

        return is_array($decoded) ? $decoded : null;
    }

    // ─── Controller actions ───────────────────────────────────────────────────

    /**
     * List all ticketing events, paginated.
     */
    public function index()
    {
        $events = TicketingEvent::with('creator')
            ->latest()
            ->paginate(15)
            ->through(fn ($event) => [
                'id'                      => $event->id,
                'title'                   => $event->title,
                'slug'                    => $event->slug,
                'fee'                     => $event->fee,
                'requires_payment'        => (bool) $event->requires_payment,
                'member_fee'              => $event->member_fee,
                'non_member_fee'          => $event->non_member_fee,
                'deadline'                => $event->deadline?->toIso8601String(),
                'status'                  => $event->status,
                'custom_fields_count'     => is_array($event->form_schema) ? count($event->form_schema) : 0,
                'created_at'              => $event->created_at->toIso8601String(),
                'creator_name'            => $event->creator?->name,
            ]);

        $stats = [
            'total'  => TicketingEvent::count(),
            'active' => TicketingEvent::where('status', 'active')->count(),
            'closed' => TicketingEvent::where('status', 'closed')->count(),
        ];

        return Inertia::render('Admin/TicketingEvents/Index', [
            'events' => $events,
            'stats'  => $stats,
        ]);
    }

    /**
     * Show the create form.
     */
    public function create()
    {
        return Inertia::render('Admin/TicketingEvents/Create');
    }

    /**
     * Store a new ticketing event.
     */
    public function store(Request $request)
    {
        $validated = $request->validate(
            $this->validationRules(null, $request->input('enabled_payment_methods', [])),
            $this->validationMessages()
        );

        TicketingEvent::create([
            'title'                   => $validated['title'],
            'slug'                    => $validated['slug'],
            'fee'                     => $validated['fee'] ?? null,
            'deadline'                => $validated['deadline'] ?? null,
            'status'                  => $validated['status'],
            'event_html_content'      => $this->resolveHtmlContent($request),
            'form_schema'             => $this->resolveFormSchema($request),
            'created_by'              => Auth::guard('admin')->id(),
            'requires_payment'        => $validated['requires_payment'] ?? false,
            'member_fee'              => $validated['member_fee'] ?? null,
            'non_member_fee'          => $validated['non_member_fee'] ?? null,
            'enabled_payment_methods' => $validated['enabled_payment_methods'] ?? null,
            'payment_numbers'         => $validated['payment_numbers'] ?? null,
        ]);

        return redirect()
            ->route('admin.ticketing-events.index')
            ->with('success', 'Event created successfully.');
    }

    /**
     * Show the edit form for an existing event.
     * Route model binding resolves by slug via getRouteKeyName().
     */
    public function edit(TicketingEvent $ticketingEvent)
    {
        return Inertia::render('Admin/TicketingEvents/Edit', [
            'ticketingEvent' => [
                'id'                      => $ticketingEvent->id,
                'title'                   => $ticketingEvent->title,
                'slug'                    => $ticketingEvent->slug,
                'fee'                     => $ticketingEvent->fee,
                'deadline'                => $ticketingEvent->deadline?->format('Y-m-d\TH:i'),
                'status'                  => $ticketingEvent->status,
                'event_html_content'      => $ticketingEvent->event_html_content,
                'form_schema'             => $ticketingEvent->form_schema ?? [],
                'requires_payment'        => $ticketingEvent->requires_payment ?? false,
                'member_fee'              => $ticketingEvent->member_fee,
                'non_member_fee'          => $ticketingEvent->non_member_fee,
                'enabled_payment_methods' => $ticketingEvent->enabled_payment_methods ?? [],
                'payment_numbers'         => $ticketingEvent->payment_numbers ?? [],
            ],
        ]);
    }

    /**
     * Update an existing ticketing event.
     * Uses POST with _method=PUT via Inertia forceFormData.
     */
    public function update(Request $request, TicketingEvent $ticketingEvent)
    {
        $validated = $request->validate(
            $this->validationRules($ticketingEvent->id, $request->input('enabled_payment_methods', [])),
            $this->validationMessages()
        );

        $ticketingEvent->update([
            'title'                   => $validated['title'],
            'slug'                    => $validated['slug'],
            'fee'                     => $validated['fee'] ?? null,
            'deadline'                => $validated['deadline'] ?? null,
            'status'                  => $validated['status'],
            'event_html_content'      => $this->resolveHtmlContent($request),
            'form_schema'             => $this->resolveFormSchema($request),
            'requires_payment'        => $validated['requires_payment'] ?? false,
            'member_fee'              => $validated['member_fee'] ?? null,
            'non_member_fee'          => $validated['non_member_fee'] ?? null,
            'enabled_payment_methods' => $validated['enabled_payment_methods'] ?? null,
            'payment_numbers'         => $validated['payment_numbers'] ?? null,
        ]);

        return redirect()
            ->route('admin.ticketing-events.index')
            ->with('success', 'Event updated successfully.');
    }

    /**
     * Delete a ticketing event (cascades to registrations via FK).
     */
    public function destroy(TicketingEvent $ticketingEvent)
    {
        $ticketingEvent->delete();

        return redirect()
            ->route('admin.ticketing-events.index')
            ->with('success', 'Event deleted successfully.');
    }

    /**
     * Store unsaved preview data in session and return the preview URL.
     * The public show() controller checks for this session key.
     */
    public function preview(Request $request)
    {
        $formSchema = null;
        $raw = $request->input('form_schema');
        if (!empty($raw)) {
            $decoded = json_decode($raw, true);
            $formSchema = is_array($decoded) ? $decoded : [];
        }

        // Create a unique preview ID for this session
        $previewId = 'preview_' . Auth::guard('admin')->id() . '_' . time();
        
        session()->put('ticketing_event_preview_' . $previewId, [
            'title'                   => $request->input('title', 'Preview'),
            'slug'                    => $previewId,
            'event_html_content'      => $this->resolveHtmlContent($request),
            'form_schema'             => $formSchema ?? [],
            'fee'                     => $request->input('fee'),
            'deadline'                => $request->input('deadline'),
            'status'                  => 'active',
            'requires_payment'        => $request->input('requires_payment', false),
            'member_fee'              => $request->input('member_fee'),
            'non_member_fee'          => $request->input('non_member_fee'),
            'enabled_payment_methods' => $request->input('enabled_payment_methods', []),
            'payment_numbers'         => $request->input('payment_numbers', []),
            'is_preview'              => true,
        ]);

        $previewUrl = route('ticketing-event.show', $previewId) . '?preview=1';
        
        // Handle AJAX requests differently than Inertia requests
        if ($request->ajax()) {
            return response()->json([
                'preview_url' => $previewUrl
            ]);
        }
        
        // For Inertia requests, return redirect response  
        return redirect()->back()->with('preview_url', $previewUrl);
    }
}
