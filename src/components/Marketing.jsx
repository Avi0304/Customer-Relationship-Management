import React, { useState } from "react";
import { IoIosMail } from "react-icons/io";
import { BsFillChatTextFill } from "react-icons/bs";
import { FaBullhorn, FaFacebook, FaGoogle, FaInstagram } from "react-icons/fa";
import { MdSms } from "react-icons/md";
import CampaignForm from "./CampaignForm";
import AudienceForm from "./AudienceForm";
import PromotedPostForm from "./PromotedPostForm";

const Marketing = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState("");

  const handleFormClick = (formType, platform = "") => {
    setActiveForm(formType);
    setSelectedPlatform(platform);
  };

  const sections = [
    {
      title: "Create Campaign",
      items: [
        { icon: IoIosMail, title: "Email Campaign", bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-600 dark:text-blue-400", desc: "Create and send email campaigns", formType: "email" },
        { icon: MdSms, title: "SMS Campaign", bg: "bg-green-100 dark:bg-green-900", text: "text-green-600 dark:text-green-400", desc: "Reach your customers via SMS", formType: "sms" },
      ]
    },
    {
      title: "Create Audience",
      items: [
        { icon: FaGoogle, title: "Google Ads", bg: "bg-red-100 dark:bg-red-900", text: "text-red-600 dark:text-red-400", desc: "Create and manage Google Ads", formType: "audience", platform: "Google" },
        { icon: FaFacebook, title: "Facebook Ads", bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-600 dark:text-blue-400", desc: "Manage Facebook advertising", formType: "audience", platform: "Facebook" }
      ]
    },
    {
      title: "Promoted Posts",
      items: [
        { icon: FaFacebook, title: "Facebook Ads", bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-600 dark:text-blue-400", desc: "Boost your Facebook posts", formType: "promotedPost" },
        { icon: FaInstagram, title: "Instagram Ads", bg: "bg-pink-100 dark:bg-pink-900", text: "text-pink-600 dark:text-pink-400", desc: "Promote your Instagram content", formType: "promotedPost" }
      ]
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Sections (Campaign, Audience, Promoted Posts) */}
      {sections.map((section, index) => (
        <section key={index} className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {section.items.map((item, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden transition-all hover:shadow-lg bg-white dark:bg-gray-900 rounded-lg p-6 flex flex-col items-center text-center space-y-4 shadow-md cursor-pointer"
                onClick={() => handleFormClick(item.formType, item.platform)}
              >
                <div className={`p-3 ${item.bg} rounded-full transition-transform group-hover:scale-110`}>
                  <item.icon className={`text-2xl ${item.text}`} />
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Dynamic Form Rendering */}
      <div className="mt-8">
        {activeForm === "email" && <CampaignForm campaignType="email" togglePanel={() => setActiveForm(null)} />}
        {activeForm === "sms" && <CampaignForm campaignType="sms" togglePanel={() => setActiveForm(null)} />}
        {activeForm === "voice" && <CampaignForm campaignType="voice" togglePanel={() => setActiveForm(null)} />}
        {activeForm === "audience" && <AudienceForm selectedPlatform={selectedPlatform} togglePanel={() => setActiveForm(null)} />}
        {activeForm === "promotedPost" && <PromotedPostForm togglePanel={() => setActiveForm(null)} />}
      </div>
    </div>
  );
};

export default Marketing;
