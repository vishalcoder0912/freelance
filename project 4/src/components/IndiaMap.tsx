import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { indiaLocations } from "../data/content";

// Geographic coordinates of cities
const cityGeoCoords: Record<string, [number, number]> = {
  Delhi: [28.6139, 77.2090],
  Mumbai: [19.0760, 72.8777],
  Pune: [18.5204, 73.8567],
  Bangalore: [12.9716, 77.5946],
  Hyderabad: [17.3850, 78.4867],
  Chennai: [13.0827, 80.2707],
  Kolkata: [22.5726, 88.3639],
  Lucknow: [26.8467, 80.9462],
};

export default function IndiaMap() {
  const ref = useRef<HTMLDivElement>(null!);
  const containerRef = useRef<HTMLDivElement>(null!);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const isInView = useInView(ref, { once: true });
  const [active, setActive] = useState<string | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current && containerRef.current) {
      // Create Map centered in India
      const map = L.map(containerRef.current, {
        center: [21.5, 78.9],
        zoom: 5,
        zoomControl: false, // Custom position control
        attributionControl: false, // Hides Leaflet logo for luxury look
        scrollWheelZoom: false, // Prevents scroll hijacking
      });

      // Add CartoDB Positron (clean grey/beige theme)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 18,
      }).addTo(map);

      // Add zoom control at bottom right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync active markers and view
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Re-create markers with custom icons depending on active state
    Object.entries(cityGeoCoords).forEach(([city, coords]) => {
      const isActive = active === city;

      // Remove existing marker for this city if it exists
      if (markersRef.current[city]) {
        markersRef.current[city].remove();
      }

      // Custom icon using Tailwind styles
      const customIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
            ${isActive ? `
              <div class="absolute h-8 w-8 rounded-full bg-[#c8b04a]/30 animate-ping"></div>
              <div class="h-4.5 w-4.5 rounded-full bg-[#c8b04a] border-2 border-white shadow-[0_0_12px_rgba(200,176,74,0.9)] z-50 transition-all duration-300"></div>
            ` : `
              <div class="absolute h-6 w-6 rounded-full bg-[#111111]/10 group-hover:bg-[#c8b04a]/25 transition-all duration-300"></div>
              <div class="h-3 w-3 rounded-full bg-[#111111] border border-white shadow-sm transition-all duration-300 group-hover:bg-[#c8b04a]"></div>
            `}
          </div>
        `,
        className: "custom-marker-icon",
        iconSize: [0, 0],
      });

      const marker = L.marker(coords, { icon: customIcon })
        .addTo(map)
        .on("mouseover", () => setActive(city))
        .on("mouseout", () => setActive(null));

      // Bind dynamic tooltip
      marker.bindTooltip(
        `<div class="font-body text-xs font-semibold px-1 py-0.5">${city}</div>`,
        {
          direction: "top",
          offset: [0, -10],
          opacity: 0.95,
          className: "custom-map-tooltip"
        }
      );

      markersRef.current[city] = marker;
    });
  }, [active]);

  // Smoothly pan/zoom to active city
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (active && cityGeoCoords[active]) {
      map.flyTo(cityGeoCoords[active], 6.5, {
        animate: true,
        duration: 1.0,
      });
    } else {
      map.flyTo([21.5, 78.9], 5, {
        animate: true,
        duration: 1.0,
      });
    }
  }, [active]);

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

        {/* Mobile Horizontal Cities Navigation (swipable) */}
        <div className="lg:hidden mt-8 flex gap-2.5 overflow-x-auto pb-3 snap-x scrollbar-none px-1">
          {indiaLocations.map((loc) => {
            const isActive = active === loc.city;
            return (
              <button
                key={loc.city}
                onClick={() => setActive(isActive ? null : loc.city)}
                className={`snap-start flex-shrink-0 px-5 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "bg-gold border-gold text-premium-black shadow-md shadow-gold/25"
                    : "bg-white border-gray-150 text-gray-500 hover:border-gold/50"
                }`}
              >
                {loc.city}
              </button>
            );
          })}
        </div>

        <div className="mt-6 lg:mt-14 grid gap-10 lg:grid-cols-3">
          {/* Real Leaflet Map */}
          <div className="lg:col-span-2">
            <div className="relative w-full h-[350px] sm:h-[400px] md:h-[500px] lg:h-[550px] bg-[#f9f8f4] rounded-2xl border border-gray-150 overflow-hidden shadow-inner z-10">
              <div ref={containerRef} className="h-full w-full" />
            </div>
          </div>

          {/* Desktop Location sidebar */}
          <div className="hidden lg:block space-y-4 md:max-h-[550px] md:overflow-y-auto pr-2 custom-scrollbar">
            {indiaLocations.map((loc, i) => (
              <motion.div
                key={loc.city}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.05 }}
                onMouseEnter={() => setActive(loc.city)}
                onMouseLeave={() => setActive(null)}
                className={`cursor-pointer rounded-2xl border border-gray-100 p-5 transition-all duration-300 ${
                  active === loc.city
                    ? "border-gold bg-luxury-white shadow-lg scale-[1.02]"
                    : "border-transparent bg-luxury-white/55 hover:border-gold/50 hover:bg-luxury-white hover:scale-[1.01]"
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

          {/* Mobile Active City Stats Card */}
          <div className="lg:hidden">
            {(() => {
              const activeLoc = indiaLocations.find((l) => l.city === (active || "Delhi")) || indiaLocations[0];
              return (
                <motion.div
                  key={activeLoc.city}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl border border-gold/30 p-6 shadow-md text-left"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h4 className="font-heading text-2xl font-bold text-premium-black">{activeLoc.city}</h4>
                    <span className="text-[10px] font-black text-gold tracking-widest uppercase bg-gold/10 px-2 py-0.5 rounded-full">
                      Branch Stats
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-left">
                    <div>
                      <p className="text-gold font-black text-lg">{activeLoc.projects.toLocaleString("en-IN")}+</p>
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">Projects</p>
                    </div>
                    <div>
                      <p className="text-gold font-black text-lg">{activeLoc.deliveries.toLocaleString("en-IN")}+</p>
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">Deliveries</p>
                    </div>
                    <div>
                      <p className="text-gold font-black text-lg">10+</p>
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">Installs</p>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}
