import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "../data/content";
import { Menu, X, Search, User, Heart, Sun, ShoppingBag } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-2"
          : "bg-white py-3 border-b border-gray-150"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <a href="#" className="flex flex-col items-center group">
            <div className="bg-[#d61b2a] px-5 py-1 rounded-[6px] shadow-sm border border-[#b21421] transition-transform duration-300 group-hover:scale-102">
              <span className="font-heading text-lg sm:text-xl font-extrabold tracking-wide text-white uppercase block leading-none">
                SALON FACTORY
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-semibold text-premium-black mt-1 uppercase tracking-[0.2em] font-body">
              Furniture • Tools • Essentials
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-bold tracking-widest text-[#555] transition-colors duration-300 hover:text-gold"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Right side: CTA & Icons */}
          <div className="hidden items-center gap-6 lg:flex">
            <a
              href="#contact"
              className="text-xs font-bold tracking-widest text-[#555] transition-colors duration-300 hover:text-gold"
            >
              CONTACT US
            </a>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-5 text-gray-700">
              <button className="cursor-pointer transition-colors duration-300 hover:text-gold" aria-label="Search">
                <Search size={18} />
              </button>
              <button className="cursor-pointer transition-colors duration-300 hover:text-gold" aria-label="Profile">
                <User size={18} />
              </button>
              <button className="cursor-pointer transition-colors duration-300 hover:text-gold" aria-label="Wishlist">
                <Heart size={18} />
              </button>
              <button className="cursor-pointer transition-colors duration-300 hover:text-gold" aria-label="Toggle Theme">
                <Sun size={18} />
              </button>
              <button className="cursor-pointer transition-colors duration-300 hover:text-gold relative" aria-label="Cart">
                <ShoppingBag size={18} />
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-premium-black">
                  0
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-premium-black transition-colors duration-300 hover:text-gold lg:hidden cursor-pointer p-1"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100 bg-white shadow-inner lg:hidden overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              <nav className="flex flex-col gap-5">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-bold tracking-widest text-[#444] transition-colors duration-300 hover:text-gold py-1"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-bold tracking-widest text-[#444] transition-colors duration-300 hover:text-gold py-1"
                >
                  CONTACT US
                </a>
              </nav>

              <div className="h-px bg-gray-100 w-full" />

              <div className="flex items-center gap-6 justify-center text-gray-700 py-2">
                <button className="cursor-pointer transition-colors duration-300 hover:text-gold" aria-label="Search">
                  <Search size={20} />
                </button>
                <button className="cursor-pointer transition-colors duration-300 hover:text-gold" aria-label="Profile">
                  <User size={20} />
                </button>
                <button className="cursor-pointer transition-colors duration-300 hover:text-gold" aria-label="Wishlist">
                  <Heart size={20} />
                </button>
                <button className="cursor-pointer transition-colors duration-300 hover:text-gold" aria-label="Toggle Theme">
                  <Sun size={20} />
                </button>
                <button className="cursor-pointer transition-colors duration-300 hover:text-gold relative" aria-label="Cart">
                  <ShoppingBag size={20} />
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-premium-black">
                    0
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
