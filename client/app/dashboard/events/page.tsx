import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";

export default async function UserEventsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    // Placeholder data for user events
    const myEvents = [
        {
            id: "e1",
            title: "Community Beach Cleanup",
            date: "October 15, 2026",
            time: "09:00 AM - 01:00 PM",
            location: "Sunnyvale Beach",
            status: "Upcoming",
            image: "https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc9?auto=format&fit=crop&q=80&w=800",
        },
        {
            id: "e2",
            title: "Youth Coding Workshop",
            date: "September 22, 2026",
            time: "10:00 AM - 03:00 PM",
            location: "Downtown Tech Hub",
            status: "Completed",
            image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                My Events
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">
                                Track the community events you've registered for.
                            </p>
                        </div>
                        <Link
                            href="/events"
                            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
                        >
                            Browse More Events
                        </Link>
                    </div>
                </div>

                <div className="space-y-6">
                    {myEvents.length > 0 ? (
                        myEvents.map((event) => (
                            <div key={event.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                                <div className="md:w-64 h-48 md:h-auto shrink-0 relative">
                                    <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800">
                                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm backdrop-blur-md ${event.status === 'Upcoming'
                                                ? 'bg-indigo-500/90 text-white border border-indigo-400/50'
                                                : 'bg-slate-800/80 text-slate-200 border border-slate-700/50'
                                            }`}>
                                            {event.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                            {event.title}
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-4">
                                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                                <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                                                {event.date}
                                            </div>
                                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                                <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                                                {event.time}
                                            </div>
                                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 sm:col-span-2">
                                                <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                                                {event.location}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                        {event.status === 'Upcoming' && (
                                            <button className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors">
                                                Cancel Registration
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-12 text-center">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No events found</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                                You haven't registered for any community events yet. Browse our upcoming activities to get involved!
                            </p>
                            <Link
                                href="/events"
                                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
                            >
                                View Upcoming Events
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
