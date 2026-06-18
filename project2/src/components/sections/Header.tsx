"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Collection", href: "#collection" },
    { label: "Our Story", href: "#story" },
    { label: "Experiences", href: "#experiences" },
    { label: "Gifting", href: "#gifting" },
  ];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#090605]/85 backdrop-blur-md py-4 border-b border-[#e5ad6b]/10"
            : "bg-transparent py-6"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Left Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.25em] text-[#c8b5a4]">
            {navLinks.slice(0, 2).map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[#e5ad6b] transition-colors duration-350"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Logo */}
          <a
            href="#"
            className="text-center flex flex-col items-center group select-none"
          >
            <span className="font-serif text-xl md:text-2xl font-bold tracking-[0.3em] text-[#f8eadc] group-hover:text-[#e5ad6b] transition-colors duration-500">
              DARKINS
            </span>
            <span className="text-[7px] uppercase tracking-[0.55em] text-[#d4af37]/75 mt-0.5 font-sans">
              Bean-to-Bar India
            </span>
          </a>

          {/* Right Navigation & Icons (Desktop) */}
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.25em] text-[#c8b5a4]">
              {navLinks.slice(2).map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-[#e5ad6b] transition-colors duration-350"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Utility Icons */}
            <div className="flex items-center gap-4 md:gap-6 text-[#f8eadc]">
              <button
                className="hover:text-[#e5ad6b] transition-colors duration-300"
                aria-label="Account"
              >
                <User size={16} />
              </button>
              <button
                className="relative hover:text-[#e5ad6b] transition-colors duration-300"
                aria-label="Cart"
              >
                <ShoppingBag size={16} />
                <span className="absolute -top-1.5 -right-1.5 bg-[#c58c48] text-[#090605] font-mono text-[8px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
              
              {/* Mobile menu trigger */}
              <button
                className="md:hidden hover:text-[#e5ad6b] transition-colors duration-300"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open Menu"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#090605] flex flex-col justify-between p-8"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              {/* Mobile Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#e5ad6b]/10">
                <span className="font-serif text-lg font-bold tracking-[0.25em] text-[#f8eadc]">
                  DARKINS
                </span>
                <button
                  className="text-[#f8eadc] hover:text-[#e5ad6b]"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close Menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Links */}
              <nav className="flex flex-col gap-6 mt-12 text-left">
                {navLinks.map((link, idx) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif text-3xl text-[#f8eadc] hover:text-[#e5ad6b] transition-colors duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
            </div>

            {/* Mobile Footer info */}
            <div className="border-t border-[#e5ad6b]/10 pt-6 text-[10px] tracking-widest text-[#c8b5a4]/50 text-center uppercase">
              Darkins Chocolate © 2026
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
