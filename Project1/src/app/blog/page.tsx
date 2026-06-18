"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import CinematicImage from "@/components/CinematicImage";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
  content: string[];
}

export default function BlogPage() {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const articles: Article[] = [
    {
      id: "conching-chemistry",
      title: "The Chemistry of Conching: Why 72 Hours Matters",
      excerpt: "Trace the molecular transformation of raw cocoa solids as slow stone grinding polishes texture, releases volatile acidity, and unlocks premium floral aromas.",
      date: "June 12, 2026",
      readTime: "5 min read",
      category: "Science",
      imageSrc: "/images/story-2.jpg",
      imageAlt: "Slow stone conching of pure chocolate",
      content: [
        "In the world of craft chocolate, conching is the defining step where raw components transition into liquid gold. Originating in Switzerland, conching originally involved heavy rollers moving back and forth through heated chocolate paste. Today, we utilize heavy stone-wheel melangers to grind cacao nibs and organic cane sugar.",
        "Over the course of 72 hours, two major processes occur: mechanical particle reduction and chemical aeration. Mechanically, the stone wheels grind cacao particles down below 20 microns. At this microscopic scale, the human tongue can no longer register individual particles, resulting in a silk-like texture that melts seamlessly on the palate.",
        "Chemically, the friction generates mild heat. Combined with exposure to air, this allows volatile organic acids—predominantly acetic acid—to evaporate. If chocolate is conched for too short a time, it retains an aggressive, vinegary bite. The extended conching mellows this acidity, allowing natural floral, red fruit, and earthy flavor notes inherent to the estate cacao beans to step forward.",
        "No soy lecithin or chemical emulsifiers are added to quicken the process. At Darkins, we believe that patience is the ultimate ingredient for pure indulgence."
      ]
    },
    {
      id: "sourcing-trinitario",
      title: "Sourcing Trinitario: Our Partnership with Malabar Estates",
      excerpt: "Journey to the organic plantations of Andhra Pradesh and the Malabar Coast to understand how farmers harvest and ferment premium cocoa beans.",
      date: "May 28, 2026",
      readTime: "7 min read",
      category: "Sourcing",
      imageSrc: "/images/story-1.jpg",
      imageAlt: "Cacao plantation pods drying",
      content: [
        "Great chocolate is born in the soil, nurtured by microclimates, and brought to life by the careful hands of estate growers. Our quest to source the finest cacao led us to partner directly with organic farms located in Andhra Pradesh and along the Malabar Coast of India.",
        "These regions grow Trinitario cacao, a hybrid varietal combining the robust disease-resistance of Forastero with the delicate, complex flavor notes of Criollo. Sourcing these beans involves visiting estate farmers, building long-term relationships, and buying direct at above-market prices.",
        "Paying a premium price ensures farmers can invest in proper fermentation and drying protocols—the two most critical variables in developing cocoa flavor precursors. Under our direction, the cocoa beans are fermented in custom cedar boxes for six days before being sun-dried on elevated bamboo mats. This process cultivates the rich, balanced acidity and deep flavor notes that distinguish our single-origin bars."
      ]
    },
    {
      id: "tempering-science",
      title: "Demystifying Tempering: The Science of the Snap",
      excerpt: "Unravel the physics of lipid crystallization. Learn why aligning cocoa butter molecules yields a glossy finish, sharp snap, and smooth melt.",
      date: "April 15, 2026",
      readTime: "6 min read",
      category: "Atelier",
      imageSrc: "/images/product-1.jpg",
      imageAlt: "Tempered chocolate bar showing clean snap",
      content: [
        "If conching creates the texture of chocolate, tempering creates its structural perfection. You have likely experienced the difference: a perfectly tempered chocolate bar has a high gloss, a clean snap when broken, and resists melting on your fingers. Untempered chocolate, on the other hand, is dull, soft, and quickly develops white streaks known as bloom.",
        "The physics of tempering centers on cocoa butter, which is a polymorphic fat. This means it can crystallize into six distinct crystal structures (Form I through Form VI), each with a different melting point and molecular layout.",
        "The goal of tempering is to ensure that only Form V (beta crystals) are formed. Form V crystals align in tight, stable matrices that give chocolate its glossy surface, firm snap, and a melting point of exactly 34°C—just below human body temperature. This ensures it remains solid at room temperature but melts luxuriously the moment it touches your tongue.",
        "Achieving this requires precise temperature manipulation: melting the chocolate fully to destroy existing crystal structures, cooling it to seed crystal growth, and warming it slightly to melt away any unstable Form I through IV crystals. In our workshops, we master this physics using marble tables and seed techniques, bringing science and culinary craft together."
      ]
    }
  ];

  return (
    <div className="relative bg-[#090605] text-[#f8eadc] flex flex-col min-h-screen">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Header */}
      <Header />

      <main className="flex-grow pt-16 md:pt-32">
        {/* Editorial Title */}
        <div className="text-center py-6 px-6 md:py-12 bg-[radial-gradient(circle_at_50%_0%,rgba(197,140,72,0.08),transparent_50%)]">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.4em] text-[#d4af37]">
            Editorial Journal
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-[#f8eadc] mt-2 md:mt-4 font-serif uppercase">
            The Darkins <span className="text-gold-gradient italic">Chronicles.</span>
          </h1>
          <p className="text-[#c8b5a4] text-xs md:text-sm mt-3 md:mt-4 max-w-xl mx-auto leading-relaxed font-light">
            Read about cocoa chemistry, ethical trade farm profiles, lipid physics, and the design ethics of our small-batch roastery.
          </p>
        </div>

        {/* Magazine Grid Layout */}
        <section className="py-8 md:py-24 px-6 md:px-12 bg-[#090605]">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {articles.map((article, idx) => (
                <motion.div
                  key={article.id}
                  className="group flex flex-col justify-between border border-[#c58c48]/10 bg-[#140d0b] rounded-md p-5 hover:border-[#e5ad6b]/35 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-500"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                >
                  <div>
                    {/* Aspect Ratio 16:10 Image wrapper */}
                    <div className="w-full mb-5 overflow-hidden rounded-sm">
                      <CinematicImage
                        src={article.imageSrc}
                        alt={article.imageAlt}
                        aspectRatio="16:10"
                        effectType="experience"
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-[#d4af37] font-semibold mb-3">
                      <span>{article.category}</span>
                      <span className="text-[#c8b5a4]/40">•</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="font-serif text-lg md:text-xl text-[#f8eadc] group-hover:text-[#e5ad6b] transition-colors duration-300">
                      {article.title}
                    </h3>

                    <p className="text-xs text-[#c8b5a4]/80 mt-3 leading-relaxed font-light line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#c58c48]/10 flex items-center justify-between">
                    <span className="text-[9px] text-[#c8b5a4]/50 tracking-wider">
                      {article.date}
                    </span>
                    <button
                      onClick={() => setActiveArticle(article)}
                      className="text-[9.5px] uppercase tracking-[0.2em] font-semibold text-[#e5ad6b] group-hover:text-[#f8eadc] transition-colors duration-300"
                    >
                      Read Article &rarr;
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Full Article Modal Reading Overlay */}
        <AnimatePresence>
          {activeArticle && (
            <motion.div
              className="fixed inset-0 z-50 bg-[#090605]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative w-full max-w-4xl bg-[#140d0b] border border-[#e5ad6b]/20 rounded-md shadow-2xl overflow-y-auto max-h-[90vh] flex flex-col md:flex-row"
                initial={{ scale: 0.95, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 30 }}
                transition={{ type: "spring", damping: 25, stiffness: 250 }}
              >
                {/* Left Panel: Big image */}
                <div className="w-full md:w-5/12 relative min-h-[200px] md:min-h-full">
                  <div className="absolute inset-0 bg-[#0c0807]">
                    <img
                      src={activeArticle.imageSrc}
                      alt={activeArticle.imageAlt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#140d0b] via-transparent to-transparent md:from-transparent md:to-[#140d0b] z-10" />
                  </div>
                </div>

                {/* Right Panel: Content */}
                <div className="w-full md:w-7/12 p-6 md:p-10 flex flex-col justify-between">
                  <div>
                    {/* Header meta */}
                    <div className="flex items-center justify-between text-[9px] uppercase tracking-widest text-[#d4af37] font-semibold pb-4 border-b border-[#c58c48]/10 mb-6">
                      <span>{activeArticle.category}</span>
                      <span>{activeArticle.readTime}</span>
                    </div>

                    <h2 className="font-serif text-2xl md:text-3xl text-[#f8eadc] font-medium leading-tight">
                      {activeArticle.title}
                    </h2>

                    <div className="text-[9.5px] uppercase tracking-widest text-[#c8b5a4]/50 mt-2">
                      Published on {activeArticle.date}
                    </div>

                    {/* Article Body */}
                    <div className="mt-8 space-y-4 text-xs md:text-sm text-[#c8b5a4] leading-relaxed font-light">
                      {activeArticle.content.map((p, pIdx) => (
                        <p key={pIdx}>
                          {pIdx === 0 ? (
                            <span className="font-serif text-3xl md:text-4xl text-[#e5ad6b] float-left mr-2 mt-1 font-medium leading-none">
                              {p.charAt(0)}
                            </span>
                          ) : null}
                          {pIdx === 0 ? p.slice(1) : p}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Close button at bottom */}
                  <div className="mt-10 pt-6 border-t border-[#c58c48]/10 text-right">
                    <button
                      onClick={() => setActiveArticle(null)}
                      className="px-6 py-2.5 bg-[#c58c48] text-[#090605] text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm hover:bg-[#e5ad6b] transition-all"
                    >
                      Close Journal
                    </button>
                  </div>
                </div>

                {/* Absolute close icon in corner */}
                <button
                  onClick={() => setActiveArticle(null)}
                  className="absolute top-4 right-4 z-20 text-[#f8eadc]/60 hover:text-[#e5ad6b] p-2"
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
