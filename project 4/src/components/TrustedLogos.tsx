import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { trustedClients } from "../data/content";

export default function TrustedLogos() {
  const ref = useRef<HTMLDivElement>(null!);
  const isInView = useInView(ref, { once: true });

  // Helper to generate a unique elegant text-logo styling based on the salon name
  const getLogoStyle = (name: string) => {
    if (name.includes("Calista") || name.includes("Royal") || name.includes("House")) {
      return "font-heading font-bold text-premium-black tracking-wider text-sm";
    }
    if (name.includes("Shivam") || name.includes("Monalisa") || name.includes("Sudha")) {
      return "font-serif italic font-semibold text-gold tracking-normal text-base";
    }
    if (name.includes("KT") || name.includes("VIP") || name.includes("MR")) {
      return "font-sans font-extrabold text-[#333] tracking-[0.2em] text-xs uppercase";
    }
    return "font-heading font-medium text-gray-700 tracking-wide text-xs";
  };

  return (
    <section ref={ref} className="overflow-hidden bg-[#faf9f6] py-16 border-b border-gray-100" id="clients">
      <div className="container-main mb-8">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-xs font-bold uppercase tracking-[0.3em] text-gray-400 font-body"
        >
          Trusted by India's Finest Salons
        </motion.p>
      </div>

      <div className="relative w-full">
        {/* Infinite scrolling slider */}
        <div className="flex gap-6 animate-scroll-left py-4 w-max">
          {[...trustedClients, ...trustedClients, ...trustedClients].map((client, i) => (
            <div
              key={`${client}-${i}`}
              className="flex-shrink-0 bg-white px-6 py-4 rounded-xl border border-gray-150 shadow-sm flex items-center justify-center h-16 min-w-[170px] transition-all duration-300 hover:border-gold hover:shadow-md cursor-pointer"
            >
              <span className={`text-center select-none ${getLogoStyle(client)}`}>
                {client}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
