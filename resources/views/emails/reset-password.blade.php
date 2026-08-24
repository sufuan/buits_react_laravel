<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .logo {
            margin-bottom: 20px;
        }
        h1 {
            font-size: 24px;
            color: #333333;
            margin-bottom: 10px;
        }
        p {
            font-size: 16px;
            color: #555555;
            margin: 5px 0;
        }
        a {
            color: #0066cc;
            text-decoration: none;
            font-size: 16px;
        }
        .footer {
            border-top: 1px solid #e0e0e0;
            padding-top: 20px;
            margin-top: 20px;
            font-size: 14px;
            color: #555555;
        }
        .footer a {
            margin: 0 10px;
            color: #0066cc;
            text-decoration: none;
        }
        .social-icons {
            margin-top: 20px;
        }
        .social-icons img {
            width: 24px;
            margin: 0 10px;
        }
        .copyright {
            margin-top: 20px;
            font-size: 12px;
            color: #888888;
        }
        .center-logo {
            display: block;
            margin: 0 auto 20px auto;
            width: 100px;
            height: 100px;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #0066cc;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .btn:hover {
            background-color: #005bb5;
        }
    </style>
</head>

<body>
    <div class="container">
      
        <h1>Reset Your Password</h1>

        <p>Dear {{ $user->name }},</p>
        <p>You are receiving this email because we received a password reset request for your account.</p>

        <a href="{{ $url }}" class="btn">Reset Password</a> 

        <p style="margin-top: 20px;">This password reset link will expire in 60 minutes.</p>
        <p>If you did not request a password reset, no further action is required.</p>
        <br>

        <p>Facebook page link: <a href="https://www.facebook.com/buitsorg">https://www.facebook.com/buitsorg</a></p>
        <p>Facebook group link: <a
                href="https://www.facebook.com/groups/buitsorg/?ref=share&mibextid=NSMWBT">https://www.facebook.com/groups/buitsorg/?ref=share&mibextid=NSMWBT</a>
        </p>

        <img src="https://www.buits.org/assets/img/logo.png" width="150" height="150" alt="logo">

        <div class="footer">
           
            <div class="copyright">
                &copy; {{ date('Y') }} Barishal University IT Society. All rights reserved.
            </div>
        </div>
    </div>
</body>

</html>
