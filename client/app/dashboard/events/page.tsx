import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";

async function getMyEvents() {
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

export default async function UserEventsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const fetchedEvents = await getMyEvents();
    const now = new Date();

    const myEvents = fetchedEvents.map((event: any) => {
        const eventDate = new Date(event.date);
        const isCompleted = eventDate < now;
        
        return {
            id: event._id || event.id || Math.random().toString(),
            title: event.title || "Untitled Event",
            date: eventDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
            time: event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : "Time TBA",
            location: event.location || "Location TBD",
            status: isCompleted ? "Completed" : "Upcoming",
            image: event.image,
            description: event.description || event.shortDescription || "Thank you for registering for this community impact opportunity.",
            slug: event.slug || event._id
        };
    });

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                <div className="mb-10">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                My Registered Events
                            </h1>
                            <p className="text-slate-500 mt-1 font-medium">
                                Track the community events you've committed to attending.
                            </p>
                        </div>
                        <Link
                            href="/events"
                            className="inline-flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-100 transition-colors"
                        >
                            Browse More Events
                        </Link>
                    </div>
                </div>

                <div className="space-y-6">
                    {myEvents.length > 0 ? (
                        <div className="flex flex-col gap-10">
                            {myEvents.map((event: any) => (
                                <div
                                    key={event.id}
                                    className="group bg-white rounded-[10px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_48px_80px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden flex flex-col md:flex-row items-center p-6 md:p-8"
                                >
                                    {/* Left Side: Image */}
                                    <div className="w-full md:w-[30%] h-64 md:h-56 shrink-0 overflow-hidden rounded-[10px] relative bg-slate-50">
                                        {event.image ? (
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center border border-slate-200">
                                                <Calendar className="w-12 h-12 text-slate-300" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/5" />
                                        <div className="absolute top-3 left-3">
                                            <span className={`px-3 py-1 text-xs font-black tracking-widest uppercase rounded-full shadow-sm backdrop-blur-md ${event.status === 'Upcoming'
                                                    ? 'bg-indigo-500/90 text-white shadow-indigo-500/20'
                                                    : 'bg-slate-800/80 text-white'
                                                }`}>
                                                {event.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Middle Section: Content */}
                                    <div className="flex-1 py-8 md:py-0 md:px-12 space-y-5">
                                        <Link href={`/event/${event.slug}`} className="hover:text-indigo-600 transition-colors">
                                            <h3 className="text-2xl md:text-3xl font-black text-[#14181f] tracking-tight truncate pb-1">
                                                {event.title}
                                            </h3>
                                        </Link>

                                        {/* Info Bar - Single Line */}
                                        <div className="flex items-center gap-8 whitespace-nowrap overflow-x-auto pb-2 md:pb-0">
                                            <div className="flex items-center gap-2.5 text-sm font-bold text-[#2ea0c5] shrink-0">
                                                <Calendar className="w-4.5 h-4.5" />
                                                <span>{event.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-sm font-bold text-slate-500 shrink-0">
                                                <Clock className="w-4.5 h-4.5 text-[#FFCB3B]" />
                                                <span>{event.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-sm font-bold text-slate-500 shrink-0">
                                                <MapPin className="w-4.5 h-4.5 text-[#2ea0c5]" />
                                                <span className="max-w-[200px] truncate">{event.location}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-gray-500 font-medium leading-relaxed line-clamp-2">
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="hidden md:block w-px h-32 bg-slate-100 mx-4" />

                                    {/* Right Status Badge (No Registration Link) */}
                                    <div className="w-full md:w-auto shrink-0 md:px-6 mt-6 md:mt-0 flex items-center justify-center">
                                        <div className="w-full md:w-auto flex flex-col items-center justify-center py-5 px-12 rounded-[10px] bg-emerald-50 border border-emerald-100 shadow-sm">
                                            <span className="text-sm font-black tracking-widest uppercase text-emerald-600">
                                                Registered
                                            </span>
                                            <span className="text-[10px] font-bold text-emerald-500/70 mt-1">Confirmed</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
                            <div className="w-20 h-20 bg-slate-50 shadow-inner rounded-full flex items-center justify-center mx-auto mb-6">
                                <Calendar className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2 mt-4">No events found</h3>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto font-medium">
                                You haven't confirmed your attendance for any community events yet. 
                            </p>
                            <Link
                                href="/events"
                                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
                            >
                                Browse Local Events
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
