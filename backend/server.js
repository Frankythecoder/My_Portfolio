import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config({ path: '.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Add this GET / route
app.get('/', (req, res) => {
  res.send('Server is running. Use POST /send-email to send emails.');
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /send-email route
app.post('/send-email', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const info = await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_TO,
      subject: subject || 'Test Email',
      text: message || 'Hello from Node.js!',
      replyTo: email,
    });

    console.log('Email sent:', info.response);
    res.json({ success: true, info: info.response });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
