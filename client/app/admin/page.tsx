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
    upcomingEventsCount: number;
    userCount: number;
}

interface RecentActivity {
    id: string;
    title: string;
    description: string;
    date: string;
}

export default function AdminOverviewPage() {
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
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Dashboard...</p>
            </div>
        );
    }

    const { stats, recentActivity } = data;

    const statCards = [
        { name: "Active Volunteers", value: stats.volunteerCount, change: "+Live", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
        { name: "Upcoming Events", value: stats.upcomingEventsCount, change: "+Live", icon: Calendar, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
        { name: "Total Users", value: stats.userCount, change: "+Live", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
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
                        className="p-6 bg-[#0a0a0a] rounded-3xl border border-slate-800 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className="text-xs font-bold px-2 py-1 rounded-full text-indigo-400 bg-indigo-900/20">
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium">{stat.name}</h3>
                        <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-[#0a0a0a] rounded-[2rem] border border-slate-800 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                        <button className="text-indigo-400 hover:text-indigo-300 text-sm font-bold flex items-center gap-1">
                            Live Feed <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                        </button>
                    </div>

                    {recentActivity.length === 0 ? (
                        <div className="text-center text-slate-500 py-10">No recent activity detected.</div>
                    ) : (
                        <div className="space-y-6">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
                                        <Calendar className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white">{activity.title}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{activity.description}</p>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0 mt-1">
                                        {new Date(activity.date).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Links / Tasks */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-200 dark:shadow-none">
                    <h2 className="text-xl font-bold mb-6">Administrator Tasks</h2>
                    <div className="space-y-4">
                        {[
                            "Review pending volunteer applications",
                            "Update community event list",
                            "Generate monthly financial report",
                            "Backup site database"
                        ].map((task) => (
                            <div key={task} className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all cursor-pointer">
                                <span className="text-sm font-medium">{task}</span>
                                <ChevronRight className="w-5 h-5 opacity-60" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
