import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

const transformations = [
  {
    name: "Blush Beauty Studio",
    location: "Mumbai",
    budget: "₹12L",
    timeline: "14 Days",
    before: "https://images.unsplash.com/photo-1599921841143-819065a6b8a3?w=800&q=80",
    after: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
    products: ["Enduralux Lounge", "Unity Gold Station", "Aqua Bliss Wash"],
    review: "Increased customer retention by 37% after the renovation. Our revenue per client went up 52%.",
    impact: "37% Customer Retention | 52% Revenue Growth",
  },
  {
    name: "The Royal House",
    location: "Lucknow",
    budget: "₹8L",
    timeline: "10 Days",
    before: "https://images.unsplash.com/photo-1600949438054-5c2c1b4c7ce3?w=800&q=80",
    after: "https://images.unsplash.com/photo-1633681926025-84c23e8cb2d5?w=800&q=80",
    products: ["Bulwark Rose Gold", "BarberPro Chair"],
    review: "Our daily footfall doubled after the renovation. Customers love the premium look and feel.",
    impact: "2x Daily Footfall | 40% Revenue Increase",
  },
];

export default function BeforeAfter() {
  const ref = useRef<HTMLDivElement>(null!);
  const isInView = useInView(ref, { once: true });
  const [active, setActive] = useState(0);

  return (
    <section ref={ref} className="bg-premium-black py-24" id="projects">
      <div className="container-main">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center text-sm uppercase tracking-[0.3em] text-gold"
        >
          Transformations
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="mt-4 text-center font-heading text-4xl text-luxury-white md:text-5xl lg:text-6xl"
        >
          Before & After <span className="text-gold">Transformations</span>
        </motion.h2>

        <div className="mt-10 flex justify-center gap-4">
          {transformations.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActive(i)}
              className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
                active === i ? "bg-gold text-premium-black" : "border border-white/20 text-gray-400 hover:border-gold/50"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-12 grid gap-8 lg:grid-cols-2"
          >
            {["before", "after"].map((type, idx) => (
              <div key={type} className="relative overflow-hidden">
                <div className="absolute top-4 left-4 z-10 bg-premium-black/80 backdrop-blur px-4 py-2">
                  <span className="text-xs uppercase tracking-wider text-gold">{type}</span>
                </div>
                <img
                  src={type === "before" ? transformations[active].before : transformations[active].after}
                  alt={type}
                  className="h-80 w-full object-cover transition-all duration-700 hover:scale-105"
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          key={`details-${active}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-10 grid gap-8 lg:grid-cols-3"
        >
          <div className="rounded-sm border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-gray-500">Budget</p>
            <p className="mt-1 font-heading text-2xl font-bold text-gold">{transformations[active].budget}</p>
            <p className="text-xs text-gray-500">Timeline: {transformations[active].timeline}</p>
          </div>
          <div className="rounded-sm border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-gray-500">Products Used</p>
            <ul className="mt-2 space-y-1">
              {transformations[active].products.map((p) => (
                <li key={p} className="text-sm text-gray-300">• {p}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-sm border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-gray-500">Business Impact</p>
            <p className="mt-2 text-sm text-gray-300">{transformations[active].impact}</p>
          </div>
        </motion.div>

        <motion.div
          key={`review-${active}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-lg italic text-gray-400">"{transformations[active].review}"</p>
          <div className="mt-6">
            <Button>Start Your Transformation</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
