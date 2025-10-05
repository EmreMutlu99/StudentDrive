const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// Create nodemailer transporter from env
function createTransporter() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
  } = process.env;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: String(SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

// Load template file once (sync is fine at boot)
const templatePath = path.join(__dirname, "template.html");
const templateHtml = fs.readFileSync(templatePath, "utf8");

// Very small templating function for {{ header }} and {{ content }}
function renderTemplate({ header, contentHtml }) {
  return templateHtml
    .replace(/{{\s*header\s*}}/g, header)
    .replace(/{{\s*content\s*\|\s*safe\s*}}/g, contentHtml);
}

async function sendTemplatedEmail({ to, subject, header, contentHtml }) {
  const transporter = createTransporter();
  const from = process.env.SENDER_EMAIL || "no-reply@example.com";

  // Logo path (bundled in this folder)
  const logoPath = path.join(__dirname, "logo.png");

  const html = renderTemplate({ header, contentHtml });

  const mailOptions = {
    from,
    to,
    subject,
    html,
    attachments: [
      {
        filename: "logo.png",
        path: logoPath,
        cid: "company_logo", // must match src="cid:company_logo" in template
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendTemplatedEmail };
