"use client";

import { motion } from "framer-motion";
import { CheckCircle, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function DonationSuccessPage() {
    useEffect(() => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 text-center shadow-xl border border-slate-100 dark:border-slate-800"
            >
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>

                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Thank You!</h1>
                <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                    Your generous donation has been received. You're now a part of the mission to support SUDUR and uplift our community.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/dashboard/donations"
                        className="w-full inline-flex items-center justify-center py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
                    >
                        View Donation History
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                    <Link
                        href="/"
                        className="w-full inline-flex items-center justify-center py-4 text-slate-600 dark:text-slate-400 font-semibold hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        Return to Home
                    </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                        <Heart className="w-5 h-5 fill-current" />
                        <span>Shared with ❤️ by SUDUR</span>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
