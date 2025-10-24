require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/', (req, res) => res.send('Feedback server is running'));

app.post('/submit-feedback', async (req, res) => {
  const { name = 'Anonymous', email = '', rating = '', message = '' } = req.body || {};

  if (!message || message.toString().trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Create transporter using environment variables
  // See .env.example for required values
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    });

    const to = process.env.TO_EMAIL || process.env.SMTP_USER;
    const from = process.env.FROM_EMAIL || process.env.SMTP_USER;

    const subject = `Portfolio feedback from ${name}`;
    const text = `Name: ${name}\nEmail: ${email}\nRating: ${rating}\n\nMessage:\n${message}`;

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text
    });

    console.log('Feedback email sent:', info.messageId);
    res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error('Error sending feedback email', err);
    res.status(500).json({ error: 'Unable to send email', details: err.message });
  }
});

app.listen(PORT, () => console.log(`Feedback server listening on http://localhost:${PORT}`));
