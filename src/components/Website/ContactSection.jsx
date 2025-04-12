import axios from "axios";
import React, { useState } from "react";
import { LuMapPin, LuMail, LuPhone, LuStar } from "react-icons/lu";
import Swal from "sweetalert2";

function ContactSection() {
  const [formData, setformData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/Contact/sendContact",
        formData
      );

      Swal.fire({
        title: "Message Sent!",
        text: "Your message has been send successfully...",
        icon: "success",
        iconColor: "green",
        showConfirmButton: false,
        timer: 2000,
      });

      setformData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("error in sunbmitting the contact message: ", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to send message. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-30 bg-gray-50  xl:py-25  2xl:py-40 dark:bg-gray-900/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-black text-white px-3 py-1 text-sm dark:bg-indigo-950/40 dark:text-indigo-400">
              Contact Us
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white md:text-4xl lg:text-5xl">
              Get in Touch
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground dark:text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Have questions about our CRM solution? Our team is here to help.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-2xl font-semibold leading-none tracking-tight text-black dark:text-white">
              Send us a message
            </h3>
            <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">
              Fill out the form below and we'll get back to you as soon as
              possible.
            </p>
            <form className="grid gap-4 mt-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-black dark:text-white"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-indigo-500"
                />
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-black dark:text-white"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-indigo-500"
                />
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="subject"
                  className="text-sm font-medium text-black dark:text-white"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter the subject"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-indigo-500"
                />
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-black dark:text-white"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Enter your message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-indigo-500 min-h-[140px]"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md text-lg font-medium hover:bg-gray-900  dark:bg-gradient-to-r dark:from-indigo-500 dark:to-purple-500 
                          dark:hover:from-indigo-600 dark:hover:to-purple-600 
                          dark:hover:text-white transition"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Office Address */}
            <div className="bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md rounded-lg p-6 flex items-start gap-4">
              <LuMapPin className="h-6 w-6 text-black dark:text-white" />
              <div>
                <h3 className="font-medium text-lg text-black dark:text-white">Our Office</h3>
                <p className="text-gray-600  dark:text-gray-300 text-sm mt-1">
                  123 Business Avenue, Suite 500
                  <br />
                  San Francisco, CA 94107
                </p>
              </div>
            </div>

            {/* Email Address */}
            <div className="bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md rounded-lg p-6 flex items-start gap-4">
              <LuMail className="h-6 w-6 text-black dark:text-white" />
              <div>
                <h3 className="font-medium text-lg text-black dark:text-white">Email Us</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  info@GrowCRM.com
                  <br />
                  support@GrowCRM.com
                </p>
              </div>
            </div>

            {/* Phone Number */}
            <div className="bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md rounded-lg p-6 flex items-start gap-4">
              <LuPhone className="h-6 w-6 text-black dark:text-white" />
              <div>
                <h3 className="font-medium text-lg text-black dark:text-white">Call Us</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  +91 8849286008
                  <br />
                  Mon-Fri, 9 AM - 5 PM
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md rounded-lg p-6 flex items-start gap-4">
              {/* Customer Rating Information */}
              <LuStar className="h-6 w-6 text-black dark:text-white" /> {/* Star Icon next to the title */}
              <div>
                <h3 className="font-medium text-lg text-black dark:text-white">Customer Rating</h3>
                <div className="flex items-center gap-2">

                  <div className="flex">
                    {/* You can replace this with actual star icons or images */}
                    {[...Array(5)].map((_, index) => (
                      <span key={index} className="text-yellow-500">
                        &#9733; {/* Star Icon (Unicode) */}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">(4.5/5)</span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Our customers have rated us 4.5/5 based on 120 reviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
