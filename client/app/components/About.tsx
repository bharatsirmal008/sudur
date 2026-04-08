"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';

export default function About() {
  // Custom variant to animate a character in an endless egg-shaped loop
  const eggOvalVariant: Variants = {
    animate: (i: number) => ({
      x: [0, 8, 0, -8, 0],
      y: [0, -15, 0, 5, 0], // Asymmetric heights: taller top, shorter bottom = egg shape
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.08, // Stagger effect
      }
    }),
    initial: { opacity: 0, y: 50 },
    entry: (i: number) => ({
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, delay: i * 0.04 }
    })
  };

  const line1 = "Youth Association of";
  const line2 = "Purbichauki";

  return (
    // Main container: Min height or screen height, white background, flexbox for centering
    <div id="about" className="relative flex min-h-[100vh] py-32 w-full items-center justify-center bg-white text-indigo-500 px-8 md:px-20 lg:px-32 overflow-hidden">
      
      {/* Background Ellipses (Four Sides) */}
      <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          src="/yellow_ellipse.svg"
          alt=""
          className="absolute -top-[10%] -left-[5%] w-[35rem] h-[35rem] z-0 blur-[40px] pointer-events-none"
      />
      <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          viewport={{ once: true }}
          src="/blue_ellipse.svg"
          alt=""
          className="absolute top-[10%] -right-[15%] w-[45rem] h-[45rem] z-0 blur-[60px] pointer-events-none"
      />
      <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.7, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          viewport={{ once: true }}
          src="/pink_ellipse.svg"
          alt=""
          className="absolute -bottom-[20%] left-[10%] w-[40rem] h-[40rem] z-0 blur-[50px] pointer-events-none"
      />
      <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          viewport={{ once: true }}
          src="/yellow_ellipse.svg"
          alt=""
          className="absolute -bottom-[10%] -right-[5%] w-[30rem] h-[30rem] z-0 blur-[40px] pointer-events-none"
      />

      {/* Text Container */}
      <div className="relative z-10 px-4 w-full text-center">
        <h1 className="font-black tracking-tighter text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[1.2] md:leading-[1.2] flex flex-col items-center justify-center gap-4">
          
          {/* Line 1 */}
          <div className="flex flex-wrap justify-center gap-x-[0.3em]">
            {line1.split(" ").map((word, wIdx) => (
               <span key={wIdx} className="inline-flex overflow-visible">
                  {word.split("").map((char, cIdx) => {
                    const charIndex = wIdx * 10 + cIdx; // unique staggering value
                    return (
                      <motion.span
                        key={cIdx}
                        custom={charIndex}
                        variants={eggOvalVariant}
                        initial="initial"
                        whileInView={["entry", "animate"]}
                        viewport={{ once: true, margin: "-100px" }}
                        className={`inline-block whitespace-pre ${wIdx === 2 ? 'text-slate-400 font-bold' : 'text-slate-900'}`}
                      >
                        {char}
                      </motion.span>
                    );
                  })}
               </span>
            ))}
          </div>

          {/* Line 2 with Gradient */}
          <div className="flex flex-wrap justify-center">
             <span className="inline-flex overflow-visible pb-4 pt-2">
                {line2.split("").map((char, cIdx) => (
                  <motion.span
                    key={cIdx}
                    custom={cIdx + 20} // offset delay from first line
                    variants={eggOvalVariant}
                    initial="initial"
                    whileInView={["entry", "animate"]}
                    viewport={{ once: true, margin: "-100px" }}
                    className="inline-block whitespace-pre bg-clip-text text-transparent bg-gradient-to-r from-[#2ea0c5] via-indigo-600 to-purple-600"
                  >
                    {char}
                  </motion.span>
                ))}
             </span>
          </div>

        </h1>
      </div>

    </div>
  );
}