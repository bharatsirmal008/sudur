import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Profile Settings
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Manage your account details and preferences.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        defaultValue={session.user?.name || ""}
                                        className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 px-4 py-3 text-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 sm:text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        defaultValue={session.user?.email || ""}
                                        disabled
                                        className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 px-4 py-3 text-slate-500 dark:text-slate-400 cursor-not-allowed sm:text-sm"
                                    />
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Email cannot be changed at this time.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Change Password</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label htmlFor="current_password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            id="current_password"
                                            name="current_password"
                                            className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 px-4 py-3 text-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 sm:text-sm"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="new_password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                id="new_password"
                                                name="new_password"
                                                className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 px-4 py-3 text-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 sm:text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="confirm_password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                id="confirm_password"
                                                name="confirm_password"
                                                className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 px-4 py-3 text-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
