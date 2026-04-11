"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Heart,
    TrendingUp,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    ChevronRight,
    Loader2
} from "lucide-react";

interface AdminStats {
    volunteerCount: number;
    pendingVolunteerCount: number;
    upcomingEventsCount: number;
    userCount: number;
    pendingDonationCount: number;
    totalDonations: number;
}

interface RecentActivity {
    id: string;
    title: string;
    description: string;
    date: string;
}

import { useRouter } from "next/navigation";

export default function AdminOverviewPage() {
    const router = useRouter();
    const [data, setData] = useState<{
        stats: AdminStats;
        recentActivity: RecentActivity[];
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/dashboard")
            .then(res => {
                if (!res.ok) throw new Error("Server error");
                return res.json();
            })
            .then(resData => {
                if (resData && resData.stats) {
                    setData(resData);
                }
            })
            .catch(err => {
                console.error("Dashboard fetch error:", err);
                setData(null);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px]">
                <Loader2 className="w-10 h-10 text-[#16A34A] animate-spin mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Dashboard...</p>
            </div>
        );
    }

    const { stats, recentActivity } = data;

    const statCards = [
        { name: "Active Volunteers", value: stats.volunteerCount, change: "+Live", icon: Users, color: "text-[#16A34A]", bg: "bg-green-50" },
        { name: "Pending Apps", value: stats.pendingVolunteerCount, change: stats.pendingVolunteerCount > 0 ? "Action Required" : "Up to date", icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
        { name: "Upcoming Events", value: stats.upcomingEventsCount, change: "+Live", icon: Calendar, color: "text-amber-600", bg: "bg-amber-50" },
        { name: "Total Users", value: stats.userCount, change: "+Live", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-white rounded-[20px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className="text-xs font-bold px-2 py-1 rounded-full text-[#16A34A] bg-green-50">
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium">{stat.name}</h3>
                        <p className="text-2xl font-bold text-[#111827] mt-1">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-white rounded-[20px] border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-[#111827]">Recent Activity</h2>
                        <button className="text-[#16A34A] hover:text-[#15803D] text-sm font-bold flex items-center gap-1">
                            Live Feed <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        </button>
                    </div>

                    {recentActivity.length === 0 ? (
                        <div className="text-center text-slate-400 py-10">No recent activity detected.</div>
                    ) : (
                        <div className="space-y-6">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-[15px] bg-green-50 flex items-center justify-center shrink-0">
                                        <Calendar className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-[#111827]">{activity.title}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{activity.description}</p>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 mt-1">
                                        {new Date(activity.date).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Links / Tasks */}
                <div className="bg-gradient-to-br from-[#16A34A] to-[#15803D] rounded-[20px] p-8 text-white shadow-[0_20px_50px_rgba(22,163,74,0.15)]">
                    <h2 className="text-xl font-bold mb-6">Administrator Tasks</h2>
                    <div className="space-y-4">
                        {[
                            { title: "Review pending volunteer applications", route: "/admin/volunteers/applications", count: stats.pendingVolunteerCount },
                            { title: "Review Donation Applications", route: "/admin/donations", count: stats.pendingDonationCount },
                            { title: "Update community event list", route: "/admin/events" },
                            { title: "Site Settings", route: "/admin/settings" }
                        ].map((task) => (
                            <div 
                                key={task.title} 
                                onClick={() => router.push(task.route)}
                                className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md rounded-[15px] hover:bg-white/20 transition-all cursor-pointer group shadow-lg shadow-black/5"
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{task.title}</span>
                                    {task.count !== undefined && task.count > 0 && (
                                        <span className="text-[10px] uppercase font-bold text-rose-100 mt-1">{task.count} pending items</span>
                                    )}
                                </div>
                                <ChevronRight className="w-5 h-5 opacity-60 group-hover:translate-x-1 transition-transform" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
