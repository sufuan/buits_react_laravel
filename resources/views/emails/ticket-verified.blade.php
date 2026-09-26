<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Your Ticket — {{ $registration->ticketingEvent->title }}</title>
  <style>
    /* ---- Screen styles ---- */
    body { 
        font-family: Arial, sans-serif; 
        background: #f4f4f4; 
        margin: 0; 
        padding: 0; 
    }
    .wrapper { 
        max-width: 600px; 
        margin: 20px auto; 
        background: #fff; 
        border-radius: 8px;
        padding: 30px; 
        box-shadow: 0 0 10px rgba(0,0,0,0.1); 
    }
    .logo { 
        text-align: center; 
        margin-bottom: 20px; 
    }
    .ticket-card { 
        border: 2px solid #333; 
        border-radius: 8px; 
        padding: 24px;
        margin: 24px 0; 
        background: #fafafa; 
    }
    .ticket-title { 
        font-size: 22px; 
        font-weight: bold; 
        color: #1a1a1a; 
        margin-bottom: 8px; 
    }
    .ticket-field { 
        font-size: 14px; 
        color: #555; 
        margin: 4px 0; 
    }
    .ticket-field strong { 
        color: #222; 
    }
    .tear-line { 
        border-top: 2px dashed #999; 
        margin: 20px 0; 
    }
    .ticket-number { 
        font-size: 32px; 
        font-weight: 900; 
        color: #0066cc;
        text-align: center; 
        letter-spacing: 2px; 
        margin: 12px 0; 
    }
    .venue-note { 
        text-align: center; 
        font-size: 13px; 
        color: #666; 
    }
    .custom-fields-table { 
        width: 100%; 
        border-collapse: collapse; 
        margin-top: 10px; 
        font-size: 13px; 
    }
    .custom-fields-table td { 
        padding: 4px 8px; 
        border-bottom: 1px solid #eee; 
    }
    .custom-fields-table td:first-child { 
        font-weight: bold; 
        color: #444; 
        width: 40%; 
    }
    .print-btn { 
        display: block; 
        width: fit-content; 
        margin: 20px auto 0;
        padding: 10px 24px; 
        background: #0066cc; 
        color: #fff;
        text-decoration: none; 
        border-radius: 5px; 
        font-size: 15px;
        cursor: pointer; 
        border: none; 
    }
    .footer { 
        border-top: 1px solid #e0e0e0; 
        padding-top: 16px; 
        margin-top: 24px;
        font-size: 12px; 
        color: #888; 
        text-align: center; 
    }

    /* ---- Print styles ---- */
    @media print {
      body > *                 { display: none !important; }
      .ticket-card             { display: block !important; }
      .no-print                { display: none !important; }
      .ticket-card {
        border: 2px solid #000;
        padding: 20mm;
        max-width: 100%;
        page-break-inside: avoid;
        box-shadow: none;
      }
      @page { size: A5; margin: 10mm; }
    }
  </style>
</head>
<body>
  <div class="wrapper no-print">
    <div class="logo">
      <img src="https://www.buits.org/assets/img/logo.png" width="100" height="100" alt="BUITS Logo">
    </div>

    <h1 style="text-align:center; color:#333;">Your Ticket is Confirmed!</h1>
    <p style="text-align:center; color:#555;">
      Dear {{ $registration->name }}, your payment has been verified.
      Your ticket for <strong>{{ $registration->ticketingEvent->title }}</strong> is ready.
    </p>

    <a href="javascript:window.print()" class="print-btn no-print">Print Your Ticket</a>
  </div>

  {{-- The ticket card — visible on screen AND in print --}}
  <div class="ticket-card">
    <div class="ticket-title">{{ $registration->ticketingEvent->title }}</div>

    <div class="ticket-field"><strong>Registrant:</strong> {{ $registration->name }}</div>
    <div class="ticket-field"><strong>Email:</strong> {{ $registration->email }}</div>
    <div class="ticket-field"><strong>Phone:</strong> {{ $registration->phone }}</div>

    @if($registration->is_member)
    <div class="ticket-field">
      <strong>Member Status:</strong> Verified Member
      @if($registration->member_id)
        (ID: {{ $registration->member_id }})
      @endif
    </div>
    @else
    <div class="ticket-field"><strong>Member Status:</strong> Non-Member</div>
    @endif

    @if($registration->fee_charged)
    <div class="ticket-field">
      <strong>Fee Paid:</strong> ৳{{ number_format($registration->fee_charged, 2) }}
    </div>
    @else
    <div class="ticket-field"><strong>Fee Paid:</strong> Free</div>
    @endif

    @if($registration->ticketingEvent->deadline)
    <div class="ticket-field">
      <strong>Deadline:</strong>
      {{ $registration->ticketingEvent->deadline->format('d M Y, h:i A') }}
    </div>
    @endif

    {{-- Custom field responses --}}
    @if($registration->custom_field_responses && count($registration->custom_field_responses) > 0)
    <table class="custom-fields-table">
      @foreach($registration->custom_field_responses as $key => $value)
      <tr>
        <td>{{ $key }}</td>
        <td>{{ $value }}</td>
      </tr>
      @endforeach
    </table>
    @endif

    <div class="tear-line"></div>

    <div class="ticket-number">{{ $registration->ticket_no }}</div>
    <div class="venue-note">Present this ticket at the venue for check-in</div>
  </div>

  <div class="footer no-print">
    &copy; {{ date('Y') }} Barishal University IT Society. All rights reserved.
  </div>
</body>
</html>
