<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Confirmation | BUITS</title>
</head>
<body style="margin:0; padding:24px 10px; background:#f1f4f9; font-family:Arial,sans-serif; color:#111c34;">
    <div style="max-width:600px; margin:0 auto; text-align:center;">
        <img
            src="{{ $message->embedData($confirmation_png, 'registration-confirmation.png') }}"
            width="600"
            alt="Registration confirmation for {{ $registration->name }}"
            style="display:block; width:100%; max-width:600px; height:auto; border:0;"
        >
        <p style="font-size:13px; line-height:1.6; color:#5a6577;">
            Your registration is approved. Registration ID: <strong>{{ $registration_id }}</strong>
        </p>
        <p style="font-size:12px; color:#8b95a8;">Registration confirmation from Barishal University IT Society.</p>
    </div>
</body>
</html>
