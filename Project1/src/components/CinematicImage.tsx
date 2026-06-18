"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

interface CinematicImageProps {
  src?: string;
  alt: string;
  aspectRatio: "16:9" | "21:9" | "4:5" | "16:10";
  effectType: "hero" | "product" | "story" | "experience";
  className?: string;
}

export default function CinematicImage({
  src,
  alt,
  aspectRatio,
  effectType,
  className = "",
}: CinematicImageProps) {
  const [imageError, setImageError] = useState(false);

  // Aspect ratio mapping classes
  const aspectClasses = {
    "16:9": "aspect-[16/9]",
    "21:9": "aspect-[16/10] md:aspect-[21/9]",
    "4:5": "aspect-[4/5]",
    "16:10": "aspect-[16/10]",
  };

  // Determine animations based on effect type
  const isHero = effectType === "hero";
  const isProduct = effectType === "product";
  const isStory = effectType === "story";
  const isExperience = effectType === "experience";

  // Framer Motion variants
  const storyRevealVariants: Variants = {
    hidden: { scale: 1.15, filter: "blur(12px)", opacity: 0.6 },
    visible: {
      scale: 1,
      filter: "blur(0px)",
      opacity: 1,
      transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const productVariants: Variants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  // Luxury Placeholder Mesh when image doesn't exist
  const renderPlaceholder = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1c120f] via-[#090605] to-[#251510] p-6 text-center select-none overflow-hidden">
      {/* Golden accent corners */}
      <div className="absolute top-4 left-4 h-3 w-3 border-t border-l border-[#d4af37]/40" />
      <div className="absolute top-4 right-4 h-3 w-3 border-t border-r border-[#d4af37]/40" />
      <div className="absolute bottom-4 left-4 h-3 w-3 border-b border-l border-[#d4af37]/40" />
      <div className="absolute bottom-4 right-4 h-3 w-3 border-b border-r border-[#d4af37]/40" />

      {/* Floating circular soft gold glow */}
      <div className="absolute -top-[20%] -left-[20%] h-[60%] w-[60%] rounded-full bg-gradient-to-tr from-[#d4af37]/10 to-transparent blur-3xl" />
      <div className="absolute -bottom-[20%] -right-[20%] h-[60%] w-[60%] rounded-full bg-gradient-to-bl from-[#b87333]/15 to-transparent blur-3xl" />

      {!isHero && (
        <div className="z-10 flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#d4af37]/70 font-semibold">
            {effectType.toUpperCase()} FRAME
          </span>
          <h3 className="font-serif text-xl md:text-2xl text-[#f8eadc] leading-tight max-w-[80%] font-medium">
            {alt}
          </h3>
          <span className="text-[11px] font-mono tracking-widest text-[#c8b5a4]/50 mt-2 px-3 py-1 border border-[#c8b5a4]/15 rounded-full bg-[#0c0807]/60">
            Ratio {aspectRatio}
          </span>
          {src && (
            <span className="text-[8px] font-mono text-[#c8b5a4]/30 mt-3 max-w-[90%] truncate">
              {src}
            </span>
          )}
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      className={`relative w-full overflow-hidden rounded-md border border-[#c58c48]/15 bg-[#0c0807] shadow-2xl ${aspectClasses[aspectRatio]} ${className}`}
      whileHover={isProduct ? "hover" : undefined}
      initial={isProduct ? "rest" : undefined}
    >
      {/* 1. Base Image Layer */}
      {src && !imageError ? (
        <motion.div
          className="absolute inset-0 h-full w-full"
          variants={isStory ? storyRevealVariants : undefined}
          initial={isStory ? "hidden" : undefined}
          whileInView={isStory ? "visible" : undefined}
          viewport={isStory ? { once: true, margin: "-10%" } : undefined}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-w-768px) 100vw, 50vw"
            className={`object-cover object-center transition-transform ${
              isHero ? "animate-kenburns" : ""
            }`}
            onError={() => setImageError(true)}
            priority={isHero}
          />
        </motion.div>
      ) : (
        renderPlaceholder()
      )}

      {/* 2. Overlays depending on effect type */}
      {isHero && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#090605] via-[#090605]/30 to-transparent z-10 pointer-events-none" />
      )}

      {isProduct && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-[#0c0807] via-transparent to-transparent opacity-80 z-10 pointer-events-none"
          variants={{
            rest: { opacity: 0.6 },
            hover: { opacity: 0.8 },
          }}
        />
      )}

      {isExperience && (
        <>
          {/* Dark luxury tint & Radial Light Ray Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#090605] via-transparent to-[#090605]/50 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(229,173,107,0.08),transparent_50%)] z-10 pointer-events-none" />
        </>
      )}

      {/* Hover borders on product */}
      {isProduct && (
        <div className="absolute inset-0 border border-[#e5ad6b]/0 hover:border-[#e5ad6b]/20 transition-colors duration-500 z-20 pointer-events-none" />
      )}
    </motion.div>
  );
}
