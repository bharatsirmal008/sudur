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
        <section id="contact" className="py-24 bg-black border-t border-slate-900/50 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col xl:flex-row gap-16 xl:gap-24 items-center xl:items-start">

                {/* Left Side */}
                <div className="w-full xl:flex-1 flex flex-col justify-center">
                    <h2 className="font-sans font-black uppercase leading-[0.85] tracking-tighter flex flex-col m-0">
                        <span className="text-[1.5rem] md:text-[2.5rem] lg:text-[4rem] text-[#e33737]">TRANSPARENTLY</span>
                        <span className="text-[1.5rem] md:text-[2.5rem] lg:text-[4rem] text-white mt-1">UNVEILING OUR</span>
                        <span className="text-[1.5rem] md:text-[2.5rem] lg:text-[4rem] text-white mt-1">ACCOUNT.</span>
                    </h2>
                </div>

                {/* Right Side */}
                <div className="w-full xl:w-[500px] flex flex-col justify-center space-y-10 shrink-0 mt-8 xl:mt-0">

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                        </div>
                    ) : stats ? (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                                {/* Stat 1 */}
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-semibold tracking-widest uppercase text-emerald-500">
                                        FUNDS RECEIVED
                                    </span>
                                    <div className="text-2xl sm:text-3xl font-black tracking-tight text-gray-200 flex items-baseline">
                                        RS.{formatCurrency(stats.fundsReceived)}<span className="text-gray-600/70">.00</span>
                                    </div>
                                </div>

                                {/* Stat 2 */}
                                {/* <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-semibold tracking-widest uppercase text-orange-500">
                                        KINDS RECEIVED
                                    </span>
                                    <div className="text-2xl sm:text-3xl font-black tracking-tight text-gray-200 flex items-baseline">
                                        RS.{formatCurrency(stats.kindsReceived)}<span className="text-gray-600/70">.00</span>
                                    </div>
                                </div> */}

                                {/* Stat 3 */}
                                {/* <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-semibold tracking-widest uppercase text-[#e33737]">
                                        TOTAL SPENT
                                    </span>
                                    <div className="text-2xl sm:text-3xl font-black tracking-tight text-gray-200 flex items-baseline">
                                        RS.{formatCurrency(stats.totalSpent)}<span className="text-gray-600/70">.00</span>
                                    </div>
                                </div> */}

                                {/* Stat 4 */}
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-500">
                                        TOTAL AMOUNT
                                    </span>
                                    <div className="text-2xl sm:text-3xl font-black tracking-tight text-gray-200 flex items-baseline">
                                        RS.{formatCurrency(stats.totalAmount)}<span className="text-gray-600/70">.00</span>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar Area */}
                            <div className="space-y-6 pt-2">
                                {/* Progress Bar */}
                                <div className="flex w-full h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `${(stats.fundsReceived / stats.totalAmount) * 100}%` }}></div>
                                    {/* <div className="h-full bg-orange-500" style={{ width: `${(stats.kindsReceived / stats.totalAmount) * 100}%` }}></div> */}
                                    {/* <div className="h-full bg-[#e33737]" style={{ width: `${(stats.totalSpent / stats.totalAmount) * 100}%` }}></div> */}
                                    <div className="h-full bg-[#333333]" style={{ width: `${(stats.remainingAmount / stats.totalAmount) * 100}%` }}></div>
                                </div>

                                {/* Remaining */}
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
                                        REMAINING AMOUNT
                                    </span>
                                    <div className="text-2xl sm:text-3xl font-black tracking-tight text-gray-200 flex items-baseline">
                                        RS.{formatCurrency(stats.remainingAmount)}<span className="text-gray-600/70">.00</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-slate-500 text-sm">Failed to load statistics.</p>
                    )}

                    {/* Notice Box */}
                    <div className="bg-[#0f241a] rounded-md p-5 flex gap-3.5 border border-[#163627]">
                        <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1.5">
                            <h4 className="font-bold text-sm text-emerald-500">Notice!</h4>
                            <p className="text-xs text-gray-300 leading-relaxed font-medium">
                                We are currently in the process of building this site. Our team is transferring all previous account records, and soon it will be fully operational for your convenience. We appreciate your patience during this time.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
