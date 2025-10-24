# Feedback server (nodemailer)

This small Express server accepts POST requests at `/submit-feedback` and forwards the feedback as an email using nodemailer.

Setup

1. Install dependencies

```powershell
cd server
npm install
```

2. Create a `.env` file from `.env.example` and set your SMTP credentials. Example for Gmail (recommended: use an App Password):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
TO_EMAIL=apal06696@gmail.com
FROM_EMAIL=your@gmail.com
```

3. Run the server

```powershell
npm start
```

The server listens on port 3000 by default. The feedback form in `feedback.html` is pre-configured to POST to `http://localhost:3000/submit-feedback`.

Security notes

- Do not commit your real `.env` file to source control.
- For Gmail, create an App Password and use that instead of your account password.

Troubleshooting

- If emails are blocked, check SMTP credentials and provider limits.
- Make sure the server is reachable from the browser (CORS is enabled for local testing).
