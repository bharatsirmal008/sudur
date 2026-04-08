"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, MapPin, Loader2, Clock, Globe, ArrowRight, Activity, HandHeart, CheckCircle2, ChevronRight, Share2, Facebook, Twitter, Mail, Info, User } from "lucide-react";
import Link from "next/link";

interface Event {
    _id: string;
    title: string;
    description: string;
    shortDescription?: string;
    date: string;
    location: string;
    image: string;
    registrationLink?: string;
    slug?: string;
    organizer?: string;
    startTime?: string;
    endTime?: string;
    activities?: string;
    impactPoints?: string[];
    terms?: string;
    criteria?: string;
    feedbackLink?: string;
    otherInfo?: string;
    status?: 'scheduled' | 'live' | 'closed';
}

export default function EventDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Support both ID and Slug
        const requestId = params?.id;
        if (!requestId) return;

        fetch(`/api/events/${requestId}`)
            .then(res => {
                if (!res.ok) throw new Error("Event not found");
                return res.json();
            })
            .then(data => {
                if (data) {
                    setEvent(data);
                    // If accessed via ID but has a slug, optionally redirect to slug for SEO
                    if (data.slug && requestId === data._id && window.location.pathname.includes("/event/")) {
                        router.replace(`/event/${data.slug}`);
                    }
                }
            })
            .catch(err => {
                console.error("Failed to fetch event:", err);
                setEvent(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [params?.id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-12 h-12 text-[#2ea0c5] animate-spin" />
                    <p className="text-[#2ea0c5] font-black uppercase tracking-widest text-sm animate-pulse">Loading Event...</p>
                </div>
            </main>
        );
    }

    if (!event) {
        return (
            <main className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-[#062a24]">
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center p-12 bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 max-w-lg">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-10 h-10 text-slate-300" />
                        </div>
                        <h2 className="text-3xl font-black mb-3 text-[#062a24]">Event Not Found</h2>
                        <p className="text-slate-500 mb-8 font-medium">The event you are looking for might have been moved or removed.</p>
                        <Link href="/#events" className="inline-flex items-center gap-2 px-8 py-4 bg-[#ff5722] text-white rounded-full font-bold transition hover:scale-105 shadow-xl shadow-[#ff5722]/20">
                            Back to Events <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#fdfdfd] font-sans text-[#062a24] selection:bg-[#ff5722]/10 selection:text-[#ff5722]">

            {/* Hero Section */}
            <section className="pt-24 pb-8 md:pt-32 md:pb-12 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Breadcrumbs */}
                    {/* <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">
                        <Link href="/" className="hover:text-[#ff5722] transition-all">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/#events" className="hover:text-[#ff5722] transition-all">Events</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-slate-600 truncate max-w-[200px]">{event.title}</span>
                    </div> */}

                    <div className="relative group rounded-[10px] overflow-hidden shadow-2xl shadow-slate-200/50 aspect-[4/3] sm:aspect-video lg:aspect-[21/9]">
                        {event.image ? (
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center">
                                <span className="text-slate-300 font-black text-2xl md:text-4xl uppercase opacity-20 tracking-tighter">YAOP EVENT</span>
                            </div>
                        )}
                        <div className="absolute inset-0 rounded-[10px] bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12">
                            {(() => {
                                const evDate = new Date(event.date);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const isExpired = evDate < today;
                                const status = (event.status === 'closed' || isExpired) ? 'closed' : (event.status || 'scheduled');

                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`inline-block px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${status === 'closed' ? 'bg-slate-500' : status === 'live' ? 'bg-green-600' : 'bg-[#ff5722]'
                                            }`}
                                    >
                                        {status === 'closed' ? 'Event Closed' : status === 'live' ? 'Live Now' : 'Upcoming Event'}
                                    </motion.div>
                                );
                            })()}
                            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight">
                                {event.title}
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-8 md:py-20">
                <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">

                    {/* Left Column: Details & Content */}
                    <div className="lg:col-span-7 space-y-16">
                        {/* Highlights Grid */}
                        {(event.activities || event.shortDescription) && (
                            <div className="grid grid-cols-1 gap-8">
                                {event.activities && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        className="relative p-8 bg-white rounded-[10px] border border-slate-50 shadow-2xl shadow-slate-200/50 overflow-hidden group/item"
                                    >
                                        <img src="/yellow_ellipse.svg" alt="" className="absolute top-2 right-2 w-32 object-contain opacity-100 group-hover/item:scale-110 transition-transform duration-1000 pointer-events-none" />
                                        <div className="relative z-10">
                                            <div className="w-12 h-12 rounded-2xl bg-[#ff5722]/10 flex items-center justify-center mb-6">
                                                <Activity className="w-6 h-6 text-[#ff5722]" />
                                            </div>
                                            <h3 className="text-2xl font-black text-[#062a24] mb-4">Activities</h3>
                                            <p className="text-slate-500 font-medium leading-relaxed whitespace-pre-wrap">
                                                {event.activities}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {event.shortDescription && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        className="relative p-8 bg-white rounded-[10px] border border-slate-50 shadow-2xl shadow-slate-200/50 overflow-hidden group/item"
                                    >
                                        <img src="/green_ellipse.svg" alt="" className="absolute top-2 right-2 w-32 object-contain opacity-100 group-hover/item:scale-110 transition-transform duration-1000 pointer-events-none" />
                                        <div className="relative z-10">
                                            <div className="w-12 h-12 rounded-2xl bg-[#ff5722]/10 flex items-center justify-center mb-6">
                                                <HandHeart className="w-6 h-6 text-[#ff5722]" />
                                            </div>
                                            <h3 className="text-2xl font-black text-[#062a24] mb-4">Impact</h3>
                                            <p className="text-slate-500 font-medium leading-relaxed whitespace-pre-wrap">
                                                {event.shortDescription}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {/* Events Details Section (Main Content) */}
                        {event.description && (
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-1.5 h-8 bg-[#ff5722] rounded-full" />
                                    <h2 className="text-3xl font-black text-[#062a24]">About This Event</h2>
                                </div>
                                <div className="prose prose-lg text-slate-500 font-medium leading-[1.8] max-w-none whitespace-pre-wrap">
                                    {event.description}
                                </div>
                            </motion.div>
                        )}

                        {/* Impact Points */}
                        {event.impactPoints && event.impactPoints.length > 0 && (
                            <div className="bg-white rounded-[10px] p-10 border border-slate-100 shadow-xl shadow-slate-100/30">
                                <h3 className="text-2xl font-black text-[#062a24] mb-8">Impact of Your Support</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {event.impactPoints.map((point, i) => (
                                        <div key={i} className="flex gap-4 items-center group">
                                            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-[#ff5722] transition-colors shrink-0">
                                                <CheckCircle2 className="w-5 h-5 text-[#ff5722] group-hover:text-white transition-colors" />
                                            </div>
                                            <span className="font-bold text-[#062a24]">{point}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Secondary Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {event.terms && (
                                <div className="p-10 border border-slate-100 rounded-[10px] bg-slate-50">
                                    <h4 className="text-lg font-black text-[#062a24] mb-4 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#ff5722]" /> Terms & Conditions
                                    </h4>
                                    <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-wrap">{event.terms}</p>
                                </div>
                            )}
                            {event.criteria && (
                                <div className="p-10 border border-slate-100 rounded-[10px] bg-slate-50">
                                    <h4 className="text-lg font-black text-[#062a24] mb-4 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#ff5722]" /> Criteria
                                    </h4>
                                    <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-wrap">{event.criteria}</p>
                                </div>
                            )}
                        </div>

                        {/* Share & Feedback */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-slate-100">
                            <div className="flex items-center gap-6">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Share with</span>
                                <div className="flex gap-3">
                                    {[Facebook, Twitter, Mail].map((Icon, i) => (
                                        <button key={i} className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-[#ff5722] hover:text-white hover:border-[#ff5722] transition-all">
                                            <Icon className="w-5 h-5" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {event.feedbackLink && (
                                <Link
                                    href={event.feedbackLink}
                                    target="_blank"
                                    className="flex items-center gap-2 text-[#ff5722] font-black uppercase text-xs tracking-widest group"
                                >
                                    Event Feedback <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Premium Sidebar Widget - Enhanced Shadow & Gradient CTA */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative bg-white rounded-[10px] p-6 md:p-10 shadow-[0_48px_100px_rgba(0,0,0,0.12)] border border-slate-50 overflow-hidden group"
                        >
                            {/* SVG Background Assets */}
                            <img src="/blue_ellipse.svg" alt="" className="absolute -top-10 -right-10 w-[250px] opacity-40 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
                            <img src="/yellow_ellipse.svg" alt="" className="absolute -bottom-10 -left-10 w-[250px] opacity-40 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />

                            <div className="relative z-10">
                                <h2 className="text-3xl font-black mb-2 text-[#062a24]">Events Details</h2>
                                {event.shortDescription && (
                                    <p className="text-[#5e7d78] text-sm font-medium leading-relaxed mb-10">
                                        {event.shortDescription}
                                    </p>
                                )}

                                <div className="space-y-6 mb-10">
                                    {/* Organizer Row */}
                                    {event.organizer && (
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                                                <User className="w-6 h-6 text-[#ff5722]" />
                                            </div>
                                            <div>
                                                <p className="text-[#5e7d78] text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Organizer :</p>
                                                <p className="text-lg font-black text-[#062a24]">{event.organizer}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Location Row */}
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                                            <MapPin className="w-6 h-6 text-[#ff5722]" />
                                        </div>
                                        <div>
                                            <p className="text-[#5e7d78] text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Location :</p>
                                            <p className="text-lg font-black text-[#062a24]">{event.location}</p>
                                        </div>
                                    </div>

                                    {/* Date Row */}
                                    {event.date && !isNaN(new Date(event.date).getTime()) && new Date(event.date).getFullYear() > 2000 && (
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                                                <Calendar className="w-6 h-6 text-[#ff5722]" />
                                            </div>
                                            <div>
                                                <p className="text-[#5e7d78] text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Entry Ends :</p>
                                                <p className="text-lg font-black text-[#062a24]">
                                                    {new Date(event.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Time Row */}
                                    {event.startTime && event.startTime.trim() !== "" && event.endTime && event.endTime.trim() !== "" && (
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                                                <Clock className="w-6 h-6 text-[#ff5722]" />
                                            </div>
                                            <div>
                                                <p className="text-[#5e7d78] text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Time Slot :</p>
                                                <p className="text-lg font-black text-[#062a24]">
                                                    {event.startTime} - {event.endTime}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {(() => {
                                    const hasDate = !!event.date && !isNaN(new Date(event.date).getTime()) && new Date(event.date).getFullYear() > 2000;
                                    const evDate = hasDate ? new Date(event.date) : null;
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    
                                    const isExpired = evDate ? evDate < today : false;
                                    const status = (event.status === 'closed' || isExpired) ? 'closed' : (event.status || 'scheduled');

                                    return (
                                        <div className="flex justify-center">
                                            <Link
                                                href={status === 'closed' ? "#" : (event.registrationLink || "#")}
                                                target={status === 'closed' ? "" : "_blank"}
                                                className={`relative px-12 py-4 rounded-[10px] shadow-xl transition-all overflow-hidden group/btn ${status === 'closed'
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
                                                <div className="relative z-10 flex items-center justify-center">
                                                <span className={`text-lg font-black tracking-tight whitespace-nowrap ${status === 'closed'
                                                    ? 'text-slate-400'
                                                    : 'bg-clip-text text-transparent bg-gradient-to-r from-[#ff5722] via-[#062a24] to-[#ff5722] bg-[length:200%_auto] bg-left hover:bg-right transition-all duration-700'
                                                    }`}>
                                                    {!hasDate ? "Join Event" : (status === 'closed' ? "Closed Event" : status === 'live' ? "Join live Event" : "Join Us Now")}
                                                </span>
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })()}
                            </div>

                            {event.otherInfo && (
                                <div className="mt-8 pt-8 border-t border-slate-100 flex items-start gap-4 relative z-10">
                                    <Info className="w-5 h-5 text-[#ff5722] shrink-0 mt-0.5" />
                                    <p className="text-xs text-[#5e7d78] font-bold leading-relaxed">{event.otherInfo}</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

        </main>
    );
}

const XCircle = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
