"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "../context/ToastContext";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function VolunteerApplicationPage() {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        permanentAddress: "",
        temporaryAddress: "",
        bloodGroup: "",
        email: "",
        dob: "",
        contact: "",
        occupation: "",
        hasVolunteered: "No",
        volunteerDetails: "",
        skills: "",
        cv: null as File | null,
        declaration: false
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const bloodGroups = ["A+ve", "A-ve", "B+ve", "B-ve", "AB+ve", "AB-ve", "O+ve", "O-ve"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.declaration) {
            showToast("Please certify the declaration before submitting.", "warning");
            return;
        }
        setSubmitting(true);
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/volunteer-applications`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error("Failed to submit application");
            
            setSubmitted(true);
        } catch (error) {
            console.error("Submission failed:", error);
            showToast("Something went wrong. Please try again later.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-6"
                >
                    <div className="flex justify-center">
                        <CheckCircle2 className="w-20 h-20 text-[#2ea0c5]" />
                    </div>
                    <h1 className="text-4xl font-black text-[#14181f] tracking-tight">Application Sent!</h1>
                    <p className="text-gray-500 text-lg font-medium leading-[1.6]">
                        Thank you for your interest in volunteering with YAOP. We will review your application and get back to you soon.
                    </p>
                    <button 
                        onClick={() => window.location.href = "/"}
                        className="inline-block px-10 py-4 bg-[#2ea0c5] text-white font-bold rounded-2xl shadow-xl shadow-[#2ea0c5]/30 hover:scale-[1.05] transition-all active:scale-[0.98]"
                    >
                        Back to Home
                    </button>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white font-sans overflow-x-hidden relative selection:bg-[#2ea0c5]/20 pb-20 pt-24">
            {/* Background Blobs for Atmosphere */}
            <div className="absolute top-[10%] left-[-5%] w-[30rem] h-[30rem] bg-[#ffeff8] rounded-full blur-[120px] -z-20 opacity-60" />
            <div className="absolute bottom-[20%] right-[-5%] w-[35rem] h-[35rem] bg-[#e8f0fd] rounded-full blur-[120px] -z-20 opacity-60" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-[72px] flex flex-col lg:flex-row items-start justify-between gap-16 lg:gap-24 relative">
                
                {/* Left Side: Content & Branded Assets */}
                <div className="lg:w-[45%] lg:sticky lg:top-32 space-y-10">
                    <div className="relative">
                        {/* Branded Asset: Pink Ellipse */}
                        <motion.img 
                            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                            animate={{ scale: 1, opacity: 0.9, rotate: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            src="/pink_ellipse.svg"
                            alt=""
                            className="absolute -top-16 -left-16 w-38 h-38 -z-10 opacity-90 pointer-events-none"
                        />

                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <h1 className="text-5xl md:text-7xl font-black text-[#14181f] leading-[1.05] tracking-tight">
                                Apply today <br /> and start <br /> making difference.
                            </h1>
                            
                            <img 
                                src="https://cdn.prod.website-files.com/64e379f5c8606ea47c3e346c/64eed5c145b217c3c3cee33b_Underline%204.svg" 
                                alt="" 
                                className="w-56 opacity-90"
                            />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="space-y-6 max-w-lg"
                    >
                        <p className="text-gray-500 text-lg md:text-xl font-medium leading-[1.7]">
                            Welcome to our volunteer application! We are thrilled to offer opportunities for you to engage with our community and make a meaningful impact. 
                        </p>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
                            Ideal volunteers are passionate individuals ready to dedicate their time and skills.
                        </p>
                    </motion.div>

                    {/* Branded Asset: Blue Ellipse */}
                    <motion.img 
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        src="/blue_ellipse.svg"
                        alt=""
                        className="absolute -right-12 bottom-0 w-48 h-48 -z-10 opacity-80 pointer-events-none hidden lg:block"
                    />
                </div>

                {/* Right Side: Form Card */}
                <motion.div 
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="lg:w-[55%] w-full z-10"
                >
                    <div className="bg-white rounded-[48px] p-8 md:p-12 lg:p-16 shadow-[0_32px_80px_rgba(44,49,54,0.12)] border border-gray-50">
                        <form onSubmit={handleSubmit} className="space-y-12">
                            
                            {/* Section: Personal Info */}
                            <div className="space-y-8">
                                <SectionHeader color="#2ea0c5" title="Personal Information" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    <FormField label="Full Name" required>
                                        <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Enter your full name" className="form-input" />
                                    </FormField>
                                    <FormField label="Email Address" required>
                                        <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="example@gmail.com" className="form-input" />
                                    </FormField>
                                    <FormField label="Date of Birth" required>
                                        <input required type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="form-input" />
                                    </FormField>
                                    <FormField label="Contact Info" required>
                                        <input required type="tel" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} placeholder="Phone number" className="form-input" />
                                    </FormField>
                                    <FormField label="Blood Group" required>
                                        <select required value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} className="form-input bg-white cursor-pointer">
                                            <option value="">Select Blood Group</option>
                                            {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                        </select>
                                    </FormField>
                                    <FormField label="Occupation">
                                        <input value={formData.occupation} onChange={e => setFormData({...formData, occupation: e.target.value})} placeholder="e.g. Student, Teacher" className="form-input" />
                                    </FormField>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <FormField label="Permanent Address" required>
                                        <textarea required rows={3} value={formData.permanentAddress} onChange={e => setFormData({...formData, permanentAddress: e.target.value})} placeholder="Address as per ID" className="form-input resize-none" />
                                    </FormField>
                                    <FormField label="Temporary Address" required>
                                        <textarea required rows={3} value={formData.temporaryAddress} onChange={e => setFormData({...formData, temporaryAddress: e.target.value})} placeholder="Current location" className="form-input resize-none" />
                                    </FormField>
                                </div>
                            </div>

                            {/* Section: Experience */}
                            <div className="space-y-8">
                                <SectionHeader color="#ffa9d9" title="Experience" />
                                <FormField label="Have you ever volunteered before?" required>
                                    <div className="flex gap-8 mt-2">
                                        {["Yes", "No"].map(option => (
                                            <label key={option} className="flex items-center gap-3 cursor-pointer group">
                                                <input type="radio" name="volunteered" value={option} checked={formData.hasVolunteered === option} onChange={e => setFormData({...formData, hasVolunteered: e.target.value})} className="w-5 h-5 accent-[#2ea0c5]" />
                                                <span className="text-lg font-bold text-gray-700 group-hover:text-[#2ea0c5] transition-colors">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </FormField>
                                {formData.hasVolunteered === "Yes" && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                                        <FormField label="Details of previous volunteering">
                                            <textarea rows={4} value={formData.volunteerDetails} onChange={e => setFormData({...formData, volunteerDetails: e.target.value})} placeholder="Organization, role, duration..." className="form-input resize-none" />
                                        </FormField>
                                    </motion.div>
                                )}
                            </div>

                            {/* Section: Skills */}
                            <div className="space-y-8">
                                <SectionHeader color="#a78bfa" title="Skills & Interests" />
                                <FormField label="Mention skills that can help YAOP" required>
                                    <textarea required rows={4} value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} placeholder="What are your areas of expertise?" className="form-input resize-none" />
                                </FormField>
                            </div>

                            {/* Section: Documents */}
                            <div className="space-y-8">
                                <SectionHeader color="#14181f" title="Documents" />
                                <FormField label="Upload CV/Resume (PDF/DOC/DOCX, Max 10MB)">
                                     <div className="relative group">
                                         <input type="file" accept=".pdf,.doc,.docx" onChange={e => setFormData({...formData, cv: e.target.files?.[0] || null})} className="hidden" id="cv-upload" />
                                         <label htmlFor="cv-upload" className="w-full flex items-center justify-center gap-5 bg-[#fcfcfc] border-2 border-dashed border-gray-200 rounded-2xl py-10 cursor-pointer hover:border-[#2ea0c5] hover:bg-[#2ea0c5]/5 transition-all group-hover:scale-[1.01]">
                                             <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 group-hover:text-[#2ea0c5] transition-colors">
                                                 <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
                                             </div>
                                             <span className="text-lg font-bold text-gray-500 group-hover:text-[#2ea0c5] transition-colors">
                                                 {formData.cv ? formData.cv.name : "Choose file or drag & drop"}
                                             </span>
                                         </label>
                                     </div>
                                 </FormField>
                            </div>

                            {/* Declaration */}
                            <div className="pt-10 border-t border-gray-100">
                                <label className="flex items-start gap-4 cursor-pointer group">
                                    <input required type="checkbox" checked={formData.declaration} onChange={e => setFormData({...formData, declaration: e.target.checked})} className="mt-1 w-6 h-6 accent-[#2ea0c5] rounded-md cursor-pointer" />
                                    <span className="text-lg font-bold text-gray-700 leading-[1.5] group-hover:text-[#2ea0c5] transition-colors">
                                        I certify that the information provided is true and accurate to the best of my knowledge. <span className="text-red-500">*</span>
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                disabled={submitting}
                                type="submit"
                                className="relative w-full py-6 rounded-[10px] shadow-2xl transition-all overflow-hidden group/btn cursor-pointer bg-[#fffbeb] border border-yellow-100 hover:shadow-yellow-200/50 disabled:opacity-70 disabled:hover:scale-100"
                            >
                                {submitting ? (
                                    <div className="relative z-10 flex items-center justify-center gap-3">
                                        <Loader2 className="w-8 h-8 animate-spin text-[#ff5722]" />
                                        <span className="text-xl font-black text-[#ff5722]">Submitting...</span>
                                    </div>
                                ) : (
                                    <>
                                        <img
                                            src="/yellow_ellipse.svg"
                                            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/btn:scale-125 transition-transform duration-700 pointer-events-none"
                                            alt=""
                                        />
                                        <div className="relative z-10">
                                            <span className="text-2xl font-black tracking-tight whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-[#d97706] via-[#062a24] to-[#d97706] bg-[length:200%_auto] bg-left hover:bg-right transition-all duration-700">
                                                Submit application
                                            </span>
                                        </div>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
                .form-input {
                    width: 100%;
                    background: #fdfdfd;
                    border: 2px solid #edeff3;
                    border-radius: 1rem;
                    padding: 1.1rem 1.5rem;
                    font-size: 1rem;
                    color: #14181f;
                    font-weight: 500;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .form-input:focus {
                    outline: none;
                    border-color: #2ea0c5;
                    background: white;
                    box-shadow: 0 10px 20px -10px rgba(46,160,197,0.1);
                }
                .form-input::placeholder {
                    color: #bac1ca;
                }
            `}</style>
        </main>
    );
}

function SectionHeader({ color, title }: { color: string; title: string }) {
    return (
        <div className="flex items-center gap-4 mb-4">
            <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: color }} />
            <h2 className="text-2xl font-black text-[#14181f] tracking-wider">{title}</h2>
        </div>
    );
}

function FormField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
    return (
        <div className="space-y-3">
            <label className="text-[15px] font-bold text-[#4c5157] ml-1 tracking-wide flex items-center gap-2">
                {label}
                {required && <span className="text-red-500 text-lg">*</span>}
            </label>
            {children}
        </div>
    );
}

