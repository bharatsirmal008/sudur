"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Linkedin, Twitter, Globe, Facebook, Loader2 } from "lucide-react";

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
        <main className="min-h-screen bg-black text-white pt-24 pb-20 px-6 md:px-12 font-sans">
            {/* Filter Navigation */}
            <nav className="flex items-center gap-8 border-b border-gray-900 pb-4 mb-12 overflow-x-auto no-scrollbar">
                {locations.map((loc) => (
                    <button
                        key={loc}
                        onClick={() => setActiveFilter(loc)}
                        className={`text-sm font-semibold tracking-wide whitespace-nowrap transition-all relative pb-4 ${activeFilter === loc ? "text-white" : "text-gray-500 hover:text-gray-300"
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
                    <p className="text-gray-500 tracking-widest uppercase text-xs">Loading Team...</p>
                </div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                                className="relative group aspect-[3/4] rounded-2xl overflow-hidden bg-gray-900 shadow-2xl"
                            >
                                {/* Image Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 opacity-80" />

                                {/* Member Image */}
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                />

                                {/* Bottom Content Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex justify-between items-end">
                                    <div className="flex items-center gap-4">
                                        {/* Decorative Red Icon (from reference) */}
                                        <div className="w-10 h-10 rounded-lg bg-red-600/20 backdrop-blur-md flex items-center justify-center border border-red-600/30">
                                            <Globe className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black tracking-tighter leading-none mb-1">
                                                {member.name}
                                            </h3>
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                                {member.role}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Socials Overlay Bottom Right */}
                                    <div className="flex gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                        {member.socials.facebook && (
                                            <a href={member.socials.facebook} className="hover:text-red-600 transition-colors">
                                                <Facebook className="w-4 h-4" />
                                            </a>
                                        )}
                                        {member.socials.instagram && (
                                            <a href={member.socials.instagram} className="hover:text-red-600 transition-colors">
                                                <Instagram className="w-4 h-4" />
                                            </a>
                                        )}
                                        {member.socials.linkedin && (
                                            <a href={member.socials.linkedin} className="hover:text-red-600 transition-colors">
                                                <Linkedin className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Footer Info */}
            <footer className="mt-20 border-t border-gray-900 pt-10 text-center text-gray-600 text-xs uppercase tracking-[0.2em]">
                © 2026 SUDUR Community Platform • Dedicated Enthusiasts
            </footer>
        </main>
    );
}
