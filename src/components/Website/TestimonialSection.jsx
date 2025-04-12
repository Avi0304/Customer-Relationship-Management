import React, { useState, useEffect } from "react";
import { FaQuoteRight } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    text: "This CRM has transformed how we manage our customer relationships. The dashboard gives us instant insights, and the task management keeps our team organized.",
    name: "Sarah Johnson",
    position: "CEO, TechSolutions Inc.",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    text: "The lead management feature has increased our conversion rate by 40%. We can now track every interaction and follow up at the right time.",
    name: "Michael Brown",
    position: "Sales Director, Global Enterprises",
    img: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    id: 3,
    text: "The appointment scheduling feature has eliminated the back-and-forth emails. Our clients love the seamless experience.",
    name: "Emily Davis",
    position: "Customer Success Manager, Retail Solutions",
    img: "https://randomuser.me/api/portraits/women/14.jpg",
  },
  {
    id: 4,
    text: "Using this CRM has helped our sales team close deals faster, and the reporting system provides insights that have guided our business decisions.",
    name: "John Smith",
    position: "Sales Manager, FastTrack Logistics",
    img: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 5,
    text: "I can't imagine running our operations without this CRM. It integrates well with our existing tools, and the customer support is top-notch.",
    name: "Alice Walker",
    position: "Operations Manager, GreenTech",
    img: "https://randomuser.me/api/portraits/women/25.jpg",
  },
  {
    id: 6,
    text: "The integration with our email system has streamlined our communications and saved us countless hours each week.",
    name: "James Wilson",
    position: "Marketing Director, DigiMarketing",
    img: "https://randomuser.me/api/portraits/men/15.jpg",
  },
];

export function TestimonialSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const testimonialsPerPage = 3;

  // Get the testimonials for the current page
  const currentTestimonials = testimonials.slice(
    currentPage * testimonialsPerPage,
    (currentPage + 1) * testimonialsPerPage
  );

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if ((currentPage + 1) * testimonialsPerPage < testimonials.length) {
        setCurrentPage(currentPage + 1);
      } else {
        setCurrentPage(0); // Reset to the first page when reaching the last set
      }
    }, 5000); // Change testimonials every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [currentPage]);

  return (
    <section
      id="testimonials"
      className="w-full py-12 md:py-24 lg:py-20 xl:py-20 2xl:py-20 dark:bg-gray-900/60"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Heading Section */}
        <div className="text-center space-y-4">
          <div className="inline-block rounded-full bg-black dark:bg-indigo-950/40 dark:text-indigo-400 px-3 py-1 text-sm text-white">
            Testimonials
          </div>
          <h2 className="text-3xl font-bold text-black dark:text-white tracking-tight md:text-4xl lg:text-5xl">
            Trusted by Businesses Worldwide
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 md:text-lg dark:text-gray-300">
            See what our customers have to say about our CRM solution.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
          {currentTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-lg bg-white p-6 shadow-lg flex flex-col h-full transition-transform transform hover:scale-105 hover:shadow-2xl dark:bg-gray-800 dark:border-gray-700"
              style={{ minHeight: "340px" }} // Set a minimum height for uniform card size
            >
              <div className="flex flex-col gap-4 flex-grow">
                <FaQuoteRight
                  size={30}
                  className="text-black dark:text-gray-200"
                />
                <p className="text-lg text-gray-800 dark:text-gray-300">
                  {testimonial.text}
                </p>
              </div>
              <div className="flex items-center gap-4 mt-6">
                <img
                  src={testimonial.img}
                  alt={testimonial.name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {testimonial.position}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
