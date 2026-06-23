import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { indiaLocations } from "../data/content";

const cityCoords: Record<string, { x: number; y: number }> = {
  Delhi: { x: 30, y: 22 },
  Mumbai: { x: 18, y: 55 },
  Bangalore: { x: 28, y: 72 },
  Hyderabad: { x: 32, y: 62 },
  Chennai: { x: 35, y: 75 },
  Pune: { x: 20, y: 55 },
  Kolkata: { x: 50, y: 38 },
  Lucknow: { x: 38, y: 30 },
};

export default function IndiaMap() {
  const ref = useRef<HTMLDivElement>(null!);
  const isInView = useInView(ref, { once: true });
  const [active, setActive] = useState<string | null>(null);

  return (
    <section ref={ref} className="bg-beige py-24" id="map">
      <div className="container-main">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="font-heading text-4xl text-premium-black md:text-5xl lg:text-6xl"
        >
          Our <span className="text-gold">Pan-India</span> Presence
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="mt-4 text-lg text-gray-600"
        >
          Serving 25+ states with premium salon infrastructure.
        </motion.p>

        <div className="mt-14 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-lg">
              <svg viewBox="0 0 200 280" className="h-full w-full">
                <path
                  d="M100,10 L180,60 L180,180 L100,260 L20,180 L20,60 Z"
                  fill="none"
                  stroke="#c8b04a"
                  strokeWidth="1.5"
                  opacity={0.3}
                />
                {Object.entries(cityCoords).map(([city, coord]) => (
                  <g key={city}>
                    <circle
                      cx={coord.x * 4}
                      cy={coord.y * 3}
                      r={active === city ? 8 : 5}
                      fill={active === city ? "#c8b04a" : "#111111"}
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setActive(city)}
                      onMouseLeave={() => setActive(null)}
                    />
                    <circle
                      cx={coord.x * 4}
                      cy={coord.y * 3}
                      r={12}
                      fill="none"
                      stroke="#c8b04a"
                      strokeWidth="1"
                      className={`transition-opacity duration-300 ${active === city ? "opacity-100" : "opacity-0"}`}
                    />
                    <text
                      x={coord.x * 4 + 10}
                      y={coord.y * 3 + 4}
                      fontSize="5"
                      fill={active === city ? "#c8b04a" : "#666"}
                      className="transition-colors duration-300"
                    >
                      {city}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="space-y-6">
            {indiaLocations.map((loc, i) => (
              <motion.div
                key={loc.city}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.05 }}
                onMouseEnter={() => setActive(loc.city)}
                onMouseLeave={() => setActive(null)}
                className={`cursor-pointer rounded-sm border-l-4 p-5 transition-all duration-300 ${
                  active === loc.city
                    ? "border-gold bg-luxury-white shadow-lg"
                    : "border-transparent bg-luxury-white/50 hover:border-gold/50 hover:bg-luxury-white"
                }`}
              >
                <h4 className="font-heading text-xl font-semibold text-premium-black">{loc.city}</h4>
                <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gold font-bold">{loc.projects.toLocaleString("en-IN")}+</p>
                    <p className="text-gray-500 text-xs">Projects</p>
                  </div>
                  <div>
                    <p className="text-gold font-bold">{loc.deliveries.toLocaleString("en-IN")}+</p>
                    <p className="text-gray-500 text-xs">Deliveries</p>
                  </div>
                  <div>
                    <p className="text-gold font-bold">10+</p>
                    <p className="text-gray-500 text-xs">Installations</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
