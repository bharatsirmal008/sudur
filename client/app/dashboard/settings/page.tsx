"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, User, Camera, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function SettingsPage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [message, setMessage] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (session?.user) {
            setName(session.user.name || "");
            setImage(session.user.image || "");
            setPreviewImage(session.user.image || "");
        }
    }, [status, session, router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setPreviewImage(result);
            setImage(result); // temporarily hold base64 or prepare for upload
        };
        reader.readAsDataURL(file);
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        let finalImageUrl = session?.user?.image || "";

        try {
            // If image is a base64 string, upload it to Cloudinary first
            if (image && image.startsWith("data:image")) {
                const uploadRes = await fetch("https://sudurapi.vercel.app/api/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image })
                });
                
                // Fallback to local server if remote fails
                let parsedUploadRes;
                if (!uploadRes.ok) {
                    const fallbackRes = await fetch("http://localhost:5000/api/upload", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ image })
                    });
                    if (fallbackRes.ok) parsedUploadRes = await fallbackRes.json();
                } else {
                    parsedUploadRes = await uploadRes.json();
                }

                if (parsedUploadRes && parsedUploadRes.url) {
                    finalImageUrl = parsedUploadRes.url;
                }
            }

            // Save to Backend Database
            const API_BASE = "https://sudurapi.vercel.app";
            let res = await fetch(`${API_BASE}/api/user/profile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: session?.user?.email,
                    name: name,
                    image: finalImageUrl
                })
            });

            if (!res.ok) {
                 res = await fetch(`http://localhost:5000/api/user/profile`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: session?.user?.email,
                        name: name,
                        image: finalImageUrl
                    })
                });
            }

            if (res.ok) {
                // Force Update NextAuth Session via Trigger
                await update({ name: name, image: finalImageUrl });
                setMessage("Profile updated successfully!"); setTimeout(() => router.push("/dashboard"), 800);
            } else {
                setMessage("Failed to update profile.");
            }
        } catch (error) {
            console.error(error);
            setMessage("An error occurred while communicating with the server.");
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") {
        return <div className="min-h-screen bg-slate-50 py-12 flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Profile Settings
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        Personalize your account identity.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8 sm:p-10">
                        <form onSubmit={handleSaveProfile} className="space-y-8">
                            
                            {/* Profile Picture Upload Section */}
                            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-6">
                                <div className="relative group shrink-0">
                                    <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-indigo-50 shadow-sm relative">
                                        {previewImage ? (
                                            <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-10 h-10 text-slate-400" />
                                        )}
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        >
                                            <Camera className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleImageChange}
                                        accept="image/*" 
                                        className="hidden" 
                                    />
                                </div>
                                <div className="text-center sm:text-left space-y-1">
                                    <h3 className="text-lg font-bold text-slate-900">Avatar Image</h3>
                                    <p className="text-sm font-medium text-slate-500 max-w-xs">Upload a square image, ideally 256x256px layout for the best display.</p>
                                    <button 
                                        type="button" 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-indigo-600 text-sm font-bold mt-2 hover:underline inline-block"
                                    >
                                        Change Picture
                                    </button>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-bold text-slate-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-bold text-slate-700">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        defaultValue={session?.user?.email || ""}
                                        disabled
                                        className="w-full rounded-xl border border-slate-100 bg-slate-100/50 px-4 py-3 text-slate-400 font-medium cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {message && (
                                <div className={`p-4 rounded-xl text-sm font-bold ${message.includes('successfully') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                    {message}
                                </div>
                            )}

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    {loading ? "Saving..." : "Save Profile"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
