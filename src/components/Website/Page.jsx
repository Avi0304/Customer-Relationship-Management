import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import HeroSection from './HeroSection';
import FeatureSection from './FeatureSection';
import SolutionSection from './SolutionSection';
import PowerfulDash from './PowerfulDash';
import { TestimonialSection } from './TestimonialSection';
import Footer from './Footer';
import ContactSection from './ContactSection';
// import { BiLineChart } from "react-icons/bi";

const Page = () => {

    const navigate = useNavigate();

    const handleScroll = (sectionID) => {
        const section = document.getElementById(sectionID);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' })
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            {/* Header Section */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-300 bg-white/95 backdrop-blur">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">

                    {/* Logo with LineChart Icon */}
                    <div className="flex items-center gap-2">
                        {/* <BiLineChart className="h-6 w-6 text-black" /> */}
                        <span className="text-2xl font-bold text-black">GrowCRM</span>
                    </div>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center gap-6">
                        <button className="text-sm font-medium text-gray-700 hover:underline" onClick={() => handleScroll('features')}>
                            Features
                        </button>
                        <button className="text-sm font-medium text-gray-700 hover:underline" onClick={() => handleScroll('Solutions')}>
                            Solutions
                        </button>
                        <button className="text-sm font-medium text-gray-700 hover:underline" onClick={() => handleScroll('Testimonials')}>
                            Testimonials
                        </button>
                        <button className="text-sm font-medium text-gray-700 hover:underline" onClick={() => handleScroll('Contact')}>
                            Contact
                        </button>
                    </nav>

                    {/* Buttons */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outlined"
                            className="hidden md:inline-flex"
                            sx={{
                                color: 'black',
                                borderColor: 'lightgray',
                                '&:hover': { borderColor: 'black', color: 'black' },
                                textTransform: 'capitalize'
                            }}
                        >
                            <Link to="/login" className="text-black">Log in</Link>
                        </Button>

                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: 'black',
                                '&:hover': { backgroundColor: '#333' },
                                textTransform: 'capitalize'
                            }}
                        >
                            <Link to="/signup" className="text-white">Sign up</Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <HeroSection />
                <div id="features"><FeatureSection /></div>
                <div id="Solutions"><SolutionSection /></div>
                <div><PowerfulDash /></div>
                <div id="Testimonials"><TestimonialSection /></div>
                <div id="Contact"><ContactSection /></div>
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
};

export default Page;
