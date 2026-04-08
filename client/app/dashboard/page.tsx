import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { LogOut, User, Settings, CreditCard, Calendar, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-white py-10 md:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-8 border-b border-slate-200 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-indigo-50 items-center justify-center border border-indigo-100">
                            <LayoutDashboard className="w-8 h-8 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                                Hello, {session.user?.name}
                            </h1>
                            <p className="text-sm sm:text-base text-slate-500 mt-1 max-w-md">
                                Manage your contributions, track your progress, and see community activities.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 self-start md:self-auto w-full md:w-auto">
                        <Link
                            href="/dashboard/settings"
                            className="flex-1 md:flex-none inline-flex items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors gap-2 font-medium"
                        >
                            <Settings className="w-5 h-5" />
                            <span className="md:hidden">Settings</span>
                        </Link>
                        <div className="flex-1 md:flex-none">
                            <LogoutButton />
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    
                    {/* Profile Card */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all group">
                        <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform overflow-hidden font-bold border border-indigo-100 shadow-sm relative">
                            {session.user?.image ? (
                                <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xl text-indigo-600 uppercase">{(session.user?.name || "U")[0]}</span>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Profile Details</h3>
                        <p className="text-sm text-slate-500 mb-6 truncate">{session.user?.email}</p>
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-widest border border-slate-200">
                            Role: {String(session.user?.role || "Supporter")}
                        </div>
                    </div>

                    {/* Events Card */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-start h-full hover:shadow-md hover:border-teal-200 transition-all group">
                        <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <Calendar className="w-7 h-7 text-teal-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">My Registered Events</h3>
                        <p className="text-sm text-slate-500 mb-8 flex-1 leading-relaxed">
                            Track and manage the community events you've registered to attend.
                        </p>
                        <Link href="/dashboard/events" className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-teal-50 text-teal-700 text-sm font-bold hover:bg-teal-100 transition-colors">
                            View Events &rarr;
                        </Link>
                    </div>

                    {/* Donations Placeholder (Optional Future Card) */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-start h-full hover:shadow-md hover:border-rose-200 transition-all group">
                        <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <CreditCard className="w-7 h-7 text-rose-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">My Donations</h3>
                        <p className="text-sm text-slate-500 mb-8 flex-1 leading-relaxed">
                            Review your past contributions securely.
                        </p>
                        <Link href="/dashboard/donations" className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-rose-50 text-rose-700 text-sm font-bold hover:bg-rose-100 transition-colors">
                            View Contributions &rarr;
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
