"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, CalendarCheck, HeartHandshake } from "lucide-react";

export default function StatsSection() {
    const [stats, setStats] = useState([
        { label: "Funds Raised", value: "$0", icon: <TrendingUp className="w-8 h-8 opacity-70" /> },
        { label: "Active Volunteers", value: "0", icon: <Users className="w-8 h-8 opacity-70" /> },
        { label: "Events Completed", value: "0", icon: <CalendarCheck className="w-8 h-8 opacity-70" /> },
        { label: "Partner Orgs", value: "12", icon: <HeartHandshake className="w-8 h-8 opacity-70" /> },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats([
                        { label: "Funds Raised", value: data.totalFunds, icon: <TrendingUp className="w-8 h-8 opacity-70" /> },
                        { label: "Active Volunteers", value: data.activeVolunteers, icon: <Users className="w-8 h-8 opacity-70" /> },
                        { label: "Events Completed", value: data.eventsCompleted, icon: <CalendarCheck className="w-8 h-8 opacity-70" /> },
                        { label: "Partner Orgs", value: "12", icon: <HeartHandshake className="w-8 h-8 opacity-70" /> },
                    ]);
                }
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            }
        };

        fetchStats();
    }, []);

    return (
        <section className="py-20 bg-indigo-600 relative overflow-hidden">
            {/* Abstract Background pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-white opacity-10 blur-3xl"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="text-center text-white"
                        >
                            <div className="flex justify-center mb-4 text-indigo-200">
                                {stat.icon}
                            </div>
                            <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                                {stat.value}
                            </h3>
                            <p className="text-indigo-100 font-medium tracking-wide uppercase text-sm">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
