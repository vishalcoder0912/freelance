import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { manufacturingSteps } from "../data/content";

export default function Manufacturing() {
  const ref = useRef<HTMLDivElement>(null!);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="bg-[#faf9f6] py-24 border-b border-gray-100" id="manufacturing">
      <div className="container-main">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center text-sm uppercase tracking-[0.3em] text-gold font-bold font-body"
        >
          Manufacturing Excellence
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="mt-4 text-center font-heading text-4xl font-bold text-premium-black md:text-5xl lg:text-6xl leading-[1.15]"
        >
          Built Inside Our <span className="text-gold">Factory</span>.
          <br />
          Trusted Across India.
        </motion.h2>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {manufacturingSteps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-150 shadow-sm transition-all duration-300 hover:scale-102 hover:shadow-lg hover:border-gold/40 cursor-pointer flex flex-col h-[280px]"
            >
              <div className="w-full h-[180px] overflow-hidden bg-gray-50 relative">
                <img
                  src={step.image}
                  alt={step.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-center text-left">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-gold font-heading leading-none">0{i + 1}</span>
                  <h3 className="font-heading text-lg font-bold text-premium-black group-hover:text-gold transition-colors duration-300 leading-tight">
                    {step.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-xs sm:text-sm font-semibold text-gray-400 font-body uppercase tracking-wider"
        >
          ✓ Every product undergoes 7 quality checks before dispatch.
        </motion.p>
      </div>
    </section>
  );
}
