import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { bentoGrid } from "../data/content";

const sizeClasses: Record<string, string> = {
  md: "md:col-span-2 md:row-span-1",
  sm: "md:col-span-1 md:row-span-1",
  lg: "md:col-span-2 md:row-span-2",
};

export default function WhySalonFactory() {
  const ref = useRef<HTMLDivElement>(null!);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="bg-beige py-24" id="about">
      <div className="container-main">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center text-sm uppercase tracking-[0.3em] text-gold"
        >
          Why Choose Us
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="mt-4 text-center font-heading text-4xl text-premium-black md:text-5xl lg:text-6xl"
        >
          Why Salon <span className="text-gold">Factory</span>
        </motion.h2>

        <div className="mt-14 grid gap-4 md:grid-cols-3 md:grid-rows-2">
          {bentoGrid.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.06 }}
              className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-luxury-white p-8 shadow-sm transition-all duration-500 hover:shadow-xl ${sizeClasses[item.size] || ""}`}
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-4 font-heading text-xl font-semibold text-premium-black">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.desc}</p>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gold transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
