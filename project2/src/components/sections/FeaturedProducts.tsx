"use client";

import { motion } from "framer-motion";
import ProductCard from "../ProductCard";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageAlt: string;
}

export default function FeaturedProducts() {
  const products: Product[] = [
    {
      id: "blueberries-70",
      name: "70% Dark Chocolate with Blueberries",
      category: "Bar Selection",
      price: 295,
      description: "Organic tangy wild blueberries embedded in deep, single-origin dark chocolate.",
      imageAlt: "70% Dark Chocolate Blueberry Bar",
    },
    {
      id: "coorg-coffee-65",
      name: "65% Dark Chocolate with Coorg Coffee",
      category: "Bar Selection",
      price: 250,
      description: "Medium roast single-origin Coorg coffee beans ground with rich cacao.",
      imageAlt: "65% Coorg Coffee Dark Chocolate Bar",
    },
    {
      id: "paan-70",
      name: "70% Dark Chocolate with Paan",
      category: "Bar Selection",
      price: 250,
      description: "Betel leaves, fennel seeds, and sweet dates infused in dark chocolate.",
      imageAlt: "70% Dark Chocolate Paan Infused Bar",
    },
    {
      id: "tasting-pack-5",
      name: "'Explore Your Dark Side' Tasting Pack",
      category: "Tasting Packs",
      price: 850,
      description: "Curated set of 5 signature 35g mini bars representing different cocoa origins.",
      imageAlt: "Explore Your Dark Side Five Bar Tasting Set",
    },
    {
      id: "hazelnut-spread",
      name: "Chocolate Hazelnut Gourmet Spread",
      category: "Spreads & Drinks",
      price: 550,
      description: "Creamy vegan spread made from stone-ground hazelnuts and organic raw cacao.",
      imageAlt: "Stone Ground Chocolate Hazelnut Jar",
    },
    {
      id: "citrus-pebbles",
      name: "Citrus Blast Dark Chocolate Pebbles",
      category: "Dragees & Extras",
      price: 200,
      description: "Candied orange peel enrobed in glossy single-origin dark chocolate.",
      imageAlt: "Citrus Blast Dark Pebbles Dragees",
    },
  ];

  return (
    <section
      id="shop"
      className="relative py-24 md:py-36 bg-[#090605] px-6 md:px-12 border-t border-[#e5ad6b]/10"
    >
      {/* soft dynamic glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_bottom,rgba(197,140,72,0.06),transparent_50%)] pointer-events-none" />

      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-20 text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.4em] text-[#d4af37]">
            Featured Showcase
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#f8eadc] mt-4 font-serif">
            Sensory <span className="italic text-gold-gradient">Creation.</span>
          </h2>
          <p className="text-[#c8b5a4] text-sm md:text-base mt-4 font-light leading-relaxed">
            Taste our core collection of single-origin dark chocolate, curated packs, and signature pairings. Indulgence, refined.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
