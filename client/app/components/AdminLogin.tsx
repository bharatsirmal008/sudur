"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart, Loader2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                setError("Invalid admin credentials");
                setIsLoading(false);
                return;
            }

            // Successfully logged in
            router.push("/admin");
            router.refresh();
        } catch (err) {
            setError("An unexpected error occurred");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-900 border-4 border-slate-800 shadow-2xl mb-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/30 to-purple-600/30"></div>
                        <ShieldCheck className="w-10 h-10 text-white relative z-10" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Admin Portal
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                        Secure access for authorized personnel only
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 py-10 px-8 shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-[2rem] border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500"></div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold border border-red-100 dark:border-red-900/30 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
                                placeholder="admin@yourdomain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                                Master Password
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-4 px-4 rounded-xl text-sm font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 shadow-xl shadow-slate-200 dark:shadow-none disabled:opacity-70 transition-all uppercase tracking-widest mt-8"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authenticate"}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
