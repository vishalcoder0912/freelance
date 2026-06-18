"use client";

import { motion } from "framer-motion";
import Header from "@/components/sections/Header";
import ProductCard from "@/components/ProductCard";
import CinematicImage from "@/components/CinematicImage";
import Newsletter from "@/components/sections/Newsletter";
import Footer from "@/components/sections/Footer";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageAlt: string;
  src?: string;
}

export default function ShopPage() {
  const { addToCart } = useCart();

  const products: Product[] = [
    {
      id: "blueberries-70",
      name: "70% Dark Chocolate with Blueberries",
      category: "Bar Selection",
      price: 295,
      description: "Organic tangy wild blueberries embedded in deep, single-origin dark chocolate.",
      imageAlt: "70% Dark Chocolate Blueberry Bar",
      src: "/images/product-1.jpg",
    },
    {
      id: "coorg-coffee-65",
      name: "65% Dark Chocolate with Coorg Coffee",
      category: "Bar Selection",
      price: 250,
      description: "Medium roast single-origin Coorg coffee beans ground with rich cacao.",
      imageAlt: "65% Coorg Coffee Dark Chocolate Bar",
      src: "/images/story-1.jpg",
    },
    {
      id: "paan-70",
      name: "70% Dark Chocolate with Paan",
      category: "Bar Selection",
      price: 250,
      description: "Betel leaves, fennel seeds, and sweet dates infused in dark chocolate.",
      imageAlt: "70% Dark Chocolate Paan Infused Bar",
      src: "/images/story-2.jpg",
    },
    {
      id: "tasting-pack-5",
      name: "'Explore Your Dark Side' Tasting Pack",
      category: "Tasting Packs",
      price: 850,
      description: "Curated set of 5 signature 35g mini bars representing different cocoa origins.",
      imageAlt: "Explore Your Dark Side Five Bar Tasting Set",
      src: "/images/gifting.jpg",
    },
    {
      id: "hazelnut-spread",
      name: "Chocolate Hazelnut Gourmet Spread",
      category: "Spreads & Drinks",
      price: 550,
      description: "Creamy vegan spread made from stone-ground hazelnuts and organic raw cacao.",
      imageAlt: "Stone Ground Chocolate Hazelnut Jar",
      src: "/images/product-1.jpg",
    },
    {
      id: "citrus-pebbles",
      name: "Citrus Blast Dark Chocolate Pebbles",
      category: "Dragees & Extras",
      price: 200,
      description: "Candied orange peel enrobed in glossy single-origin dark chocolate.",
      imageAlt: "Citrus Blast Dark Pebbles Dragees",
      src: "/images/story-2.jpg",
    },
  ];

  // The spotlight product
  const spotlightProduct = products[3]; // Tasting pack

  return (
    <div className="relative bg-[#090605] text-[#f8eadc] flex flex-col min-h-screen">
      {/* Noise background texture overlay */}
      <div className="noise-overlay" />

      {/* Page Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow pt-16 md:pt-28">
        
        {/* SECTION 1: Featured Collection Hero */}
        <section className="relative py-16 md:py-24 px-6 md:px-12 bg-[#0c0807] overflow-hidden border-b border-[#e5ad6b]/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(197,140,72,0.06),transparent_60%)] pointer-events-none" />
          
          <div className="container mx-auto max-w-[1600px] w-[92%] px-4 md:px-20 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
              <div className="lg:col-span-6 flex flex-col items-start text-left">
                <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.4em] text-[#d4af37] mb-4">
                  Exquisite Collections
                </span>
                <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-[#f8eadc] leading-tight font-serif uppercase">
                  Sensory <span className="text-gold-gradient italic">Creation.</span>
                </h1>
                <p className="text-[#c8b5a4] text-xs md:text-sm mt-6 max-w-lg leading-relaxed font-light">
                  Delve into our single-origin bean-to-bar selection, experimental infusions, and stone-ground pairings. Handcrafted at our Okhla factory using premium Trinitario cacao beans bought directly from Indian organic farmers.
                </p>
                <a
                  href="#gallery"
                  className="mt-8 px-8 py-3.5 bg-[#c58c48] text-[#090605] text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm hover:bg-[#e5ad6b] transition-colors"
                >
                  Explore Boutique
                </a>
              </div>

              <div className="lg:col-span-6 relative">
                <CinematicImage
                  src="/images/gifting.jpg"
                  alt="Cinematic premium packaging boxes and chocolate flights"
                  aspectRatio="16:10"
                  effectType="experience"
                  className="w-full shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Luxury Product Gallery */}
        <section id="gallery" className="relative py-16 md:py-24 px-6 md:px-12 bg-[#090605]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_bottom,rgba(197,140,72,0.04),transparent_50%)] pointer-events-none" />
          
          <div className="container mx-auto max-w-[1600px] w-[92%] px-4 md:px-20">
            <div className="mb-12 text-left">
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
                Pure Cacao Originals
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-[#f8eadc] mt-2 font-medium">
                The Chocolate <span className="italic text-gold-gradient">Atelier.</span>
              </h2>
            </div>

            {/* Expanded 4-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
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

        {/* SECTION 3: Featured Product Spotlight */}
        <section className="relative py-16 md:py-24 px-6 md:px-12 bg-[#0c0807] border-t border-b border-[#e5ad6b]/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,140,72,0.04),transparent_60%)] pointer-events-none" />
          
          <div className="container mx-auto max-w-[1600px] w-[92%] px-4 md:px-20 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Side: Editorial Image */}
              <div className="lg:col-span-6 relative">
                <CinematicImage
                  src={spotlightProduct.src}
                  alt={spotlightProduct.imageAlt}
                  aspectRatio="16:10"
                  effectType="experience"
                  className="w-full shadow-2xl"
                />
              </div>

              {/* Right Side: Narrative Content */}
              <motion.div
                className="lg:col-span-6 flex flex-col items-start text-left"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
              >
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
                  Featured Indulgence
                </span>
                <h3 className="font-serif text-3xl md:text-4xl text-[#f8eadc] mt-3 font-medium">
                  {spotlightProduct.name}
                </h3>
                <p className="text-[#c8b5a4] text-xs md:text-sm mt-6 leading-relaxed font-light">
                  Understand origin flavor wheels. The Explore Your Dark Side tasting flight set contains 5 signature mini bars representing different organic cacao estates from Andhra Pradesh and the Malabar Coast.
                </p>
                <p className="text-[#c8b5a4] text-xs md:text-sm mt-4 leading-relaxed font-light">
                  Trace how soil profiles and roasting curves yield notes of wild berries, Coorg roast coffee, or Paan spices. Perfect for chocolate pairings and sensory flight experiments at home.
                </p>
                
                <div className="mt-8 flex items-center gap-6">
                  <span className="font-mono text-xl text-[#f8eadc] font-semibold">
                    ₹{spotlightProduct.price.toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={() => addToCart(spotlightProduct)}
                    className="px-8 py-3.5 bg-[#c58c48] text-[#090605] text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm hover:bg-[#e5ad6b] transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* SECTION 4: Chocolate Experience Banner */}
        <section className="relative py-20 md:py-28 px-6 md:px-12 overflow-hidden border-b border-[#e5ad6b]/10 bg-[#0c0807]">
          {/* Background image overlay */}
          <div className="absolute inset-0 z-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('/images/story-1.jpg')" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090605] via-[#090605]/80 to-transparent z-10 pointer-events-none" />

          <div className="container mx-auto max-w-[1600px] w-[92%] px-4 md:px-20 relative z-20">
            <div className="max-w-xl text-left">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.4em] text-[#d4af37]">
                Atelier Experiences
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#f8eadc] mt-4 font-serif uppercase">
                Step Into the <span className="text-gold-gradient italic">Factory.</span>
              </h2>
              <p className="text-[#c8b5a4] text-xs md:text-sm mt-4 leading-relaxed font-light">
                Book an immersive factory tour, a technical tempering masterclass, or private sensory tastings at our Okhla roastery in New Delhi. Trace conching straight from stone grinders.
              </p>
              <a
                href="/experiences"
                className="mt-8 inline-flex px-8 py-3.5 bg-transparent border border-[#e5ad6b]/35 text-[#f8eadc] text-[10px] uppercase tracking-[0.2em] font-semibold rounded-sm hover:bg-[#e5ad6b] hover:text-[#090605] transition-all duration-300"
              >
                Book Atelier Session
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 5: Darkins Club */}
        <Newsletter />

      </main>

      {/* SECTION 6: Footer */}
      <Footer />
    </div>
  );
}
