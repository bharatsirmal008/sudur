"use client";

import { useState, useEffect } from "react";
import { Heart, Search, Loader2, DollarSign, Calendar, Mail, MapPin } from "lucide-react";

interface Donation {
    _id: string;
    amount: number;
    currency: string;
    donorName: string;
    donorEmail: string;
    phone?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    purpose?: string;
    message?: string;
    paymentMethod: string;
    status: string;
    createdAt: string;
}

export default function AdminDonationsPage() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDonations = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/donations");
            const data = await res.json();
            setDonations(data);
        } catch (err) {
            console.error("Failed to fetch donations:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    const totalDonations = donations.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Heart className="w-48 h-48 text-indigo-500" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-extrabold dark:text-white mb-2">Donation Records</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                        A complete historical log of all financial contributions. Review donor information and messages.
                    </p>
                </div>
                <div className="relative z-10 bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Total Raised</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">${totalDonations.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Donations List */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                        <p className="text-slate-500 font-medium">Fetching financial records...</p>
                    </div>
                ) : donations.length === 0 ? (
                    <div className="text-center py-24">
                        <Heart className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                        <h3 className="text-lg font-bold dark:text-white">No donations yet</h3>
                        <p className="text-slate-500">When users donate, their records will appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                    <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Donor Focus</th>
                                    <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Amount</th>
                                    <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Target/Purpose</th>
                                    <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Location</th>
                                    <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Date Received</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.map((d) => (
                                    <tr key={d._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="p-6 align-top">
                                            <div className="flex flex-col">
                                                <p className="font-bold text-slate-900 dark:text-white text-base">{d.donorName}</p>
                                                <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    <span className="text-sm font-medium">{d.donorEmail}</span>
                                                </div>
                                                {d.phone && (
                                                    <div className="text-xs text-slate-400 mt-0.5">{d.phone}</div>
                                                )}
                                                {d.message && (
                                                    <div className="mt-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 italic relative">
                                                        <span className="absolute -top-2 -left-1 text-2xl text-slate-200 dark:text-slate-800 font-serif">"</span>
                                                        <span className="relative z-10">{d.message}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6 align-top">
                                            <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-black text-lg py-1.5 px-3 rounded-lg inline-block border border-emerald-100 dark:border-emerald-800/30">
                                                ${(d.amount || 0).toFixed(2)}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2 font-medium uppercase tracking-wider">{d.paymentMethod}</p>
                                        </td>
                                        <td className="p-6 align-top">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                {d.purpose || "General Fund"}
                                            </span>
                                        </td>
                                        <td className="p-6 align-top text-slate-600 dark:text-slate-400">
                                            <div className="flex items-start gap-2 max-w-[200px]">
                                                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                                <span className="text-sm font-medium leading-relaxed">
                                                    {d.address ? (
                                                        <>
                                                            {d.address.city}, {d.address.state} <br />
                                                            <span className="text-xs text-slate-400 uppercase">{d.address.country}</span>
                                                        </>
                                                    ) : (
                                                        "Location N/A"
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6 align-top text-right">
                                            <div className="flex flex-col items-end gap-1 text-slate-500">
                                                <Calendar className="w-4 h-4 mb-1" />
                                                <span className="text-sm font-bold dark:text-slate-300">
                                                    {new Date(d.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className="text-xs">
                                                    {new Date(d.createdAt).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
