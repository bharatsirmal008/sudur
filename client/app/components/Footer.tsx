"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Facebook, Instagram, Mail, Heart } from "lucide-react";

export default function Footer() {
    const pathname = usePathname();
    if (pathname?.startsWith("/admin")) return null;

    return (
        <footer className="bg-white text-slate-900 py-10 px-6 md:px-12 lg:px-24 font-sans border-t border-slate-100">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between">

                {/* Left Section */}
                <div className="flex flex-col max-w-2xl text-left">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-[1.2] text-slate-900 tracking-tight">
                        Join us in our fight for a better
                        <br className="hidden lg:block" />
                        {" "}future for our societies and its
                        <br className="hidden lg:block" />
                        {" "}people.
                    </h2>

                    <div className="mt-8 space-y-3">
                        <p className="text-sm text-slate-500 font-medium">Stay updated with us and our causes.</p>
                        <div className="relative max-w-md flex items-center">
                            <input
                                type="email"
                                placeholder="Subscribe to our Newsletter"
                                className="w-full bg-slate-50 border border-slate-200 rounded-md py-3.5 px-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:bg-white transition-colors"
                            />
                            <button className="absolute right-4 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link
                            href="/volunteer"
                            className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-sm font-bold py-3 px-6 rounded-[10px] transition-all cursor-pointer shadow-sm shadow-emerald-600/5"
                        >
                            Apply as a volunteer
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                        <Link
                            href="/donate"
                            className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-sm font-bold py-3 px-6 rounded-[10px] border border-emerald-100 transition-all cursor-pointer shadow-sm shadow-emerald-600/5"
                        >
                            Donate Now
                            <Heart className="w-4 h-4 ml-1" />
                        </Link>
                        <Link
                            href="/donors"
                            className="inline-flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-600 text-sm font-bold py-3 px-6 rounded-[10px] border border-amber-100 transition-all cursor-pointer shadow-sm shadow-amber-600/5"
                        >
                            Top Donors List
                            <Heart className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col mt-12 lg:mt-0 lg:ml-12 min-w-[250px]">
                    <div className="space-y-10">
                        {/* Location Info */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-semibold text-slate-400 tracking-widest uppercase">
                                Purbichauki
                            </h3>
                            <ul className="space-y-1.5 text-[15px] text-slate-600">
                                <li className="font-bold text-slate-900">YAOP</li>
                                <li>Purbichauki rural municipality 01,</li>
                                <li>khirshain doti, Nepal.</li>
                                <li className="pt-2">+977 98XXXXXXX</li>
                                <li>purbichaukiyuwanetritwa99@gmail.com</li>
                            </ul>
                        </div>

                        {/* Socials */}
                        <div className="space-y-5">
                            <h3 className="text-xs font-semibold text-slate-400 tracking-widest uppercase">
                                Socials
                            </h3>
                            <div className="flex gap-3">
                                <a
                                    href="https://www.facebook.com/people/Youth-Association-Of-Purbichauki/61583554026434/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-10 h-10 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors cursor-pointer"
                                >
                                    <Facebook className="w-4 h-4 text-emerald-600" />
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center justify-center w-10 h-10 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors cursor-pointer"
                                >
                                    <Instagram className="w-4 h-4 text-emerald-600" />
                                </a>
                                <a
                                    href="mailto:purbichaukiyuwanetritwa99@gmail.com"
                                    className="flex items-center justify-center w-10 h-10 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors cursor-pointer"
                                >
                                    <Mail className="w-4 h-4 text-emerald-600" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                <p className="text-sm text-slate-400 font-medium">
                    Copyright © {new Date().getFullYear()} YAOP
                </p>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                    {/* <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        YAOP x Void Studio
                    </span> */}
                </div>
            </div>
        </footer>
    );
}
