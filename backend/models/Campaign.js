const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    campaignType: {
      type: String,
      enum: ["email", "sms"],
      required: true,
    },
    subject: {
      type: String,
      validate: {
        validator: function (v) {
          if (
            this.campaignType === "email" &&
            (!this.emailPost ||
              !this.emailPost.caption ||
              !this.emailPost.callToAction ||
              !this.emailPost.link)
          ) {
            return v && v.trim().length > 0;
          }
          return true;
        },
        message:
          "Subject is required for email campaigns without complete emailPost.",
      },
    },
    body: {
      type: String,
      validate: {
        validator: function (v) {
          if (
            this.campaignType === "email" &&
            (!this.emailPost ||
              !this.emailPost.caption ||
              !this.emailPost.callToAction ||
              !this.emailPost.link)
          ) {
            return v && v.trim().length > 0;
          }
          return true;
        },
        message:
          "Body is required for email campaigns without complete emailPost.",
      },
    },
    message: {
      type: String,
      required: function () {
        return this.campaignType === "sms";
      },
    },
    recipients: {
      type: [String],
      required: true,
    },
    schedule: {
      type: String,
      enum: ["immediately", "scheduled"],
      default: "immediately",
    },
    emailPost: {
      caption: String,
      callToAction: String,
      link: String,
      mediaUrl: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Campaign", CampaignSchema);
