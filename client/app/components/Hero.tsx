"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
    return (
        <section id="home" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-black">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero_bg.jpg"
                    alt="Mountain Landscape Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-5xl m-auto space-y-8"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white pb-2 leading-tight kosmik-title flex flex-wrap justify-center gap-[0.2em] md:gap-[0.3em]">
                        {"Youth Association of".split(" ").map((word, wordIdx) => (
                            <span key={`word-${wordIdx}`} className="flex">
                                {word.split("").map((char, charIdx) => {
                                    // Calculate how many characters came before this one across all words
                                    const priorWordsLength = "Youth Association of"
                                        .split(" ")
                                        .slice(0, wordIdx)
                                        .join("").length;
                                    const globalIdx = priorWordsLength + charIdx;
                                    
                                    return (
                                        <motion.span 
                                            key={`char-${globalIdx}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: 0.2 + globalIdx * 0.05, ease: "easeOut" }}
                                            className="inline-block"
                                        >
                                            {char}
                                        </motion.span>
                                    );
                                })}
                            </span>
                        ))}
                        <span className="flex text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 drop-shadow-sm">
                            {"Purbichauki".split("").map((char, charIdx) => {
                                // "YouthAssociationof" length is 18
                                const globalIdx = 18 + charIdx;
                                
                                return (
                                    <motion.span 
                                        key={`purb-${charIdx}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.2 + globalIdx * 0.05, ease: "easeOut" }}
                                        className="inline-block"
                                    >
                                        {char}
                                    </motion.span>
                                );
                            })}
                        </span>
                    </h1>

                    <p className="max-w-[60rem] m-auto text-lg md:text-xl text-slate-200 leading-relaxed">
                        Join YAOP. Stronger Communities, Brighter Futures. We invite you to contribute your voice and your time. Through education and collective action, we can build a more sustainable and equitable society for all.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
