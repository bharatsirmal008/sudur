"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
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
    isVisible?: boolean;
    socials: {
        instagram?: string;
        linkedin?: string;
        facebook?: string;
    };
}

export default function AdminVolunteersPage() {
    const { showToast, confirm } = useToast();
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
        isVisible: true,
        socials: { instagram: "", linkedin: "", facebook: "" }
    });

    const fetchVolunteers = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/volunteers?admin=true");
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
                showToast(currentVolunteer ? "Volunteer updated!" : "New volunteer added!", "success");
                setIsModalOpen(false);
                fetchVolunteers();
                resetForm();
            }
        } catch (err) {
            console.error("Submit failed:", err);
        }
    };

    const handleDelete = async (id: string) => {
        confirm({
            title: "Remove Volunteer?",
            message: "Are you sure you want to delete this volunteer? Their profile will be permanently removed from the system.",
            confirmText: "Remove Member",
            isDestructive: true,
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/volunteers?id=${id}`, { method: "DELETE" });
                    if (res.ok) {
                        showToast("Volunteer removed successfully", "success");
                        fetchVolunteers();
                    }
                } catch (err) {
                    showToast("Failed to remove volunteer", "error");
                }
            },
            onCancel: () => {}
        });
    };

    const toggleVisibility = async (v: Volunteer) => {
        try {
            const res = await fetch("/api/volunteers", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...v, id: v._id, isVisible: !v.isVisible }),
            });
            if (res.ok) {
                showToast(`Visibility updated!`, "info");
                fetchVolunteers();
            }
        } catch (err) {
            showToast("Failed to toggle visibility", "error");
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            role: "Volunteer",
            location: "Khirsain",
            image: "",
            isVisible: true,
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
                const uploadUrl = "/api/upload";


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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[20px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div>
                    <h2 className="text-xl font-bold text-[#111827]">Volunteer Roster</h2>
                    <p className="text-sm text-slate-500">Add, edit, or remove team members displayed on the frontend.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#16A34A] text-white font-bold rounded-xl hover:bg-[#15803D] transition-all shadow-lg shadow-green-100"
                >
                    <Plus className="w-5 h-5" /> Add Volunteer
                </button>
            </div>

            {/* Volunteer List */}
            <div className="bg-white rounded-[20px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-[#16A34A] animate-spin mb-4" />
                        <p className="text-slate-400">Loading roster...</p>
                    </div>
                ) : volunteers.length === 0 ? (
                    <div className="text-center py-20">
                        <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-[#111827]">No volunteers found</h3>
                        <p className="text-slate-500">Get started by adding your first team member.</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 bg-[#F0FDF4]">
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-[#16A34A]">Team Member</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-[#16A34A]">Role</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-[#16A34A]">Location</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-[#16A34A] text-center">Visibility</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-[#16A34A] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {volunteers.map((v) => (
                                <tr key={v._id} className="border-b border-slate-50 hover:bg-green-50/30 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100">
                                                {v.image ? (
                                                    <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[#16A34A] font-bold">
                                                        {v.name[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#111827]">{v.name}</p>
                                                <div className="flex gap-2 mt-1">
                                                    {v.socials.instagram && <Instagram className="w-3 h-3 text-slate-400" />}
                                                    {v.socials.linkedin && <Linkedin className="w-3 h-3 text-slate-400" />}
                                                    {v.socials.facebook && <Facebook className="w-3 h-3 text-slate-400" />}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 rounded-full bg-green-50 text-[#16A34A] text-xs font-bold">
                                            {v.role}
                                        </span>
                                    </td>
                                    <td className="p-6 text-slate-600 font-medium">
                                        {v.location}
                                    </td>
                                    <td className="p-6 text-center">
                                        <button
                                            onClick={() => toggleVisibility(v)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${v.isVisible !== false ? 'bg-[#16A34A]' : 'bg-slate-200'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${v.isVisible !== false ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEdit(v)}
                                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(v._id!)}
                                                className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
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
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[101] overflow-y-auto rounded-l-[20px]"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold text-[#111827]">
                                        {currentVolunteer ? "Edit Volunteer" : "Add New Volunteer"}
                                    </h2>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                                        <X className="w-6 h-6 text-[#111827]" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-[#111827] focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none transition-all"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Anil Baniya"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-[#111827] focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none transition-all"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            placeholder="e.g. Senior Volunteer"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-[#111827] focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none transition-all"
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

                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="isVisible"
                                            className="w-5 h-5 rounded border-slate-200 text-[#16A34A] focus:ring-[#16A34A]"
                                            checked={formData.isVisible !== false}
                                            onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                                        />
                                        <label htmlFor="isVisible" className="text-sm font-bold text-slate-700">
                                            Enable on Main Page
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Volunteer Image</label>
                                        <div className="flex items-center gap-4">
                                            {formData.image && (
                                                <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden border border-slate-100">
                                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploadingImage}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-[#111827] focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-green-50 file:text-[#16A34A] hover:file:bg-green-100"
                                            />
                                        </div>
                                        {uploadingImage && <p className="text-xs text-[#16A34A] mt-2 font-medium flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Uploading to secure cloud...</p>}
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Social Links</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <Instagram className="w-5 h-5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    className="flex-1 px-4 py-2 text-sm rounded-lg border border-slate-200 bg-white text-[#111827] outline-none"
                                                    value={formData.socials.instagram}
                                                    onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, instagram: e.target.value } })}
                                                    placeholder="Instagram URL"
                                                />
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Linkedin className="w-5 h-5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    className="flex-1 px-4 py-2 text-sm rounded-lg border border-slate-200 bg-white text-[#111827] outline-none"
                                                    value={formData.socials.linkedin}
                                                    onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, linkedin: e.target.value } })}
                                                    placeholder="LinkedIn URL"
                                                />
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Facebook className="w-5 h-5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    className="flex-1 px-4 py-2 text-sm rounded-lg border border-slate-200 bg-white text-[#111827] outline-none"
                                                    value={formData.socials.facebook}
                                                    onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, facebook: e.target.value } })}
                                                    placeholder="Facebook URL"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-8">
                                        <button
                                            type="submit"
                                            disabled={uploadingImage}
                                            className="w-full py-5 bg-[#16A34A] text-white font-black uppercase tracking-widest rounded-[20px] hover:bg-[#15803D] transition-all flex items-center justify-center gap-2 shadow-xl shadow-green-100 disabled:opacity-50"
                                        >
                                            <Plus className="w-5 h-5" />
                                            {currentVolunteer ? "Update Volunteer" : "Add to Roster"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
