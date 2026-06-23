import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { trustedClients } from "../data/content";

export default function TrustedLogos() {
  const ref = useRef<HTMLDivElement>(null!);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="overflow-hidden bg-premium-black py-20" id="clients">
      <div className="container-main mb-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center text-sm uppercase tracking-[0.3em] text-gray-500"
        >
          Trusted by India's Finest Salons
        </motion.p>
      </div>

      <div className="relative">
        <div className="flex gap-16 animate-scroll-left">
          {[...trustedClients, ...trustedClients].map((client, i) => (
            <div
              key={`${client}-${i}`}
              className="group relative flex-shrink-0 cursor-pointer"
            >
              <p className="whitespace-nowrap font-heading text-xl text-gray-600 transition-colors duration-300 hover:text-gold">
                {client}
              </p>
              <div className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
