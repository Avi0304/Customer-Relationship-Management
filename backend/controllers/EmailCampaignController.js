const EmailCampaign = require("../models/EmailCampaign");
const User = require("../models/Customer");
const {
  sendEmail,
  sendEmailWithPost,
  sendSms,
} = require("../services/messaging.js");

const createEmailCampaign = async (req, res) => {
  try {
    const campaign = new EmailCampaign(req.body);
    await campaign.save();

    const users = await User.find({}, "email");
    const recipientEmails = users.map((user) => user.email);

    if (recipientEmails.length === 0) {
      return res
        .status(400)
        .json({ message: "No users found to send emails." });
    }

    await sendEmailWithPost(recipientEmails, campaign);
    res
      .status(201)
      .json({ message: "Email Campaign created and emails sent!", campaign });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllEmailCampaigns = async (req, res) => {
  try {
    const campaigns = await EmailCampaign.find();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmailCampaignById = async (req, res) => {
  try {
    const campaign = await EmailCampaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Email Campaign not found" });
    }
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmailCampaign = async (req, res) => {
  try {
    const campaign = await EmailCampaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!campaign) {
      return res.status(404).json({ message: "Email Campaign not found" });
    }
    res.status(200).json(campaign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteEmailCampaign = async (req, res) => {
  try {
    const campaign = await EmailCampaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Email Campaign not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEmailCampaign,
  getAllEmailCampaigns,
  getEmailCampaignById,
  updateEmailCampaign,
  deleteEmailCampaign,
};
