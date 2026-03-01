"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-purple-300 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-indigo-300 dark:bg-indigo-900/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

            <div className="container px-4 md:px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto space-y-8"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center rounded-full border border-indigo-200 dark:border-indigo-800 bg-white/50 dark:bg-slate-900/50 px-3 py-1 text-sm font-medium text-indigo-800 dark:text-indigo-300 backdrop-blur-sm"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-2"></span>
                        Supporting SUDUR
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white pb-2 leading-tight kosmik-title">
                        Together We Create <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                            Sustainable Impact
                        </span>
                    </h1>

                    <p className="max-w-[42rem] mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                        Join SUDUR. Connect, volunteer, educate, and contribute to building a brighter, more sustainable future for everyone.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                    >
                        <Link
                            href="/register"
                            className="inline-flex h-12 items-center justify-center rounded-full bg-indigo-600 px-8 text-base font-medium text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all duration-300 w-full sm:w-auto hover:-translate-y-0.5"
                        >
                            Join as Member
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                        <Link
                            href="/donate"
                            className="inline-flex h-12 items-center justify-center rounded-full border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 text-base font-medium text-slate-900 dark:text-white shadow-sm hover:border-purple-600 dark:hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 w-full sm:w-auto hover:-translate-y-0.5"
                        >
                            <Heart className="mr-2 h-4 w-4" />
                            Make a Donation
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
