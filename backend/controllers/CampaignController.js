const Campaign = require("../models/Campaign");
const {
  sendEmail,
  sendEmailWithPost,
  sendSms,
} = require("../services/messaging");
const formatEmailFromPost = require("../utils/formatEmailFromPost");
const User = require("../models/User");
const { sendWhatsapp } = require("../services/messaging");

const createCampaign = async (req, res) => {
  try {
    let {
      title,
      recipients,
      message,
      schedule,
      campaignType,
      emailPost,
      subject,
      body,
    } = req.body;

    // Ensure recipients is an array
    recipients = Array.isArray(recipients) ? recipients : [recipients];

    // If it's an email campaign and emailPost exists, format the email content
    if (campaignType === "email" && emailPost) {
      const formatted = formatEmailFromPost(emailPost);
      subject = formatted.subject;
      body = formatted.html;
    }

    // Validate subject and body for email campaigns
    if (campaignType === "email" && (!subject || !body)) {
      throw new Error("Subject and body are required for email campaigns");
    }

    const campaign = new Campaign({
      title,
      recipients,
      subject,
      body,
      message,
      schedule,
      campaignType,
      emailPost,
    });

    await campaign.save();

    // Handle immediate sending
    if (schedule === "immediately") {
      if (campaignType === "email") {
        if (emailPost) {
          await sendEmailWithPost(recipients, emailPost);
        } else {
          await sendEmail(recipients, subject, body);
        }
      } else if (campaignType === "sms") {
        await sendSms(message, recipients);
      }

      campaign.status = "Sent";
      await campaign.save();
    }

    res.status(201).json(campaign);
  } catch (error) {
    console.error("❌ Error creating campaign:", error);
    res.status(400).json({ message: error.message });
  }
};

// Get all email campaigns
const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single campaign by ID
const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a campaign by ID
const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json(campaign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a campaign by ID
const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendWhatsappCampaign = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message content is required." });
    }

    // Get users with phone numbers
    const users = await User.find({}, "phone");
    const phoneNumbers = users.map((user) => user.phone).filter(Boolean);

    if (phoneNumbers.length === 0) {
      return res.status(400).json({ message: "No phone numbers found." });
    }

    // Send WhatsApp messages
    await sendWhatsapp(message, phoneNumbers);

    res
      .status(200)
      .json({ message: "✅ WhatsApp campaign sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending WhatsApp campaign:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendWhatsappCampaign,
};

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  sendWhatsappCampaign,
};
