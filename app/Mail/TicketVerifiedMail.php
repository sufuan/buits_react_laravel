<?php

namespace App\Mail;

use App\Models\EventRegistration;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

class TicketVerifiedMail extends Mailable
{
    use Queueable, SerializesModels;

    private ?string $confirmationPng = null;

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
                'contact_email'   => config('mail.from.address'),
                'contact_phone'   => config('app.contact_phone', ''),
                'confirmation_png' => $this->confirmationPng(),
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

    private function barcodePng(): string
    {
        $barcodePayload = implode('|', [
            $this->registration->ticket_no,
            $this->registration->name,
            $this->registration->email,
            'PAID',
            $this->registration->payment_method ?: 'N/A',
        ]);
        $barcodeUrl = 'https://bwipjs-api.metafloor.com/?bcid=code128&text=' . rawurlencode($barcodePayload) . '&scale=3&height=12&includetext=false';

        return Http::retry(2, 200)->timeout(10)->get($barcodeUrl)->throw()->body();
    }

    private function confirmationPng(): string
    {
        if ($this->confirmationPng !== null) {
            return $this->confirmationPng;
        }

        if (! extension_loaded('gd')) {
            throw new \RuntimeException('The GD extension is required to generate the registration confirmation image.');
        }

        $width = 1200;
        $height = 1500;
        $image = imagecreatetruecolor($width, $height);
        $background = imagecolorallocate($image, 241, 244, 249);
        $white = imagecolorallocate($image, 255, 255, 255);
        $navy = imagecolorallocate($image, 20, 33, 61);
        $text = imagecolorallocate($image, 17, 28, 52);
        $muted = imagecolorallocate($image, 90, 101, 119);
        $border = imagecolorallocate($image, 221, 227, 238);
        $green = imagecolorallocate($image, 30, 113, 69);
        $light = imagecolorallocate($image, 246, 248, 252);

        imagefill($image, 0, 0, $background);
        imagefilledrectangle($image, 80, 60, $width - 80, $height - 60, $white);
        imagefilledrectangle($image, 80, 60, $width - 80, 66, $navy);

        $logoPath = public_path('img/logo.png');
        if (is_file($logoPath) && ($logo = @imagecreatefrompng($logoPath))) {
            imagecopyresampled($image, $logo, 120, 105, 0, 0, 88, 88, imagesx($logo), imagesy($logo));
            imagedestroy($logo);
        }

        imagestring($image, 5, 230, 112, 'Barishal University', $navy);
        imagestring($image, 5, 230, 135, 'IT Society', $navy);

        $barcode = @imagecreatefromstring($this->barcodePng());
        if ($barcode) {
            imagecopyresampled($image, $barcode, 850, 105, 0, 0, 260, 80, imagesx($barcode), imagesy($barcode));
            imagedestroy($barcode);
        }
        imagestring($image, 3, 915, 195, $this->registration->ticket_no, $text);

        imagestring($image, 3, 120, 270, 'REGISTRATION CONFIRMATION', $muted);
        imagestring($image, 5, 120, 300, 'Registration Successful', $text);
        imagestring($image, 4, 120, 350, $this->registration->ticketingEvent->title, $muted);

        imagestring($image, 4, 120, 415, 'Dear ' . $this->registration->name . ',', $text);
        imagestring($image, 4, 120, 455, 'Your registration has been approved and your payment has been received.', $muted);
        imagestring($image, 4, 120, 480, 'Please keep this confirmation and barcode for the event.', $muted);

        imagefilledrectangle($image, 120, 540, $width - 120, 580, $light);
        imagestring($image, 4, 145, 552, 'PAYMENT SUMMARY', $navy);

        $paymentMethod = match ($this->registration->payment_method) {
            'bkash' => 'bKash',
            'nagad' => 'Nagad',
            'rocket' => 'Rocket',
            'bank' => 'Bank Transfer',
            default => $this->registration->payment_method ?: 'N/A',
        };
        $rows = [
            ['Registration ID', $this->registration->ticket_no],
            ['Amount Paid', 'BDT ' . ($this->registration->fee_charged ? number_format((float) $this->registration->fee_charged, 2) : '0.00')],
            ['Payment Method', $paymentMethod],
            ['Transaction ID', $this->registration->transaction_id ?: 'N/A'],
            ['Payment Date', $this->registration->updated_at?->format('d M Y, h:i A') ?: 'N/A'],
            ['Status', 'PAID'],
        ];

        $rowY = 620;
        foreach ($rows as [$label, $value]) {
            imageline($image, 120, $rowY - 12, $width - 120, $rowY - 12, $border);
            imagestring($image, 4, 145, $rowY, $label, $muted);
            imagestring($image, 4, 730, $rowY, $value, $label === 'Status' ? $green : $text);
            $rowY += 48;
        }

        imageline($image, 120, 940, $width - 120, 940, $border);
        imagestring($image, 4, 120, 985, 'Please present this barcode at the event for check-in.', $muted);
        imagestring($image, 4, 120, 1035, 'Regards,', $text);
        imagestring($image, 4, 120, 1065, 'Barishal University IT Society (BUITS)', $text);
        imagestring($image, 3, 120, 1380, 'Contact: ' . config('mail.from.address'), $muted);
        imagestring($image, 3, 120, 1410, 'This is an automated email.', $muted);

        ob_start();
        imagepng($image);
        $this->confirmationPng = ob_get_clean();
        imagedestroy($image);

        return $this->confirmationPng;
    }
}
