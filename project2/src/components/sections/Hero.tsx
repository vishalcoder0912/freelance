"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import CinematicImage from "../CinematicImage";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement | null>(null);

  // Scroll parallax effects
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Mouse reactive parallax coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 200 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const { width, height, left, top } = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 35; // Slight movement factor
    const y = (e.clientY - top - height / 2) / 35;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen flex items-center justify-center bg-[#090605] overflow-hidden"
    >
      {/* Background Parallax Layer */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 w-full h-full z-0"
      >
        <motion.div
          style={{ x: parallaxX, y: parallaxY }}
          className="absolute inset-0 w-full h-full scale-105"
        >
          <CinematicImage
            alt="Darkins Single-Origin Roastery Experience"
            aspectRatio="16:9"
            effectType="hero"
            className="w-full h-full opacity-65"
          />
          {/* Deep chocolate dark vignette overlays */}
          <div className="absolute inset-0 bg-radial-gradient(circle_at_center, transparent 20%, rgba(9, 6, 5, 0.9) 80%) pointer-events-none" />
        </motion.div>
      </motion.div>

      {/* Hero Content Layer */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-20 text-center max-w-4xl px-6 md:px-12 flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        {/* Delicate Golden Tagline */}
        <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.45em] text-[#d4af37] mb-6 inline-block">
          Artisanal Bean-To-Bar India
        </span>

        {/* Large Cinematic Title */}
        <h1 className="font-serif text-5xl md:text-8xl font-bold tracking-tight text-[#f8eadc] leading-[0.9] mb-8 font-serif">
          Discover Your <br />
          <span className="text-gold-gradient italic">Dark Side.</span>
        </h1>

        {/* Premium Subtitle */}
        <p className="text-[#c8b5a4] text-sm md:text-lg max-w-2xl leading-relaxed tracking-wide font-light mb-12">
          Indian Bean-to-Bar Chocolate Crafted for Extraordinary Experiences. Single-origin cacao ethically sourced, roasted, conched, and tempered in small batches.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
          <a
            href="#collection"
            className="group relative inline-flex items-center justify-center px-8 py-4.5 rounded-sm bg-[#c58c48] text-[#090605] text-[11px] uppercase tracking-[0.25em] font-semibold overflow-hidden transition-all duration-300 hover:bg-[#e5ad6b] hover:scale-105"
          >
            Shop Collection
          </a>
          <a
            href="#experiences"
            className="group relative inline-flex items-center justify-center px-8 py-4.5 rounded-sm border border-[#e5ad6b]/30 text-[#f8eadc] text-[11px] uppercase tracking-[0.25em] font-semibold overflow-hidden transition-all duration-300 hover:bg-[#e5ad6b]/10 hover:border-[#e5ad6b]/65 hover:scale-105"
          >
            Book Factory Tour
          </a>
        </div>
      </motion.div>

      {/* Soft indicator of page scroll */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-25 flex flex-col items-center gap-2 text-[#c8b5a4]/50 pointer-events-none"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[8px] uppercase tracking-[0.3em] font-sans">Scroll to indulge</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[#e5ad6b]/60 to-transparent" />
      </motion.div>
    </section>
  );
}
