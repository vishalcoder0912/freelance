import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { indiaLocations } from "../data/content";

// City coordinates mapped to the 1024 x 1024 geographic SVG map of India
const cityCoords: Record<string, { x: number; y: number }> = {
  Delhi: { x: 380, y: 320 },
  Mumbai: { x: 230, y: 610 },
  Pune: { x: 260, y: 630 },
  Bangalore: { x: 330, y: 790 },
  Hyderabad: { x: 380, y: 690 },
  Chennai: { x: 420, y: 810 },
  Kolkata: { x: 670, y: 500 },
  Lucknow: { x: 470, y: 375 },
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
            <div className="relative mx-auto aspect-square w-full max-w-lg bg-[#f9f8f4] rounded-2xl border border-gray-150 p-6 shadow-inner">
              <svg viewBox="0 0 1024 1024" className="h-full w-full">
                {/* Real geographic outline map of India */}
                <g
                  transform="translate(0, 1024) scale(0.1, -0.1)"
                  fill="none"
                  stroke="#c8b04a"
                  strokeWidth="15"
                  opacity={0.35}
                >
                  <path d="M4040 10225 c-14 -8 -40 -14 -58 -15 -64 0 -119 -22 -173 -66 -57 -47 -124 -77 -199 -89 -25 -4 -89 -29 -142 -56 l-97 -49 -17 -56 c-9 -33 -30 -71 -49 -92 -31 -34 -35 -36 -121 -42 -71 -5 -104 -13 -158 -38 -83 -39 -130 -40 -211 -7 -33 14 -91 30 -130 36 -38 6 -86 19 -106 29 -46 24 -69 26 -152 16 -65 -8 -68 -10 -82 -43 -21 -50 -19 -76 10 -103 16 -15 25 -35 25 -54 0 -17 7 -40 15 -50 22 -30 18 -58 -12 -82 -27 -21 -27 -24 -16 -65 10 -38 9 -50 -8 -88 -10 -24 -19 -51 -19 -60 0 -9 28 -44 63 -77 101 -97 102 -98 156 -95 54 2 47 11 67 -89 5 -26 12 -32 57 -44 29 -8 69 -17 90 -21 43 -7 49 -28 18 -66 -15 -19 -30 -24 -84 -27 -62 -4 -67 -6 -95 -42 -17 -20 -45 -43 -63 -50 l-32 -13 5 -123 c5 -137 -1 -162 -49 -196 -17 -13 -61 -60 -97 -106 -50 -63 -66 -90 -66 -115 0 -57 -9 -71 -56 -91 -58 -24 -107 -86 -205 -257 -77 -134 -85 -141 -164 -154 -64 -11 -92 -30 -110 -78 -10 -27 -34 -58 -60 -80 -54 -45 -101 -127 -110 -190 -4 -26 -12 -50 -17 -53 -5 -3 -30 2 -54 11 -31 12 -58 15 -87 11 -23 -4 -83 -9 -134 -12 l-92 -6 -3 49 c-3 47 -4 48 -38 51 -54 4 -102 -41 -136 -128 -25 -64 -34 -75 -96 -121 -37 -28 -68 -57 -68 -63 0 -7 -9 -21 -21 -32 -12 -10 -30 -31 -40 -46 -25 -35 -12 -72 33 -91 18 -8 44 -26 58 -41 21 -23 30 -26 61 -21 31 5 39 3 52 -16 17 -24 14 -65 -9 -111 -24 -47 -17 -87 27 -160 l41 -68 54 0 c53 0 54 0 54 -30 0 -16 11 -64 25 -107 14 -43 25 -94 25 -114 0 -28 6 -39 25 -49 22 -12 24 -18 19 -49 -3 -20 -15 -44 -26 -54 -17 -14 -19 -22 -11 -39 7 -16 5 -30 -6 -50 -14 -24 -23 -28 -58 -28 -36 0 -44 4 -48 23 -6 22 -7 22 -100 13 -78 -8 -96 -13 -101 -28 -9 -28 -70 -24 -118 10 -41 28 -41 28 -281 35 l-50 2 -3 -46 c-3 -43 -5 -47 -34 -53 -17 -3 -49 -6 -73 -6 -46 0 -82 -27 -72 -55 8 -20 122 -20 157 0 32 18 40 18 40 1 0 -8 -17 -20 -37 -27 -21 -6 -44 -16 -50 -22 -24 -18 -14 -76 27 -157 35 -69 44 -80 66 -80 15 0 48 -16 73 -35 56 -40 109 -54 211 -53 69 1 78 3 107 31 28 26 37 29 77 25 25 -3 49 -1 55 5 7 7 12 5 17 -7 10 -27 -46 -107 -104 -147 -38 -27 -65 -38 -106 -42 -31 -3 -66 -13 -78 -21 -35 -25 -95 -20 -130 9 -16 14 -35 25 -42 25 -18 0 -36 -21 -36 -42 0 -25 74 -143 125 -198 22 -25 57 -70 78 -100 20 -30 95 -123 166 -206 116 -135 134 -152 168 -157 26 -5 45 -2 62 9 17 12 37 15 73 11 41 -5 61 -1 126 27 42 19 87 37 99 40 12 4 31 18 42 32 13 16 29 24 51 24 38 0 69 32 70 73 0 19 12 38 40 63 47 43 51 76 20 147 l-21 46 27 63 c24 59 38 77 57 78 4 0 7 -6 7 -12 0 -28 17 -40 37 -30 11 6 25 7 33 2 11 -7 7 -15 -19 -39 -28 -26 -32 -36 -26 -59 3 -15 7 -43 9 -62 1 -19 8 -46 15 -59 11 -20 19 -23 49 -18 21 3 45 8 56 13 14 5 17 3 14 -7 -5 -14 -26 -23 -80 -34 -21 -4 -34 -18 -53 -55 -31 -62 -32 -87 -1 -101 21 -10 25 -20 31 -83 3 -39 13 -82 22 -94 18 -29 11 -62 -22 -114 -14 -20 -29 -56 -35 -80 -21 -93 -3 -256 34 -296 18 -20 17 -22 -9 -57 -27 -34 -27 -36 -10 -55 10 -11 31 -20 47 -20 25 0 28 -4 28 -31 0 -16 -9 -47 -19 -67 -39 -76 -41 -97 -15 -136 20 -29 23 -40 14 -56 -9 -17 -7 -28 9 -54 15 -24 21 -50 21 -95 0 -54 4 -68 35 -113 35 -50 40 -76 15 -70 -7 1 -9 -4 -6 -15 19 -62 27 -127 36 -272 l10 -164 75 -115 c59 -90 75 -122 75 -151 0 -28 9 -48 40 -85 22 -26 40 -59 40 -71 0 -15 11 -32 30 -45 38 -27 86 -128 95 -200 4 -30 18 -74 31 -97 18 -31 24 -57 24 -100 0 -32 5 -76 10 -98 6 -22 15 -74 20 -115 7 -49 22 -99 44 -145 19 -38 41 -95 50 -125 11 -37 48 -101 116 -199 55 -79 100 -148 100 -154 0 -5 15 -44 34 -87 19 -42 37 -99 41 -126 10 -74 25 -114 62 -169 20 -30 33 -62 33 -81 0 -25 12 -42 59 -87 70 -67 104 -142 56 -124 -8 4 -15 18 -15 32 0 20 -5 25 -25 25 -25 0 -33 -14 -15 -25 6 -3 10 -35 10 -71 0 -57 4 -71 31 -110 17 -25 42 -73 56 -107 31 -77 123 -175 207 -220 33 -18 68 -45 80 -64 27 -42 49 -41 97 2 22 19 49 35 61 35 13 0 43 23 80 61 53 56 58 65 58 107 0 34 8 60 32 99 36 59 58 71 161 83 41 5 76 15 87 25 21 19 72 15 122 -11 43 -22 68 -18 68 11 0 21 -8 27 -66 45 -36 11 -72 20 -80 20 -16 0 -34 31 -34 58 0 10 15 39 33 63 44 57 107 171 107 192 0 13 10 16 53 16 28 -1 59 0 67 0 8 1 27 -1 42 -5 24 -5 29 -2 44 30 15 31 16 44 6 98 -9 44 -9 89 -3 147 8 77 7 88 -13 125 -27 52 -29 193 -4 241 9 17 19 48 23 69 Z" />
                </g>

                {/* Cities layer with interactive hover points */}
                {Object.entries(cityCoords).map(([city, coord]) => (
                  <g key={city}>
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={active === city ? 14 : 9}
                      fill={active === city ? "#c8b04a" : "#111111"}
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setActive(city)}
                      onMouseLeave={() => setActive(null)}
                    />
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={22}
                      fill="none"
                      stroke="#c8b04a"
                      strokeWidth="2"
                      className={`transition-opacity duration-300 pointer-events-none ${
                        active === city ? "opacity-100 animate-ping" : "opacity-0"
                      }`}
                    />
                    <text
                      x={coord.x + 18}
                      y={coord.y + 5}
                      fontSize="13"
                      fontWeight="bold"
                      fill={active === city ? "#c8b04a" : "#666"}
                      className="transition-colors duration-300 pointer-events-none select-none font-body"
                    >
                      {city}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Location sidebar */}
          <div className="space-y-6">
            {indiaLocations.map((loc, i) => (
              <motion.div
                key={loc.city}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.05 }}
                onMouseEnter={() => setActive(loc.city)}
                onMouseLeave={() => setActive(null)}
                className={`cursor-pointer rounded-2xl border-l-4 border-t border-r border-b border-gray-100 p-5 transition-all duration-300 ${
                  active === loc.city
                    ? "border-gold bg-luxury-white shadow-lg"
                    : "border-transparent bg-luxury-white/55 hover:border-gold/50 hover:bg-luxury-white"
                }`}
              >
                <h4 className="font-heading text-xl font-semibold text-premium-black text-left">{loc.city}</h4>
                <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-left">
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
