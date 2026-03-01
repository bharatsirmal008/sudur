"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Twitter, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    const pathname = usePathname();
    if (pathname?.startsWith("/admin")) return null;

    return (
        <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-800">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                                <Heart className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">SUDUR</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            A digital hub dedicated to uplifting communities through education, healthcare, and sustainable development.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="p-2 bg-slate-900 rounded-full hover:bg-indigo-600 hover:text-white transition-colors duration-300">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 bg-slate-900 rounded-full hover:bg-indigo-600 hover:text-white transition-colors duration-300">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 bg-slate-900 rounded-full hover:bg-indigo-600 hover:text-white transition-colors duration-300">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 bg-slate-900 rounded-full hover:bg-indigo-600 hover:text-white transition-colors duration-300">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">About Us</Link></li>
                            <li><Link href="/events" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Upcoming Events</Link></li>
                            <li><Link href="/volunteer" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Volunteer</Link></li>
                            <li><Link href="/donate" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Donate</Link></li>
                            <li><Link href="/contact" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Legal</h3>
                        <ul className="space-y-3">
                            <li><Link href="/privacy" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Terms of Service</Link></li>
                            <li><Link href="/guidelines" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Community Guidelines</Link></li>
                            <li><Link href="/financials" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Financial Transparency</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contact Info</h3>
                        <div className="flex items-start gap-3 text-sm text-slate-400">
                            <MapPin className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                            <p>Purbichauki rural muncipality 01,<br />khirshain doti, Nepal</p>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                            <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                            <p>+977 98XXXXXXX</p>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                            <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                            <p>purbichaukiyuwanetritwa99@gmail.com</p>
                        </div>
                    </div>

                </div>

                <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>© {new Date().getFullYear()} SUDUR. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Made with <Heart className="w-4 h-4 text-rose-500" /> for the community
                    </p>
                </div>
            </div>
        </footer>
    );
}
