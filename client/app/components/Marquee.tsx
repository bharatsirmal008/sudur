"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Marquee = () => {
  const [isHovered, setIsHovered] = useState(false);

  const segments = [
    { text: "🎓 Scholarship 2082 for SEE Students — Apply Now", link: "/events" },
    { text: "Join YAOP. Stronger Communities, Brighter Futures. We invite you to contribute your voice and your time.", link: "/volunteer" },
    { text: "Through education and collective action, we can build a more sustainable and equitable society for all.", link: "/about" }
  ];

  // Combine segments with gap characters
  const marqueeText = segments.map(s => s.text).join(" \u00A0\u00A0\u00A0 • \u00A0\u00A0\u00A0 ");

  return (
    <div 
      className="bg-[#14181f] text-white py-2.5 overflow-hidden whitespace-nowrap relative z-[100] border-b border-white/10 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="inline-block"
        animate={{ x: isHovered ? undefined : ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          duration: 40,
          ease: "linear",
          x: {
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }
        }}
        style={{ x: isHovered ? 0 : undefined }} // This logic is slightly flawed for framer-motion pause, better to use CSS or a more robust framer-motion approach
      >
        <div className="flex items-center gap-12 pr-12">
           {[1, 2].map((i) => (
             <div key={i} className="flex items-center gap-12">
                {segments.map((segment, idx) => (
                  <Link 
                    key={`${i}-${idx}`} 
                    href={segment.link} 
                    className="flex items-center gap-2 hover:text-[#2ea0c5] transition-colors group"
                  >
                    <span className="text-[13px] md:text-sm font-bold tracking-wide uppercase">
                      {segment.text}
                    </span>
                    {idx === 0 && (
                      <div className="bg-[#2ea0c5] text-white text-[10px] px-2 py-0.5 rounded font-black uppercase flex items-center gap-1 group-hover:bg-[#14181f] group-hover:text-[#2ea0c5] transition-all border border-[#2ea0c5]">
                        Live <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                      </div>
                    )}
                  </Link>
                ))}
                <span className="text-gray-600 font-bold">•</span>
             </div>
           ))}
        </div>
      </motion.div>

      {/* CSS approach for marquee since it's more reliable for 'pause on hover' */}
      <style jsx>{`
        .marquee-container {
          display: flex;
          width: fit-content;
          animation: marquee 50s linear infinite;
        }
        .marquee-container:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Replacement using standard CSS for better hover behavior */}
      <div className="marquee-container flex items-center">
         {[1, 2].map((i) => (
             <div key={i} className="flex items-center gap-16 pr-16">
                {segments.map((segment, idx) => (
                  <Link 
                    key={`${i}-${idx}`} 
                    href={segment.link} 
                    className="flex items-center gap-3 hover:text-[#2ea0c5] transition-colors group shrink-0"
                  >
                    <span className="text-[12px] md:text-[13px] font-black tracking-widest uppercase">
                      {segment.text}
                    </span>
                    {idx === 0 && (
                      <ArrowRight className="w-4 h-4 text-[#2ea0c5] -rotate-45 group-hover:rotate-0 transition-transform" />
                    )}
                  </Link>
                ))}
                <span className="text-gray-800 font-bold">•</span>
             </div>
           ))}
      </div>

      {/* Hide the framer-motion one if it's redundant */}
      <style jsx>{`
        div :global(.inline-block) { display: none; }
      `}</style>
    </div>
  );
};

export default Marquee;
