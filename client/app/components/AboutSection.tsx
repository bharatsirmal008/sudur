"use client";

import { motion } from "framer-motion";
import { Users, Droplets, BookOpen, HeartPulse } from "lucide-react";

export default function AboutSection() {
    const pillars = [
        {
            icon: <BookOpen className="w-6 h-6 text-indigo-500" />,
            title: "Education",
            description: "Providing resources and tutoring programs for underserved youth.",
        },
        {
            icon: <HeartPulse className="w-6 h-6 text-indigo-500" />,
            title: "Healthcare",
            description: "Organizing health camps and awareness initiatives for families.",
        },
        {
            icon: <Droplets className="w-6 h-6 text-indigo-500" />,
            title: "Environment",
            description: "Driving local cleanup drives and sustainable practices.",
        },
        {
            icon: <Users className="w-6 h-6 text-indigo-500" />,
            title: "Youth Development",
            description: "Mentorship and skill-building workshops for future leaders.",
        },
    ];

    return (
        <section id="about" className="py-24 bg-white dark:bg-slate-950 overflow-hidden relative">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                                Our Mission & Vision
                            </h2>
                            <div className="w-20 h-1.5 bg-indigo-500 rounded-full mb-6"></div>
                            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                                SUDUR is dedicated to creating sustainable development through technology. We act as a digital hub connecting passionate volunteers, generous donors, and individuals in need.
                            </p>
                            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                Our vision is a world where transparency meets action—where every contribution is tracked, every event brings people closer, and no community is left behind.
                            </p>
                        </div>

                        <div className="flex gap-4 items-center p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">10k+</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white">Lives Impacted</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Across our multiple community initiatives</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="grid sm:grid-cols-2 gap-6"
                    >
                        {pillars.map((pillar, idx) => (
                            <div
                                key={idx}
                                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative group overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent dark:from-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
                                        {pillar.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{pillar.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">{pillar.description}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
