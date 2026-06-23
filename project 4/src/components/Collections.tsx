import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { collections } from "../data/content";

export default function Collections() {
  const ref = useRef<HTMLDivElement>(null!);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="bg-beige py-24" id="collections">
      <div className="container-main">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-sm uppercase tracking-[0.3em] text-gold"
          >
            Product Range
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="mt-4 font-heading text-4xl text-premium-black md:text-5xl lg:text-6xl"
          >
            Explore <span className="text-gold">Collections</span>
          </motion.h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="group relative h-80 cursor-pointer overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-premium-black/90 via-premium-black/30 to-transparent p-6 flex flex-col justify-end">
                <h3 className="font-heading text-2xl font-semibold text-luxury-white transition-all duration-500 group-hover:translate-y-[-4px]">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-gray-300 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {item.desc}
                </p>
                <span className="mt-3 text-sm text-gold opacity-0 transition-all duration-500 group-hover:opacity-100">
                  View Collection →
                </span>
              </div>
              <div className="absolute inset-0 border border-gold/0 transition-all duration-500 group-hover:border-gold/50" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
