const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Message = require('../models/message');
const { requireAnyAdmin } = require('../middleware/adminAuth');

// Configure nodemailer with Gmail
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // TLS for port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Test email config on startup
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter.verify((error, success) => {
    if (error) {
      console.error('Email config error:', error.message);
    } else {
      console.log('Email service is ready');
    }
  });
}

// Function to send emails (non-blocking)
function sendEmails(name, email, phone, subject, message) {
  const adminMailOptions = {
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: process.env.MAIL_FROM || process.env.SMTP_USER,
    subject: `New Contact Form: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #e74c3c; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
          .details { background: white; padding: 20px; border-left: 4px solid #e74c3c; margin: 20px 0; border-radius: 4px; }
          .detail-row { margin: 12px 0; }
          .detail-label { font-weight: bold; color: #e74c3c; display: inline-block; width: 120px; }
          .detail-value { display: inline-block; color: #333; }
          .message-box { background: white; padding: 15px; border: 1px solid #e0e0e0; border-radius: 4px; margin: 20px 0; }
          .message-content { white-space: pre-wrap; color: #444; line-height: 1.8; }
          .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 11px; color: #666; border-radius: 0 0 8px 8px; }
          .highlight { color: #e74c3c; font-weight: bold; }
          .timestamp { color: #888; font-size: 12px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 New Contact Form Submission</h1>
          </div>
          
          <div class="content">
            <p>A new message has been submitted through the contact form.</p>
            
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value"><a href="mailto:${email}">${email}</a></span>
              </div>
              ${phone ? `<div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value"><a href="tel:${phone}">${phone}</a></span>
              </div>` : ''}
              <div class="detail-row">
                <span class="detail-label">Subject:</span>
                <span class="detail-value"><span class="highlight">${subject}</span></span>
              </div>
            </div>
            
            <h3 style="color: #e74c3c; margin-top: 25px;">Message:</h3>
            <div class="message-box">
              <div class="message-content">${message.replace(/\n/g, '<br>')}</div>
            </div>
            
            <p class="timestamp">
              ⏰ Received: ${new Date().toLocaleString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>
          </div>
          
          <div class="footer">
            <p style="margin: 0;">This is an automated notification from Jyoti Public School contact form.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  const userMailOptions = {
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'We received your message - Jyoti Public School',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
          .greeting { font-size: 16px; color: #333; margin-bottom: 20px; }
          .details { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px; }
          .detail-row { margin: 15px 0; }
          .detail-label { font-weight: bold; color: #667eea; display: inline-block; width: 100px; }
          .detail-value { display: inline-block; color: #333; }
          .message-box { background: white; padding: 15px; border: 1px solid #e0e0e0; border-radius: 4px; margin: 20px 0; }
          .message-content { white-space: pre-wrap; color: #444; line-height: 1.8; }
          .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
          .divider { border-top: 1px solid #ddd; margin: 20px 0; }
          .highlight { color: #667eea; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Message Received</h1>
            <p>Thank you for contacting Jyoti Public School!</p>
          </div>
          
          <div class="content">
            <div class="greeting">
              <p>Dear <span class="highlight">${name}</span>,</p>
              <p>We have successfully received your message and appreciate you reaching out to us. Our team will review your inquiry and get back to you as soon as possible.</p>
            </div>
            
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${email}</span>
              </div>
              ${phone ? `<div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${phone}</span>
              </div>` : ''}
              <div class="detail-row">
                <span class="detail-label">Subject:</span>
                <span class="detail-value">${subject}</span>
              </div>
            </div>
            
            <h3 style="color: #667eea; margin-top: 30px;">Your Message:</h3>
            <div class="message-box">
              <div class="message-content">${message.replace(/\n/g, '<br>')}</div>
            </div>
            
            <div class="divider"></div>
            
            <p style="color: #666; font-size: 14px;">
              <strong>Expected Response Time:</strong> We typically respond within 24-48 hours during business days (Monday - Saturday, 9:00 AM - 4:00 PM).
            </p>
            
            <p style="color: #666; font-size: 14px;">
              If you need immediate assistance, please call us at <strong>8229095143</strong> or visit our address at Kahra Ward No. 6/41, Saharsa, Bihar – 852201.
            </p>
          </div>
          
          <div class="footer">
            <p style="margin: 0;">Jyoti Public School</p>
            <p style="margin: 5px 0 0 0;">Kahra Ward No. 6/41, Saharsa, Bihar – 852201</p>
            <p style="margin: 5px 0 0 0;">📧 jyotipublicschool24@gmail.com | 📱 8229095143</p>
            <p style="margin: 10px 0 0 0; font-size: 11px; color: #999;">© 2024 Jyoti Public School. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  // Send emails in background (don't wait)
  transporter.sendMail(adminMailOptions, (err, info) => {
    if (err) {
      console.error('Failed to send admin email:', err);
    } else {
      console.log('Admin email sent:', info.response);
    }
  });

  transporter.sendMail(userMailOptions, (err, info) => {
    if (err) {
      console.error('Failed to send user confirmation email:', err);
    } else {
      console.log('User confirmation email sent:', info.response);
    }
  });
}

// POST - Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save to MongoDB
    const msg = new Message({
      name,
      email,
      phone: phone || '',
      subject,
      message,
      status: 'new'
    });
    await msg.save();

    // Send emails in background (non-blocking)
    // Don't wait for this to complete
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      sendEmails(name, email, phone, subject, message);
    }

    res.json({ success: true, message: 'Message saved successfully!' });
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET - Get all messages (admin)
router.get('/', requireAnyAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Mark message as read (admin)
router.put('/:id/read', requireAnyAdmin, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { status: 'read' }, { new: true });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Delete message (admin)
router.delete('/:id', requireAnyAdmin, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
