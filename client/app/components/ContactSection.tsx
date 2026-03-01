"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Phone, Mail, MapPin, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactSection() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        message: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus("idle");
        setMessage("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: formData.first_name,
                    lastName: formData.last_name,
                    email: formData.email,
                    message: formData.message
                })
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage(data.mock ? "Message sent! (Mock Mode: Check terminal)" : "Thank you! Your message has been sent to our team.");
                setFormData({ first_name: "", last_name: "", email: "", message: "" });
            } else {
                throw new Error(data.message || "Something went wrong.");
            }
        } catch (err: any) {
            setStatus("error");
            setMessage(err.message || "Failed to send message. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="contact" className="py-24 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-16">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Get In Touch
                        </h2>
                        <div className="w-20 h-1.5 bg-indigo-500 rounded-full mb-6"></div>
                        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                            Have questions about our initiatives or want to get involved? We'd love to hear from you. Drop us a message and our team will get back to you shortly.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white">Our Headquarters</h4>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1">Purbichauki rural muncipality 01<br />khirshain doti, Nepal</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white">Phone Number</h4>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1">+977 98XXXXXXX<br />Nepal</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white">Email Address</h4>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1">purbichaukiyuwanetritwa99@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm"
                    >
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send a Message</h3>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {status === "success" && (
                                <div className="flex items-center gap-2 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-medium border border-emerald-100 dark:border-emerald-900/30 mb-4">
                                    <CheckCircle className="w-5 h-5" /> {message}
                                </div>
                            )}

                            {status === "error" && (
                                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30 mb-4">
                                    <AlertCircle className="w-5 h-5" /> {message}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="first_name" className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                                    <input type="text" id="first_name" required value={formData.first_name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="John" />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="last_name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                                    <input type="text" id="last_name" required value={formData.last_name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Doe" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                                <input type="email" id="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="john@example.com" />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                                <textarea id="message" required rows={4} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none mt-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
