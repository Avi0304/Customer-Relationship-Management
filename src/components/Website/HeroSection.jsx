import React from "react";
import { Link } from "react-router-dom";
import hero from "./assets/hero.png";
import { LuArrowRight } from "react-icons/lu";

const HeroSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-25 xl:py-15">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
          {/* Text Content */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-black font-black tracking-tighter sm:text-5xl xl:text-6xl">
                Streamline Your Business with Our Powerful CRM Solution
              </h1>
              <p className="max-w-[600px] text-gray-600 md:text-xl">
                Manage customers, track sales, and grow your business with our
                all-in-one CRM platform. Designed for businesses of all sizes.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                to="/login"
                className="flex items-center gap-2 bg-black text-white text-lg font-medium px-6 py-3 rounded-lg shadow-md hover:bg-black hover:transition"
              >
                Get Started
                <LuArrowRight size={23} />
              </Link>

              {/* <Link
                                href="#demo"
                                className="border border-gray-300 text-gray-700 text-lg font-medium px-6 py-3 rounded-lg shadow-md hover:bg-gray-200 transition"
                            >
                                Request Demo
                            </Link> */}
            </div>
          </div>

          <img
            src={hero}
            alt="CRM Dashboard"
            className="mx-auto w-full max-w-[700px] h-auto rounded-xl object-contain mt-7"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
