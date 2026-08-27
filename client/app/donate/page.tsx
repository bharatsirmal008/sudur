"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../context/ToastContext";
import { CheckCircle2, Loader2, ArrowRight, ChevronDown, Download } from "lucide-react";
import "flag-icons/css/flag-icons.min.css";
import { jsPDF } from "jspdf";

export default function DonatePage() {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        countryCode: "+977",
        countryIso: "np",
        purpose: "",
        amount: "",
        transactionId: "",
        paymentMethod: "",
        receipt: null as File | null,
        declaration: false
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [events, setEvents] = useState<any[]>([]);
    const [globalSettings, setGlobalSettings] = useState<any>(null);

    // Fetch events and settings
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsRes, settingsRes] = await Promise.all([
                    fetch("/api/events"),
                    fetch("/api/settings")
                ]);
                const eventsData = await eventsRes.json();
                const settingsData = await settingsRes.json();
                const activeEvents = Array.isArray(eventsData) ? eventsData.filter((e: any) => e.status !== 'closed') : [];
                setEvents(activeEvents);
                setGlobalSettings(settingsData);
            } catch (err) {
                console.error("Failed to fetch data", err);
            }
        };
        fetchData();
    }, []);

    const countries = [
        { name: "Nepal", code: "+977", iso: "np" },
        { name: "India", code: "+91", iso: "in" },
        { name: "USA", code: "+1", iso: "us" },
        { name: "UK", code: "+44", iso: "gb" },
        { name: "Australia", code: "+61", iso: "au" },
        { name: "UAE", code: "+971", iso: "ae" },
    ];

    // Handle both old string array and new object array {name, qrCode} for backward compatibility
    const defaultPurposes = globalSettings?.donationPurposes?.length 
        ? globalSettings.donationPurposes.map((p: any) => typeof p === 'string' ? p : p.name)
        : [
            "Education Support",
            "Health & Medical Aid",
            "Community Development",
            "Emergency Relief",
            "General Donation"
        ];

    // Combine default purposes with event titles
    const purposes = [...defaultPurposes, ...events.map(e => e.title)];

    const paymentMethods = ["eSewa", "Bank Transfer"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.declaration) {
            showToast("Please confirm the declaration before submitting.", "warning");
            return;
        }
        setSubmitting(true);

        try {
            const res = await fetch("/api/donations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: formData.name,
                    email: formData.email,
                    phoneNumber: `${formData.countryCode}${formData.phone}`,
                    address: formData.address,
                    amount: formData.amount,
                    transactionId: formData.transactionId,
                    paymentScreenshot: "", // Placeholder for now as file upload isn't connected to cloud storage yet
                    purpose: formData.purpose,
                    paymentMethod: formData.paymentMethod,
                    createdAt: new Date()
                })
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                throw new Error("Failed to submit");
            }
        } catch (error) {
            showToast("Submission failed. Please try again or contact support.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const generateReceipt = () => {
        const doc = new jsPDF();
        
        // Brand Setup
        doc.setFillColor(46, 160, 197); // #2ea0c5 Primary Blue
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
        
        const dateStr = new Date().toLocaleDateString();
        doc.text(`Date of Issue: ${dateStr}`, 20, 70);
        doc.text(`Receipt No: YAOP-DON-${Math.floor(Math.random() * 100000)}`, 130, 70);

        doc.setLineWidth(0.5);
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 75, 190, 75);

        // Details
        doc.setTextColor(50, 50, 50);
        doc.setFont('helvetica', 'bold');
        doc.text("Donation Details", 20, 90);

        doc.setFont('helvetica', 'normal');
        doc.text(`Donor Name:`, 20, 105);
        doc.text(formData.name || "N/A", 70, 105);

        doc.text(`Transaction ID:`, 20, 115);
        doc.text(formData.transactionId || "N/A", 70, 115);

        doc.text(`Payment Method:`, 20, 125);
        doc.text(formData.paymentMethod || "N/A", 70, 125);

        doc.text(`Purpose:`, 20, 135);
        doc.text(formData.purpose || "General Support", 70, 135);

        // Amount Highlight
        doc.setFillColor(245, 245, 245);
        doc.rect(20, 150, 170, 25, 'F');
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("Total Contribution:", 30, 166);
        doc.setTextColor(46, 160, 197);
        doc.text(`Rs. ${formData.amount || "0"}`, 140, 166);

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.setFont('helvetica', 'italic');
        doc.text("This is an unverified digital receipt. Final tax-exempt status depends on our formal audit.", 105, 190, { align: "center" });
        doc.text("Thank you for supporting our mission!", 105, 200, { align: "center" });

        doc.save(`YAOP_Receipt_${formData.name || 'Donation'}.pdf`);
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
                    <h1 className="text-4xl font-black text-[#14181f] tracking-tight">Thank You!</h1>
                    <p className="text-gray-500 text-lg font-medium leading-[1.6]">
                        Your donation information has been submitted. We will verify the transaction and send a confirmation to your email soon.
                    </p>
                    <div className="flex flex-col gap-4 pt-4">
                        <button
                            onClick={generateReceipt}
                            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#14181f] text-white font-bold rounded-2xl shadow-xl shadow-[#14181f]/20 hover:scale-[1.02] transition-all"
                        >
                            <Download className="w-5 h-5" />
                            Download PDF Receipt
                        </button>
                        <button
                            onClick={() => window.location.href = "/"}
                            className="inline-block px-10 py-4 bg-[#2ea0c5]/10 text-[#2ea0c5] font-bold rounded-2xl hover:bg-[#2ea0c5]/20 transition-all"
                        >
                            Back to Home
                        </button>
                    </div>
                </motion.div>
            </main>
        );
    }

    const selectedEvent = events.find(e => e.title === formData.purpose);
    const selectedPurpose = globalSettings?.donationPurposes?.find((p: any) => typeof p === 'object' && p.name === formData.purpose);
    
    const defaultBankQr = globalSettings?.bankQrCode || "/Bank_QR.jpeg";
    const defaultEsewaQr = globalSettings?.esewaQrCode || "/payment_qr.jpeg";

    let dynamicQrSrc = formData.paymentMethod === "Bank Transfer" ? defaultBankQr : defaultEsewaQr;
    
    if (selectedEvent && selectedEvent.qrCode) {
        dynamicQrSrc = selectedEvent.qrCode;
    } else if (selectedPurpose && selectedPurpose.qrCode) {
        dynamicQrSrc = selectedPurpose.qrCode;
    }

    return (
        <main className="min-h-screen bg-white font-sans overflow-x-hidden relative selection:bg-[#2ea0c5]/20 pb-20 pt-24">
            {/* Background Atmosphere */}
            <div className="absolute top-[10%] left-[-5%] w-[30rem] h-[30rem] bg-[#ffeff8] rounded-full blur-[120px] -z-20 opacity-60" />
            <div className="absolute bottom-[20%] right-[-5%] w-[35rem] h-[35rem] bg-[#e8f0fd] rounded-full blur-[120px] -z-20 opacity-60" />

            <div className="max-w-4xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center relative">

                {/* Top Section: Hero content */}
                <div className="w-full text-center space-y-10 mb-16 relative py-20 px-4">
                    {/* Branded Asset: Yellow Ellipse - Large Background Blob */}
                    <motion.img
                        initial={{ scale: 0.8, opacity: 0, x: -50 }}
                        animate={{ scale: 1, opacity: 0.9, x: 0 }}
                        transition={{ duration: 1.5 }}
                        src="/yellow_ellipse.svg"
                        alt=""
                        className="absolute top-0 left-[5%] md:left-[15%] w-[25rem] h-[25rem] z-0 blur-[30px] pointer-events-none"
                    />

                    {/* Branded Asset: Blue Ellipse - Large Background Blob */}
                    <motion.img
                        initial={{ scale: 0.8, opacity: 0, x: 50 }}
                        animate={{ scale: 1, opacity: 0.8, x: 0 }}
                        transition={{ duration: 1.5, delay: 0.2 }}
                        src="/blue_ellipse.svg"
                        alt=""
                        className="absolute top-[-5%] right-[5%] md:right-[15%] w-[25rem] h-[25rem] z-0 blur-[30px] pointer-events-none"
                    />

                    <div className="relative z-10 w-full max-w-5xl mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-4"
                        >
                            <h1 className="font-black text-[#14181f] tracking-tight py-4 text-center">
                                {/* Line 1: Your Support */}
                                <div className="flex flex-nowrap justify-center gap-x-[0.2em] text-5xl md:text-7xl lg:text-8xl leading-tight">
                                    {"Your Support".split(" ").map((word, wIdx) => (
                                        <span key={`w1-${wIdx}`} className="inline-flex">
                                            {word.split("").map((char, cIdx) => (
                                                <motion.span
                                                    key={`c1-${wIdx}-${cIdx}`}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5, delay: (wIdx * word.length + cIdx) * 0.04 }}
                                                    className="inline-block text-[#14181f]"
                                                >
                                                    {char}
                                                </motion.span>
                                            ))}
                                        </span>
                                    ))}
                                </div>

                                {/* Line 2: Changes Everything. */}
                                <div className="flex flex-nowrap justify-center gap-x-[0.2em] mt-2 text-4xl md:text-7xl lg:text-8xl leading-tight">
                                    {"Changes Everything.".split(" ").map((word, wIdx) => (
                                        <span key={`w2-${wIdx}`} className="inline-flex">
                                            {word.split("").map((char, cIdx) => (
                                                <motion.span
                                                    key={`c2-${wIdx}-${cIdx}`}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5, delay: 0.4 + (wIdx * word.length + cIdx) * 0.04 }}
                                                    className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#2ea0c5] via-[#2ea0c5] to-[#14181f]"
                                                >
                                                    {char}
                                                </motion.span>
                                            ))}
                                        </span>
                                    ))}
                                </div>
                            </h1>

                            <div className="flex justify-center -mt-6">
                                <img
                                    src="https://cdn.prod.website-files.com/64e379f5c8606ea47c3e346c/64eed5c145b217c3c3cee33b_Underline%204.svg"
                                    alt=""
                                    className="w-48 md:w-64 opacity-90"
                                />
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="space-y-8 max-w-3xl mx-auto relative z-10"
                    >
                        <p className="text-[#1a7fa0] text-2xl md:text-3xl font-black leading-[1.4] tracking-tight">
                            "Join us in building a brighter, <br className="hidden md:block" />
                            <span className="text-[#FFCB3B]">more sustainable future</span> for everyone."
                        </p>
                        <div className="space-y-4">
                            <p className="text-gray-500 text-lg md:text-xl font-medium leading-[1.8]">
                                Your contribution directly supports the{" "}
                                <span className="text-[#2ea0c5] font-bold">Youth Association of Purbichauki (YAOP)</span>{" "}
                                in our mission to connect, volunteer, and educate.
                            </p>
                            <p className="text-gray-400 text-base md:text-lg font-medium leading-[1.8]">
                                Every donation helps us drive local projects in{" "}
                                <span className="text-[#2ea0c5] font-bold underline decoration-[#FFCB3B] decoration-2 underline-offset-4">health</span>,{" "}
                                <span className="text-[#2ea0c5] font-bold underline decoration-[#FFCB3B] decoration-2 underline-offset-4">education</span>, and{" "}
                                <span className="text-[#2ea0c5] font-bold underline decoration-[#FFCB3B] decoration-2 underline-offset-4">community welfare</span>.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Section: Donation Form */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full z-10"
                >
                    <div className="bg-white rounded-[20px] p-8 md:p-12 lg:p-16 shadow-[0_48px_100px_rgba(44,49,54,0.15),0_12px_40px_rgba(46,160,197,0.08)] border border-gray-50/50">
                        <form onSubmit={handleSubmit} className="space-y-12">

                            {/* Section: Personal Details */}
                            <div className="space-y-8">
                                <SectionHeader color="#2ea0c5" title="Personal Details" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <FormField label="Full Name" required>
                                        <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter your full name" className="form-input" />
                                    </FormField>
                                    <FormField label="Email Address" required>
                                        <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="example@gmail.com" className="form-input" />
                                    </FormField>
                                    <div className="md:col-span-1">
                                        <FormField label="Phone Number" required>
                                            <div className="flex gap-4 relative">
                                                {/* Custom Country Selector */}
                                                <div className="w-[110px] shrink-0 relative">
                                                    <div
                                                        onClick={() => setIsCountryOpen(!isCountryOpen)}
                                                        className="form-input bg-white cursor-pointer flex items-center justify-between px-3"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className={`fi fi-${formData.countryIso} rounded-sm w-5 h-4`} />
                                                            <span className="text-[15px] font-bold">{formData.countryCode}</span>
                                                        </div>
                                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCountryOpen ? "rotate-180" : ""}`} />
                                                    </div>

                                                    <AnimatePresence>
                                                        {isCountryOpen && (
                                                            <>
                                                                <div className="fixed inset-0 z-[100]" onClick={() => setIsCountryOpen(false)} />
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                    className="absolute top-full left-0 mt-2 w-[280px] bg-white rounded-2xl shadow-2xl shadow-[#14181f]/15 border border-gray-100 p-2 z-[101] overflow-hidden"
                                                                    style={{ transformOrigin: "top left" }}
                                                                >
                                                                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                                                                        {countries.map((c) => (
                                                                            <div
                                                                                key={c.iso}
                                                                                onClick={() => {
                                                                                    setFormData({ ...formData, countryCode: c.code, countryIso: c.iso });
                                                                                    setIsCountryOpen(false);
                                                                                }}
                                                                                className={`flex items-center justify-between px-5 py-3.5 rounded-xl cursor-pointer transition-colors ${formData.countryIso === c.iso ? "bg-[#2ea0c5]/5 text-[#2ea0c5]" : "hover:bg-gray-50"}`}
                                                                            >
                                                                                <div className="flex items-center gap-4">
                                                                                    <span className={`fi fi-${c.iso} rounded-sm`} />
                                                                                    <span className="text-[15px] font-bold text-gray-700">{c.name}</span>
                                                                                </div>
                                                                                <span className="text-[14px] font-medium text-gray-400">{c.code}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </motion.div>
                                                            </>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                <div className="flex-1">
                                                    <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Enter phone number" className="form-input" />
                                                </div>
                                            </div>
                                        </FormField>
                                    </div>
                                    <div className="md:col-span-2">
                                        <FormField label="Address / Location / City" required>
                                            <input required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Enter your current location" className="form-input" />
                                        </FormField>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Donation Details */}
                            <div className="space-y-8">
                                <SectionHeader color="#ffa9d9" title="Donation Details" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <FormField label="Purpose of Donation" required>
                                        <select required value={formData.purpose} onChange={e => setFormData({ ...formData, purpose: e.target.value })} className="form-input bg-white cursor-pointer">
                                            <option value="">Select Purpose</option>
                                            {purposes.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </FormField>
                                    <FormField label="Amount (Rs.)" required>
                                        <input required type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} placeholder="Enter donation amount" className="form-input" />
                                    </FormField>
                                    <FormField label="Transaction ID / Reference Number" required>
                                        <input required value={formData.transactionId} onChange={e => setFormData({ ...formData, transactionId: e.target.value })} placeholder="Reference number" className="form-input" />
                                    </FormField>
                                </div>
                            </div>

                            {/* Section: Payment Proof */}
                            <div className="space-y-8">
                                <SectionHeader color="#a78bfa" title="Payment Proof" />

                                <FormField label="Payment Method" required>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {paymentMethods.map(method => (
                                            <label key={method} className={`flex items-center justify-center py-4 px-2 border-2 rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === method ? "border-[#2ea0c5] bg-[#2ea0c5]/5 text-[#2ea0c5]" : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"}`}>
                                                <input type="radio" name="paymentMethod" value={method} className="hidden" onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })} />
                                                <span className="font-bold text-sm">{method}</span>
                                            </label>
                                        ))}
                                    </div>
                                </FormField>

                                {/* Conditional QR Code Section */}
                                <AnimatePresence>
                                    {formData.paymentMethod && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, height: "auto", scale: 1 }}
                                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                            className="flex flex-col items-center justify-center p-8 bg-gray-50/50 rounded-3xl border border-gray-100 overflow-hidden"
                                        >
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Scan to Pay via {formData.paymentMethod}</p>
                                            <div className="relative group p-4 bg-white rounded-2xl shadow-lg border border-gray-50 text-center">
                                                <img
                                                    src={dynamicQrSrc}
                                                    alt={`${formData.paymentMethod} QR`}
                                                    className="w-56 h-auto object-contain rounded-lg mx-auto"
                                                />
                                                <div className="absolute inset-0 bg-[#2ea0c5]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
                                            </div>
                                            <p className="mt-6 text-gray-500 font-bold text-center">
                                                {formData.paymentMethod === "Bank Transfer" 
                                                    ? (globalSettings?.bankDetails || "Youth Association Of Purbichauki")
                                                    : `eSewa ID: ${globalSettings?.esewaId || "98XXXXXXX"}`}
                                            </p>
                                            <p className="mt-2 text-gray-400 text-xs font-medium text-center max-w-[250px]">
                                                Please scan the QR code above and upload the screenshot below for verification.
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <FormField label="Upload Payment Receipt (JPG, PNG, PDF, Max 10MB)" required>
                                    <div className="relative group">
                                        <input required type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={e => setFormData({ ...formData, receipt: e.target.files?.[0] || null })} className="hidden" id="receipt-upload" />
                                        <label htmlFor="receipt-upload" className="w-full flex items-center justify-center gap-5 bg-[#fcfcfc] border-2 border-dashed border-gray-200 rounded-2xl py-12 cursor-pointer hover:border-[#2ea0c5] hover:bg-[#2ea0c5]/5 transition-all group-hover:scale-[1.01]">
                                            <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 group-hover:text-[#2ea0c5] transition-colors">
                                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                            </div>
                                            <span className="text-lg font-bold text-gray-500 group-hover:text-[#2ea0c5] transition-colors">
                                                {formData.receipt ? formData.receipt.name : "Upload receipt"}
                                            </span>
                                        </label>
                                    </div>
                                </FormField>
                            </div>

                            {/* Declaration */}
                            <div className="pt-10 border-t border-gray-100">
                                <label className="flex items-start gap-4 cursor-pointer group">
                                    <input required type="checkbox" checked={formData.declaration} onChange={e => setFormData({ ...formData, declaration: e.target.checked })} className="mt-1 w-6 h-6 accent-[#2ea0c5] rounded-md cursor-pointer" />
                                    <span className="text-lg font-bold text-gray-700 leading-[1.5] group-hover:text-[#2ea0c5] transition-colors">
                                        I confirm that the above payment details are correct and I am submitting genuine information. <span className="text-red-500">*</span>
                                    </span>
                                </label>
                            </div>

                            <button
                                disabled={submitting}
                                type="submit"
                                className="relative w-full py-6 rounded-[10px] shadow-2xl transition-all overflow-hidden group/btn cursor-pointer bg-[#f0fdf4] border border-green-100 hover:shadow-green-200/50 disabled:opacity-70 disabled:hover:scale-100"
                            >
                                {submitting ? (
                                    <div className="relative z-10 flex items-center justify-center gap-3">
                                        <Loader2 className="w-8 h-8 animate-spin text-[#ff5722]" />
                                        <span className="text-xl font-black text-[#ff5722]">Processing...</span>
                                    </div>
                                ) : (
                                    <>
                                        <img 
                                            src="/green_ellipse.svg" 
                                            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/btn:scale-125 transition-transform duration-700 pointer-events-none" 
                                            alt="" 
                                        />
                                        <div className="relative z-10">
                                            <span className="text-2xl font-black tracking-tight whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-[#0d9488] via-[#062a24] to-[#0d9488] bg-[length:200%_auto] bg-left hover:bg-right transition-all duration-700">
                                                Submit donation details
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
                    transition: all 0.3s;
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
