import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import HeroSection from "./HeroSection";
import FeatureSection from "./FeatureSection";
import SolutionSection from "./SolutionSection";
import PowerfulDash from "./PowerfulDash";
import { TestimonialSection } from "./TestimonialSection";
import Footer from "./Footer";
import ContactSection from "./ContactSection";
import { ThemeContext } from "../../context/ThemeContext";
import { useTheme } from "@mui/material/styles";
import ThemeToggle from "../ThemeToggle";
import ThemeSwitch from "./ThemeSwitch";

const Page = () => {
  const navigate = useNavigate();
  const { mode } = useContext(ThemeContext);
  const theme = useTheme();

  const [activeSection, setActiveSection] = useState("");

  // Handle scroll behavior
  const handleScroll = (sectionID) => {
    const section = document.getElementById(sectionID);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Listen for scroll events and update the active section
  const handleScrollEvent = () => {
    const sections = ["features", "Solutions", "Testimonials", "Contact"];
    let currentSection = "";
    sections.forEach((sectionID) => {
      const section = document.getElementById(sectionID);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 0 && rect.bottom >= 0) {
          currentSection = sectionID;
        }
      }
    });
    setActiveSection(currentSection);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScrollEvent);
    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, []);

  return (
    <div className="flex min-h-screen dark:bg-gray-900 flex-col">
      {/* Header Section */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="ml-2 text-2xl font-bold text-black dark:text-transparent dark:bg-gradient-to-r dark:from-indigo-400 dark:to-purple-400 dark:bg-clip-text">
              GrowCRM
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              className={`text-base font-medium ${
                activeSection === "features"
                  ? "text-black dark:text-indigo-400"
                  : "text-gray-700 dark:text-gray-300"
              } hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors`}
              onClick={() => handleScroll("features")}
            >
              Features
            </button>

            <button
              className={`text-base font-medium ${
                activeSection === "Solutions"
                  ? "text-black dark:text-indigo-400"
                  : "text-gray-700 dark:text-gray-300"
              } hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors`}
              onClick={() => handleScroll("Solutions")}
            >
              Solutions
            </button>
            <button
              className={`text-base font-medium ${
                activeSection === "Testimonials"
                  ? "text-black dark:text-indigo-400"
                  : "text-gray-700 dark:text-gray-300"
              } hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors`}
              onClick={() => handleScroll("Testimonials")}
            >
              Testimonials
            </button>
            <button
              className={`text-base font-medium ${
                activeSection === "Contact"
                  ? "text-black dark:text-indigo-400"
                  : "text-gray-700 dark:text-gray-300"
              } hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors`}
              onClick={() => handleScroll("Contact")}
            >
              Contact
            </button>
          </nav>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <ThemeSwitch />
            <Button
              variant="outlined"
              className="hidden md:inline-flex"
              sx={{
                color: mode === "dark" ? "#ffffff" : "black",
                backgroundColor: mode === "dark" ? "#1F2937" : "#F3F4F6",
                borderColor: mode === "dark" ? "transparent" : "lightgray",
                textTransform: "capitalize",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: mode === "dark" ? "#374151" : "#E5E7EB",
                  color: "black",
                  borderColor: "black",
                },
              }}
            >
              <Link
                to="/login"
                style={{
                  color: mode === "dark" ? "#ffffff" : "inherit",
                  textDecoration: "none",
                }}
              >
                Log in
              </Link>
            </Button>

            <Button
              variant="contained"
              sx={{
                background: theme.palette.point3,
                color: mode === "light" ? "white" : "white",
                textTransform: "capitalize",
                border: "1px solid transparent",
                borderRadius: "0.375rem",
                transition: "all 0.3s ease",
                boxShadow:
                  mode === "light" ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
                "&:hover": {
                  background: mode === "light" ? "#1a1a1a" : "#7c3aed",
                  color: "white",
                },
              }}
            >
              <Link
                to="/signup"
                style={{
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Sign up
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <HeroSection />
        <div id="features">
          <FeatureSection />
        </div>
        <div id="Solutions">
          <SolutionSection />
        </div>
        <div>
          <PowerfulDash />
        </div>
        <div id="Testimonials">
          <TestimonialSection />
        </div>
        <div id="Contact">
          <ContactSection />
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Page;
