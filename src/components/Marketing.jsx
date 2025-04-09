import React, { useState } from "react";
import { IoIosMail } from "react-icons/io";
import { MdSms } from "react-icons/md";
import EmailForm from "./EmailForm";
import SMSForm from "./SMSForm";
import EmailAudience from "./EmailAudience";
// import SmsAudience from "./SmsAudience";
import EmailPost from "./EmailPost";
// import Smspost from "./SmsPost";
import GenericTable from "./GenericTable";
import { Button } from "@mui/material";

const Marketing = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [showTable, setShowTable] = useState("emailCampaigns");

  const handleFormClick = (formType, platform = "") => {
    setActiveForm(formType);
    setSelectedPlatform(platform);
  };

  const closePopup = () => {
    setActiveForm(null);
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
        { icon: IoIosMail, title: "Email Audience", bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-600 dark:text-blue-400", desc: "Create and manage Email Ads", formType: "emailAudience", platform: "LinkedIn" },
        // { icon: MdSms, title: "SMS Audience", bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-600 dark:text-blue-400", desc: "Manage SMS advertising", formType: "smsAudience", platform: "Facebook" },
      ]
    },
    {
      title: "Promoted Posts",
      items: [
        { icon: IoIosMail, title: "Email Posts", bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-600 dark:text-blue-400", desc: "Boost your Email posts", formType: "emailpost" },
        // { icon: MdSms, title: "SMS Posts", bg: "bg-pink-100 dark:bg-pink-900", text: "text-pink-600 dark:text-pink-400", desc: "Promote your SMS content", formType: "smspost" }
      ]
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
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

      {activeForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent">
          <div className="fixed inset-0 bg-black opacity-50" onClick={closePopup}></div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-1/2 max-w-md relative">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            {activeForm === "email" && <EmailForm togglePanel={closePopup} />}
            {activeForm === "sms" && <SMSForm togglePanel={closePopup} />}
            {activeForm === "emailAudience" && <EmailAudience togglePanel={closePopup} />}
            {/* {activeForm === "smsAudience" && <SmsAudience togglePanel={closePopup} />} */}
            {activeForm === "emailpost" && <EmailPost togglePanel={closePopup} />}
            {/* {activeForm === "smspost" && <Smspost togglePanel={closePopup} />} */}
          </div>
        </div>
      )}

      <div className="flex  gap-4 bg-gray-100 dark:bg-gray-800 p-2 rounded-xl shadow-md">
        {[
          { label: "Email Campaigns", key: "emailCampaigns" },
          { label: "SMS Campaigns", key: "smsCampaigns" },
          { label: "Audience", key: "audienceTable" },
          // { label: "SMS Audience", key: "smsAudienceTable" },
          { label: "Email Posts", key: "emailPostTable" },
          // { label: "SMS Posts", key: "smsPostTable" },
        ].map((tab) => (
          <div
            key={tab.key}
            onClick={() => setShowTable(tab.key)}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 ${
              showTable === tab.key
                ? "bg-blue-500 text-white shadow-lg"
                : "text-gray-700 dark:text-gray-300 hover:bg-blue-200 dark:hover:bg-blue-600"
            }`}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div className="w-full grid grid-cols-1 gap-4 transition-all duration-300 min-h-[100px]">
        <GenericTable tableType={showTable} />
      </div>
    </div>
  );
};

export default Marketing;
