import express from 'express';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import Message from '../models/Message.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Prevent contact form spam
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many messages sent. Please try again later.' },
});

const sendEmailNotification = async ({ name, email, subject, message }) => {
  // Skip silently if email isn't configured (so the app still works without it)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
    to: process.env.CONTACT_RECEIVER_EMAIL || process.env.EMAIL_USER,
    replyTo: email,
    subject: `[Portfolio] ${subject || 'New message from ' + name}`,
    html: `
      <h3>New contact form submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });
};

// @route  POST /api/contact
// @desc   Submit contact form -> save to DB + send email
// @access Public
router.post('/', contactLimiter, async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    const saved = await Message.create({ name, email, subject, message });

    // Don't let email failure break the request - log and continue
    sendEmailNotification({ name, email, subject, message }).catch((err) =>
      console.error('Email notification failed:', err.message)
    );

    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/contact
// @desc   Get all messages (admin dashboard)
// @access Private
router.get('/', protect, async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

// @route  PATCH /api/contact/:id/read
// @desc   Mark a message as read
// @access Private
router.patch('/:id/read', protect, async (req, res, next) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(msg);
  } catch (err) {
    next(err);
  }
});

// @route  DELETE /api/contact/:id
// @desc   Delete a message
// @access Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
