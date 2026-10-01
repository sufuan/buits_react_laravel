<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Registration Confirmation | BUITS</title>
<style>
  body{margin:0;padding:0;background:#f1f4f9}
  table{border-collapse:collapse}
  img{border:0;display:block}
  .f{font-family:'Segoe UI',Helvetica,Arial,sans-serif}
  .lbl{padding:12px 16px;font-size:14px;color:#5a6577;border-top:1px solid #e3e8f0;width:45%}
  .val{padding:12px 16px;font-size:14px;color:#111c34;font-weight:bold;text-align:right;border-top:1px solid #e3e8f0}
  @media only screen and (max-width:620px){
    .wrap{width:100%!important}
    .pad{padding-left:18px!important;padding-right:18px!important}
    .brand{font-size:13px!important}
    .bar img{width:112px!important;height:auto!important}
    .barcell{width:120px!important}
    .h1{font-size:22px!important}
  }
</style>
</head>
<body class="f" style="margin:0;padding:0;background:#f1f4f9;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your payment has been received and your registration is confirmed.</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f1f4f9">
<tr><td align="center" style="padding:24px 10px;">
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="width:600px;max-width:600px;background:#ffffff;border:1px solid #dde3ee;">
  <tr>
    <td class="pad" style="padding:22px 28px;border-bottom:3px solid #14213d;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td valign="middle">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td><img src="{{ asset('img/logo.png') }}" width="44" height="44" alt="BUITS" style="display:block;object-fit:contain;"></td>
            <td class="f" style="padding-left:12px;">
              <div class="brand" style="font-size:15px;font-weight:bold;color:#14213d;line-height:1.3;">Barishal University<br>IT Society</div>
            </td>
          </tr></table>
        </td>
        <td class="barcell bar" valign="middle" align="right" width="170">
          <img src="{{ $barcode_url }}" width="150" height="46" alt="Registration barcode" style="width:150px;height:46px;margin-left:auto;">
          <div class="f" style="font-size:11px;letter-spacing:1px;color:#111c34;text-align:right;padding-top:3px;font-weight:bold;">{{ $registration_id }}</div>
        </td>
      </tr></table>
    </td>
  </tr>

  <tr>
    <td class="pad" style="padding:30px 28px 6px 28px;">
      <p class="f" style="margin:0 0 6px 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#5a6577;font-weight:bold;">Registration Confirmation</p>
      <h1 class="f h1" style="margin:0;font-size:26px;line-height:1.3;color:#111c34;">Registration Successful</h1>
      <p class="f" style="margin:6px 0 0 0;font-size:14px;color:#5a6577;">{{ $registration->ticketingEvent->title }}</p>
    </td>
  </tr>

  <tr>
    <td class="pad" style="padding:22px 28px 8px 28px;">
      <p class="f" style="margin:0 0 10px 0;font-size:15px;color:#111c34;">Dear <b>{{ $registration->name }}</b>,</p>
      <p class="f" style="margin:0 0 24px 0;font-size:15px;line-height:1.75;color:#3d4859;">Your registration has been approved and your payment has been received successfully. Please find your payment details below.</p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #dde3ee;margin-bottom:22px;">
        <tr><td colspan="2" class="f" bgcolor="#f6f8fc" style="background:#f6f8fc;padding:11px 16px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#14213d;font-weight:bold;">Payment Summary</td></tr>
        <tr><td class="lbl f">Registration ID</td><td class="val f">{{ $registration_id }}</td></tr>
        <tr><td class="lbl f">Amount Paid</td><td class="val f">BDT {{ $amount }}</td></tr>
        <tr><td class="lbl f">Payment Method</td><td class="val f">{{ $payment_method }}</td></tr>
        <tr><td class="lbl f">Transaction ID</td><td class="val f">{{ $registration->transaction_id ?: 'N/A' }}</td></tr>
        <tr><td class="lbl f">Payment Date</td><td class="val f">{{ $payment_date }}</td></tr>
        <tr><td class="lbl f">Status</td><td class="val f" style="color:#1e7145;">PAID &#10003;</td></tr>
      </table>

      <p class="f" style="margin:0 0 24px 0;font-size:14px;line-height:1.7;color:#3d4859;"><b>Instructions:</b> Please keep the barcode in this email with you at the event. It can be scanned to verify your registration and payment status.</p>

      <p class="f" style="margin:0 0 26px 0;font-size:15px;line-height:1.7;color:#111c34;">Regards,<br><b>Barishal University IT Society (BUITS)</b></p>
    </td>
  </tr>

  <tr>
    <td class="pad f" bgcolor="#f6f8fc" style="background:#f6f8fc;border-top:1px solid #dde3ee;padding:18px 28px;text-align:center;">
      <p style="margin:0 0 4px 0;font-size:12px;color:#5a6577;">Contact: {{ $contact_email }}@if($contact_phone) &nbsp;|&nbsp; {{ $contact_phone }}@endif</p>
      <p style="margin:0;font-size:11px;color:#8b95a8;">This is an automated email. Barishal University IT Society</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>
