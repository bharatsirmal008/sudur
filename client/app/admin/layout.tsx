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
import { useState, useEffect } from "react";
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
    const [settings, setSettings] = useState<{ adminName?: string, logoUrl?: string } | null>(null);

    useEffect(() => {
        if (status === "authenticated") {
            fetch("/api/settings")
                .then(res => res.json())
                .then(data => setSettings(data))
                .catch(console.error);
        }
    }, [status]);

    const menuItems = [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Volunteers", href: "/admin/volunteers", icon: Users },
        { name: "Donations", href: "/admin/donations", icon: Heart },
        { name: "Events", href: "/admin/events", icon: Calendar },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
            </div>
        );
    }

    if (!session || (session?.user as { role?: string })?.role !== "admin") {
        return <AdminLogin />;
    }

    return (
        <div className="min-h-screen bg-white flex transition-colors duration-300 text-[#111827]">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? "w-64" : "w-20"
                    } border-r border-slate-100 bg-[#F0FDF4] transition-all duration-300 flex flex-col fixed inset-y-0 z-50`}
            >
                <div className="p-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#16A34A] flex items-center justify-center">
                            <Heart className="w-4 h-4 text-white" />
                        </div>
                        {isSidebarOpen && (
                            <span className="font-bold text-lg text-[#111827]">AdminPanel</span>
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
                                    ? "bg-[#16A34A] text-white shadow-lg shadow-green-200"
                                    : "text-slate-600 hover:bg-green-50"
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-3 p-3 w-full text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all rounded-xl"
                    >
                        <LogOut className="w-5 h-5" />
                        {isSidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-50 rounded-lg text-slate-500"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-bold text-[#111827]">
                            {menuItems.find(item => item.href === pathname)?.name || "Dashboard"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-[#111827]">{settings?.adminName || session?.user?.name || "System Admin"}</p>
                            <p className="text-xs text-slate-500">System Administrator</p>
                        </div>
                        {settings?.logoUrl ? (
                            <img src={settings.logoUrl} alt="Admin Avatar" className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center font-bold text-[#16A34A] border border-green-100">
                                {(settings?.adminName || session?.user?.name || "A")[0].toUpperCase()}
                            </div>
                        )}
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
