"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, RefreshCw, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
    const [stats, setStats] = useState({
        fundsReceived: 0,
        kindsReceived: 0,
        totalSpent: 0,
        totalAmount: 0,
        remainingAmount: 0
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetch("/api/transparency")
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setStats({
                        fundsReceived: data.fundsReceived || 0,
                        kindsReceived: data.kindsReceived || 0,
                        totalSpent: data.totalSpent || 0,
                        totalAmount: data.totalAmount || 0,
                        remainingAmount: data.remainingAmount || 0
                    });
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch("/api/transparency", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(stats)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Statistics updated successfully!' });
            } else {
                throw new Error("Failed to update");
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update statistics. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Settings...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-black tracking-tight text-white mb-2">Transparency Settings</h1>
                <p className="text-slate-400">Manage the financial data displayed in the public transparency section.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#0a0a0a] border border-slate-800 p-6 rounded-3xl space-y-4">
                        <label className="block">
                            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2 block">Funds Received (RS)</span>
                            <input
                                type="number"
                                value={stats.fundsReceived}
                                onChange={(e) => setStats({ ...stats, fundsReceived: parseFloat(e.target.value) })}
                                className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </label>

                        <label className="block">
                            <span className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2 block">Kinds Received (RS)</span>
                            <input
                                type="number"
                                value={stats.kindsReceived}
                                onChange={(e) => setStats({ ...stats, kindsReceived: parseFloat(e.target.value) })}
                                className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </label>
                    </div>

                    <div className="bg-[#0a0a0a] border border-slate-800 p-6 rounded-3xl space-y-4">
                        <label className="block">
                            <span className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-2 block">Total Spent (RS)</span>
                            <input
                                type="number"
                                value={stats.totalSpent}
                                onChange={(e) => setStats({ ...stats, totalSpent: parseFloat(e.target.value) })}
                                className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </label>

                        <label className="block">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Total Amount (RS)</span>
                            <input
                                type="number"
                                value={stats.totalAmount}
                                onChange={(e) => setStats({ ...stats, totalAmount: parseFloat(e.target.value) })}
                                className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </label>
                    </div>

                    <div className="bg-[#0a0a0a] border border-slate-800 p-6 rounded-3xl md:col-span-2">
                        <label className="block">
                            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">Remaining Amount (RS)</span>
                            <input
                                type="number"
                                value={stats.remainingAmount}
                                onChange={(e) => setStats({ ...stats, remainingAmount: parseFloat(e.target.value) })}
                                className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </label>
                    </div>
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-center gap-3 p-4 rounded-2xl ${
                            message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                        }`}
                    >
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="text-sm font-bold">{message.text}</span>
                    </motion.div>
                )}

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-indigo-500/20"
                    >
                        {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {saving ? "Saving Changes..." : "Save Statistics"}
                    </button>
                </div>
            </form>
        </div>
    );
}
