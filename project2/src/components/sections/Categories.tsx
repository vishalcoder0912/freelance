"use client";

import { motion } from "framer-motion";
import CinematicImage from "../CinematicImage";

interface CategoryItem {
  title: string;
  subtitle: string;
  description: string;
  imageAlt: string;
  href: string;
  gridSpanClass: string;
  aspectRatio: "16:9" | "21:9" | "4:5" | "16:10";
}

export default function Categories() {
  const categories: CategoryItem[] = [
    {
      title: "Bar Selection",
      subtitle: "Bean-to-Bar Originals",
      description: "Explore classic, single-origin, and experimental infusions like Paan, Coffee, and Sea Salt.",
      imageAlt: "Artisanal Dark Chocolate Bar Selection",
      href: "#collection",
      gridSpanClass: "md:col-span-2 md:row-span-1",
      aspectRatio: "16:10",
    },
    {
      title: "Experiences & Tours",
      subtitle: "Sensory Journey",
      description: "Book an immersive factory tour and chocolate crafting workshop in New Delhi.",
      imageAlt: "Guided Roasting & Conching Tour Experience",
      href: "#experiences",
      gridSpanClass: "md:col-span-1 md:row-span-1",
      aspectRatio: "4:5",
    },
    {
      title: "Tasting Packs",
      subtitle: "Guided Indulgence",
      description: "Curated sets like 'Explore Your Dark Side' designed to reveal nuances of cacao origin.",
      imageAlt: "Premium Five-Bar Mini Tasting Set",
      href: "#collection",
      gridSpanClass: "md:col-span-1 md:row-span-1",
      aspectRatio: "4:5",
    },
    {
      title: "Chocolate Drinks",
      subtitle: "Velvety Infusions",
      description: "Indulge in rich, cacao-dense hot chocolate mixes and gourmet hazelnut spreads.",
      imageAlt: "Organic Hot Chocolate Pouring Cream",
      href: "#collection",
      gridSpanClass: "md:col-span-1 md:row-span-1",
      aspectRatio: "4:5",
    },
    {
      title: "Luxury Gifting",
      subtitle: "Curated Packages",
      description: "Fine copper-stamped gift boxes for seasonal celebrations, corporate events, and loved ones.",
      imageAlt: "Premium Copper-Stamped Chocolate Box",
      href: "#gifting",
      gridSpanClass: "md:col-span-1 md:row-span-1",
      aspectRatio: "4:5",
    },
  ];

  return (
    <section
      id="collection"
      className="relative py-24 md:py-36 bg-[#0c0807] px-6 md:px-12 border-t border-[#e5ad6b]/10"
    >
      {/* Dynamic light background vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(197,140,72,0.08),transparent_50%)] pointer-events-none" />

      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-20 text-center md:text-left max-w-2xl">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.4em] text-[#d4af37]">
            Curated Collections
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#f8eadc] mt-4 font-serif">
            Discover <span className="italic text-gold-gradient">Darkins.</span>
          </h2>
          <p className="text-[#c8b5a4] text-sm md:text-base mt-4 font-light leading-relaxed">
            Delve into our single-origin bean-to-bar selection, immersive chocolate experiences, tasting flight kits, and high-end gifting collections.
          </p>
        </div>

        {/* Asymmetric Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat, index) => (
            <motion.a
              key={cat.title}
              href={cat.href}
              className={`group block relative rounded-md overflow-hidden bg-[#140d0b] border border-[#c58c48]/10 p-4 transition-all duration-700 hover:border-[#e5ad6b]/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] ${cat.gridSpanClass}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative overflow-hidden w-full h-full flex flex-col justify-between">
                {/* Visual Image container */}
                <div className="w-full mb-6">
                  <CinematicImage
                    alt={cat.imageAlt}
                    aspectRatio={cat.aspectRatio}
                    effectType="product"
                    className="w-full"
                  />
                </div>

                {/* Floating Content Area */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#d4af37]/75 font-sans">
                    {cat.subtitle}
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <h3 className="font-serif text-xl md:text-2xl text-[#f8eadc] group-hover:text-[#e5ad6b] transition-colors duration-300">
                      {cat.title}
                    </h3>
                    {/* Tiny editorial arrow */}
                    <span className="text-[#e5ad6b] translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 text-lg">
                      →
                    </span>
                  </div>
                  <p className="text-[#c8b5a4]/80 text-xs md:text-sm font-light mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
