"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface GalleryImage {
    _id: string;
    url: string;
    caption?: string;
}

export default function Gallery() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    
    useEffect(() => {
        fetch("/api/gallery")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setImages(data);
            })
            .catch(console.error);
    }, []);

    // "in tinal not show any thing" -> if no images, render nothing
    if (images.length === 0) return null;

    return (
        <section className="relative w-full bg-[#050505] py-28 overflow-hidden">
            {/* SVG Wire Background */}
            <div className="absolute top-1/2 left-0 w-full h-[300px] -translate-y-[60%] pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 1200 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-100,50 Q600,450 1300,50" fill="none" stroke="#666" strokeWidth="1.5" />
                </svg>
            </div>

            <div className="max-w-[90rem] mx-auto px-4 relative z-10">
                <div className="text-center mb-24">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Gallery</h2>
                    <p className="text-slate-400 font-medium max-w-2xl mx-auto">A glimpse into our impactful moments.</p>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 pb-16">
                    {images.map((img, i) => {
                        // Alternate rotations and Y translations to simulate hanging on a curved wire
                        const rotations = [-8, 6, -5, 9, -4, 7];
                        const rotate = rotations[i % rotations.length];
                        
                        // To follow a quadratic curve roughly: items in the center are lower.
                        const middleIndex = (images.length - 1) / 2;
                        const distanceFromCenter = Math.abs(i - middleIndex);
                        const translateY = Math.max(0, 100 - (distanceFromCenter * distanceFromCenter * 15));

                        return (
                            <motion.div
                                key={img._id}
                                initial={{ opacity: 0, scale: 0.9, y: translateY + 30 }}
                                whileInView={{ opacity: 1, scale: 1, y: translateY }}
                                animate={{ rotate: rotate }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="relative bg-white p-3 pb-10 md:p-4 md:pb-14 shadow-2xl hover:scale-105 transition-transform duration-300 w-56 h-64 md:w-72 md:h-80 flex-shrink-0 cursor-pointer group"
                            >
                                {/* Binder Clip Graphic */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-10 flex flex-col items-center z-20">
                                    {/* The metal wire of the clip */}
                                    <div className="w-5 h-8 border-[2px] border-[#a3a3a3] rounded-t-full rounded-b-sm bg-transparent"></div>
                                    {/* The black body of the clip */}
                                    <div className="w-8 h-4 bg-black rounded-b-sm -mt-2 z-10 shadow-md"></div>
                                </div>

                                <div className="w-full h-full overflow-hidden bg-slate-100 border border-slate-200">
                                    <img src={img.url} alt={img.caption || "Gallery"} className="w-full h-full object-cover filter brightness-[0.95] contrast-[1.05] group-hover:brightness-100 transition-all" />
                                </div>
                                {img.caption && (
                                    <div className="absolute bottom-3 md:bottom-4 left-0 right-0 px-4">
                                        <p className="text-center text-slate-800 text-sm md:text-base font-medium truncate">
                                            {img.caption}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
