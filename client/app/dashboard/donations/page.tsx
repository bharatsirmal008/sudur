"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Download, Receipt, Calendar, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import jsPDF from "jspdf";

interface Donation {
    _id: string;
    amount: string;
    purpose?: string;
    paymentMethod?: string;
    status: string;
    createdAt: string;
}

export default function UserDonationsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && session?.user?.email) {
            fetchDonations(session.user.email);
        }
    }, [status, session, router]);

    const fetchDonations = async (email: string) => {
        try {
            const res = await fetch(`/api/donations?email=${encodeURIComponent(email)}`);
            if (res.ok) {
                const data = await res.json();
                setDonations(data);
            }
        } catch (error) {
            console.error("Failed to fetch donations", error);
        } finally {
            setLoading(false);
        }
    };

    const generateReceipt = (donation: Donation) => {
        const doc = new jsPDF();
        
        // Brand Setup
        doc.setFillColor(46, 160, 197); // Primary Blue
        doc.rect(0, 0, 210, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text("Youth Association of Purbichauki", 105, 20, { align: "center" });

        // Content
        doc.setTextColor(20, 24, 31);
        doc.setFontSize(24);
        doc.text("Official Donation Receipt", 105, 50, { align: "center" });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        
        const dateStr = new Date(donation.createdAt).toLocaleDateString();
        doc.text(`Date of Issue: ${dateStr}`, 20, 70);
        doc.text(`Receipt No: YAOP-DON-${donation._id.substring(0, 8).toUpperCase()}`, 130, 70);

        doc.setLineWidth(0.5);
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 75, 190, 75);

        // Donor Details
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("Received with thanks from:", 20, 90);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Name: ${session?.user?.name || "Valued Donor"}`, 20, 100);
        doc.text(`Email: ${session?.user?.email}`, 20, 110);
        
        // Donation Details Table
        doc.setFillColor(245, 247, 250);
        doc.rect(20, 125, 170, 50, 'F');
        
        doc.setFont('helvetica', 'bold');
        doc.text("Donation Details", 30, 138);
        doc.text("Amount", 140, 138);

        doc.setFont('helvetica', 'normal');
        doc.text(`Purpose: ${donation.purpose || "General Fund"}`, 30, 150);
        doc.text(`Method: ${donation.paymentMethod || "Online Transfer"}`, 30, 160);
        
        doc.setFont('helvetica', 'bold');
        doc.text("Total Contribution:", 30, 166);
        doc.setTextColor(46, 160, 197);
        doc.text(`Rs. ${donation.amount}`, 140, 166);

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.setFont('helvetica', 'italic');
        doc.text("Thank you for your generous contribution. Your support empowers our community.", 105, 200, { align: "center" });
        doc.text("This is an electronically generated receipt.", 105, 210, { align: "center" });

        doc.save(`YAOP_Receipt_${donation._id.substring(0,6)}.pdf`);
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-rose-500 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading your contributions...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 pb-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                
                {/* Navigation & Header */}
                <div className="mb-10">
                    <Link href="/dashboard" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-rose-600 mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center border border-rose-200">
                            <Receipt className="w-8 h-8 text-rose-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Donations</h1>
                            <p className="text-slate-500 mt-1">Review your financial support history and securely download receipts.</p>
                        </div>
                    </div>
                </div>

                {/* Donation List */}
                {donations.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CreditCard className="w-10 h-10 text-slate-300" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-700 mb-2">No Contributions Yet</h2>
                        <p className="text-slate-500 max-w-md mx-auto mb-8">It looks like you haven't made any donations using this account yet. Your support helps us drive meaningful change.</p>
                        <Link href="/donate" className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-500/20">
                            Make a Donation Today
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {donations.map((donation) => (
                            <div key={donation._id} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm hover:shadow-md hover:border-rose-200 transition-all">
                                
                                {/* Info Group */}
                                <div className="flex items-start sm:items-center gap-5">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 border border-emerald-100">
                                        <HeartIcon status={donation.status} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-black text-slate-900">Rs. {parseFloat(donation.amount).toLocaleString()}</h3>
                                            <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full ${donation.status === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {donation.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm font-medium text-slate-500">
                                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> {new Date(donation.createdAt).toLocaleDateString()} at {new Date(donation.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            <span className="hidden sm:block text-slate-300">•</span>
                                            <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-slate-400" /> {donation.paymentMethod || "Online"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div>
                                    <button 
                                        onClick={() => generateReceipt(donation)}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download PDF
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Simple local component for the heart visual
function HeartIcon({ status }: { status: string }) {
    if (status === 'verified') {
        return <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>;
    }
    return <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}
