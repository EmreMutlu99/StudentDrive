const express = require("express");
const router = express.Router();
const { sendTemplatedEmail } = require("./email_sender/email.service");

// Simple API-key middleware (reads from .env)
router.use((req, res, next) => {
  const provided = req.header("x-api-key");
  if (!provided || provided !== process.env.EMAIL_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

/**
 * POST /api/email/send
 * Body:
 * {
 *   "to": "a@b.com" | ["a@b.com","c@d.com"],
 *   "subject": "Optional (defaults to header)",
 *   "header": "Email headline",
 *   "content": "<p>HTML allowed</p>"
 * }
 */
router.post("/send", async (req, res) => {
  try {
    const { to, subject, header, content } = req.body || {};

    if (!to || !header || !content) {
      return res.status(400).json({
        error: "Missing required field(s): to, header, content",
      });
    }

    const recipients = Array.isArray(to) ? to : [to];
    const subj = subject || header;

    await sendTemplatedEmail({
      to: recipients,
      subject: subj,
      header,
      contentHtml: content,
    });

    return res.json({ ok: true, sent: recipients.length });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;
