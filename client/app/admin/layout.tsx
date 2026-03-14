"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    Users,
    Settings,
    LogOut,
    LayoutDashboard,
    Heart,
    ChevronRight,
    Menu,
    X,
    Calendar
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLogin from "../components/AdminLogin";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuItems = [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Volunteers", href: "/admin/volunteers", icon: Users },
        { name: "Events", href: "/admin/events", icon: Calendar },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (!session || (session?.user as { role?: string })?.role !== "admin") {
        return <AdminLogin />;
    }

    return (
        <div className="min-h-screen bg-black flex transition-colors duration-300 text-white">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? "w-64" : "w-20"
                    } border-r border-slate-800 bg-[#050505] transition-all duration-300 flex flex-col fixed inset-y-0 z-50`}
            >
                <div className="p-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <Heart className="w-4 h-4 text-white" />
                        </div>
                        {isSidebarOpen && (
                            <span className="font-bold text-lg text-white">AdminPanel</span>
                        )}
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
                                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-3 p-3 w-full text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all rounded-xl"
                    >
                        <LogOut className="w-5 h-5" />
                        {isSidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
                {/* Header */}
                <header className="h-20 bg-black/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-bold text-white">
                            {menuItems.find(item => item.href === pathname)?.name || "Dashboard"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-white">{session?.user?.name}</p>
                            <p className="text-xs text-slate-400">System Admin</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400">
                            {session?.user?.name?.[0]}
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
