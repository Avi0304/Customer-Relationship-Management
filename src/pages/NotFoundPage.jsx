import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";

export default function ErrorPage() {

    const navigate = useNavigate();

    const handleback = async () => {
        navigate(-1);
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-200">
            <div className="max-w-4xl w-full text-center">
                <div className="relative h-64 md:h-80 mb-12">
                    {/* Background 403 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-[180px] md:text-[250px] font-black text-slate-300/90 select-none">403</div>
                    </div>

                    {/* Door Illustration */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative h-44 w-24 md:h-52 md:w-28 bg-white border-4 border-indigo-800 rounded-t-full shadow-md mx-auto">
                            <div className="absolute right-2 top-1/2 h-3 w-3 border-2 border-indigo-800 rounded-full bg-white"></div>
                            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 h-10 w-10 border-2 border-indigo-800 rounded-full">
                                <div className="absolute inset-1 border border-indigo-800 rounded-full"></div>
                            </div>
                            <div className="absolute top-28 md:top-32 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-indigo-800 text-white text-xs font-medium rounded-sm shadow">
                                CLOSED
                            </div>
                        </div>

                        {/* Person Sitting */}
                        <div className="absolute top-50 left-1/5 transform -translate-x-1/2">
                            <svg viewBox="0 0 200 320" width="100" height="180" xmlns="http://www.w3.org/2000/svg">
                                {/* Head */}
                                <circle cx="100" cy="50" r="28" fill="#fcd5b4" stroke="#e2b48c" strokeWidth="1.5" />

                                {/* Hair */}
                                <path d="M72 45 Q100 5 128 45 Q118 15 82 15 Q72 30 72 45" fill="#1f2937" />

                                {/* Eyes */}
                                <circle cx="88" cy="48" r="3" fill="#1f2937" />
                                <circle cx="112" cy="48" r="3" fill="#1f2937" />

                                {/* Nose */}
                                <path d="M99 52 Q100 56 101 52" stroke="#cc9c78" strokeWidth="1.2" />

                                {/* Mouth */}
                                <path d="M88 64 Q100 70 112 64" stroke="#e11d48" strokeWidth="2" fill="none" />

                                {/* Neck */}
                                <rect x="90" y="75" width="20" height="12" rx="3" fill="#fcd5b4" />

                                {/* New Shirt with Collar (changed style) */}
                                <path d="M70 85 Q100 95 130 85 Q135 120 130 165 Q100 180 70 165 Q65 120 70 85" fill="#ef4444" />
                                <polygon points="100,85 110,105 90,105" fill="#fef2f2" /> {/* New Collar */}

                                {/* New Sleeves */}
                                <path d="M55 95 Q50 120 55 140 Q60 145 65 140 Q70 120 65 95 Z" fill="#ef4444" />
                                <path d="M145 95 Q150 120 145 140 Q140 145 135 140 Q130 120 135 95 Z" fill="#ef4444" />

                                {/* Arms */}
                                <path d="M53 140 Q55 160 60 160 Q65 160 67 140" fill="#fcd5b4" />
                                <path d="M147 140 Q145 160 140 160 Q135 160 133 140" fill="#fcd5b4" />

                                {/* New Pants (Changed Style - Different color) */}
                                <rect x="75" y="165" width="20" height="95" rx="5" fill="#6b7280" />
                                <rect x="105" y="165" width="20" height="95" rx="5" fill="#6b7280" />

                                {/* Shoes */}
                                <rect x="72" y="260" width="26" height="10" rx="3" fill="#0f172a" />
                                <rect x="102" y="260" width="26" height="10" rx="3" fill="#0f172a" />

                                {/* Shadow */}
                                <ellipse cx="100" cy="300" rx="50" ry="8" fill="rgba(0, 0, 0, 0.1)" />
                            </svg>
                        </div>


                        {/* Person Standing */}
                        {/* Human SVG with Even Legs */}
                        <div className="absolute bottom-0 right-1/5 transform translate-x-1/2 scale-90">
                            <svg viewBox="0 0 200 320" width="100" height="180" xmlns="http://www.w3.org/2000/svg">
                                {/* Head */}
                                <circle cx="100" cy="50" r="28" fill="#fcd5b4" stroke="#e2b48c" strokeWidth="1.5" />

                                {/* Hair */}
                                <path d="M72 45 Q100 5 128 45 Q118 15 82 15 Q72 30 72 45" fill="#1f2937" />

                                {/* Eyes */}
                                <circle cx="88" cy="48" r="3" fill="#1f2937" />
                                <circle cx="112" cy="48" r="3" fill="#1f2937" />

                                {/* Nose */}
                                <path d="M99 52 Q100 56 101 52" stroke="#cc9c78" strokeWidth="1.2" />

                                {/* Mouth */}
                                <path d="M88 64 Q100 70 112 64" stroke="#e11d48" strokeWidth="2" fill="none" />

                                {/* Neck */}
                                <rect x="90" y="75" width="20" height="12" rx="3" fill="#fcd5b4" />

                                {/* Shirt with collar */}
                                <path d="M70 85 Q100 95 130 85 Q135 130 130 165 Q100 180 70 165 Q65 130 70 85" fill="#6366f1" />
                                <polygon points="100,85 110,105 90,105" fill="#dbeafe" />

                                {/* Sleeves */}
                                <path d="M55 95 Q50 120 55 140 Q60 145 65 140 Q70 120 65 95 Z" fill="#6366f1" />
                                <path d="M145 95 Q150 120 145 140 Q140 145 135 140 Q130 120 135 95 Z" fill="#6366f1" />

                                {/* Arms */}
                                <path d="M53 140 Q55 160 60 160 Q65 160 67 140" fill="#fcd5b4" />
                                <path d="M147 140 Q145 160 140 160 Q135 160 133 140" fill="#fcd5b4" />

                                {/* Pants - Legs even and solid */}
                                <rect x="75" y="165" width="20" height="95" rx="5" fill="#1e3a8a" />
                                <rect x="105" y="165" width="20" height="95" rx="5" fill="#1e3a8a" />

                                {/* Shoes */}
                                <rect x="72" y="260" width="26" height="10" rx="3" fill="#0f172a" />
                                <rect x="102" y="260" width="26" height="10" rx="3" fill="#0f172a" />

                                {/* Shadow */}
                                <ellipse cx="100" cy="300" rx="50" ry="8" fill="rgba(0, 0, 0, 0.1)" />
                            </svg>
                        </div>


                        {/* Decorative SVG */}
                        <div className="absolute top-10 left-10 text-slate-300 rotate-[-12deg]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M5 9L19 3L15 20L12 12L5 9Z" />
                            </svg>
                        </div>
                        <div className="absolute bottom-10 right-10 text-slate-300">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 3C7.5 3 9 4.5 9 6C9 7.5 7.5 9 6 9C4.5 9 3 7.5 3 6C3 4.5 4.5 3 6 3ZM18 3C19.5 3 21 4.5 21 6C21 7.5 19.5 9 18 9C16.5 9 15 7.5 15 6C15 4.5 16.5 3 18 3ZM6 15C7.5 15 9 16.5 9 18C9 19.5 7.5 21 6 21C4.5 21 3 19.5 3 18C3 16.5 4.5 15 6 15ZM18 15C19.5 15 21 16.5 21 18C21 19.5 19.5 21 18 21C16.5 21 15 19.5 15 18C15 16.5 16.5 15 18 15Z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-slate-300 mb-10" />

                {/* Heading & Message */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-4">Oops! Access Denied</h1>
                <p className="text-slate-600 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                    You don’t have permission to view this page. If you think this is a mistake, please contact your system administrator.
                </p>

                {/* Back Button */}
                <button
                    onClick={handleback}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-full shadow-md transition-all duration-200"
                >
                    <LuArrowLeft className="w-5 h-5" />
                    Go Back
                </button>
            </div>
        </div>
    );
}
