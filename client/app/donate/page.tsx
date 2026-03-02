"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    ArrowLeft,
    CreditCard,
    User,
    MapPin,
    CheckCircle,
    Loader2,
    QrCode,
    ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const STEPS = [
    { id: 1, name: "Amount", icon: Heart },
    { id: 2, name: "Details", icon: User },
    { id: 3, name: "Address", icon: MapPin },
    { id: 4, name: "Payment", icon: QrCode },
];

export default function DonatePage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        amount: "",
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "India",
        purpose: "General Fund",
        message: "",
        paymentMethod: "QR Code"
    });

    const handleAmountSelect = (val: string) => {
        setFormData({ ...formData, amount: val });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => {
        if (step < 4) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate API call
            const res = await fetch("/api/donate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push("/donate/success");
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
            <div className="container px-4 mx-auto max-w-2xl">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                    {/* Header */}
                    <div className="bg-indigo-600 p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0 0 L100 0 L100 100 Z" fill="white" />
                            </svg>
                        </div>
                        <Heart className="w-12 h-12 text-white mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-white mb-2">Support SUDUR</h1>
                        <p className="text-indigo-100 opacity-90">Your donation creates lasting change.</p>
                    </div>

                    {/* Stepper */}
                    <div className="flex border-b border-slate-100 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/50">
                        {STEPS.map((s) => (
                            <div key={s.id} className="flex-1 flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= s.id
                                    ? "bg-indigo-600 text-white"
                                    : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                                    }`}>
                                    {step > s.id ? <CheckCircle className="w-5 h-5" /> : s.id}
                                </div>
                                <span className={`text-[10px] uppercase tracking-wider font-bold ${step >= s.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"
                                    }`}>
                                    {s.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit} className="p-8">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Select Donation Amount</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {["100", "500", "1000", "5000"].map((amt) => (
                                            <button
                                                key={amt}
                                                type="button"
                                                onClick={() => handleAmountSelect(amt)}
                                                className={`py-4 rounded-2xl border-2 font-bold transition-all duration-200 ${formData.amount === amt
                                                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                                                    : "border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 text-slate-600 dark:text-slate-400"
                                                    }`}
                                            >
                                                Rs. {amt}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">Rs.</span>
                                        <input
                                            type="number"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            placeholder="Enter Custom Amount"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-10 pr-4 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Choose a Cause</label>
                                        <select
                                            name="purpose"
                                            value={formData.purpose}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 appearance-none"
                                        >
                                            <option>General Fund</option>
                                            <option>Education Initiative</option>
                                            <option>Healthcare Support</option>
                                            <option>Environmental Program</option>
                                            <option>Youth Development</option>
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={!formData.amount}
                                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next Details
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Donor Information</h2>
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Full Name"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600"
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Email Address"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600"
                                        />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Phone Number (Optional)"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600"
                                        />
                                        <textarea
                                            name="message"
                                            rows={3}
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Any special message? (How did you hear about us?)"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 resize-none"
                                        ></textarea>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex-1 py-4 border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            disabled={!formData.name || !formData.email}
                                            className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next: Address
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Mailing Address</h2>
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            name="address"
                                            required
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Street Address"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600"
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                name="city"
                                                required
                                                value={formData.city}
                                                onChange={handleChange}
                                                placeholder="City"
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600"
                                            />
                                            <input
                                                type="text"
                                                name="state"
                                                required
                                                value={formData.state}
                                                onChange={handleChange}
                                                placeholder="State / Province"
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                name="zip"
                                                required
                                                value={formData.zip}
                                                onChange={handleChange}
                                                placeholder="ZIP / Postal Code"
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600"
                                            />
                                            <input
                                                type="text"
                                                name="country"
                                                required
                                                value={formData.country}
                                                onChange={handleChange}
                                                placeholder="Country"
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 mt-4">
                                        <div className="flex items-center gap-3 text-sm text-indigo-700 dark:text-indigo-400 font-medium">
                                            <QrCode className="w-5 h-5" />
                                            <span>Scan & Pay will follow after address details.</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex-1 py-4 border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            disabled={!formData.address || !formData.city || !formData.state || !formData.zip || !formData.country}
                                            className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next: Payment
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Scan & Pay</h2>

                                    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-600 flex flex-col items-center text-center space-y-4">
                                        <div className="bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                            Nepal QR Payment
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-inner border border-slate-100 overflow-hidden">
                                            <img
                                                src="/payment_qr.jpeg"
                                                alt="Payment QR Code"
                                                className="w-[200px] h-[200px] object-contain"
                                            />
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                                            Scan this QR code with your mobile banking or wallet app to complete the payment of <span className="font-bold text-slate-900 dark:text-white">Rs. {formData.amount}</span>.
                                        </p>
                                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 w-full">
                                            <p className="text-xs text-indigo-700 dark:text-indigo-400">
                                                After scanning and paying, please click the button below to complete your donation record.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex-1 py-4 border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            ) : (
                                                "Complete Donation"
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="space-y-2">
                        <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto shadow-sm border border-slate-100 dark:border-slate-800 mb-2 font-bold text-indigo-600">100%</div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Direct Impact</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">All funds go directly to community programs.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto shadow-sm border border-slate-100 dark:border-slate-800 mb-2 font-bold text-indigo-600">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Secure Payment</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Industry standard 256-bit SSL encryption.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto shadow-sm border border-slate-100 dark:border-slate-800 mb-2 font-bold text-indigo-600">TAX</div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Tax Deductible</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Receive an official receipt for tax purposes.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
