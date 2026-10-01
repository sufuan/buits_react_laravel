<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Update</title>
</head>
<body style="margin:0; padding:24px; background:#f4f6f8; font-family:Arial,sans-serif; color:#1f2937;">
    <div style="max-width:600px; margin:0 auto; padding:32px; background:#ffffff; border-radius:8px;">
        <h1 style="margin-top:0; color:#991b1b;">Registration Update</h1>
        <p>Dear {{ $registration->name }},</p>
        <p>
            Thank you for your interest in
            <strong>{{ $registration->ticketingEvent->title }}</strong>.
            We are unable to approve your registration at this time.
        </p>
        <p>
            If you believe this was sent in error, please contact the event organizers
            with your registration details.
        </p>
        <p style="margin-bottom:0;">Regards,<br>Barishal University IT Society</p>
    </div>
</body>
</html>