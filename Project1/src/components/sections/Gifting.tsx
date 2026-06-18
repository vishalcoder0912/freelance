"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CinematicImage from "../CinematicImage";

interface GiftCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  specifications: string[];
  imageAlt: string;
  imageSrc: string;
  idealFor: string;
}

export default function Gifting() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const giftCards: GiftCard[] = [
    {
      id: "wooden-chests",
      title: "Signature Cacao Chests",
      subtitle: "Solid Teak & Copper Finish",
      description: "Our ultimate presentation box, handcrafted from sustainably sourced teak wood and finished with custom copper latches and deep chocolate velvet lining.",
      specifications: [
        "Holds 12–18 artisanal bars",
        "Includes personalized copper foil insert",
        "Refillable drawers for keepsake reuse",
        "Minimum order: 25 units"
      ],
      imageSrc: "/images/gifting.jpg",
      imageAlt: "Keepsake teak wood chocolate chest",
      idealFor: "Luxury weddings, VIP client hampers, corporate milestones."
    },
    {
      id: "copper-sleeves",
      title: "Copper-Stamped Sleeves",
      subtitle: "Premium Textured Cardstock",
      description: "Sleek, minimalist sleeve boxes constructed from FSC-certified heavy paper. Finished with a blind-debossed logo and hot-stamp copper details.",
      specifications: [
        "Holds 5–8 chocolate bars",
        "Includes a tasting flavor wheel wheel leaflet",
        "Custom ribbons available",
        "Minimum order: 50 units"
      ],
      imageSrc: "/images/product-1.jpg",
      imageAlt: "Copper foil debossed sleeve gift boxes",
      idealFor: "Seasonal gifting, client appreciations, celebratory gestures."
    }
  ];

  return (
    <section
      id="gifting"
      className="relative py-12 md:py-36 bg-[#090605] px-6 md:px-12 border-t border-[#e5ad6b]/10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(197,140,72,0.04),transparent_50%)] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="mb-10 md:mb-20 text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.4em] text-[#d4af37]">
            Bespoke Services
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#f8eadc] mt-2 md:mt-4 font-serif">
            Luxury <span className="italic text-gold-gradient">Gifting.</span>
          </h2>
          <p className="text-[#c8b5a4] text-sm md:text-base mt-3 md:mt-4 font-light leading-relaxed">
            Elevate your wedding rituals, seasonal releases, and corporate relationships with customized wooden packaging and hot foil details.
          </p>
        </div>

        {/* Gifting Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-12">
          {giftCards.map((card) => {
            const isExpanded = activeCard === card.id;

            return (
              <motion.div
                key={card.id}
                layout
                onClick={() => setActiveCard(isExpanded ? null : card.id)}
                onMouseEnter={() => setActiveCard(card.id)}
                onMouseLeave={() => setActiveCard(null)}
                className="group relative cursor-pointer bg-[#140d0b] border border-[#c58c48]/10 rounded-md p-4 md:p-6 overflow-hidden transition-all duration-500 hover:border-[#e5ad6b]/35 hover:shadow-[0_20px_60px_rgba(229,173,107,0.1)] flex flex-col justify-between"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Gold Shimmer Sweep Overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                  <motion.div
                    className="absolute -inset-y-10 left-0 w-32 bg-gradient-to-r from-transparent via-[#d4af37]/15 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                    initial={{ x: "-100%" }}
                    animate={isExpanded || activeCard === card.id ? { x: "800%" } : { x: "-100%" }}
                    transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                  />
                </div>

                <div>
                  {/* Aspect Ratio 16:10 Container */}
                  <div className="w-full relative overflow-hidden rounded-sm mb-4 md:mb-6">
                    <CinematicImage
                      src={card.imageSrc}
                      alt={card.imageAlt}
                      aspectRatio="16:10"
                      effectType="experience"
                      className="w-full transition-transform duration-700 group-hover:scale-103"
                    />
                  </div>

                  {/* Header info */}
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                    {card.subtitle}
                  </span>
                  
                  <div className="flex items-center justify-between mt-1 md:mt-2">
                    <h3 className="font-serif text-xl md:text-2xl text-[#f8eadc] group-hover:text-[#e5ad6b] transition-colors duration-300">
                      {card.title}
                    </h3>
                    {/* Minimal interactive button indicator */}
                    <span className="text-[#e5ad6b] text-xs font-mono tracking-widest uppercase">
                      {isExpanded ? "Less —" : "More +"}
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-[#c8b5a4]/90 mt-2 md:mt-4 leading-relaxed font-light">
                    {card.description}
                  </p>

                  {/* Expandable specs panel */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden mt-4 pt-4 md:mt-6 md:pt-6 border-t border-[#c58c48]/10 text-left"
                      >
                        <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold mb-2 md:mb-3">
                          Specifications
                        </h4>
                        <ul className="space-y-2">
                          {card.specifications.map((spec, index) => (
                            <li key={index} className="flex items-start text-xs text-[#c8b5a4] leading-relaxed font-light">
                              <span className="text-[#e5ad6b] mr-2 select-none">•</span>
                              {spec}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-4 pt-3 md:mt-5 md:pt-4 border-t border-[#c58c48]/10">
                          <span className="text-[9px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold block">Ideal For</span>
                          <p className="text-xs text-[#c8b5a4] mt-1 leading-relaxed font-light italic">
                            {card.idealFor}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-5 pt-3 md:mt-8 md:pt-5 border-t border-[#c58c48]/10 flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-widest text-[#c8b5a4]/50">
                    Bespoke Customization
                  </span>
                  
                  <a
                    href="#contact"
                    onClick={(e) => e.stopPropagation()}
                    className="px-5 py-2.5 bg-[#c58c48] text-[#090605] text-[9px] uppercase tracking-[0.2em] font-bold rounded-sm transition-all duration-300 hover:bg-[#e5ad6b] hover:scale-103"
                  >
                    Send Inquiry
                  </a>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
