"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Info, Loader2 } from "lucide-react";

interface TransparencyStats {
    fundsReceived: number;
    kindsReceived: number;
    totalSpent: number;
    totalAmount: number;
    remainingAmount: number;
}

export default function Transparency() {
    const [stats, setStats] = useState<TransparencyStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/transparency")
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Error fetching transparency stats:", err))
            .finally(() => setLoading(false));
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <section id="transparency" className="py-32 bg-white border-t border-slate-100 overflow-x-hidden relative">
            {/* Background Branded Assets */}
            <img
                src="/green_ellipse.svg"
                alt=""
                className="absolute  top-10 w-[20rem] h-[20rem]  pointer-events-none"
            />
            <img
                src="/blue_ellipse.svg"
                alt=""
                className="absolute bottom-10 right-10 w-[20rem] h-[20rem]  pointer-events-none"
            />

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 flex flex-col xl:flex-row gap-12 xl:gap-20 items-center xl:items-start relative z-10">

                {/* Left Side */}
                <div className="w-full xl:flex-1 flex flex-col justify-center">
                    <h2 className="font-sans font-black uppercase leading-[0.85] tracking-tighter flex flex-col m-0">
                        <motion.span
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="text-[1.5rem] md:text-[2.2rem] lg:text-[3.8rem] xl:text-[4.2rem] bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 whitespace-nowrap"
                        >
                            {"TRANSPARENTLY".split("").map((char, index) => (
                                <motion.span
                                    key={index}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0, transition: { delay: index * 0.05, duration: 0.5, ease: "easeOut" } }
                                    }}
                                    className="inline-block"
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="text-[1.5rem] md:text-[2.5rem] lg:text-[4.5rem] text-slate-900 mt-2"
                        >
                            UNVEILING OUR
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1.1, duration: 0.8 }}
                            className="text-[1.5rem] md:text-[2.5rem] lg:text-[4.5rem] text-slate-900 mt-1"
                        >
                            ACCOUNT.
                        </motion.span>
                    </h2>
                </div>

                {/* Right Side */}
                <div className="w-full xl:w-[500px] flex flex-col justify-center space-y-10 shrink-0 mt-8 xl:mt-0">

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                        </div>
                    ) : stats ? (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                                {/* Stat 1 */}
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-semibold tracking-widest uppercase text-emerald-600">
                                        FUNDS RECEIVED
                                    </span>
                                    <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-baseline">
                                        Rs. {formatCurrency(stats.fundsReceived)}<span className="text-slate-400">.00</span>
                                    </div>
                                </div>

                                {/* Stat 2: TOTAL SPENT */}
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-semibold tracking-widest uppercase text-[#e33737]">
                                        TOTAL SPENT
                                    </span>
                                    <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-baseline">
                                        Rs. {formatCurrency(stats.totalSpent)}<span className="text-slate-400">.00</span>
                                    </div>
                                </div>

                                {/* Stat 3: REMAINING AMOUNT */}
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-500">
                                        REMAINING AMOUNT
                                    </span>
                                    <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-baseline">
                                        Rs. {formatCurrency(stats.remainingAmount)}<span className="text-slate-400">.00</span>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar Area */}
                            <div className="space-y-6 pt-2">
                                {/* Split progress bar of total received */}
                                <div className="flex w-full h-1.5 rounded-full overflow-hidden bg-slate-100">
                                    <div className="h-full bg-emerald-500" style={{ width: `${stats.fundsReceived === 0 ? 0 : (stats.remainingAmount / stats.fundsReceived) * 100}%` }}></div>
                                    <div className="h-full bg-[#e33737]" style={{ width: `${stats.fundsReceived === 0 ? 0 : (stats.totalSpent / stats.fundsReceived) * 100}%` }}></div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-slate-500 text-sm">Failed to load statistics.</p>
                    )}

                    {/* Notice Box */}
                    <div className="bg-emerald-50 rounded-xl p-6 flex gap-4 border border-emerald-100 shadow-sm shadow-emerald-500/5">
                        <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1.5">
                            <h4 className="font-bold text-sm text-emerald-700">Notice!</h4>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                We are currently in the process of building this site. Our team is transferring all previous account records, and soon it will be fully operational for your convenience. We appreciate your patience during this time.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
