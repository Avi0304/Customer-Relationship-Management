const EmailAudience = require("../models/EmailCampaign");
const User = require("../models/User");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Create Audience and Send Emails
exports.createAudience = async (req, res) => {
  try {
    const newAudience = await EmailAudience.create(req.body);

    const { email, emailSubject, emailBody } = req.body;

    // Ensure email is an array
    if (!Array.isArray(email)) {
      return res
        .status(400)
        .json({ error: "email must be an array of email addresses." });
    }

    const validEmails = email.filter(
      (emailAddress) => emailAddress && /\S+@\S+\.\S+/.test(emailAddress)
    );

    if (validEmails.length === 0) {
      return res.status(400).json({ error: "No valid emails provided." });
    }

    console.log("Emails to send:", validEmails);

    // Send emails via nodemailer
    await Promise.all(
      validEmails.map((emailAddress) => {
        console.log(`Sending email to: ${emailAddress}`);

        const emailHTML = `
          <html>
            <head>
              <style>
                body {
                  font-family: 'Arial', sans-serif;
                  background-color: #f4f4f4;
                  color: #333;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                h1 {
                  color: #333;
                  font-size: 24px;
                }
                p {
                  font-size: 16px;
                  line-height: 1.6;
                  color: #555;
                }
                .cta-button {
                  display: inline-block;
                  background-color: #3498db;
                  color: #ffffff;
                  padding: 12px 24px;
                  text-decoration: none;
                  border-radius: 5px;
                  font-size: 18px;
                  margin-top: 20px;
                  text-align: center;
                }
                .cta-button:hover {
                  background-color: #2980b9;
                }
                .footer {
                  font-size: 14px;
                  color: #777;
                  text-align: center;
                  margin-top: 30px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>${emailSubject}</h1>
                <p>${emailBody}</p>
                <a href="https://www.your-website-link.com" class="cta-button">Shop Now</a>
                <div class="footer">
                  <p>If you no longer wish to receive these emails, you can <a href="https://www.unsubscribe-link.com">unsubscribe here</a>.</p>
                </div>
              </div>
            </body>
          </html>
        `;

        return transporter
          .sendMail({
            from: process.env.EMAIL_USER,
            to: emailAddress,
            subject: emailSubject,
            text: emailBody,
            html: emailHTML,
          })
          .then((info) =>
            console.log(`✅ Email sent to ${emailAddress}:`, info.response)
          )
          .catch((err) =>
            console.error(`❌ Failed to send email to ${emailAddress}:`, err)
          );
      })
    );

    res.status(201).json({
      message: `Audience created and email sent to ${validEmails.length} users.`,
      audience: newAudience,
    });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(400).json({ error: err.message });
  }
};

// Get All Audiences
exports.getAudiences = async (req, res) => {
  try {
    const audiences = await EmailAudience.find().sort({ createdAt: -1 });
    res.json(audiences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Audience by ID
exports.getAudienceById = async (req, res) => {
  try {
    const audience = await EmailAudience.findById(req.params.id);
    if (!audience) return res.status(404).json({ error: "Audience not found" });
    res.json(audience);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Audience
exports.updateAudience = async (req, res) => {
  try {
    const {
      audienceName,
      audienceDescription,
      caption,
      callToAction,
      budget,
      startDate,
      endDate,
      gender,
      ageRange,
      location,
      interests,
      emailSubject,
      emailBody,
      email,
    } = req.body;

    if (!audienceName || !emailSubject || !emailBody) {
      return res.status(400).json({
        error: "Audience name, email subject, and email body are required.",
      });
    }

    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        error: "End date must be after the start date.",
      });
    }

    const updateData = {
      audienceName,
      audienceDescription,
      caption,
      callToAction,
      budget,
      startDate,
      endDate,
      gender,
      ageRange,
      location,
      interests,
      emailSubject,
      emailBody,
      email,
    };

    const updated = await EmailAudience.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (!updated) {
      return res.status(404).json({ error: "Audience not found." });
    }

    res.json({
      message: "Audience updated successfully.",
      audience: updated,
    });
  } catch (err) {
    console.error("Error updating audience:", err);
    res.status(400).json({
      error: err.message || "Something went wrong while updating the audience.",
    });
  }
};

// Delete Audience
exports.deleteAudience = async (req, res) => {
  try {
    const deleted = await EmailAudience.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Audience not found" });
    res.json({ message: "Audience deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
