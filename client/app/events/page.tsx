import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";

async function getEvents() {
    const API_URL = process.env.BACKEND_API_URL || 'https://sudurapi.vercel.app';
    try {
        const res = await fetch(`${API_URL}/api/events`, { cache: 'no-store' });
        if (!res.ok) return [];
        return await res.json();
    } catch (e) {
        console.error("Failed to fetch events:", e);
        return [];
    }
}

export default async function AllEventsPage() {
    const fetchedEvents = await getEvents();
    const now = new Date();

    const upcomingEvents = fetchedEvents.filter((event: any) => new Date(event.date) >= now);

    return (
        <div className="min-h-screen bg-[#f8fafc] py-20 font-sans">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                
                {/* Header */}
                <div className="mb-16 text-center space-y-4">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-black uppercase tracking-widest text-slate-400 hover:text-[#ff5722] transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-[#062a24] tracking-tight">
                        Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ea0c5] to-[#1a7a99]">Events</span>
                    </h1>
                    <p className="text-slate-500 font-medium max-w-xl mx-auto">
                        Discover new ways to get involved and give back to the community.
                    </p>
                </div>

                {/* Event Catalog */}
                <div className="space-y-10">
                    {upcomingEvents.length > 0 ? (
                        upcomingEvents.map((event: any, idx: number) => {
                            const isExpired = new Date(event.date) < new Date();
                            const status = (event.status === 'closed' || isExpired) ? 'closed' : (event.status || 'scheduled');

                            return (
                                <div
                                    key={event._id || idx}
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
                                            <div className="w-full h-full bg-slate-50 flex items-center justify-center border border-slate-200">
                                                <Calendar className="w-12 h-12 text-slate-300" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/5" />
                                    </div>

                                    {/* Middle Section: Content */}
                                    <div className="flex-1 py-8 md:py-0 md:px-12 space-y-5">
                                        <h3 className="text-2xl md:text-3xl font-black text-[#14181f] tracking-tight truncate pb-1">
                                            {event.title}
                                        </h3>

                                        {/* Info Bar */}
                                        <div className="flex flex-wrap items-center gap-6 pb-2 md:pb-0">
                                            <div className="flex items-center gap-2.5 text-sm font-bold text-[#2ea0c5]">
                                                <Calendar className="w-4.5 h-4.5" />
                                                <span>{new Date(event.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-sm font-bold text-slate-500">
                                                <Clock className="w-4.5 h-4.5 text-[#FFCB3B]" />
                                                <span>{event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : "Time TBA"}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-sm font-bold text-slate-500">
                                                <MapPin className="w-4.5 h-4.5 text-[#2ea0c5]" />
                                                <span className="max-w-[200px] truncate">{event.location}</span>
                                            </div>
                                        </div>

                                        <p className="text-gray-500 font-medium leading-relaxed line-clamp-2">
                                            {event.description || event.shortDescription || "Join us for this exciting upcoming community impact event."}
                                        </p>
                                    </div>

                                    {/* Divider */}
                                    <div className="hidden md:block w-px h-32 bg-slate-100 mx-4" />

                                    {/* Right Action Button */}
                                    <div className="w-full md:w-auto shrink-0 md:px-6 mt-6 md:mt-0">
                                        <Link
                                            href={`/event/${event.slug || event._id}`}
                                            className={`relative w-full md:w-auto flex flex-col items-center justify-center py-4 px-10 rounded-[10px] shadow-xl transition-all overflow-hidden group/btn cursor-pointer ${
                                                status === 'closed' 
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200' 
                                                : 'bg-[#fdf2f8] border border-[#ff5722]/10 hover:shadow-[#ff5722]/10'
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
                                                    View Details
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-24 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
                            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Upcoming Events</h3>
                            <p className="text-slate-500 font-medium max-w-md mx-auto">We are planning something major. Check back soon for more community engagements!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
