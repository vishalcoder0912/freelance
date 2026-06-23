import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { locations } from "../data/content";
import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "./ui/button";

export default function Locations() {
  const ref = useRef<HTMLDivElement>(null!);
  const isInView = useInView(ref, { once: true });
  
  // Track selected location
  const [selectedLoc, setSelectedLoc] = useState(locations[0]);

  // Construct Google Maps embed URL
  const getEmbedUrl = (address: string) => {
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <section ref={ref} className="bg-luxury-white py-24" id="contact">
      <div className="container-main">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center text-sm uppercase tracking-[0.3em] text-gold"
        >
          Visit Us
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="mt-4 text-center font-heading text-4xl text-premium-black md:text-5xl lg:text-6xl"
        >
          Our <span className="text-gold">Locations</span>
        </motion.h2>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          {/* Left Column: Address list cards */}
          <div className="space-y-6 flex flex-col justify-center">
            {locations.map((loc, i) => {
              const isActive = selectedLoc.title === loc.title;
              return (
                <motion.div
                  key={loc.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  onClick={() => setSelectedLoc(loc)}
                  onMouseEnter={() => setSelectedLoc(loc)}
                  className={`group cursor-pointer rounded-2xl border p-8 shadow-sm transition-all duration-300 text-left ${
                    isActive
                      ? "border-gold bg-beige/25 shadow-md scale-[1.01]"
                      : "border-gray-150 bg-white hover:shadow-md hover:border-gold/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-2xl font-semibold text-premium-black">{loc.title}</h3>
                    {isActive && (
                      <span className="text-xs uppercase tracking-wider text-gold font-semibold bg-gold/10 px-2.5 py-1 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="mt-0.5 flex-shrink-0 text-gold" />
                      <p className="text-gray-600">{loc.address}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="flex-shrink-0 text-gold" />
                      <a href={`tel:${loc.phone}`} className="text-gray-600 transition-colors hover:text-gold">{loc.phone}</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="flex-shrink-0 text-gold" />
                      <a href={`mailto:${loc.email}`} className="text-gray-600 transition-colors hover:text-gold">{loc.email}</a>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`, '_blank');
                      }}
                    >
                      Get Directions
                    </Button>
                  </div>

                  {/* Inline Map for Mobile Screens */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 260 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 w-full rounded-xl border border-gray-150 overflow-hidden shadow-inner bg-beige/10 lg:hidden z-10"
                    >
                      <iframe
                        title={`Map of ${loc.title} (Mobile)`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={getEmbedUrl(loc.address)}
                        className="w-full h-full filter grayscale-[5%] opacity-95"
                      />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Google Maps dynamic embed (Desktop only) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="hidden lg:block w-full h-[500px] rounded-2xl border border-gray-150 overflow-hidden shadow-inner bg-beige/10 z-10"
          >
            <iframe
              title={`Map of ${selectedLoc.title}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={getEmbedUrl(selectedLoc.address)}
              className="w-full h-full filter grayscale-[5%] opacity-95 hover:opacity-100 transition-opacity duration-300"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
