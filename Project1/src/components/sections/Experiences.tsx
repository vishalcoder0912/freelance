"use client";

import { motion } from "framer-motion";
import CinematicImage from "../CinematicImage";

interface ExperienceItem {
  id: string;
  title: string;
  price: string;
  duration: string;
  location: string;
  description: string;
  imageAlt: string;
}

export default function Experiences() {
  const experiences: ExperienceItem[] = [
    {
      id: "factory-tour",
      title: "The Bean-to-Bar Factory Tour",
      price: "₹1,600 per guest",
      duration: "2 Hours",
      location: "Okhla Phase I, New Delhi",
      description:
        "Go behind the scenes of our small-batch roastery. Trace the conching, grinding, and tempering processes, ending with a guided tasting of 6 chocolate flights and molding your own bar.",
      imageAlt: "Darkins Roasting Roastery Room",
    },
    {
      id: "workshop",
      title: "Artisanal Tempering Workshops",
      price: "₹2,500 per guest",
      duration: "3 Hours",
      location: "Factory Kitchen, New Delhi",
      description:
        "Learn the technical science of chocolate tempering. Master seed tempering, table conching, and infuse your custom recipes using salts, berries, and gourmet coffee grinds.",
      imageAlt: "Chef Tempering Liquid Chocolate on Marble Table",
    },
    {
      id: "tasting",
      title: "Private Sensory Tastings",
      price: "₹1,200 per guest",
      duration: "1.5 Hours",
      location: "Tasting Salon, New Delhi",
      description:
        "Understand origin flavor wheels. Explore how roasting curves and plantation soil (Andhra vs Malabar) create wildly different notes of acidity, citrus, and toasted spices.",
      imageAlt: "Guided Flight tasting with chocolate glasses",
    },
  ];

  return (
    <section
      id="experiences"
      className="relative py-12 md:py-36 bg-[#0c0807] px-6 md:px-12 border-t border-[#e5ad6b]/10"
    >
      {/* Immersive radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,140,72,0.08),transparent_60%)] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="mb-10 md:mb-20 text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.4em] text-[#d4af37]">
            Factory Experiences
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#f8eadc] mt-2 md:mt-4 font-serif">
            Chocolate <span className="italic text-gold-gradient">Atelier.</span>
          </h2>
          <p className="text-[#c8b5a4] text-sm md:text-base mt-3 md:mt-4 font-light leading-relaxed">
            Unravel the artistry of chocolate craft. Step into our New Delhi roastery for guided tours, hands-on molding workshops, and sensory tasting curves.
          </p>
        </div>

        {/* Cinematic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-10">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              className="group relative flex flex-col justify-between rounded-md overflow-hidden bg-[#140d0b] border border-[#c58c48]/10 p-5 hover:border-[#e5ad6b]/20 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.2, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div>
                {/* 16:9 aspect ratio container */}
                <CinematicImage
                  alt={exp.imageAlt}
                  aspectRatio="16:9"
                  effectType="experience"
                  className="w-full mb-4 md:mb-6"
                />

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[#d4af37] font-semibold uppercase tracking-wider font-sans mb-2 md:mb-3">
                  <span>{exp.duration}</span>
                  <span className="text-[#c58c48]/40">•</span>
                  <span>{exp.location}</span>
                </div>

                <h3 className="font-serif text-xl md:text-2xl text-[#f8eadc] group-hover:text-[#e5ad6b] transition-colors duration-300">
                  {exp.title}
                </h3>

                <p className="text-[#c8b5a4]/90 text-xs md:text-sm mt-2 md:mt-3.5 leading-relaxed font-light">
                  {exp.description}
                </p>
              </div>

              <div className="mt-5 pt-3 md:mt-8 md:pt-5 border-t border-[#c58c48]/10 flex items-center justify-between">
                <span className="text-[11px] font-mono tracking-widest text-[#f8eadc] font-semibold">
                  {exp.price}
                </span>
                
                <a
                  href="#contact"
                  className="px-4 py-2.5 rounded-sm border border-[#e5ad6b]/35 text-[#f8eadc] text-[9px] uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:bg-[#e5ad6b] hover:text-[#090605] hover:scale-105"
                >
                  Book Session
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
