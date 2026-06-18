"use client";

import { motion } from "framer-motion";

interface TestimonialItem {
  quote: string;
  author: string;
  source: string;
  location: string;
}

export default function Testimonials() {
  const reviews: TestimonialItem[] = [
    {
      quote:
        "“Darkins has completely redefined Indian bean-to-bar chocolate. The blueberry infusion has this incredible glossy finish and a perfectly balanced tangy snap that feels genuinely world-class.”",
      author: "Radhika Sen",
      source: "Vogue India",
      location: "Mumbai",
    },
    {
      quote:
        "“The factory tour in New Delhi is a masterpiece. Getting to understand the chemistry of conching and tasting single-origin bars straight from the stone grinder was unforgettable.”",
      author: "Kabir Mehta",
      source: "Food Critics Guild",
      location: "New Delhi",
    },
    {
      quote:
        "“Bespoke copper-stamped gift boxes were the highlight of our wedding hampers. Impeccable presentation, premium taste, and beautiful editorial packaging.”",
      author: "Ananya Kapoor",
      source: "Harper's Bazaar Bride",
      location: "Bengaluru",
    },
  ];

  return (
    <section className="relative py-12 md:py-36 bg-[#0c0807] px-6 md:px-12 border-t border-[#e5ad6b]/10">
      {/* Light ray backdrop overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(197,140,72,0.06),transparent_50%)] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-10 md:mb-20 text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.4em] text-[#d4af37]">
            Press & Reviews
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#f8eadc] mt-2 md:mt-4 font-serif">
            Editorial <span className="italic text-gold-gradient">Praise.</span>
          </h2>
        </div>

        {/* Magazine Aesthetic layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-16">
          {reviews.map((item, index) => (
            <motion.div
              key={item.author}
              className="flex flex-col justify-between text-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Oversized serif quote */}
              <p className="font-serif text-lg md:text-xl text-[#f8eadc] leading-relaxed italic font-light">
                {item.quote}
              </p>

              {/* Reviewer Details */}
              <div className="mt-4 pt-3 md:mt-8 md:pt-6 border-t border-[#c58c48]/15 flex flex-col">
                <span className="text-xs font-serif text-[#f8eadc] font-medium tracking-wide">
                  {item.author}
                </span>
                <div className="flex items-center justify-between mt-1 md:mt-1.5 text-[9px] uppercase tracking-wider text-[#c8b5a4]/70">
                  <span>{item.source}</span>
                  <span>{item.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
