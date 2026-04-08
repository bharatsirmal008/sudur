"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, RefreshCw, AlertCircle, CheckCircle2, Loader2, Image as ImageIcon, User, Building, Mail } from "lucide-react";

interface SiteSettings {
    adminName: string;
    orgName: string;
    adminEmail: string;
    logoUrl: string;
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<SiteSettings>({
        adminName: '',
        orgName: '',
        adminEmail: '',
        logoUrl: ''
    });
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setSettings({
                        adminName: data.adminName || '',
                        orgName: data.orgName || '',
                        adminEmail: data.adminEmail || '',
                        logoUrl: data.logoUrl || ''
                    });
                }
            })
            .catch(err => console.error("Error fetching settings:", err))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'System Configuration Updated!' });
            } else {
                throw new Error("Failed to update");
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to apply configuration.' });
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
        <div className="max-w-4xl mx-auto pb-10">
            <div className="mb-8">
                <h1 className="text-3xl font-black tracking-tight text-white mb-2">Global Settings</h1>
                <p className="text-slate-400">Manage administrator profiles, organization branding, and contact channels.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                
                {/* Branding Section */}
                <div className="bg-[#0a0a0a] border border-slate-800 p-8 rounded-[2rem] shadow-sm">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-indigo-500" /> Site Branding
                    </h2>
                    
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Logo Preview */}
                        <div className="w-full md:w-48 aspect-square rounded-3xl border-2 border-dashed border-slate-800 bg-black flex items-center justify-center overflow-hidden shrink-0 relative group">
                            {settings.logoUrl ? (
                                <img src={settings.logoUrl} alt="Logo Preview" className="w-full h-full object-contain p-4" />
                            ) : (
                                <div className="text-center p-4">
                                    <Building className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">No Logo</p>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-5 w-full">
                            <label className="block">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">Organization Name</span>
                                <input
                                    type="text"
                                    value={settings.orgName}
                                    onChange={(e) => setSettings({ ...settings, orgName: e.target.value })}
                                    className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="Enter full organization name..."
                                />
                            </label>

                            <label className="block">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">Logo URL (External Link)</span>
                                <input
                                    type="url"
                                    value={settings.logoUrl}
                                    onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                                    className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-emerald-400 font-mono text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="https://yourapp.com/logo.png"
                                />
                                <p className="text-[10px] text-slate-600 mt-2">Paste a direct image link or use Cloudinary. PNG with transparent background recommended.</p>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Administrator Profile */}
                <div className="bg-[#0a0a0a] border border-slate-800 p-8 rounded-[2rem] shadow-sm">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-500" /> Default Administrator Configuration
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <label className="block">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">Primary Admin Name</span>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                <input
                                    type="text"
                                    value={settings.adminName}
                                    onChange={(e) => setSettings({ ...settings, adminName: e.target.value })}
                                    className="w-full bg-black border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                        </label>

                        <label className="block">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">System Contact Email</span>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                <input
                                    type="email"
                                    value={settings.adminEmail}
                                    onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                                    className="w-full bg-black border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="sysadmin@example.com"
                                />
                            </div>
                        </label>
                    </div>
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`flex items-center gap-3 p-5 rounded-2xl border ${
                            message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                        }`}
                    >
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="text-sm font-bold tracking-wide">{message.text}</span>
                    </motion.div>
                )}

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                    <p className="text-slate-500 italic text-xs">Remember to configure your production SMTP server to make use of dynamic outbound emails.</p>
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-xl shadow-indigo-500/20"
                    >
                        {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {saving ? "Saving Changes..." : "Apply Global Configuration"}
                    </button>
                </div>
            </form>
        </div>
    );
}
