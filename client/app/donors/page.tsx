"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Loader2, ArrowLeft, Trophy, Calendar, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function DonorsPage() {
    const [donors, setDonors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPurpose, setSelectedPurpose] = useState<string>("All");

    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const res = await fetch("/api/donations");
                if (res.ok) {
                    const data = await res.json();
                    const verified = data.filter((d: any) => d.status === 'verified');
                    const sorted = verified.sort((a: any, b: any) => parseFloat(b.amount) - parseFloat(a.amount));
                    setDonors(sorted);
                }
            } catch (err) {
                console.error("Failed to fetch donors:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDonors();
    }, []);

    const uniquePurposes = Array.from(new Set(donors.map(d => d.purpose).filter(Boolean)));

    const filteredDonors = selectedPurpose === "All" 
        ? donors 
        : donors.filter(d => d.purpose === selectedPurpose);

    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-20 pt-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[10%] left-[-5%] w-[30rem] h-[30rem] bg-amber-100 rounded-full blur-[120px] -z-10 opacity-60" />
            <div className="absolute bottom-[20%] right-[-5%] w-[35rem] h-[35rem] bg-emerald-50 rounded-full blur-[120px] -z-10 opacity-60" />

            <div className="max-w-4xl mx-auto px-6">
                <div className="mb-12 text-center relative z-10">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-black uppercase tracking-widest text-slate-400 hover:text-amber-500 transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
                            <Trophy className="w-8 h-8 text-amber-500" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">
                        Our Generous <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Donors</span>
                    </h1>
                    <p className="text-slate-500 font-medium max-w-xl mx-auto mb-8">
                        Thank you to everyone who has contributed to our mission. Your support makes everything possible.
                    </p>

                    {uniquePurposes.length > 0 && (
                        <div className="flex justify-center">
                            <select 
                                value={selectedPurpose}
                                onChange={(e) => setSelectedPurpose(e.target.value)}
                                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-amber-500 focus:border-amber-500 block p-3 px-6 shadow-sm font-bold uppercase tracking-widest cursor-pointer"
                            >
                                <option value="All">All Purposes</option>
                                {uniquePurposes.map((purpose: any, i) => (
                                    <option key={i} value={purpose}>{purpose}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                    </div>
                ) : filteredDonors.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-slate-100">
                        <Heart className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-800">No donors found for this purpose.</h3>
                        <p className="text-slate-500 mt-2">Check back later or try another filter.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 relative z-10">
                        {filteredDonors.map((donor, index) => (
                            <motion.div
                                key={donor._id || index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className="relative shrink-0 flex flex-col items-center justify-center w-12 h-12">
                                        {index < 3 ? (
                                            <Trophy className={`w-8 h-8 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-slate-400' : 'text-amber-700'}`} />
                                        ) : (
                                            <span className="text-2xl font-black text-slate-200">#{index + 1}</span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                            {donor.fullName}
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        </h3>
                                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                                            {donor.role && <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{donor.role}</span>}
                                            {donor.address && <span className="flex items-center gap-1">{donor.address}</span>}
                                            {donor.createdAt && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(donor.createdAt).toLocaleDateString()}</span>}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="w-full md:w-auto text-left md:text-right bg-emerald-50 md:bg-transparent p-4 md:p-0 rounded-xl">
                                    <p className="text-xs font-black uppercase text-emerald-600/60 tracking-widest mb-1">
                                        {donor.purpose ? `Donated For: ${donor.purpose}` : 'Donated'}
                                    </p>
                                    <p className="text-2xl font-black text-emerald-600">Rs. {parseFloat(donor.amount).toLocaleString()}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
