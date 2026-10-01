<?php

namespace App\Http\Controllers;

use App\Models\TicketingEvent;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PublicTicketingEventController extends Controller
{
    public function show(string $slug)
    {
        // Check session for preview mode first
        if (request()->query('preview')) {
            $previewKey = 'ticketing_event_preview_' . $slug;
            
            if (session()->has($previewKey)) {
                $preview = session()->get($previewKey);
                
                return Inertia::render('TicketingEvent/Show', [
                    'event'       => $preview,
                    'htmlContent' => $preview['event_html_content'] ?? '',
                    'formSchema'  => $preview['form_schema'] ?? [],
                    'isClosed'    => false,
                    'isPreview'   => true,
                ]);
            }
        }

        $event = TicketingEvent::where('slug', $slug)->firstOrFail();

        return Inertia::render('TicketingEvent/Show', [
            'event'       => $event->only([
                'id', 'title', 'slug', 'fee', 'deadline', 'status',
                'requires_payment', 'member_fee', 'non_member_fee', 'enabled_payment_methods', 'payment_numbers'
            ]),
            'htmlContent' => $event->event_html_content,
            'formSchema'  => $event->form_schema ?? [],
            'isClosed'    => $event->isClosed(),
            'isPreview'   => false,
        ]);
    }

    public function verifyMember(Request $request)
    {
        $request->validate([
            'member_id' => 'required|string',
        ]);

        $user = \App\Models\User::where('member_id', $request->member_id)
            ->where('is_approved', true)
            ->first();

        if ($user) {
            return response()->json([
                'valid' => true,
                'name'  => $user->name,
            ]);
        }

        return response()->json([
            'valid' => false,
        ]);
    }

    public function storeRegistration(Request $request, string $slug)
    {
        $event = TicketingEvent::where('slug', $slug)->firstOrFail();

        if ($event->isClosed()) {
            abort(403, 'Registration is closed for this event.');
        }

        // Build dynamic validation rules based on payment requirement
        $rules = [
            'name'  => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
        ];

        // Conditional payment validation
        if ($event->requires_payment) {
            $rules['payment_method'] = [
                'required',
                'string',
                Rule::in($event->enabled_payment_methods ?? ['bkash', 'nagad', 'rocket', 'bank'])
            ];
            $rules['transaction_id'] = ['required', 'string', Rule::unique('event_registrations', 'transaction_id')];
            $rules['sender_number'] = 'nullable|string|max:20';
            $rules['member_id'] = 'nullable|string';
        }

        // Add rules for each custom field from the event's form_schema
        foreach ($event->form_schema ?? [] as $field) {
            $key = 'custom_fields.' . $field['label'];
            $rules[$key] = $field['required'] ? 'required|string' : 'nullable|string';
        }

        $messages = [
            'transaction_id.unique' => 'This Transaction ID has already been used. Please check and re-enter.',
            'payment_method.in' => 'Selected payment method is not available for this event.',
        ];

        $validated = $request->validate($rules, $messages);

        // Independent member verification - TRUST BOUNDARY
        $isMember = false;
        $verifiedMemberId = null;
        $feeCharged = null;

        if ($event->requires_payment) {
            // Re-verify member_id on backend - never trust frontend
            if (!empty($request->member_id)) {
                $memberExists = \App\Models\User::where('member_id', $request->member_id)
                    ->where('is_approved', true)
                    ->exists();
                
                if ($memberExists) {
                    $isMember = true;
                    $verifiedMemberId = $request->member_id;
                }
            }

            // Calculate fee based on backend verification result
            $feeCharged = $isMember ? $event->member_fee : $event->non_member_fee;
        }

        // Determine status based on payment requirement
        $status = $event->requires_payment ? 'pending' : 'verified';

        EventRegistration::create([
            'event_id'               => $event->id,
            'name'                   => $validated['name'],
            'email'                  => $validated['email'],
            'phone'                  => $validated['phone'],
            'payment_method'         => $validated['payment_method'] ?? null,
            'transaction_id'         => $validated['transaction_id'] ?? null,
            'sender_number'          => $validated['sender_number'] ?? null,
            'custom_field_responses' => $validated['custom_fields'] ?? null,
            'status'                 => $status,
            'is_member'              => $isMember,
            'member_id'              => $verifiedMemberId,
            'fee_charged'            => $feeCharged,
        ]);

        return redirect()->back()->with('success', 'Registration submitted successfully!');
    }
}
