"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

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
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Events", href: "/#events" },
    { name: "Team", href: "/team" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm py-3"
        : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none overflow-hidden">
            <img className="w-full h-full object-cover" src="/sudur_logo.png" alt="SUDUR Logo" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 tracking-tight">
            SUDUR
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {session ? (
            <div className="flex items-center gap-3">

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-900 dark:text-white shadow-sm hover:border-indigo-600 dark:hover:border-indigo-400 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 dark:bg-white px-5 py-2.5 text-sm font-medium text-white dark:text-slate-900 shadow-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                Join Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2 z-50">
          <ThemeToggle />
          <button
            className="text-slate-900 dark:text-white p-2"
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
            className="absolute top-full left-0 right-0 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 shadow-lg py-4 px-4 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base font-medium text-slate-700 dark:text-slate-200 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              {session ? (
                <>

                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center text-sm font-medium text-slate-700 dark:text-slate-200 py-2.5 border border-slate-200 dark:border-slate-800 rounded-full"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center inline-flex items-center justify-center rounded-full bg-slate-900 dark:bg-white px-5 py-2.5 text-sm font-medium text-white dark:text-slate-900"
                  >
                    Join Now
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
