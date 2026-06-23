import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "../data/content";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8">
      <div
        className={`mx-auto mt-4 max-w-7xl rounded-full px-6 transition-all duration-500 ${
          scrolled
            ? "bg-premium-black/80 backdrop-blur-xl shadow-2xl shadow-black/20"
            : "bg-premium-black/40 backdrop-blur-md"
        }`}
      >
        <div className="flex h-16 items-center justify-between">
          <a href="#" className="font-heading text-2xl font-bold tracking-wide text-luxury-white">
            Salon <span className="text-gold">Factory</span>
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-sm font-medium text-gray-300 transition-colors hover:text-gold after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button size="sm">Get Consultation</Button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-luxury-white lg:hidden"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-auto mt-2 max-w-7xl rounded-2xl bg-premium-black/95 backdrop-blur-xl p-6 lg:hidden"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-gray-300 transition-colors hover:text-gold"
                >
                  {link.label}
                </a>
              ))}
              <Button size="sm" className="mt-2 w-full">Get Consultation</Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
