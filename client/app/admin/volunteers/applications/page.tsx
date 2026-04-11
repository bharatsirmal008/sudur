"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../../context/ToastContext";
import { 
    MessageSquare,
    AlertCircle,
    Heart,
    ChevronRight,
    Users,
    ArrowLeft,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    ExternalLink,
    Clock,
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Activity,
    FileText,
    Loader2,
    Calendar
} from "lucide-react";

interface VolunteerApplication {
    _id: string;
    name: string;
    email: string;
    contact: string;
    temporaryAddress: string;
    permanentAddress: string;
    dob: string;
    occupation: string;
    bloodGroup: string;
    hasVolunteered: string;
    volunteerDetails?: string;
    skills: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    rejectionReason?: string;
}

export default function VolunteerApplicationsPage() {
    const { showToast, confirm } = useToast();
    const [applications, setApplications] = useState<VolunteerApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<VolunteerApplication | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [showRejectionPrompt, setShowRejectionPrompt] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
    
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<VolunteerApplication>>({});

    useEffect(() => {
        fetchApplications();
    }, []);

    const startEditing = () => {
        if (!selectedApp) return;
        setEditForm({ ...selectedApp });
        setIsEditing(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedApp) return;
        setActionLoading(true);
        try {
            const res = await fetch(`/api/volunteer-applications/${selectedApp._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            if (res.ok) {
                showToast("Changes saved successfully!", "success");
                setIsEditing(false);
                setSelectedApp({ ...selectedApp, ...editForm } as VolunteerApplication);
                fetchApplications();
            } else {
                throw new Error("Save failed");
            }
        } catch (err) {
            showToast("Error saving changes", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/volunteer-applications");
            const data = await res.json();
            setApplications(data);
        } catch (err) {
            console.error("Failed to fetch applications:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        confirm({
            title: "Approve Volunteer?",
            message: "Are you sure you want to approve this volunteer? they will be added to the public team section and notified via email.",
            confirmText: "Approve Member",
            onConfirm: async () => {
                setActionLoading(true);
                try {
                    const res = await fetch(`/api/volunteer-applications/${id}/approve`, { method: 'PATCH' });
                    if (res.ok) {
                        showToast("Application Approved!", "success");
                        setSelectedApp(null);
                        fetchApplications();
                    } else {
                        throw new Error("Approval failed");
                    }
                } catch (err) {
                    showToast("Error approving application", "error");
                } finally {
                    setActionLoading(false);
                }
            },
            onCancel: () => {}
        });
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            showToast("Please provide a reason for rejection.", "warning");
            return;
        }

        setActionLoading(true);
        try {
            const res = await fetch(`/api/volunteer-applications/${selectedApp?._id}/reject`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: rejectionReason })
            });
            if (res.ok) {
                showToast("Application Rejected and User Notified.", "info");
                setShowRejectionPrompt(false);
                setSelectedApp(null);
                setRejectionReason("");
                fetchApplications();
            } else {
                throw new Error("Rejection failed");
            }
        } catch (err) {
            showToast("Error rejecting application", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const filteredApps = applications.filter(app => {
        const matchesSearch = (app.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (app.email || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px]">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Applications...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <Heart className="w-8 h-8 text-rose-500" />
                        Volunteer Applications
                    </h1>
                    <p className="text-slate-400 mt-1 font-medium">Review and manage community volunteer requests.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                            type="text" 
                            placeholder="Search names or emails..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium"
                        />
                    </div>
                    <div className="flex bg-[#0a0a0a] border border-slate-800 rounded-2xl p-1 p-x-2">
                        {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                                    statusFilter === status 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List View */}
            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredApps.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-[#0a0a0a] border border-slate-800 rounded-3xl p-12 text-center"
                        >
                            <AlertCircle className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No applications found in this category.</p>
                        </motion.div>
                    ) : (
                        filteredApps.map((app) => (
                            <motion.div
                                key={app._id}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`bg-[#0a0a0a] border ${app.status === 'pending' ? 'border-indigo-500/30' : 'border-slate-800'} rounded-3xl p-5 hover:border-indigo-500/50 transition-all cursor-pointer group`}
                                onClick={() => setSelectedApp(app)}
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                                        <User className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-black text-white truncate">{app.name}</h3>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                app.status === 'pending' ? 'bg-indigo-500/10 text-indigo-400' :
                                                app.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                                                'bg-rose-500/10 text-rose-400'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-1 text-xs text-slate-500 font-medium">
                                            <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {app.email}</span>
                                            <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {app.temporaryAddress?.split(',')?.pop() || 'Local'}</span>
                                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 hidden sm:block">
                                        View Details
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Application Detail Modal */}
            <AnimatePresence>
                {selectedApp && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm shadow-2xl"
                        onClick={() => !actionLoading && setSelectedApp(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="bg-[#0a0a0a] border border-slate-800 rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-hidden overflow-y-auto no-scrollbar shadow-2xl shadow-indigo-500/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-slate-800 p-8 flex items-center justify-between z-20">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                        <User className="w-8 h-8 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white">
                                            {isEditing ? (
                                                <input 
                                                    value={editForm.name} 
                                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                    className="bg-black/50 border border-indigo-500/50 rounded-xl px-3 py-1 text-white focus:outline-none"
                                                />
                                            ) : selectedApp.name}
                                        </h2>
                                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Application for Volunteering</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {!isEditing && selectedApp.status === 'pending' && (
                                        <button 
                                            onClick={startEditing}
                                            className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-black uppercase hover:bg-indigo-500/20 transition-all"
                                        >
                                            Edit Details
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => { setSelectedApp(null); setIsEditing(false); }}
                                        className="p-3 rounded-2xl bg-white/5 text-slate-400 hover:text-white transition-all"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-8 space-y-10">
                                {/* Bio Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: "Blood Group", field: "bloodGroup", icon: Activity, color: "text-rose-400" },
                                        { label: "Date of Birth", field: "dob", icon: Calendar, color: "text-amber-400", type: "date" },
                                        { label: "Occupation", field: "occupation", icon: Briefcase, color: "text-indigo-400" },
                                        { label: "Status", field: "status", icon: Clock, color: "text-emerald-400", readOnly: true },
                                    ].map((item) => (
                                        <div key={item.label} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                                            <item.icon className={`w-4 h-4 ${item.color} mb-2`} />
                                            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">{item.label}</p>
                                            {isEditing && !item.readOnly ? (
                                                <input 
                                                    type={item.type || "text"}
                                                    value={item.field === 'dob' ? (editForm as any)[item.field]?.split('T')[0] : (editForm as any)[item.field]}
                                                    onChange={(e) => setEditForm({...editForm, [item.field]: e.target.value})}
                                                    className="w-full bg-black/50 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                                                />
                                            ) : (
                                                <p className="text-sm font-black text-white">
                                                    {item.field === 'dob' ? new Date((selectedApp as any)[item.field]).toLocaleDateString() : (selectedApp as any)[item.field]}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Main Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <DetailSection title="Contact Information" icon={Mail}>
                                            <DetailItem 
                                                label="Email" 
                                                value={isEditing ? editForm.email || "" : selectedApp.email} 
                                                isEditing={isEditing} 
                                                onChange={(val) => setEditForm({...editForm, email: val})}
                                                isLink 
                                            />
                                            <DetailItem 
                                                label="Phone" 
                                                value={isEditing ? editForm.contact || "" : selectedApp.contact} 
                                                isEditing={isEditing} 
                                                onChange={(val) => setEditForm({...editForm, contact: val})}
                                            />
                                        </DetailSection>

                                        <DetailSection title="Address Details" icon={MapPin}>
                                            <DetailItem 
                                                label="Current" 
                                                value={isEditing ? editForm.temporaryAddress || "" : selectedApp.temporaryAddress} 
                                                isEditing={isEditing} 
                                                onChange={(val) => setEditForm({...editForm, temporaryAddress: val})}
                                            />
                                            <DetailItem 
                                                label="Permanent" 
                                                value={isEditing ? editForm.permanentAddress || "" : selectedApp.permanentAddress} 
                                                isEditing={isEditing} 
                                                onChange={(val) => setEditForm({...editForm, permanentAddress: val})}
                                            />
                                        </DetailSection>
                                    </div>

                                    <div className="space-y-6">
                                        <DetailSection title="Expertise & Skills" icon={FileText}>
                                            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                                                {isEditing ? (
                                                    <textarea 
                                                        value={editForm.skills}
                                                        onChange={(e) => setEditForm({...editForm, skills: e.target.value})}
                                                        className="w-full bg-black/50 border border-slate-700 rounded-xl p-3 text-xs text-white h-24 focus:outline-none"
                                                    />
                                                ) : (
                                                    <p className="text-sm text-slate-300 font-medium leading-relaxed italic">
                                                        "{selectedApp.skills}"
                                                    </p>
                                                )}
                                            </div>
                                        </DetailSection>

                                        <DetailSection title="Previous Volunteering" icon={Activity}>
                                            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Have you volunteered before? <span className="text-white ml-2">{selectedApp.hasVolunteered}</span></p>
                                                {selectedApp.volunteerDetails && (
                                                    <p className="text-sm text-slate-300 font-medium leading-relaxed">
                                                        {selectedApp.volunteerDetails}
                                                    </p>
                                                )}
                                            </div>
                                        </DetailSection>
                                    </div>
                                </div>

                                {/* Rejection History if exists */}
                                {selectedApp.status === 'rejected' && (
                                    <div className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-3xl">
                                        <div className="flex items-center gap-3 text-rose-400 mb-3">
                                            <AlertCircle className="w-5 h-5" />
                                            <h4 className="font-black tracking-tight">Rejection Feedback</h4>
                                        </div>
                                        <p className="text-slate-400 text-sm italic font-medium leading-relaxed">
                                            "{selectedApp.rejectionReason || "No feedback provided."}"
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Modal Actions */}
                            <div className="sticky bottom-0 bg-[#0a0a0a]/80 backdrop-blur-md border-t border-slate-800 p-8 flex flex-col md:flex-row gap-4 items-center justify-between z-20">
                                <div className="flex items-center gap-3">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        {isEditing ? "Editing Mode:" : "Administrative Action:"}
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    {isEditing ? (
                                        <>
                                            <button 
                                                onClick={() => setIsEditing(false)}
                                                className="flex-1 md:w-40 py-4 font-black text-slate-400 hover:text-white transition-all"
                                            >
                                                Cancel Changes
                                            </button>
                                            <button 
                                                onClick={handleSaveEdit}
                                                disabled={actionLoading}
                                                className="flex-1 md:w-48 py-4 font-black rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                                Save Information
                                            </button>
                                        </>
                                    ) : (
                                        selectedApp.status === 'pending' ? (
                                            <>
                                                <button 
                                                    onClick={() => setShowRejectionPrompt(true)}
                                                    disabled={actionLoading}
                                                    className="flex-1 md:w-40 py-4 font-black rounded-2xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-all disabled:opacity-50"
                                                >
                                                    Reject Application
                                                </button>
                                                <button 
                                                    onClick={() => handleApprove(selectedApp._id)}
                                                    disabled={actionLoading}
                                                    className="flex-1 md:w-48 py-4 font-black rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                                    Approve Volunteer
                                                </button>
                                            </>
                                        ) : (
                                            <div className="px-8 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 font-black tracking-tight flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" />
                                                Application {selectedApp.status}.
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Rejection Prompt Overlay */}
            <AnimatePresence>
                {showRejectionPrompt && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 w-full max-w-lg shadow-2xl"
                        >
                            <div className="flex items-center gap-3 text-rose-500 mb-6 font-black text-xl">
                                <MessageSquare className="w-6 h-6" />
                                Rejection Feedback
                            </div>
                            <p className="text-slate-400 text-sm mb-6 font-medium leading-relaxed">
                                Please provide a reason for the rejection. This message will be sent to the user via email to help them understand why their profile wasn't selected.
                            </p>
                            <textarea 
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="e.g. We require more experience in community projects at this time..."
                                className="w-full h-40 bg-black/50 border border-slate-800 rounded-2xl p-5 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500/50 transition-all font-medium mb-8"
                            />
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setShowRejectionPrompt(false)}
                                    className="flex-1 py-4 font-black text-slate-400 hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleReject}
                                    disabled={actionLoading}
                                    className="flex-1 py-4 font-black rounded-2xl bg-rose-600 text-white shadow-xl shadow-rose-500/20 hover:bg-rose-700 transition-all disabled:opacity-50"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function DetailSection({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-indigo-400" />
                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">{title}</h4>
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}

function DetailItem({ label, value, isLink, isEditing, onChange }: { label: string, value: string, isLink?: boolean, isEditing?: boolean, onChange?: (val: string) => void }) {
    return (
        <div className="group/item">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-wider mb-1">{label}</p>
            {isEditing ? (
                <input 
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    className="w-full bg-black/50 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                />
            ) : (
                <p className={`text-sm font-bold ${isLink ? 'text-indigo-400 hover:text-indigo-300 underline cursor-pointer' : 'text-white'} truncate`}>
                    {value}
                </p>
            )}
        </div>
    );
}
