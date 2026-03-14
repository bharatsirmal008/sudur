"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Facebook, Instagram, Mail, Heart } from "lucide-react";

export default function Footer() {
    const pathname = usePathname();
    if (pathname?.startsWith("/admin") || pathname === "/team") return null;

    return (
        <footer className="bg-black text-white py-10 px-6 md:px-12 lg:px-24 font-sans border-t border-slate-900/50">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between">

                {/* Left Section */}
                <div className="flex flex-col max-w-2xl">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.2] text-gray-200 tracking-tight">
                        Join us in our fight for a better
                        <br className="hidden lg:block" />
                        {" "}future for our societies and its
                        <br className="hidden lg:block" />
                        {" "}people.
                    </h2>

                    <div className="mt-8 space-y-3">
                        <p className="text-sm text-gray-400 font-medium">Stay updated with us and our causes.</p>
                        <div className="relative max-w-md flex items-center">
                            <input
                                type="email"
                                placeholder="Subscribe to our Newsletter"
                                className="w-full bg-[#252525] border border-transparent rounded-md py-3.5 px-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:bg-[#2a2a2a] transition-colors"
                            />
                            <button className="absolute right-4 text-gray-500 hover:text-gray-300 transition-colors">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLSeWEXcvU6l3wb6bSiChzHVbr-ElI3oDXrzvvT_qndTdfp8q-Q/viewform"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2  bg-emerald-950/30 hover:bg-emerald-950/50 text-emerald-400 text-sm font-medium py-3 px-5 rounded-md transition-colors"
                        >
                            Apply as a volunteer
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </a>
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLScoceAopvrnADYYBCB3cgJY6TX05UkUTXFxBKlIJYyN2aR3sg/viewform?usp=publish-editor"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-emerald-950/30 hover:bg-emerald-950/50 text-emerald-400 text-sm font-medium py-3 px-5 rounded-md border border-emerald-900/50 transition-colors"
                        >
                            Donate Now
                            <Heart className="w-4 h-4 ml-1" />
                        </a>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col mt-12 lg:mt-0 lg:ml-12 min-w-[250px]">
                    <div className="space-y-10">
                        {/* Location Info */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
                                Purbichauki
                            </h3>
                            <ul className="space-y-1.5 text-[15px] text-gray-300">
                                <li className="font-medium text-gray-200">YAOP</li>
                                <li>Purbichauki rural municipality 01,</li>
                                <li>khirshain doti, Nepal.</li>
                                <li className="pt-2">+977 98XXXXXXX</li>
                                <li>purbichaukiyuwanetritwa99@gmail.com</li>
                            </ul>
                        </div>

                        {/* Socials */}
                        <div className="space-y-5">
                            <h3 className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
                                Socials
                            </h3>
                            <div className="flex gap-3">
                                <a
                                    href="https://www.facebook.com/people/Youth-Association-Of-Purbichauki/61583554026434/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-10 h-10  bg-emerald-950/30 hover:bg-emerald-950/50 rounded-md  transition-colors"
                                >
                                    <Facebook className="w-4 h-4 text-emerald-400" />
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center justify-center w-10 h-10  bg-emerald-950/30 hover:bg-emerald-950/50 rounded-md  transition-colors"
                                >
                                    <Instagram className="w-4 h-4 text-emerald-400" />
                                </a>
                                <a
                                    href="mailto:purbichaukiyuwanetritwa99@gmail.com"
                                    className="flex items-center justify-center w-10 h-10  bg-emerald-950/30 hover:bg-emerald-950/50 rounded-md  transition-colors"
                                >
                                    <Mail className="w-4 h-4 text-emerald-400" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="max-w-7xl mx-auto mt-16 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                <p className="text-sm text-gray-500">
                    Copyright © {new Date().getFullYear()} YAOP
                </p>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2.5 bg-[#252525] px-4 py-2 rounded-full border border-[#333]">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-gray-300">Beta Release - v0.1.7</span>
                    </div>
                    <span className="text-xs font-medium text-gray-300">
                        YAOP x Void Studio
                    </span>
                </div>
            </div>
        </footer>
    );
}
