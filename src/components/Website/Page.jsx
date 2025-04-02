import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import HeroSection from './HeroSection';
import FeatureSection from './FeatureSection';
import SolutionSection from './SolutionSection';
import PowerfulDash from './PowerfulDash';
import { TestimonialSection } from './TestimonialSection';
import Footer from './Footer';
// import { LineChart } from '@mui/icons-material'; // Importing Line Chart Icon

const Page = () => {
    return (
        <div className="flex min-h-screen flex-col">
            {/* Header Section */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-300 bg-white/95 backdrop-blur">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                    
                    {/* Logo with LineChart Icon */}
                    <div className="flex items-center gap-2">
                        {/* <LineChart className="h-6 w-6 text-black" /> */}
                        <span className="text-2xl font-bold">GrowCRM</span>
                    </div>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="#features" className="text-sm font-medium text-gray-700 hover:underline">
                            Features
                        </Link>
                        <Link to="#testimonials" className="text-sm font-medium text-gray-700 hover:underline">
                            Testimonials
                        </Link>
                        <Link to="#pricing" className="text-sm font-medium text-gray-700 hover:underline">
                            Pricing
                        </Link>
                        <Link to="#contact" className="text-sm font-medium text-gray-700 hover:underline">
                            Contact
                        </Link>
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
                <HeroSection/>
                <FeatureSection/>
                <SolutionSection/>
                <PowerfulDash/>
                <TestimonialSection/>
            </main>

            <footer>
                <Footer/>
            </footer>
        </div>
    );
};

export default Page;
