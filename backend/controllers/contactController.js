const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendContactMsg = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const newMessage = new Contact({ name, email, subject, message });
        await newMessage.save();

        // Email content for user
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `📩 Your Message Received: ${subject}`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #f4f4f4; color: #333;">
                <div style="background: #007bff; color: #fff; padding: 10px 15px; text-align: center; border-radius: 5px;">
                    <h2 style="margin: 0;">📩 Thank You for Contacting Us</h2>
                </div>
                <p style="font-size: 16px;">Hello <strong>${name}</strong>,</p>
                <p>We have received your message and will get back to you shortly. Below is a copy of your submission:</p>
                <div style="background: #fff; padding: 15px; border-radius: 5px; box-shadow: 0px 2px 5px rgba(0,0,0,0.1);">
                    <p><strong>📌 Subject:</strong> ${subject}</p>
                    <p><strong>📝 Message:</strong> ${message}</p>
                </div>
                <p style="margin-top: 15px;">We appreciate your patience and will respond as soon as possible.</p>
                <hr>
                <p style="font-size: 14px; text-align: center; color: #555;">
                   Thank you for your attention.<br>
                    <strong>Best Regards,</strong><br>
                    <em>GrowCRM Support Team</em>
                    📧 <a href="mailto:${process.env.EMAIL_USER}" style="color: #007bff; text-decoration: none;">${process.env.EMAIL_USER}</a>
                </p>
            </div>
            `,
        };
        

        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `📥 New Contact Form Submission from ${name}`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #ffffff; color: #333333; border: 1px solid #ddd;">
                <div style="background:#0056b3; color: #ffffff; padding: 15px; text-align: center; border-radius: 5px;">
                    <h2 style="margin: 0;">📥 New Contact Form Submission</h2>
                </div>
                <p style="font-size: 16px;">Hello Admin,</p>
                <p>You have received a new message via the contact form:</p>
                
                <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; box-shadow: 0px 2px 5px rgba(0,0,0,0.1);">
                    <p><strong>👤 Name:</strong> ${name}</p>
                    <p><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #0056b3; text-decoration: none;">${email}</a></p>
                    <p><strong>📌 Subject:</strong> ${subject}</p>
                    <p><strong>📝 Message:</strong> ${message}</p>
                </div>
                
                <p style="margin-top: 15px;">Please review and respond as needed.</p>
                <hr style="border-top: 1px solid #ffcc00;">
                
                <p style="font-size: 14px; text-align: center; color: #555;">
                    Thank you for your attention.<br>
                    <strong>Best Regards,</strong><br>
                    <em>GrowCRM Support Team</em>
                </p>

            </div>
            `,
        };
        
        

        // Send emails
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(adminMailOptions);

        res.status(200).json({ message: "Message sent successfully!" });

    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {sendContactMsg}