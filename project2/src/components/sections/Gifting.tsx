"use client";

import { motion } from "framer-motion";
import CinematicImage from "../CinematicImage";

export default function Gifting() {
  return (
    <section
      id="gifting"
      className="relative py-24 md:py-36 bg-[#090605] px-6 md:px-12 border-t border-[#e5ad6b]/10"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
          
          {/* Left Column: Image (16:10 aspect ratio) */}
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <CinematicImage
              alt="Luxury Copper-Stamped Darkins Gift Box"
              aspectRatio="16:10"
              effectType="experience"
              className="w-full shadow-3xl"
            />
          </motion.div>

          {/* Right Column: Editorial Text */}
          <motion.div
            className="lg:col-span-6 flex flex-col justify-center text-left"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.4em] text-[#d4af37] mb-6">
              Bespoke Services
            </span>
            
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#f8eadc] leading-tight font-serif">
              Corporate & <br />
              <span className="text-gold-gradient italic">Luxury Gifting.</span>
            </h2>

            <p className="text-[#c8b5a4] text-sm md:text-base mt-6 font-light leading-relaxed">
              Elevate your corporate events, wedding rituals, and seasonal celebrations. We offer custom-designed wooden chests, copper-stamped sleeve boxes, and bespoke chocolate selections tailored to your brand identity.
            </p>

            {/* Bullet points of detail */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
              <div className="border-l-2 border-[#e5ad6b]/30 pl-4">
                <h4 className="font-serif text-lg text-[#f8eadc] font-medium">Custom Branding</h4>
                <p className="text-[#c8b5a4]/80 text-xs mt-2 font-light leading-relaxed">
                  Hot foil stamping, custom ribbons, and branded tasting note inserts.
                </p>
              </div>
              <div className="border-l-2 border-[#e5ad6b]/30 pl-4">
                <h4 className="font-serif text-lg text-[#f8eadc] font-medium">Bespoke Recipes</h4>
                <p className="text-[#c8b5a4]/80 text-xs mt-2 font-light leading-relaxed">
                  Collaborate with our chocolate makers to formulate unique ingredient pairings.
                </p>
              </div>
            </div>

            {/* Custom CTA */}
            <div className="mt-12 flex flex-col sm:flex-row gap-5">
              <a
                href="#contact"
                className="inline-flex justify-center items-center px-8 py-4 rounded-sm bg-[#c58c48] text-[#090605] text-[10px] uppercase tracking-[0.25em] font-bold transition-all duration-300 hover:bg-[#e5ad6b] hover:scale-105"
              >
                Inquire Gifting
              </a>
              <a
                href="#collection"
                className="inline-flex justify-center items-center px-8 py-4 rounded-sm border border-[#e5ad6b]/30 text-[#f8eadc] text-[10px] uppercase tracking-[0.25em] font-semibold transition-all duration-300 hover:bg-[#e5ad6b]/10 hover:border-[#e5ad6b]/60 hover:scale-105"
              >
                View Gift Boxes
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
