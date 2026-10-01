<?php

namespace App\Mail;

use App\Models\EventRegistration;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RegistrationRejectedMail extends Mailable
{
    use SerializesModels;

    public function __construct(public EventRegistration $registration)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Registration Update — ' . $this->registration->ticketingEvent->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.registration-rejected',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}