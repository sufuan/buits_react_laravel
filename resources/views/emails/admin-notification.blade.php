<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New User Approved - Admin Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #2196F3;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 0 0 5px 5px;
        }
        .user-details {
            background-color: #e3f2fd;
            padding: 15px;
            border-left: 4px solid #2196F3;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 New User Approved</h1>
    </div>
    
    <div class="content">
        <p>Dear Admin,</p>
        
        <p>A new user has been approved and added to the system.</p>
        
        <div class="user-details">
            <h3>User Details:</h3>
            <ul>
                <li><strong>Name:</strong> {{ $user->name }}</li>
                <li><strong>Email:</strong> {{ $user->email }}</li>
                <li><strong>Department:</strong> {{ $user->department }}</li>
                <li><strong>Session:</strong> {{ $user->session }}</li>
                <li><strong>Member ID:</strong> {{ $user->member_id }}</li>
                <li><strong>Phone:</strong> {{ $user->phone }}</li>
                <li><strong>Class Roll:</strong> {{ $user->class_roll }}</li>
                <li><strong>Gender:</strong> {{ $user->gender }}</li>
                @if($user->blood_group)
                <li><strong>Blood Group:</strong> {{ $user->blood_group }}</li>
                @endif
            </ul>
        </div>
        
        <p>The user has been notified via email and can now access their account.</p>
        
        <p>Best regards,<br>
        System Administrator</p>
    </div>
    
    <div class="footer">
        <p>This is an automated notification from the user management system.</p>
    </div>
</body>
</html>
