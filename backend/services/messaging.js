const nodemailer = require("nodemailer");
const twilio = require("twilio");
require("dotenv").config();
const formatEmailFromPost = require("../utils/formatEmailFromPost");
const User = require("../models/User");

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send Basic Email
const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("✅ Email sent:", info.response);
  return info;
};

const sendEmailWithPost = async (recipients, post) => {
  try {
    const { subject, html } = formatEmailFromPost(post);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients.join(","),
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email with post sent:", info.response);
    return info;
  } catch (err) {
    console.error("❌ Failed to send email with post:", err);
    throw err;
  }
};

// Twilio Setup
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const formatNumber = (number) =>
  number.startsWith("+") ? number : `+91${number}`;

const sendSms = async (message, recipients) => {
  try {
    const formatSmsMessage = (msg) => {
      const maxLength = 160;

      // Format message neatly
      let formatted = msg
        .replace(/\r?\n|\r/g, "\n")
        .replace(/\n{2,}/g, "\n")
        .trim();

      if (formatted.length > maxLength) {
        formatted = formatted.slice(0, maxLength - 3) + "...";
      }

      return formatted;
    };

    const formattedMessage = formatSmsMessage(message);
    const formattedRecipients = recipients.map(formatNumber);

    for (const to of formattedRecipients) {
      await client.messages.create({
        body: formattedMessage,
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
      });
      console.log("✅ SMS sent to:", to);
    }

    return { success: true };
  } catch (err) {
    console.error("❌ Failed to send SMS:", err.message);
    throw err;
  }
};

module.exports = {
  sendEmail,
  sendEmailWithPost,
  sendSms,
};
