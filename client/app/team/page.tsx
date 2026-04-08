"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Linkedin, Globe, Facebook, Loader2 } from "lucide-react";

interface TeamMember {
    _id: string;
    name: string;
    role: string;
    location: string;
    image: string;
    socials: {
        instagram?: string;
        linkedin?: string;
        twitter?: string;
        facebook?: string;
    };
}

const locations = ["All Volunteers", "Khirsain", "Bagleka", "Sanagaun", "Pokhari", "Gajari", "Gairagaun", "Kadamandu"];

export default function TeamPage() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All Volunteers");

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await fetch("/api/volunteers");
                const data = await res.json();
                setTeamMembers(data);
            } catch (err) {
                console.error("Failed to fetch team:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    const filteredMembers = activeFilter === "All Volunteers"
        ? teamMembers
        : teamMembers.filter(member => member.location === activeFilter);

    return (
        <main className="min-h-screen bg-white text-black pt-24 pb-20 font-sans overflow-x-hidden">
            {/* Volunteer for the Cause - Professional Redesign based on User Specification */}
            <section
                className="section block box-border bg-white overflow-hidden relative"
                style={{
                    WebkitTextSizeAdjust: "100%",
                    fontSize: "15px",
                    color: "var(--grayscale--gray-1)",
                    fontFamily: "Poppins, sans-serif",
                    lineHeight: "160%",
                    "--grayscale--gray-1": "#2c3035",
                    "--colors--accent": "#2ea0c5",
                    "--grayscale--gray-2": "#4c5157",
                    "--colors--accent-tint": "#e8f0fd",
                    "--grayscale--gray-4": "#bac1ca",
                    "--shadow": "rgba(44,49,54,.25)",
                    "--plum-tint": "#ffeff8",
                    "--plum": "#ffa9d9",
                    "--gold": "#ffcb3b",
                    "--spring-green": "#4dd78a",
                    "--tb-padding-l": "72px",
                    "--tb-padding-s": "48px",
                    "--grayscale--gray-3": "#818a92",
                    "--gap-l": "48px",
                    "--gap-s": "24px",
                    "--grayscale--white": "white",
                    "--border-radius-l": "24px",
                    "--grayscale--gray-5": "#edeff3",
                    "--grayscale--black": "#14181f",
                    "--grayscale--gray-6": "#f3f6fc",
                } as React.CSSProperties}
            >
                <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-12 px-6 py-12 md:flex-row md:px-10 lg:px-[72px] lg:py-[72px] bg-white">
                    {/* Left Column (Hero Text Content) */}
                    <div className="relative w-full max-w-[600px] z-10 flex flex-col">
                        <div
                            className="inline-block px-5 py-2 mb-9 rounded-full text-sm font-bold uppercase tracking-widest w-fit"
                            style={{
                                color: "var(--grayscale--black)",

                            }}
                        >
                            Volunteer for the cause
                        </div>

                        <div className="relative">
                            <motion.h1
                                className="relative z-10 mb-8 text-5xl md:text-7xl font-black leading-[1.1] tracking-[-0.04em] pr-12"
                                style={{ color: "var(--grayscale--black)" }}
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.02,
                                        },
                                    },
                                }}
                            >
                                {"Start giving back to the community today!"
                                    .split(" ")
                                    .map((word, wordIndex) => (
                                        <span key={wordIndex} className="inline-block whitespace-nowrap">
                                            {word.split("").map((char, charIndex) => (
                                                <motion.span
                                                    key={charIndex}
                                                    variants={{
                                                        hidden: { opacity: 0, y: 20 },
                                                        visible: { opacity: 1, y: 0 },
                                                    }}
                                                    transition={{
                                                        type: "spring",
                                                        damping: 12,
                                                        stiffness: 200,
                                                    }}
                                                    className="inline-block"
                                                >
                                                    {char}
                                                </motion.span>
                                            ))}
                                            <span className="inline-block">&nbsp;</span>
                                        </span>
                                    ))}
                            </motion.h1>

                            {/* Pink Ellipse Asset - Layered behind Heading */}
                            <img
                                src="https://cdn.prod.website-files.com/64e379f5c8606ea47c3e346c/64eed5c09a45452fb1c2b612_pink_ellipse.svg"
                                alt=""
                                className="absolute -left-25 -top-8 -z-10 w-35 h-35 opacity-90 pointer-events-none transition-transform duration-700 hover:scale-110"
                            />

                            {/* Green Ellipse Asset - Layered between Headings */}
                            <img
                                src="https://cdn.prod.website-files.com/64e379f5c8606ea47c3e346c/64eed5c0c3b6732ca12b34fa_green_ellipse.svg"
                                alt=""
                                className="absolute left-[60%] bottom-[-40px] -z-10 w-36 h-36 opacity-90 pointer-events-none"
                            />
                        </div>

                        {/* Custom SVG Underline */}
                        <img
                            src="https://cdn.prod.website-files.com/64e379f5c8606ea47c3e346c/64eed5c145b217c3c3cee33b_Underline%204.svg"
                            alt=""
                            className="mb-8 w-48"
                        />

                        <p
                            className="mb-10 max-w-[500px] text-lg font-medium leading-[1.6]"
                            style={{ color: "var(--grayscale--gray-2)" }}
                        >
                            Together, we shape a narrative of shared responsibility, building bridges and transforming challenges into opportunities.
                        </p>

                        <Link
                            href="/volunteer"
                            className="relative w-fit inline-flex items-center justify-center px-12 py-5 rounded-[10px] shadow-2xl transition-all overflow-hidden group/btn cursor-pointer bg-[#f0fdf4] border border-green-100 hover:shadow-green-200/50"
                        >
                            <img 
                                src="/green_ellipse.svg" 
                                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/btn:scale-125 transition-transform duration-700 pointer-events-none" 
                                alt="" 
                            />
                            <div className="relative z-10">
                                <span className="text-xl font-black tracking-tight whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-[#059669] via-[#062a24] to-[#059669] bg-[length:200%_auto] bg-left hover:bg-right transition-all duration-700">
                                    Apply now For Volunteer
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Right Column (Hero Image with Mask) */}
                    <div className="relative w-full max-w-[600px] flex justify-center lg:justify-end">
                        <div className="relative w-[380px] h-[380px] md:w-[600px] md:h-[600px] rounded-[48px] overflow-hidden group">
                            {/* Main Community Photo */}
                            <img
                                src="/volunteer_community_hero.png"
                                alt="Community volunteers"
                                className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Mask Layer - Precise SVG Overlay */}
                            <img
                                src="https://cdn.prod.website-files.com/64e379f5c8606ea47c3e346c/6532151ee33609d9a0c92025_mask_hero_home.svg"
                                alt=""
                                className="absolute inset-0 z-20 w-full h-full object-cover pointer-events-none"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter Navigation */}
            <div className="max-w-7xl mx-auto px-8 md:px-20 lg:px-32">
                <nav className="flex items-center gap-8 border-b border-gray-100 pb-4 mb-12 overflow-x-auto no-scrollbar">
                    {locations.map((loc) => (
                        <button
                            key={loc}
                            onClick={() => setActiveFilter(loc)}
                            className={`text-sm font-bold tracking-wide whitespace-nowrap transition-all relative pb-4 ${activeFilter === loc ? "text-black" : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            {loc}
                            {activeFilter === loc && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-600"
                                />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Team Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
                        <p className="text-gray-400 tracking-widest uppercase text-xs font-bold">Loading Team...</p>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredMembers.map((member) => (
                                <motion.div
                                    key={member._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative group aspect-[3/4] rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
                                >
                                    {/* Image Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                                    {/* Member Image */}
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                    />

                                    {/* Bottom Content Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex justify-between items-end">
                                        <div className="flex items-center gap-4 text-white">
                                            {/* Decorative Red Icon */}
                                            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
                                                <Globe className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black tracking-tighter leading-none mb-1">
                                                    {member.name}
                                                </h3>
                                                <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">
                                                    {member.role}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Socials Overlay Bottom Right */}
                                        <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 text-white">
                                            {member.socials.facebook && (
                                                <a href={member.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors">
                                                    <Facebook className="w-5 h-5" />
                                                </a>
                                            )}
                                            {member.socials.instagram && (
                                                <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
                                                    <Instagram className="w-5 h-5" />
                                                </a>
                                            )}
                                            {member.socials.linkedin && (
                                                <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                                                    <Linkedin className="w-5 h-5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
