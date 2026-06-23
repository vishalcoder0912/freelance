import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import SafeImage from "./ui/SafeImage";

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
    <section ref={ref} className="bg-[#fcfbfa] py-24 border-b border-gray-100" id="projects">
      <div className="container-main">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center text-sm uppercase tracking-[0.3em] text-gold font-body font-bold"
        >
          Transformations
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="mt-4 text-center font-heading text-4xl font-bold text-premium-black md:text-5xl lg:text-6xl"
        >
          Before & After <span className="text-gold">Transformations</span>
        </motion.h2>

        {/* Tab Buttons */}
        <div className="mt-10 flex justify-center gap-3 flex-wrap">
          {transformations.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActive(i)}
              className={`px-6 py-2.5 text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 rounded-full cursor-pointer ${
                active === i
                  ? "bg-gold text-premium-black shadow-md shadow-gold/15"
                  : "border border-gray-200 bg-white text-gray-500 hover:border-gold/50"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Before / After Images */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-12 grid gap-8 md:grid-cols-2"
          >
            {["before", "after"].map((type) => (
              <div key={type} className="relative rounded-2xl overflow-hidden shadow-md border border-gray-150">
                <div className="absolute top-4 left-4 z-10 bg-premium-black/85 backdrop-blur px-4 py-1.5 rounded-lg shadow-sm">
                  <span className="text-xs uppercase tracking-widest font-extrabold text-gold">{type}</span>
                </div>
                <SafeImage
                  src={type === "before" ? transformations[active].before : transformations[active].after}
                  alt={`${transformations[active].name} ${type}`}
                  className="h-80 w-full object-cover transition-transform duration-700 hover:scale-103"
                  fallbackIcon={type === "before" ? "🏚️" : "✨"}
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Details Grid */}
        <motion.div
          key={`details-${active}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-left"
        >
          <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Budget & Timeline</p>
            <p className="mt-2 font-heading text-2xl font-bold text-gold">{transformations[active].budget}</p>
            <p className="text-xs text-gray-500 mt-1 font-semibold">Completed in {transformations[active].timeline}</p>
          </div>
          
          <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Products Installed</p>
            <ul className="mt-2.5 space-y-1">
              {transformations[active].products.map((p) => (
                <li key={p} className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Business Impact</p>
            <p className="mt-2 text-xs sm:text-sm font-bold text-premium-black leading-relaxed">
              {transformations[active].impact}
            </p>
          </div>
        </motion.div>

        {/* Review Quote & CTA */}
        <motion.div
          key={`review-${active}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mt-10 text-center max-w-2xl mx-auto space-y-6"
        >
          <p className="text-base sm:text-lg italic text-gray-600 font-serif leading-relaxed">
            "{transformations[active].review}"
          </p>
          <div className="pt-2">
            <a href="#contact">
              <Button className="rounded-full px-8 py-3 text-sm font-bold shadow-md hover:shadow-lg">
                Start Your Transformation
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
