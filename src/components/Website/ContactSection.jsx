import React from 'react';
import { LuMapPin, LuMail, LuPhone } from "react-icons/lu";

function ContactSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-30 bg-gray-50">
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="space-y-2">
          <div className="inline-block rounded-lg bg-black text-white px-3 py-1 text-sm">
            Contact Us
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-black md:text-4xl lg:text-5xl">
            Get in Touch
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Have questions about our CRM solution? Our team is here to help.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
        {/* Contact Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight text-black">Send us a message</h3>
          <p className="text-gray-500 text-sm mt-1">
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
          <form className="grid gap-4 mt-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium text-black">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium text-black">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="subject" className="text-sm font-medium text-black">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                placeholder="Enter the subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="message" className="text-sm font-medium text-black">
                Message
              </label>
              <textarea
                id="message"
                placeholder="Enter your message"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black min-h-[140px]"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md text-lg font-medium hover:bg-gray-900 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          {/* Office Address */}
          <div className="bg-white shadow-md rounded-lg p-6 flex items-start gap-4">
            <LuMapPin className="h-6 w-6 text-black" />
            <div>
              <h3 className="font-medium text-lg text-black">Our Office</h3>
              <p className="text-gray-600 text-sm mt-1">
                123 Business Avenue, Suite 500
                <br />
                San Francisco, CA 94107
              </p>
            </div>
          </div>

          {/* Email Address */}
          <div className="bg-white shadow-md rounded-lg p-6 flex items-start gap-4">
            <LuMail className="h-6 w-6 text-black" />
            <div>
              <h3 className="font-medium text-lg text-black">Email Us</h3>
              <p className="text-gray-600 text-sm mt-1">
                info@GrowCRM.com
                <br />
                support@GrowCRM.com
              </p>
            </div>
          </div>

          {/* Phone Number */}
          <div className="bg-white shadow-md rounded-lg p-6 flex items-start gap-4">
            <LuPhone className="h-6 w-6 text-black" />
            <div>
              <h3 className="font-medium text-lg text-black">Call Us</h3>
              <p className="text-gray-600 text-sm mt-1">
                +91 8849286008
                <br />
                Mon-Fri, 9 AM - 5 PM 
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default ContactSection