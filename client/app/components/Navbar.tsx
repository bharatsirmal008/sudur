"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  const navLinks = [
    { name: "Home", href: "/#home" },
    { name: "Events", href: "/#events" },
    { name: "Team", href: "/team" },
    { name: "Donate", href: "/donate" },
  ];

  const isLightTheme = pathname === "/team" || pathname === "/volunteer" || pathname === "/donate" || pathname === "/login" || pathname?.startsWith("/event/");

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled
        ? isLightTheme
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-3"
          : "bg-[#050505]/95 backdrop-blur-md shadow-sm border-b border-gray-800/50 py-3"
        : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none overflow-hidden">
            <img className="w-full h-full object-cover" src="/logo.png" alt="YAOP Logo" />
          </div>
          <span className={`text-2xl font-black tracking-tighter transition-colors duration-300 ${isLightTheme
            ? "text-black"
            : "text-white"
            }`}>
            YAOP
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href.startsWith("/#") && pathname === "/");
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-bold transition-all duration-300 ${isActive && isLightTheme
                  ? "text-[#2ea0c5]"
                  : isLightTheme
                    ? "text-black"
                    : "text-white"
                  } hover:text-[#2ea0c5]`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <Link
              href="/dashboard"
              className={`w-11 h-11 rounded-full overflow-hidden border-[3px] transition-all duration-300 shadow-md ${isLightTheme
                ? "border-white hover:border-slate-200"
                : "border-slate-800 hover:border-slate-600"
                }`}
              title="Go to Dashboard"
            >
              {(session.user as any)?.image ? (
                <img src={(session.user as any).image} alt="Dashboard" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 text-lg uppercase">
                  {(session.user?.name || session.user?.email || "U")[0]}
                </div>
              )}
            </Link>
          ) : (
            <Link
              href="/login"
              className={`relative overflow-hidden inline-flex items-center justify-center rounded-[12px] px-8 py-2.5 text-sm font-black transition-all duration-300 active:scale-[0.98] ${isLightTheme
                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-indigo-500/10"
                : "bg-white text-slate-900 hover:bg-slate-50 shadow-sm"
                }`}
            >
              {/* Blue Ellipse Glow */}
              <div className="absolute -top-1/2 -right-1/4 w-12 h-12 bg-blue-500/20 blur-[15px] rounded-full pointer-events-none group-hover:bg-blue-500/30 transition-colors"></div>
              <span className="relative z-10">Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2 z-50">
          <button
            className={`p-2 transition-colors duration-300 ${isLightTheme ? "text-black" : "text-white"
              }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-[#0a0a0a] border-b border-slate-800 shadow-lg py-4 px-4 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href.startsWith("/#") && pathname === "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-base font-medium py-2 border-b border-slate-800 last:border-0 transition-colors ${isActive && isLightTheme ? "text-[#2ea0c5]" : "text-white"
                    } hover:text-[#2ea0c5]`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="flex flex-col gap-3 pt-4">
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 bg-emerald-950/30 hover:bg-emerald-950/50 text-emerald-400 text-sm font-medium py-3 px-5 rounded-md border border-emerald-900/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Donate Now
                <Heart className="w-4 h-4 ml-1" />
              </Link>
              {session ? (
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full inline-flex items-center gap-3 rounded-xl bg-slate-800 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-50 border border-slate-600 flex items-center justify-center shrink-0">
                    {(session.user as any)?.image ? (
                      <img src={(session.user as any).image} alt="Dashboard" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-indigo-600 uppercase">{(session.user?.name || session.user?.email || "U")[0]}</span>
                    )}
                  </div>
                  My Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative overflow-hidden w-full text-center inline-flex items-center justify-center rounded-full bg-white px-5 py-3.5 text-sm font-bold text-slate-900 shadow-lg shadow-indigo-500/5"
                >
                  <div className="absolute -top-4 -right-2 w-16 h-16 bg-blue-500/20 blur-[20px] rounded-full pointer-events-none"></div>
                  <span className="relative z-10">Sign In</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
