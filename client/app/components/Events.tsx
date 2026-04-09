"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Loader2, X, Bell, Info, Clock } from "lucide-react";
import Link from "next/link";

interface Event {
    _id: string;
    title: string;
    description: string;
    shortDescription?: string;
    date: string;
    location: string;
    image: string;
    createdAt: string;
    registrationLink?: string;
    slug?: string;
    startTime?: string;
    endTime?: string;
    status?: 'scheduled' | 'live' | 'closed';
}

export default function Events() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    useEffect(() => {
        fetch("/api/events")
            .then(res => {
                if (!res.ok) throw new Error("Server error");
                return res.json();
            })
            .then(data => {
                if (!Array.isArray(data)) return;
                const upcoming = data.filter((e: Event) => new Date(e.date) >= new Date()).slice(0, 3);
                if (upcoming.length > 0) {
                    setEvents(upcoming);
                } else {
                    setEvents(data.slice(0, 3).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
                }
            })
            .catch(err => {
                console.error("Failed to fetch events:", err);
                setEvents([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <section id="events" className="py-24 bg-white border-t border-slate-100 relative overflow-hidden">
            {/* Background elements */}
            <img
                src="/yellow_ellipse.svg"
                alt=""
                className="absolute top-10  w-[10rem] h-[10rem]  pointer-events-none"
            />
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-50/50 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-50/50 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-4 md:px-10 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-widest mb-4"
                        >
                            <Bell className="w-3 h-3" />
                            Take Action
                        </motion.div>
                        <p className="text-xl text-slate-600 leading-relaxed font-medium max-w-xl">
                            Join us in our upcoming community initiatives. Every participant counts in building a stronger foundation for our society.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center py-32 space-y-4">
                        <Loader2 className="w-12 h-12 text-[#2ea0c5] animate-spin" />
                        <p className="text-[#2ea0c5] font-black uppercase tracking-widest text-xs animate-pulse">Gathering details...</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50">
                        <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-[#14181f] mb-2">No Upcoming Events</h3>
                        <p className="text-slate-500 font-medium">We are planning something major. Stay tuned for updates!</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-10">
                        {events.map((event, idx) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.6 }}
                                className="group bg-white rounded-[10px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_48px_80px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden flex flex-col md:flex-row items-center p-6 md:p-8"
                            >
                                {/* Left Side: Image */}
                                <div className="w-full md:w-[30%] h-64 md:h-56 shrink-0 overflow-hidden rounded-[10px] relative">
                                    {event.image ? (
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Image</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/5" />
                                </div>

                                {/* Middle Section: Content */}
                                <div className="flex-1 py-8 md:py-0 px-2 md:px-12 space-y-5 w-full overflow-hidden text-left">
                                    <h3 className="text-xl sm:text-2xl md:text-4xl font-black text-[#14181f] tracking-tight line-clamp-2 md:truncate pb-1 leading-tight">
                                        {event.title}
                                    </h3>

                                    <div className="flex flex-wrap items-center gap-4 md:gap-8 pb-2 md:pb-0">
                                        {event.date && !isNaN(new Date(event.date).getTime()) && new Date(event.date).getFullYear() > 2000 && (
                                            <div className="flex items-center gap-2.5 text-sm font-bold text-[#2ea0c5] shrink-0">
                                                <Calendar className="w-4.5 h-4.5" />
                                                <span>{new Date(event.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        )}
                                        {(() => {
                                            const formatTime = (timeStr?: string) => {
                                                if (!timeStr || timeStr.trim() === "") return null;
                                                try {
                                                    // Handle both "14:00" and raw "4"
                                                    if (timeStr.includes(":")) {
                                                        const [hours, minutes] = timeStr.split(":").map(Number);
                                                        const ampm = hours >= 12 ? 'PM' : 'AM';
                                                        const h12 = hours % 12 || 12;
                                                        return `${h12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
                                                    }
                                                    return timeStr; // Fallback for raw numbers
                                                } catch (e) { return null; }
                                            };
                                            const start = formatTime(event.startTime);
                                            const end = formatTime(event.endTime);
                                            
                                            if (start && end) {
                                                return (
                                                    <div className="flex items-center gap-2.5 text-sm font-bold text-slate-400 shrink-0">
                                                        <Clock className="w-4.5 h-4.5 text-[#FFCB3B]" />
                                                        <span>{start} - {end}</span>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}
                                        <div className="flex items-center gap-2.5 text-sm font-bold text-slate-400 shrink-0">
                                            <MapPin className="w-4.5 h-4.5 text-[#2ea0c5]" />
                                            <span className="max-w-[200px] truncate">{event.location}</span>
                                        </div>
                                    </div>

                                        <div className="space-y-4">
                                            <p className="text-gray-500 font-medium leading-relaxed line-clamp-2">
                                                {event.shortDescription || event.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Divider (Desktop only) */}
                                    <div className="hidden md:block w-px h-32 bg-slate-100 mx-4" />

                                    <div className="w-full md:w-auto shrink-0 md:px-6">
                                        {(() => {
                                            const hasDate = !!event.date && !isNaN(new Date(event.date).getTime()) && new Date(event.date).getFullYear() > 2000;
                                            const evDate = hasDate ? new Date(event.date) : null;
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            
                                            const isExpired = evDate ? evDate < today : false;
                                            const status = (event.status === 'closed' || isExpired) ? 'closed' : (event.status || 'scheduled');

                                            return (
                                                <Link
                                                    href={status === 'closed' ? "#" : `/event/${event.slug || event._id}`}
                                                    className={`relative w-full md:w-auto flex flex-col items-center justify-center py-4 px-10 rounded-[10px] shadow-xl transition-all overflow-hidden group/btn ${status === 'closed'
                                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200'
                                                        : 'bg-[#fdf2f8] border border-[#ff5722]/10 hover:shadow-[#ff5722]/10 cursor-pointer'
                                                        }`}
                                                >
                                                    {status !== 'closed' && (
                                                        <img
                                                            src="/pink_ellipse.svg"
                                                            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/btn:scale-125 transition-transform duration-700 pointer-events-none"
                                                            alt=""
                                                        />
                                                    )}
                                                    <div className="relative z-10 flex flex-col items-center justify-center">
                                                        <span className={`text-sm font-black tracking-tight whitespace-nowrap ${status === 'closed'
                                                            ? 'text-slate-400'
                                                            : 'bg-clip-text text-transparent bg-gradient-to-r from-[#ff5722] via-[#062a24] to-[#ff5722] bg-[length:200%_auto] bg-left hover:bg-right transition-all duration-700'
                                                            }`}>
                                                            {!hasDate ? "Join Event" : (status === 'closed' ? 'Closed Event' : status === 'live' ? 'Live Now' : 'Join Us Now')}
                                                        </span>
                                                        {status === 'live' && <span className="text-[10px] font-bold text-green-600/80 mt-0.5">Registration Open</span>}
                                                    </div>
                                                </Link>
                                            );
                                        })()}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
