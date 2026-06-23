import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { X, Phone, MessageCircle } from "lucide-react";

export default function FloatingConversion() {
  const [showExit, setShowExit] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        // Only trigger once
        const shown = sessionStorage.getItem("exit_modal_shown");
        if (!shown) {
          setShowExit(true);
          sessionStorage.setItem("exit_modal_shown", "true");
        }
      }
    };
    document.addEventListener("mouseleave", handler);
    return () => document.removeEventListener("mouseleave", handler);
  }, []);

  return (
    <>
      {/* Floating Action Buttons stacked in the bottom-right corner */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3.5 items-end">
        {/* Call Support Button (Gold Pill) */}
        <motion.a
          href="tel:+919335566771"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-gold shadow-lg shadow-gold/15 hover:shadow-xl transition-all border border-[#dfd4a3] text-premium-black group"
        >
          <Phone size={16} className="text-premium-black animate-pulse" />
          <span className="text-xs sm:text-sm font-bold tracking-wide font-body">
            Call Support
          </span>
        </motion.a>

        {/* WhatsApp Chat Button (Green Pill) */}
        <motion.a
          href="https://wa.me/919335566771"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/15 hover:shadow-xl transition-all text-white group"
        >
          {/* Custom SVG/Lucide icon */}
          <MessageCircle size={17} fill="white" className="text-white" />
          <span className="text-xs sm:text-sm font-bold tracking-wide font-body">
            Chat with Salon Expert
          </span>
        </motion.a>
      </div>

      {/* Exit Intent Catalog Modal */}
      <AnimatePresence>
        {showExit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-premium-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-md w-full rounded-2xl bg-white p-8 sm:p-10 shadow-2xl border border-gray-100"
            >
              <button
                onClick={() => setShowExit(false)}
                className="absolute right-4 top-4 p-1 rounded-full text-gray-400 hover:text-premium-black hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
              
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold font-body">
                EXCLUSIVE ACCESS
              </span>
              <h3 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-premium-black leading-tight text-left">
                Download Premium Catalog
              </h3>
              <p className="mt-3 text-sm text-gray-600 text-left font-body leading-relaxed">
                Browse our complete collection of luxury salon furniture, pedicure thrones, styling stations, and direct factory pricing.
              </p>
              
              <form onSubmit={(e) => { e.preventDefault(); setShowExit(false); }} className="mt-6 space-y-3.5 text-left">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-body focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Email Address *"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-body focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number *"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-body focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
                  />
                </div>
                <Button type="submit" className="w-full rounded-lg py-3 text-sm font-bold shadow-md hover:shadow-lg mt-2">
                  Download Free Catalog
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
