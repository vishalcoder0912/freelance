"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const floatingElementsRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  // Scroll parallax (Framer Motion)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // GSAP Animations (Camera drift, floating chocolate pieces, spotlight)
  useGSAP(
    () => {
      // 1. Camera Drift: Slow zoom and pan on background image
      gsap.to(bgImageRef.current, {
        scale: 1.12,
        x: "-1%",
        y: "-1.5%",
        duration: 25,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });

      // 2. Slow floating motion on absolute cocoa elements
      const elements = gsap.utils.toArray(".floating-cocoa-piece");
      const isMobile = window.innerWidth < 768;
      elements.forEach((el: any, index: number) => {
        gsap.to(el, {
          y: isMobile ? "random(-8, 8)" : "random(-20, 20)",
          x: isMobile ? "random(-6, 6)" : "random(-15, 15)",
          rotation: isMobile ? "random(-5, 5)" : "random(-10, 10)",
          duration: isMobile ? `random(8, 14)` : `random(6, 12)`,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: index * 0.5,
        });
      });

      // 3. Scroll Indicator Gold Line animation
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0, transformOrigin: "top" },
        {
          scaleY: 1,
          duration: 1.8,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        }
      );
    },
    { scope: heroRef }
  );

  // Mouse move lighting spotlight follow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current || !spotlightRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Smooth GSAP follow
      gsap.to(spotlightRef.current, {
        left: x,
        top: y,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-[65svh] md:h-screen flex items-center justify-center bg-[#090605] overflow-hidden select-none"
    >
      {/* 1. Cinematic Background Layer */}
      <div ref={bgImageRef} className="absolute inset-0 w-full h-full scale-105 z-0">
        {/* Dynamic Spotlight mouse-follow overlay */}
        <div
          ref={spotlightRef}
          className="absolute -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none z-10 mix-blend-screen opacity-45"
          style={{
            background: "radial-gradient(circle, rgba(229,173,107,0.12) 0%, rgba(229,173,107,0.03) 40%, transparent 70%)",
            left: "50%",
            top: "50%",
          }}
        />

        {/* Volumetric light rays overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#090605] via-transparent to-[#090605]/40 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_35%_25%,rgba(229,173,107,0.08),transparent_55%)] z-10 pointer-events-none" />
        
        {/* Dark vignette overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090605] via-[#090605]/15 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient(circle_at_center, transparent 30%, rgba(9, 6, 5, 0.95) 90%) pointer-events-none z-10" />
      </div>

      {/* 2. Floating Chocolate / Cocoa Elements (Depth layers) */}
      <div ref={floatingElementsRef} className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {/* Top-Left large blurred pod shadow */}
        <div className="floating-cocoa-piece absolute top-[15%] left-[8%] w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#34211a]/20 to-transparent blur-lg filter opacity-50" />
        
        {/* Mid-Right glowing crystal element */}
        <div className="floating-cocoa-piece absolute top-[45%] right-[10%] w-10 h-16 md:w-16 md:h-28 border border-[#e5ad6b]/15 bg-[#140d0b]/40 rounded-full backdrop-blur-xs shadow-[0_0_30px_rgba(229,173,107,0.05)] z-25" />
        
        {/* Bottom-Left tiny copper shard */}
        <div className="floating-cocoa-piece absolute bottom-[22%] left-[15%] w-6 h-6 rotate-45 border-t border-l border-[#e5ad6b]/20 bg-[#1d120f]/35 rounded-sm backdrop-blur-xs" />
      </div>

      {/* 3. Hero Headline Content */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-30 text-center max-w-5xl px-6 md:px-12 flex flex-col items-center mt-6 md:mt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
      >
        <span className="text-[8px] md:text-[10px] font-sans font-semibold uppercase tracking-[0.5em] text-[#d4af37] mb-4 md:mb-8 inline-block drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          Artisanal Bean-To-Bar India
        </span>

        {/* Stacked Serif Title */}
        <h1
          style={{ fontSize: "clamp(2.5rem, 11vw, 8.5rem)" }}
          className="font-serif font-bold tracking-[0.05em] text-[#f8eadc] leading-[0.9] md:leading-[0.85] mb-6 md:mb-10 font-serif uppercase flex flex-col items-center"
        >
          <span className="block tracking-widest text-[#f8eadc] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">Discover</span>
          <span className="block text-gold-gradient italic tracking-normal my-1 md:my-2 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">Your</span>
          <span className="block tracking-widest text-[#f8eadc] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">Dark Side</span>
        </h1>

        {/* Description Subheadline */}
        <p className="text-[#c8b5a4] text-[10px] md:text-base max-w-xl leading-relaxed tracking-wider font-light mb-6 md:mb-12 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          Indian Bean-to-Bar Chocolate Crafted for Extraordinary Experiences
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-5 items-center justify-center w-full sm:w-auto">
          <a
            href="#shop"
            className="group relative inline-flex items-center justify-center w-full sm:w-auto px-6 py-3.5 md:px-10 md:py-4.5 rounded-sm bg-[#c58c48] text-[#090605] text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-bold overflow-hidden transition-all duration-300 hover:bg-[#e5ad6b] hover:scale-105 hover:shadow-[0_10px_30px_rgba(197,140,72,0.3)]"
          >
            Explore Collection
          </a>
          <a
            href="#experiences"
            className="group relative inline-flex items-center justify-center w-full sm:w-auto px-6 py-3.5 md:px-10 md:py-4.5 rounded-sm border border-[#e5ad6b]/30 bg-[#090605]/40 backdrop-blur-md text-[#f8eadc] text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-semibold overflow-hidden transition-all duration-300 hover:bg-[#e5ad6b]/10 hover:border-[#e5ad6b]/65 hover:scale-105"
          >
            Book Factory Tour
          </a>
        </div>
      </motion.div>

      {/* 4. Animated Scroll Progress Indicator */}
      <div className="absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 md:gap-3 text-[#c8b5a4]/50 pointer-events-none scale-75 md:scale-100">
        <span className="text-[7px] md:text-[7.5px] uppercase tracking-[0.3em] font-sans">
          Scroll To Begin The Journey
        </span>
        <div className="w-[1.5px] h-8 md:h-12 bg-[#34211a] rounded-full relative overflow-hidden">
          <div
            ref={lineRef}
            className="absolute top-0 left-0 w-full h-full bg-[#d4af37]"
            style={{ transformOrigin: "top" }}
          />
        </div>
      </div>
    </section>
  );
}
