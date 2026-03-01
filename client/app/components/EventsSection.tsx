"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight, Loader2 } from "lucide-react";

export default function EventsSection() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/events")
            .then(res => res.json())
            .then(data => {
                // Determine 'upcoming' ones by filtering those that are in the future or sorting them
                const upcoming = data.filter((e: any) => new Date(e.date) >= new Date()).slice(0, 3);
                // If there are no upcoming events, just show the last 3 created
                if (upcoming.length > 0) {
                    setEvents(upcoming);
                } else {
                    setEvents(data.slice(0, 3));
                }
            })
            .catch(err => console.error("Failed to fetch events:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section id="events" className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="container mx-auto px-4 md:px-6">

                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Upcoming Events
                        </h2>
                        <div className="w-20 h-1.5 bg-indigo-500 rounded-full mb-6"></div>
                        <p className="text-lg text-slate-600 dark:text-slate-300">
                            Join us in our upcoming community activities. Your presence makes a real difference in building a stronger society.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800">
                        <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold dark:text-white">No Upcoming Events</h3>
                        <p className="text-slate-500 mt-2">We are planning something exciting. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event, idx) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                className="bg-white dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-100 dark:hover:shadow-none transition-all duration-300 group flex flex-col h-full"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">
                                        Community
                                    </div>
                                    <img
                                        src={event.image || "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1470&auto=format&fit=crop"}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 line-clamp-2">
                                        {event.title}
                                    </h3>

                                    <div className="space-y-3 mb-6 mt-auto">
                                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                            <Calendar className="w-4 h-4 mr-3 text-indigo-500 shrink-0" />
                                            {new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                            <MapPin className="w-4 h-4 mr-3 text-indigo-500 shrink-0" />
                                            <span className="truncate" title={event.location}>{event.location}</span>
                                        </div>
                                    </div>

                                    <button disabled className="block w-full text-center py-2.5 px-4 outline outline-1 outline-slate-200 dark:outline-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors rounded-xl font-medium cursor-not-allowed opacity-70">
                                        Details Soon
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
