"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    X,
    Globe,
    Instagram,
    Linkedin,
    Facebook,
    MoreVertical,
    Loader2,
    Users
} from "lucide-react";

interface Volunteer {
    _id?: string;
    name: string;
    role: string;
    location: string;
    image: string;
    socials: {
        instagram?: string;
        linkedin?: string;
        facebook?: string;
    };
}

export default function AdminVolunteersPage() {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVolunteer, setCurrentVolunteer] = useState<Volunteer | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState<Volunteer>({
        name: "",
        role: "Volunteer",
        location: "Khirsain",
        image: "",
        socials: { instagram: "", linkedin: "", facebook: "" }
    });

    const fetchVolunteers = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/volunteers");
            const data = await res.json();
            setVolunteers(data);
        } catch (err) {
            console.error("Failed to fetch:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = currentVolunteer ? "PUT" : "POST";
        const body = currentVolunteer ? { ...formData, id: currentVolunteer._id } : formData;

        try {
            const res = await fetch("/api/volunteers", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchVolunteers();
                resetForm();
            }
        } catch (err) {
            console.error("Submit failed:", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this volunteer?")) return;

        try {
            const res = await fetch(`/api/volunteers?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchVolunteers();
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            role: "Volunteer",
            location: "Khirsain",
            image: "",
            socials: { instagram: "", linkedin: "", facebook: "" }
        });
        setCurrentVolunteer(null);
    };

    const openEdit = (v: Volunteer) => {
        setCurrentVolunteer(v);
        setFormData(v);
        setIsModalOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                const base64Image = reader.result;
                const uploadUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL
                    ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/upload`
                    : "/api/upload";


                const res = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: base64Image })
                });

                if (!res.ok) {
                    throw new Error(`Upload failed with status ${res.status}`);
                }

                const data = await res.json();
                if (data.url) {
                    setFormData(prev => ({ ...prev, image: data.url }));
                }
                setUploadingImage(false);
            };
        } catch (err) {
            console.error("Upload failed", err);
            setUploadingImage(false);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0a0a] p-6 rounded-[2rem] border border-slate-800 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-white">Volunteer Roster</h2>
                    <p className="text-sm text-slate-400">Add, edit, or remove team members displayed on the frontend.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
                >
                    <Plus className="w-5 h-5" /> Add Volunteer
                </button>
            </div>

            {/* Volunteer List */}
            <div className="bg-[#0a0a0a] rounded-[2rem] border border-slate-800 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                        <p className="text-slate-400">Loading roster...</p>
                    </div>
                ) : volunteers.length === 0 ? (
                    <div className="text-center py-20">
                        <Users className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white">No volunteers found</h3>
                        <p className="text-slate-400">Get started by adding your first team member.</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/50">
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Team Member</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Role</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Location</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {volunteers.map((v) => (
                                <tr key={v._id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800">
                                                {v.image ? (
                                                    <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-indigo-400 font-bold">
                                                        {v.name[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{v.name}</p>
                                                <div className="flex gap-2 mt-1">
                                                    {v.socials.instagram && <Instagram className="w-3 h-3 text-slate-500" />}
                                                    {v.socials.linkedin && <Linkedin className="w-3 h-3 text-slate-500" />}
                                                    {v.socials.facebook && <Facebook className="w-3 h-3 text-slate-500" />}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold">
                                            {v.role}
                                        </span>
                                    </td>
                                    <td className="p-6 text-slate-400 font-medium">
                                        {v.location}
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEdit(v)}
                                                className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(v._id!)}
                                                className="p-2 hover:bg-red-900/20 rounded-lg text-slate-500 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal / Form Slide-over */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-[101] overflow-y-auto"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold dark:text-white">
                                        {currentVolunteer ? "Edit Volunteer" : "Add New Volunteer"}
                                    </h2>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                                        <X className="w-6 h-6 dark:text-white" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Anil Baniya"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Role</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            placeholder="e.g. Senior Volunteer"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Location</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        >
                                            <option value="Khirsain">Khirsain</option>
                                            <option value="Bagleka">Bagleka</option>
                                            <option value="Sanagaun">Sanagaun</option>
                                            <option value="Pokhari">Pokhari</option>
                                            <option value="Gajari">Gajari</option>
                                            <option value="Gairagaun">Gairagaun</option>
                                            <option value="Kadamandu">Kadamandu</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Volunteer Image</label>
                                        <div className="flex items-center gap-4">
                                            {formData.image && (
                                                <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploadingImage}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-400"
                                            />
                                        </div>
                                        {uploadingImage && <p className="text-xs text-indigo-600 mt-2 font-medium flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Uploading to secure cloud...</p>}
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Social Links</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <Instagram className="w-5 h-5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    className="flex-1 px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white outline-none"
                                                    value={formData.socials.instagram}
                                                    onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, instagram: e.target.value } })}
                                                    placeholder="Instagram URL"
                                                />
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Linkedin className="w-5 h-5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    className="flex-1 px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white outline-none"
                                                    value={formData.socials.linkedin}
                                                    onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, linkedin: e.target.value } })}
                                                    placeholder="LinkedIn URL"
                                                />
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Facebook className="w-5 h-5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    className="flex-1 px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white outline-none"
                                                    value={formData.socials.facebook}
                                                    onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, facebook: e.target.value } })}
                                                    placeholder="Facebook URL"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={uploadingImage}
                                        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {currentVolunteer ? "Update Volunteer" : "Add Volunteer"}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
