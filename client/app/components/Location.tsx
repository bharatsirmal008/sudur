"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

export default function Location() {
    return (
        <section id="location" className="py-24 bg-[#fcfcfc] relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-emerald-50/50 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-sky-50/50 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10">
                <div className="max-w-[1750px] mx-auto px-2 md:px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 40 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative w-full rounded-[10px] overflow-hidden shadow-[0_48px_100px_rgba(0,0,0,0.12)] border-[4px] border-white group"
                    >
                        <div className="absolute inset-0 bg-[#16a34a]/5 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <iframe
                            src="https://www.google.com/maps?q=Purbichauki+Locality+Doti+Nepal&output=embed&z=13"
                            width="100%"
                            height="600"
                            style={{ border: 0, borderRadius: '10px' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="filter contrast-[1.05] brightness-[1.1]"
                        ></iframe>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
