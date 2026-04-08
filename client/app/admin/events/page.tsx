"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Loader2, Calendar, MapPin } from "lucide-react";

interface Event {
    _id?: string;
    title: string;
    description: string;
    shortDescription?: string;
    date: string;
    location: string;
    image: string;
    registrationLink?: string;
    organizer?: string;
    startTime?: string;
    endTime?: string;
    activities?: string;
    impactPoints?: string | string[];
    terms?: string;
    criteria?: string;
    feedbackLink?: string;
    otherInfo?: string;
    status?: 'scheduled' | 'live' | 'closed';
}

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [activeTab, setActiveTab] = useState<"card" | "details">("card");
    const [formData, setFormData] = useState<Event>({
        title: "",
        description: "",
        shortDescription: "",
        date: "",
        location: "",
        image: "",
        registrationLink: "",
        organizer: "",
        startTime: "",
        endTime: "",
        activities: "",
        impactPoints: "",
        terms: "",
        criteria: "",
        feedbackLink: "",
        otherInfo: ""
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
                const uploadUrl = "/api/upload";

                const res = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: base64Image })
                });

                if (!res.ok) throw new Error("Upload failed");

                const data = await res.json();
                if (data.url) setFormData(prev => ({ ...prev, image: data.url }));
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
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`/api/events?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchEvents();
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const resetForm = () => {
        setFormData({ 
            title: "", 
            description: "", 
            date: "", 
            location: "", 
            image: "", 
            registrationLink: "",
            organizer: "",
            startTime: "",
            endTime: "",
            activities: "",
            impactPoints: ""
        });
        setCurrentEvent(null);
        setActiveTab("card");
    };

    const openEdit = (v: Event) => {
        setCurrentEvent(v);
        let fmtDate = v.date;
        if (fmtDate && fmtDate.includes("T")) fmtDate = fmtDate.split("T")[0];
        setFormData({ 
            ...v, 
            date: fmtDate,
            organizer: v.organizer || "",
            startTime: v.startTime || "",
            endTime: v.endTime || "",
            activities: v.activities || "",
            impactPoints: Array.isArray(v.impactPoints) ? v.impactPoints.join('\n') : (v.impactPoints || "")
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-20">
            {/* 1. SCHEDULE EVENT SECTION (AS CARDS) */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight">Schedule Events</h2>
                        <p className="text-slate-400 mt-1">Manage the visual cards that appear on the homepage.</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5733] text-white font-black rounded-xl hover:scale-105 transition-transform shadow-xl shadow-[#FF5733]/20"
                    >
                        <Plus className="w-5 h-5" /> New Event
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-[#0a0a0a] rounded-[2.5rem] border border-slate-900">
                        <Loader2 className="w-10 h-10 text-[#FF5733] animate-spin mb-4" />
                        <p className="text-[#FF5733] font-bold uppercase tracking-widest text-xs">Syncing...</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-24 bg-[#0a0a0a] rounded-[2.5rem] border border-slate-900">
                        <Calendar className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white">No Upcoming Events</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((ev) => (
                            <motion.div 
                                key={ev._id}
                                layoutId={ev._id}
                                className="group bg-[#0a0a0a] rounded-[2rem] border border-slate-800 overflow-hidden hover:border-[#FF5733]/50 transition-colors shadow-lg"
                            >
                                <div className="h-48 relative overflow-hidden bg-slate-900 flex items-center justify-center">
                                    {ev.image ? (
                                        <img src={ev.image} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest">No Poster Uploaded</div>
                                    )}
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button onClick={() => openEdit(ev)} className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-[#FF5733] transition-colors shadow-lg">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(ev._id!)} className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors shadow-lg">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center gap-3 text-xs font-bold text-[#FF5733] uppercase">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(ev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <h3 className="text-lg font-black text-white line-clamp-1">{ev.title}</h3>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                        <MapPin className="w-4 h-4" />
                                        <span className="truncate">{ev.location}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal / Slide-over with TWO PARTS */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25 }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-[500px] bg-[#0a0a0a] border-l border-slate-800 z-[101] overflow-y-auto"
                        >
                            <div className="p-8 pb-32">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-black text-white uppercase">{currentEvent ? "Refine Event" : "Setup Event"}</h2>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* TAB NAVIGATION */}
                                <div className="flex gap-2 p-1 bg-slate-900 rounded-2xl mb-8">
                                    <button 
                                        onClick={() => setActiveTab("card")}
                                        className={`flex-1 py-3 text-xs font-black uppercase rounded-xl transition-all ${activeTab === 'card' ? 'bg-[#FF5733] text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        1. Schedule Card
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab("details")}
                                        className={`flex-1 py-3 text-xs font-black uppercase rounded-xl transition-all ${activeTab === 'details' ? 'bg-[#FF5733] text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        2. Event Details
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {activeTab === "card" ? (
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Event Poster</label>
                                                <div className="space-y-4">
                                                    {formData.image && (
                                                        <div className="w-full aspect-video rounded-[1.5rem] overflow-hidden border border-slate-800 shadow-2xl relative group">
                                                            <img src={formData.image} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <p className="text-white text-xs font-bold">Replace Poster</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <input 
                                                        type="file" 
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        disabled={uploadingImage}
                                                        className="w-full text-xs text-slate-400 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-slate-900 file:text-[#FF5733] hover:file:bg-slate-800"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Event Title</label>
                                                <input required type="text" className="admin-input" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Hope Gala Fundraiser" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Start Time</label>
                                                    <input type="time" className="admin-input bg-slate-900" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">End Time</label>
                                                    <input type="time" className="admin-input bg-slate-900" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Event Date (Deadline)</label>
                                                    <input required type="date" className="admin-input" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Event Status</label>
                                                    <select 
                                                        className="admin-input appearance-none bg-slate-900"
                                                        value={formData.status || 'scheduled'} 
                                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                                    >
                                                        <option value="scheduled">⏱ Scheduled</option>
                                                        <option value="live">🔴 Live Now</option>
                                                        <option value="closed">⛔ Closed / Ended</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Location</label>
                                                <input required type="text" className="admin-input" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Springfield" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Short Description (Shows on Card)</label>
                                                <textarea required rows={3} className="admin-input resize-none" value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} placeholder="Annual scholarship program for outstanding students..." />
                                            </div>
                                            <div className="flex gap-4">
                                                <button 
                                                    type="button"
                                                    onClick={() => setActiveTab("details")}
                                                    className="flex-[2] py-5 bg-slate-900 border border-slate-800 text-slate-300 font-black uppercase text-xs rounded-2xl hover:border-[#FF5733] transition-all"
                                                >
                                                    Step 2: Page Details <ArrowRight className="inline-block w-4 h-4 ml-2" />
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="flex-1 py-5 bg-[#FF5733]/10 border border-[#FF5733]/30 text-[#FF5733] font-black uppercase text-xs rounded-2xl hover:bg-[#FF5733] hover:text-white transition-all"
                                                >
                                                    Publish
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                            <div className="bg-[#FF5733]/5 p-6 rounded-2xl border border-[#FF5733]/10">
                                                <h4 className="text-white font-bold text-sm mb-2">Rich Detail Page Content</h4>
                                                <p className="text-slate-400 text-xs text-balance">These fields appear on the dedicated event information page.</p>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">About Events Details (Main Content)</label>
                                                <textarea required rows={5} className="admin-input resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Support a cause that touches hearts. Be part of our charity event for a better tomorrow..." />
                                            </div>

                                            <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Event Organizer</label>
                                                    <input type="text" className="admin-input" value={formData.organizer} onChange={(e) => setFormData({ ...formData, organizer: e.target.value })} placeholder="Organization Name" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Terms & Conditions</label>
                                                    <textarea rows={3} className="admin-input resize-none" value={formData.terms} onChange={(e) => setFormData({ ...formData, terms: e.target.value })} placeholder="Non-refundable tickets..." />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Criteria for Join</label>
                                                    <textarea rows={3} className="admin-input resize-none" value={formData.criteria} onChange={(e) => setFormData({ ...formData, criteria: e.target.value })} placeholder="Above 18 only..." />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Activities & Highlights</label>
                                                <textarea rows={3} className="admin-input resize-none" value={formData.activities} onChange={(e) => setFormData({ ...formData, activities: e.target.value })} placeholder="Morning keynote, Networking lunch..." />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Impact of Your Support (List)</label>
                                                <textarea rows={4} className="admin-input resize-none" value={Array.isArray(formData.impactPoints) ? formData.impactPoints.join('\n') : formData.impactPoints} onChange={(e) => setFormData({ ...formData, impactPoints: e.target.value })} placeholder="Direct Community Aid&#10;Empowering Youth" />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Feedback Link</label>
                                                    <input type="url" className="admin-input" value={formData.feedbackLink} onChange={(e) => setFormData({ ...formData, feedbackLink: e.target.value })} placeholder="https://..." />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Other Info</label>
                                                    <input type="text" className="admin-input" value={formData.otherInfo} onChange={(e) => setFormData({ ...formData, otherInfo: e.target.value })} placeholder="Parking available..." />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Registration Link (CTA)</label>
                                                <input type="url" className="admin-input" value={formData.registrationLink || ""} onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })} placeholder="https://..." />
                                            </div>
                                            
                                            <div className="pt-8">
                                                <button
                                                    type="submit"
                                                    disabled={uploadingImage}
                                                    className="w-full py-6 bg-[#FF5733] text-white font-black rounded-[2rem] hover:bg-[#e64a19] transition-all shadow-2xl shadow-[#FF5733]/30 uppercase text-sm tracking-[0.2em] disabled:opacity-50"
                                                >
                                                    {currentEvent ? "Update Final Event" : "Launch Detailed Event"}
                                                </button>
                                                <button type="button" onClick={() => setActiveTab("card")} className="w-full mt-4 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
                                                    ← Back to Card Info
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style jsx>{`
                .admin-input {
                    width: 100%;
                    padding: 1rem 1.25rem;
                    border-radius: 1.25rem;
                    background: #111;
                    border: 1px solid #222;
                    color: white;
                    font-weight: 700;
                    font-size: 14px;
                    transition: all 0.3s;
                    outline: none;
                }
                .admin-input:focus {
                    border-color: #FF5733;
                    background: #151515;
                    box-shadow: 0 0 0 4px rgba(255, 87, 51, 0.1);
                }
            `}</style>
        </div>
    );
}

const ArrowRight = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);
