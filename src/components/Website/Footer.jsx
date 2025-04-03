import React from "react";
import { FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-300 bg-gray-100">
      <div className="container mx-auto flex flex-col gap-8 py-8 md:py-12 lg:py-16 px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-20">
          {/* Logo and Description */}
          <div className="flex flex-col gap-4 lg:w-1/3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">GrowCRM</span>
            </div>
            <p className="text-sm text-gray-600">
              The all-in-one CRM solution for businesses of all sizes. Manage customers, track sales, and grow your
              business.
            </p>
          </div>

          {/* Footer Navigation */}
          <div className="grid flex-1 grid-cols-2 gap-10 sm:grid-cols-4">
            {[
              { title: "Product", links: ["features", "pricing", "integrations", "updates"] },
              { title: "Company", links: ["about", "blog", "careers", "press"] },
              { title: "Resources", links: ["documentation", "help-center", "guides", "api"] },
              { title: "Legal", links: ["privacy", "terms", "security", "cookies"] },
            ].map((section, index) => (
              <div key={index} className="flex flex-col gap-2">
                <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                <nav className="flex flex-col gap-2">
                  {section.links.map((link, idx) => (
                    <Link key={idx} to={`/${link}`} className="text-sm text-gray-600 hover:underline">
                      {link.charAt(0).toUpperCase() + link.slice(1)}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} GrowCRM. All rights reserved.</p>
          <div className="flex gap-4">
            {[
              { name: "Twitter", to: "/twitter", icon: <FaTwitter className="h-6 w-6" /> },
              { name: "LinkedIn", to: "/linkedin", icon: <FaLinkedin className="h-6 w-6" /> },
              { name: "Facebook", to: "/facebook", icon: <FaFacebook className="h-6 w-6" /> },
            ].map((social, idx) => (
              <Link key={idx} to={social.to} className="text-gray-600 hover:text-gray-900 transition">
                <span className="sr-only">{social.name}</span>
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
