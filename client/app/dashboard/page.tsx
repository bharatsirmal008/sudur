import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { LogOut, User, Settings, CreditCard, Calendar } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton"; // We will create this client component

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-8 border-b border-slate-200 dark:border-slate-800 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Hello, {session.user?.name}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Manage your contributions and community activities
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/settings"
                            className="inline-flex items-center justify-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <Settings className="w-5 h-5" />
                        </Link>
                        <LogoutButton />
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                            <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Profile</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{session.user?.email}</p>
                        <p className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 inline-block uppercase tracking-wider">
                            Role: {String(session.user?.role || "Member")}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-start h-full">
                        <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-4">
                            <Calendar className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">My Events</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-1">Track the community events you&apos;ve registered for.</p>
                        <Link href="/dashboard/events" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 mt-auto">View Events &rarr;</Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
