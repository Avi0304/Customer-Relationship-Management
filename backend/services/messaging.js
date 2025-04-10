const nodemailer = require("nodemailer");
const twilio = require("twilio");
require("dotenv").config();
const formatEmailFromPost = require("../utils/formatEmailFromPost");
const User = require("../models/User");

// 📧 Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔹 Send Basic Email
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

// 🔹 Send Email With Post (Promoted)
// const sendEmailWithPost = async (recipients, post) => {
//   try {
//     const html = `
//         <h1>${post.caption}</h1>
//         ${
//           post.mediaUrl
//             ? `<img src="${post.mediaUrl}" style="max-width: 100%;">`
//             : ""
//         }
//         <p>Check out our latest offer!</p>
//         <a href="${
//           post.link
//         }" style="padding:10px;background:#007BFF;color:white;text-decoration:none;border-radius:5px;">
//           ${post.callToAction}
//         </a>
//       `;

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: recipients.join(","), // ✅ Join recipients here
//       subject: `New Offer: ${post.caption}`,
//       html,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("✅ Email with post sent:", info.response);
//     return info;
//   } catch (err) {
//     console.error("❌ Failed to send email with post:", err);
//     throw err;
//   }
// };

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

// 📱 Twilio Setup
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const client2 = twilio(
  process.env.TWILIO_ACCOUNT_SID2,
  process.env.TWILIO_AUTH_TOKEN2
);

const formatNumber = (number) =>
  number.startsWith("+") ? number : `+91${number}`;

// 🔹 Send SMS
// const sendSms = async (message, recipients) => {
//   try {
//     const formattedRecipients = recipients.map(formatNumber);

//     for (const to of formattedRecipients) {
//       await client.messages.create({
//         body: message,
//         from: process.env.TWILIO_PHONE_NUMBER,
//         to,
//       });
//       console.log("✅ SMS sent to:", to);
//     }

//     return { success: true };
//   } catch (err) {
//     console.error("❌ Failed to send SMS:", err);
//     throw err;
//   }
// };

const sendSms = async (message, recipients) => {
  try {
    const formatSmsMessage = (msg) => {
      const maxLength = 160;

      // Format message neatly
      let formatted = msg
        .replace(/\r?\n|\r/g, "\n") // Normalize line breaks
        .replace(/\n{2,}/g, "\n") // Collapse multiple newlines
        .trim();

      // Ensure it's within the character limit
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

const sendWhatsapp = async (message) => {
  try {
    // 1. Get all users with phone numbers
    const users = await User.find({ phone: { $exists: true, $ne: "" } });

    if (users.length === 0) {
      console.log("⚠️ No users with phone numbers found.");
      return { success: false, message: "No recipients found." };
    }

    // 2. Format numbers
    const formatWhatsappNumber = (number) =>
      number.startsWith("+") ? `whatsapp:${number}` : `whatsapp:+91${number}`;

    const formattedRecipients = users.map((user) =>
      formatWhatsappNumber(user.phone)
    );

    // 3. Send messages
    const from = `${process.env.TWILIO_WHATSAPP_NUMBER}`;

    for (const to of formattedRecipients) {
      await client2.messages.create({
        body: message,
        from,
        to,
      });
      console.log("✅ WhatsApp sent to:", to);
    }

    return { success: true };
  } catch (err) {
    console.error("❌ Failed to send WhatsApp:", err.message);
    throw err;
  }
};

module.exports = {
  sendEmail,
  sendEmailWithPost,
  sendSms,
  sendWhatsapp,
};
