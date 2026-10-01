<?php

namespace App\Mail;

use App\Models\EventRegistration;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TicketVerifiedMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(public EventRegistration $registration)
    {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🎟️ Ticket Confirmed — ' . $this->registration->ticketingEvent->title,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.ticket-verified',
            with: [
                'registration_id' => $this->registration->ticket_no,
                'amount'          => $this->registration->fee_charged
                    ? number_format((float) $this->registration->fee_charged, 2)
                    : '0.00',
                'payment_method'  => match ($this->registration->payment_method) {
                    'bkash' => 'bKash',
                    'nagad' => 'Nagad',
                    'rocket' => 'Rocket',
                    'bank' => 'Bank Transfer',
                    default => $this->registration->payment_method ?: 'N/A',
                },
                'payment_date'    => $this->registration->updated_at?->format('d M Y, h:i A'),
                'barcode_url'     => 'https://bwipjs-api.metafloor.com/?bcid=code128&text=' . rawurlencode($this->registration->ticket_no) . '&scale=3&height=12&includetext=0',
                'contact_email'   => config('mail.from.address'),
                'contact_phone'   => config('app.contact_phone', ''),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
