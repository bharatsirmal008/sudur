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
                setError(res.error || "Invalid admin credentials");
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
        <div className="min-h-screen flex items-center justify-center bg-[#F0FDF4] py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#16A34A] border-4 border-white shadow-2xl mb-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
                        <ShieldCheck className="w-10 h-10 text-white relative z-10" />
                    </div>
                    <h2 className="text-3xl font-black text-[#111827] tracking-tight">
                        Admin Portal
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 font-medium">
                        Secure access for authorized personnel only
                    </p>
                </div>

                <div className="bg-white py-10 px-8 shadow-2xl shadow-green-100 rounded-[2rem] border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-green-400 via-[#16A34A] to-[#15803D]"></div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-[#111827] focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A] outline-none transition-all font-medium"
                                placeholder="admin@yourdomain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                Master Password
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-[#111827] focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A] outline-none transition-all font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-4 px-4 rounded-xl text-sm font-black text-white bg-[#16A34A] hover:bg-[#15803D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16A34A] shadow-xl shadow-green-100 disabled:opacity-70 transition-all uppercase tracking-widest mt-8"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authenticate"}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
