"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Loader2, X, Bell, Info } from "lucide-react";

interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    image: string;
    createdAt: string;
    registrationLink?: string;
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
        <section id="events" className="py-24 bg-black border-t border-slate-900/50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4"
                        >
                            <Bell className="w-3 h-3" />
                            Take Action
                        </motion.div>
                        <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-xl">
                            Join us in our upcoming community initiatives. Every participant counts in building a stronger foundation for our society.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center py-32 space-y-4">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                        <p className="text-indigo-400 font-black uppercase tracking-widest text-xs animate-pulse">Gathering details...</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 bg-[#0a0a0a] rounded-[3rem] border border-slate-800/50 backdrop-blur-sm">
                        <Calendar className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-2">No Upcoming Events</h3>
                        <p className="text-slate-500 font-medium">We are planning something major. Stay tuned for updates!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {events.map((event, idx) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }}
                                className="group relative bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-500 shadow-2xl hover:shadow-indigo-500/5 flex flex-col h-full"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <img
                                        src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1470&auto=format&fit=crop"}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute top-6 left-6 z-20">
                                        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em]">
                                            Live Event
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-2xl font-black text-white mb-6 line-clamp-2 leading-tight uppercase group-hover:text-indigo-400 transition-colors">
                                        {event.title}
                                    </h3>

                                    <div className="space-y-4 mb-8 mt-auto">
                                        <div className="flex items-center text-sm font-bold text-slate-300">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center mr-4 shrink-0 border border-indigo-500/20">
                                                <Calendar className="w-5 h-5 text-indigo-500" />
                                            </div>
                                            {new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div className="flex items-center text-sm font-bold text-slate-300">
                                            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center mr-4 shrink-0 border border-purple-500/20">
                                                <MapPin className="w-5 h-5 text-purple-500" />
                                            </div>
                                            <span className="truncate" title={event.location}>{event.location}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button 
                                            onClick={() => setSelectedEvent(event)}
                                            className="flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white transition-all rounded-2xl font-black uppercase text-[10px] tracking-widest border border-slate-800"
                                        >
                                            <Info className="w-3 h-3 text-indigo-500" /> Details
                                        </button>
                                        {event.registrationLink ? (
                                            <a 
                                                href={event.registrationLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="block text-center py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-[1.02]"
                                            >
                                                Register
                                            </a>
                                        ) : (
                                            <button disabled className="block w-full text-center py-3.5 px-4 bg-slate-900 border border-slate-800 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest cursor-not-allowed opacity-50">
                                                Closed
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Event Details Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedEvent(null)}
                            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[999]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0a0a0a] border border-slate-800 rounded-[3rem] shadow-2xl z-[1000] overflow-hidden"
                        >
                            <button 
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors z-[1001]"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="relative h-72 overflow-hidden">
                                <img 
                                    src={selectedEvent.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1470&auto=format&fit=crop"} 
                                    alt={selectedEvent.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                                <div className="absolute bottom-8 left-10">
                                    <div className="bg-indigo-500 px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4 inline-block shadow-lg shadow-indigo-500/40">
                                        Exclusive Event
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic">
                                        {selectedEvent.title}
                                    </h2>
                                </div>
                            </div>

                            <div className="p-10">
                                <div className="grid grid-cols-2 gap-8 mb-10">
                                    <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                            <Calendar className="w-6 h-6 text-indigo-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</p>
                                            <p className="text-white font-bold">{new Date(selectedEvent.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                            <MapPin className="w-6 h-6 text-purple-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Location</p>
                                            <p className="text-white font-bold truncate max-w-[150px]">{selectedEvent.location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-10">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Event Description</p>
                                    <div className="text-slate-400 font-medium leading-relaxed whitespace-pre-wrap custom-scrollbar max-h-[40vh] overflow-y-auto pr-2">
                                        {selectedEvent.description}
                                    </div>
                                </div>

                                {selectedEvent.registrationLink ? (
                                    <a 
                                        href={selectedEvent.registrationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                                    >
                                        Secure Your Spot Now
                                    </a>
                                ) : (
                                    <div className="w-full py-5 bg-slate-900 border border-slate-800 text-slate-500 text-center rounded-[2rem] font-black uppercase tracking-widest opacity-70">
                                        Registration Closed
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
