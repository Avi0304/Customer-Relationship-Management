import React from "react";
import { FaQuoteRight } from "react-icons/fa";

export function TestimonialSection() {
  return (
    <section
      id="testimonials"
      className="w-full py-12 md:py-24 lg:py-25 xl:py-25"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Heading Section */}
        <div className="text-center space-y-4">
          <div className="inline-block rounded-lg bg-black px-3 py-1 text-sm text-white">
            Testimonials
          </div>
          <h2 className="text-3xl font-bold text-black tracking-tight md:text-4xl lg:text-5xl">
            Trusted by Businesses Worldwide
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 md:text-lg">
            See what our customers have to say about our CRM solution.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-lg bg-white p-6 shadow-lg flex flex-col h-full">
            <div className="flex flex-col gap-4 flex-grow">
              <FaQuoteRight size={30} className="text-black" />
              <p className="text-lg text-gray-800">
                "This CRM has transformed how we manage our customer
                relationships. The dashboard gives us instant insights, and the
                task management keeps our team organized."
              </p>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Sarah Johnson"
                className="h-10 w-10 rounded-full"
              />
              <div>
                <h3 className="font-medium text-gray-900">Sarah Johnson</h3>
                <p className="text-sm text-gray-500">CEO, TechSolutions Inc.</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-lg bg-white p-6 shadow-lg flex flex-col h-full">
            <div className="flex flex-col gap-4 flex-grow">
              <FaQuoteRight size={30} className="text-black" />
              <p className="text-lg text-gray-800">
                "The lead management feature has increased our conversion rate
                by 40%. We can now track every interaction and follow up at the
                right time."
              </p>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <img
                src="https://randomuser.me/api/portraits/men/44.jpg"
                alt="Michael Brown"
                className="h-10 w-10 rounded-full"
              />
              <div>
                <h3 className="font-medium text-gray-900">Michael Brown</h3>
                <p className="text-sm text-gray-500">
                  Sales Director, Global Enterprises
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-lg bg-white p-6 shadow-lg flex flex-col h-full">
            <div className="flex flex-col gap-4 flex-grow">
              <FaQuoteRight size={30} className="text-black" />
              <p className="text-lg text-gray-800">
                "The appointment scheduling feature has eliminated the
                back-and-forth emails. Our clients love the seamless
                experience."
              </p>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <img
                src="https://randomuser.me/api/portraits/women/14.jpg"
                alt="Emily Davis"
                className="h-10 w-10 rounded-full"
              />
              <div>
                <h3 className="font-medium text-gray-900">Emily Davis</h3>
                <p className="text-sm text-gray-500">
                  Customer Success Manager, Retail Solutions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
