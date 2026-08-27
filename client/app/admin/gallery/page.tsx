"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { Loader2, Trash2, Image as ImageIcon, Plus, X } from "lucide-react";

interface GalleryImage {
    _id: string;
    url: string;
    caption?: string;
    createdAt: string;
}

export default function AdminGalleryPage() {
    const { showToast, confirm } = useToast();
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    
    // Add form states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState("");
    const [newCaption, setNewCaption] = useState("");

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/gallery");
            if (res.ok) setImages(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setActionLoading(true);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                const base64Image = reader.result;
                const res = await fetch("/api/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: base64Image })
                });

                if (!res.ok) throw new Error("Upload failed");
                const data = await res.json();
                if (data.url) setNewImageUrl(data.url);
            };
        } catch (err) {
            console.error(err);
            showToast("Failed to upload image", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddImage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newImageUrl) {
            showToast("Please upload an image first", "error");
            return;
        }

        setActionLoading(true);
        try {
            const res = await fetch("/api/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: newImageUrl, caption: newCaption })
            });

            if (res.ok) {
                showToast("Image added successfully", "success");
                setIsAddModalOpen(false);
                setNewImageUrl("");
                setNewCaption("");
                fetchImages();
            } else {
                showToast("Failed to add image", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Failed to add image", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        confirm({
            title: "Delete Image?",
            message: "Are you sure you want to remove this image from the gallery?",
            confirmText: "Delete",
            isDestructive: true,
            onConfirm: async () => {
                setActionLoading(true);
                try {
                    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        showToast("Image deleted", "success");
                        fetchImages();
                    }
                } finally {
                    setActionLoading(false);
                }
            },
            onCancel: () => {}
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px]">
                <Loader2 className="w-12 h-12 text-[#16A34A] animate-spin mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Gallery...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#111827] tracking-tight flex items-center gap-3">
                        <ImageIcon className="w-8 h-8 text-[#16A34A]" />
                        Photo Gallery
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium italic">Manage photos displayed on the homepage.</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-6 py-3 bg-[#16A34A] text-white rounded-[15px] font-black uppercase tracking-widest text-xs hover:bg-[#15803d] transition-colors flex items-center gap-2 shadow-lg shadow-green-100"
                >
                    <Plus className="w-4 h-4" /> Add Photo
                </button>
            </div>

            {images.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                    <ImageIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h2 className="text-xl font-black text-slate-800">Gallery is empty</h2>
                    <p className="text-slate-500 mt-2">Add some photos to show on the main page.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((img) => (
                        <motion.div 
                            key={img._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[20px] overflow-hidden border border-slate-100 shadow-sm group"
                        >
                            <div className="relative aspect-square">
                                <img src={img.url} alt={img.caption || "Gallery photo"} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                        onClick={() => handleDelete(img._id)}
                                        className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors shadow-lg hover:scale-110 active:scale-95"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            {img.caption && (
                                <div className="p-4 border-t border-slate-50">
                                    <p className="text-sm font-bold text-slate-700 truncate">{img.caption}</p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsAddModalOpen(false)}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Add New Photo</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <form id="add-photo-form" onSubmit={handleAddImage} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Upload Image *</label>
                                    <div className="flex flex-col gap-4">
                                        {newImageUrl && (
                                            <div className="w-full aspect-video rounded-xl overflow-hidden border border-slate-200">
                                                <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <input required={!newImageUrl} type="file" accept="image/*" onChange={handleImageUpload} disabled={actionLoading} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:bg-green-50 file:text-green-600 hover:file:bg-green-100 cursor-pointer" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Caption (Optional)</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500" placeholder="e.g. Village Meeting 2026" value={newCaption} onChange={e => setNewCaption(e.target.value)} />
                                </div>
                            </form>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 rounded-xl text-xs font-black uppercase text-slate-500 hover:bg-slate-200">Cancel</button>
                            <button type="submit" form="add-photo-form" disabled={actionLoading} className="px-8 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#15803d]">
                                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Photo"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
