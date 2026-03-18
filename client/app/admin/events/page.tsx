"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Loader2, Calendar, MapPin } from "lucide-react";

interface Event {
    _id?: string;
    title: string;
    description: string;
    date: string;
    location: string;
    image: string;
    registrationLink?: string;
}

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState<Event>({
        title: "",
        description: "",
        date: "",
        location: "",
        image: "",
        registrationLink: ""
    });

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/events");
            const data = await res.json();
            setEvents(data);
        } catch (err) {
            console.error("Failed to fetch:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

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
                    : "https://sudurapi.vercel.app/api/upload";

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = currentEvent ? "PUT" : "POST";
        const body = currentEvent ? { ...formData, id: currentEvent._id } : formData;

        try {
            const res = await fetch("/api/events", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchEvents();
                resetForm();
            }
        } catch (err) {
            console.error("Submit failed:", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;

        try {
            const res = await fetch(`/api/events?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchEvents();
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const resetForm = () => {
        setFormData({ title: "", description: "", date: "", location: "", image: "", registrationLink: "" });
        setCurrentEvent(null);
    };

    const openEdit = (v: Event) => {
        setCurrentEvent(v);
        // Ensure date is formatted properly for input type="date"
        let fmtDate = v.date;
        if (fmtDate && fmtDate.includes("T")) fmtDate = fmtDate.split("T")[0];
        setFormData({ ...v, date: fmtDate });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0a0a] p-6 rounded-[2rem] border border-slate-800 shadow-sm relative overflow-hidden">
                <div className="relative z-10 flex flex-col justify-center">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Events Planner</h2>
                    <p className="text-sm text-slate-400 mt-1">Schedule and manage upcoming community events displayed on the homepage.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="relative z-10 inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-tr from-amber-600 to-orange-600 text-white font-black rounded-2xl hover:scale-105 transition-transform shadow-xl shadow-amber-600/20"
                >
                    <Plus className="w-5 h-5" /> Schedule Event
                </button>
            </div>

            {/* Event List */}
            <div className="bg-[#0a0a0a] rounded-[2rem] border border-slate-800 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Events...</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-24">
                        <Calendar className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white">No Upcoming Events</h3>
                        <p className="text-slate-400 text-sm mt-2">Time to engage your community. Schedule the first event now.</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/50">
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Event Details</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Date</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Location</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((ev) => (
                                <tr key={ev._id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                                                {ev.image ? (
                                                    <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-amber-600 text-white font-bold">
                                                        <Calendar className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg text-white">{ev.title}</p>
                                                <p className="text-sm text-slate-400 line-clamp-1">{ev.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 align-middle">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-900/20 text-amber-400 font-bold text-sm">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(ev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="p-6 align-middle text-slate-400 font-medium whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-slate-500" />
                                            {ev.location}
                                        </div>
                                    </td>
                                    <td className="p-6 align-middle text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEdit(ev)}
                                                className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(ev._id!)}
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
                                    <h2 className="text-2xl font-black dark:text-white uppercase tracking-tight">
                                        {currentEvent ? "Edit Event" : "New Event"}
                                    </h2>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                                        <X className="w-6 h-6 dark:text-white" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Event Title</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all font-bold"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Annual Charity Gala"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Event Date</label>
                                        <input
                                            required
                                            type="date"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all font-bold"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Location</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all font-bold"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="National City Convention Center"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Registration Link</label>
                                        <input
                                            type="url"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all font-bold"
                                            value={formData.registrationLink || ""}
                                            onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                                            placeholder="https://forms.google.com/..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Description</label>
                                        <textarea
                                            required
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all font-medium text-sm resize-none"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Describe the activities, schedule, and goals of this event..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Event Banner Image</label>
                                        <div className="flex flex-col gap-4">
                                            {formData.image && (
                                                <div className="w-full aspect-[21/9] shrink-0 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
                                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploadingImage}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:bg-amber-50 file:text-amber-600 hover:file:bg-amber-100 dark:file:bg-amber-900/30 dark:file:text-amber-400"
                                            />
                                        </div>
                                        {uploadingImage && <p className="text-xs text-amber-600 mt-2 font-black flex items-center gap-2 uppercase tracking-widest"><Loader2 className="w-3 h-3 animate-spin" /> Uploading to secure cloud...</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={uploadingImage}
                                        className="w-full py-4 bg-amber-500 text-white font-black rounded-2xl hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 mt-8 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                                    >
                                        {currentEvent ? "Update Event" : "Publish Event"}
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
