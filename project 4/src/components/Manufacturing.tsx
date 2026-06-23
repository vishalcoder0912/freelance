import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { manufacturingSteps } from "../data/content";

export default function Manufacturing() {
  const ref = useRef<HTMLDivElement>(null!);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="bg-premium-black py-24" id="manufacturing">
      <div className="container-main">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center text-sm uppercase tracking-[0.3em] text-gold"
        >
          Manufacturing Excellence
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="mt-4 text-center font-heading text-4xl text-luxury-white md:text-5xl lg:text-6xl"
        >
          Built Inside Our <span className="text-gold">Factory</span>.
          <br />
          Trusted Across India.
        </motion.h2>

        <div className="mt-16 grid gap-0 md:grid-cols-3">
          {manufacturingSteps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="group relative h-72 cursor-pointer overflow-hidden"
            >
              <img
                src={step.image}
                alt={step.title}
                className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-premium-black/90 to-transparent flex items-end p-6">
                <div>
                  <span className="text-2xl font-bold text-gold">0{i + 1}</span>
                  <h3 className="mt-1 font-heading text-xl font-semibold text-luxury-white">{step.title}</h3>
                </div>
              </div>
              <div className="absolute inset-0 border border-white/0 transition-all duration-500 group-hover:border-gold/50" />
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-10 text-center text-sm text-gray-500"
        >
          Every product undergoes 7 quality checks before dispatch.
        </motion.p>
      </div>
    </section>
  );
}
