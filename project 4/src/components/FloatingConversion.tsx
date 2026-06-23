import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { X } from "lucide-react";

export default function FloatingConversion() {
  const [showExit, setShowExit] = useState(false);

  useState(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 0) setShowExit(true);
    };
    document.addEventListener("mouseleave", handler);
    return () => document.removeEventListener("mouseleave", handler);
  });

  return (
    <>
      <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
        <a
          href="https://wa.me/9193355667771"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-gold shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-premium-black">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
        <a
          href="#quote"
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-premium-black shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        >
          <span className="text-xs font-bold text-gold">RFQ</span>
        </a>
      </div>

      <AnimatePresence>
        {showExit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-premium-black/80 backdrop-blur"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-lg rounded-sm bg-luxury-white p-10 shadow-2xl"
            >
              <button onClick={() => setShowExit(false)} className="absolute right-4 top-4 text-gray-400 hover:text-premium-black">
                <X size={20} />
              </button>
              <p className="text-sm uppercase tracking-[0.3em] text-gold">Wait!</p>
              <h3 className="mt-3 font-heading text-3xl font-semibold text-premium-black">
                Download Premium Catalog
              </h3>
              <p className="mt-3 text-gray-600">
                Browse our complete 2026 collection of luxury salon furniture and infrastructure solutions.
              </p>
              <form className="mt-6 space-y-3">
                <input type="text" placeholder="Full Name *" className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-gold focus:outline-none" />
                <input type="email" placeholder="Email *" className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-gold focus:outline-none" />
                <input type="tel" placeholder="Phone *" className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-gold focus:outline-none" />
                <Button className="w-full">Download Free Catalog</Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
