"use client";

import Header from "@/components/sections/Header";
import StoryTimeline from "@/components/sections/StoryTimeline";
import Footer from "@/components/sections/Footer";
import CinematicImage from "@/components/CinematicImage";
import { motion } from "framer-motion";

export default function StoryPage() {
  return (
    <div className="relative bg-[#090605] text-[#f8eadc] flex flex-col min-h-screen">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Header */}
      <Header />

      <main className="flex-grow">
        {/* Editorial Introduction */}
        <div className="pt-16 md:pt-32 text-center py-8 px-6 md:py-16 bg-[radial-gradient(circle_at_50%_0%,rgba(197,140,72,0.08),transparent_50%)]">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.4em] text-[#d4af37]">
            Our Craft Philosophy
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-[#f8eadc] mt-2 md:mt-4 font-serif uppercase">
            Artisanal <span className="text-gold-gradient italic">Creation.</span>
          </h1>
          <p className="text-[#c8b5a4] text-xs md:text-sm mt-3 md:mt-4 max-w-xl mx-auto leading-relaxed font-light">
            No soy lecithin, no artificial vanilla, no shortcuts. Just pure cacao and unrefined cane sugar stone-ground for 72 hours.
          </p>
        </div>

        {/* Cinematic Sourcing Spotlight */}
        <section className="py-8 md:py-24 px-6 md:px-12 bg-[#0c0807] border-t border-b border-[#e5ad6b]/10">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
              >
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
                  Estate Partnerships
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-[#f8eadc] mt-3 font-medium">
                  Direct Sourcing from <br />
                  <span className="italic text-gold-gradient">Malabar & Andhra.</span>
                </h2>
                <p className="text-[#c8b5a4] text-xs md:text-sm mt-6 leading-relaxed font-light">
                  We believe that great chocolate begins in the soil. That is why we bypass brokers and purchase premium Trinitario cacao beans directly from organic estates in Andhra Pradesh and the Malabar Coast. 
                </p>
                <p className="text-[#c8b5a4] text-xs md:text-sm mt-4 leading-relaxed font-light">
                  By paying above-market prices, we foster sustainable farming initiatives and preserve heirloom varietals that give Darkins chocolate its signature red fruit, nut, and earthy tasting profiles.
                </p>
              </motion.div>

              <div className="relative">
                <CinematicImage
                  src="/images/story-1.jpg"
                  alt="Sourced organic Trinitario cocoa beans being dried under estate sun"
                  aspectRatio="16:10"
                  effectType="experience"
                  className="w-full shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Core Horizontal Timeline */}
        <StoryTimeline />

        {/* Detailed Roasting & Conching Philosophy */}
        <section className="py-10 md:py-28 px-6 md:px-12 bg-[#0c0807] border-t border-[#e5ad6b]/10">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 relative">
                <CinematicImage
                  src="/images/story-2.jpg"
                  alt="Precision small-batch roaster conching chocolate at Okhla"
                  aspectRatio="16:10"
                  effectType="experience"
                  className="w-full shadow-2xl"
                />
              </div>

              <motion.div
                className="order-1 lg:order-2"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
              >
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
                  Factory Atelier
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-[#f8eadc] mt-3 font-medium">
                  The Alchemy of <br />
                  <span className="italic text-gold-gradient">Stone Grinding.</span>
                </h2>
                <p className="text-[#c8b5a4] text-xs md:text-sm mt-6 leading-relaxed font-light">
                  Each bean profile requires an individual roasting recipe. At our Okhla factory in New Delhi, we slow roast in custom micro-batches.
                </p>
                <p className="text-[#c8b5a4] text-xs md:text-sm mt-4 leading-relaxed font-light">
                  Following winnowing, the pure cacao nibs are stone-ground with raw unrefined cane sugar for 72 consecutive hours. This slow conching aerates the chocolate, driving off unwanted volatile acids and polishing particles down to a microscopic smoothness that melts luxuriously on the palate.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
