"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Menu, X, Sparkles, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Platform", href: "#features", hasDropdown: true },
  { label: "Roadmaps", href: "#roadmaps" },
  { label: "Mentors", href: "#mentors" },
  { label: "Jobs", href: "#jobs" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[rgba(5,8,22,0.85)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]"
            : "bg-transparent"
        }`}
      >
        <div className="container-cv flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] rounded-lg blur-sm opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-8 h-8 bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] rounded-lg flex items-center justify-center">
                <Brain size={16} className="text-white" />
              </div>
            </div>
            <span className="font-bold text-lg tracking-tight">
              Career<span className="gradient-text-primary">Veda</span>
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full border border-[rgba(108,99,255,0.4)] text-[#6C63FF] bg-[rgba(108,99,255,0.1)]">
              AI OS
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all duration-200 text-sm font-medium"
              >
                {link.label}
                {link.hasDropdown && <ChevronDown size={14} />}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl text-[#94A3B8] hover:text-white transition-colors text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[rgba(108,99,255,0.3)]"
            >
              <Sparkles size={14} />
              Start Free
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg glass-card"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[rgba(5,8,22,0.95)] backdrop-blur-2xl border-b border-[rgba(255,255,255,0.06)] p-6"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-3 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                <Link
                  href="/dashboard"
                  className="px-4 py-3 rounded-xl text-center text-[#94A3B8] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(108,99,255,0.4)] transition-all font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/dashboard"
                  className="px-4 py-3 rounded-xl text-center bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] text-white font-semibold"
                >
                  Start Free Analysis
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
