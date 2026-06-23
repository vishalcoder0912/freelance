import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { locations } from "../data/content";
import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "./ui/button";

export default function Locations() {
  const ref = useRef<HTMLDivElement>(null!);
  const isInView = useInView(ref, { once: true });

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
          {locations.map((loc, i) => (
            <motion.div
              key={loc.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="group rounded-2xl border border-gray-150 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gold/40"
            >
              <h3 className="font-heading text-2xl font-semibold text-premium-black">{loc.title}</h3>
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
              <div className="mt-6">
                <Button variant="outline" size="sm">Get Directions</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
