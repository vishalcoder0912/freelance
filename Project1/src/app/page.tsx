"use client";

import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import SmoothScroll from '@/components/SmoothScroll';

const HeroSequenceCanvas = dynamic(() => import('@/components/HeroSequenceCanvas'), {
  ssr: false
});

const AmbientAudio = dynamic(() => import('@/components/AmbientAudio'), {
  ssr: false
});

// Register GSAP ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Product {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  origin: string;
  flavorNotes: string;
  ingredients: string;
  pairings: string;
  awards: string;
  story: string;
}

const products: Product[] = [
  {
    id: "dark",
    title: "Dark Chocolate Collection",
    subtitle: "MASON SIGNATURE 75%",
    image: "/images/product_dark.png",
    origin: "Western Ghats, India",
    flavorNotes: "Wild cherry, molasses, and roasted espresso",
    ingredients: "Organic cacao beans, organic cane sugar, cocoa butter",
    pairings: "Single malt whisky, dark roast espresso, rich red wine",
    awards: "Great Taste Awards - 3 Gold Stars",
    story: "Sourced from the foothills of the Western Ghats, this single-origin bar is roasted at a precise convection temperature to unlock the deep, earthy cherry notes native to South Indian soil."
  },
  {
    id: "milk",
    title: "Milk Chocolate Collection",
    subtitle: "SALTED CARAMEL 55%",
    image: "/images/product_milk.png",
    origin: "Malabar Coast, India",
    flavorNotes: "Caramelized honey, creamy vanilla, sea salt flakes",
    ingredients: "Organic cacao, grass-fed milk solids, cane sugar, sea salt",
    pairings: "Jasmine tea, light roast pour-over, fresh berries",
    awards: "International Chocolate Awards - Gold Medalist",
    story: "A luxurious reinterpretation of milk chocolate. High cacao content balances the rich sweetness of grass-fed milk solids, finished with hand-harvested sea salt flakes."
  },
  {
    id: "single-origin",
    title: "Single Origin Collection",
    subtitle: "ANAIMALAI ESTATE 85%",
    image: "/images/product_single_origin.png",
    origin: "Anaimalai Hills, Tamil Nadu",
    flavorNotes: "Citrus zest, jasmine blossom, black tea undertones",
    ingredients: "Single-estate organic cacao beans, organic cane sugar",
    pairings: "Aged rum, dark oolong tea, roasted almonds",
    awards: "Best Fine Cacao Origin 2025",
    story: "Sourced from a single agroforestry estate in the Anaimalai Hills. The cocoa trees grow in the shade of coconut palms and pepper vines, infusing the beans with a bright, floral complexity."
  },
  {
    id: "gift-boxes",
    title: "The Gift Collection",
    subtitle: "ARTISAN CURATIONS",
    image: "/images/product_gift_box.png",
    origin: "Multi-Estate Select",
    flavorNotes: "An curated assortment of our finest flavor profiles",
    ingredients: "Various artisan inclusions and pure single origin bars",
    pairings: "Champagne, celebratory gatherings",
    awards: "Luxury Packaging Design Winner 2025",
    story: "Housed in matte-black rigid boxes with embossed gold foil details. Each bar inside is wrapped by hand by local female artisans, making it the ultimate gesture of taste."
  },
  {
    id: "seasonal",
    title: "Seasonal Collections",
    subtitle: "MONSOON HARVEST",
    image: "/images/product_seasonal.png",
    origin: "Estates under monsoon cloud cover",
    flavorNotes: "Spiced orange blossom, warm gingerbread, cloves",
    ingredients: "Cacao, organic orange zest, seasonal spices, sugar",
    pairings: "Spiced mulled wine, hot cocoa infusions",
    awards: "Artisan Innovation Award Nominee",
    story: "Crafted exclusively during the winter monsoon harvest. We infuse our limited-edition bars with hand-plucked botanicals and spices that thrive in the monsoon rain."
  },
  {
    id: "corporate",
    title: "Corporate Gifts",
    subtitle: "BESPOKE EXECUTIVE SETS",
    image: "/images/product_corporate.png",
    origin: "Curated Estate Selections",
    flavorNotes: "Balanced, refined, universally sophisticated profiles",
    ingredients: "Highest grade single-estate chocolate and truffles",
    pairings: "Executive lounges, corporate events",
    awards: "Corporate Luxury Icon 2026",
    story: "Designed for modern professional impressions. Customize with bespoke embossed bands, corporate logos, and customized greeting enclosures in pure executive elegance."
  }
];

export default function Home() {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  
  const heroTriggerRef = useRef<HTMLDivElement>(null);
  const revealTriggerRef = useRef<HTMLDivElement>(null);
  const horizontalTriggerRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);

  const [heroProgress, setHeroProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle header scrolling
  const scrollToSection = (id: string) => {
    if (typeof window === 'undefined') return;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useGSAP(() => {
    // 1. Hero Pinned scrubbing of 240 frames
    ScrollTrigger.create({
      trigger: heroTriggerRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: true,
      pinSpacing: true,
      scrub: true,
      onUpdate: (self) => {
        setHeroProgress(self.progress);
      }
    });

    // Animate Hero text overlays based on scroll position in a timeline
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroTriggerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });

    heroTl
      .fromTo(".hero-text-1", { opacity: 0, y: 30, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 })
      .to(".hero-text-1", { opacity: 0, y: -30, filter: "blur(10px)", duration: 1 }, "+=0.8")
      
      .fromTo(".hero-text-2", { opacity: 0, y: 30, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 })
      .to(".hero-text-2", { opacity: 0, y: -30, filter: "blur(10px)", duration: 1 }, "+=0.8")
      
      .fromTo(".hero-text-3", { opacity: 0, y: 30, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 })
      .to(".hero-text-3", { opacity: 0, y: -30, filter: "blur(10px)", duration: 1 }, "+=0.8")
      
      .fromTo(".hero-text-4", { opacity: 0, y: 30, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 })
      .to(".hero-text-4", { opacity: 0, y: -30, filter: "blur(10px)", duration: 1 }, "+=0.8");

    // 2. Product Reveal Pinned emerging bar
    const revealTl = gsap.timeline({
      scrollTrigger: {
        trigger: revealTriggerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        pin: true,
        pinSpacing: true
      }
    });

    revealTl
      .fromTo(".reveal-bg-overlay", { opacity: 0 }, { opacity: 1, duration: 1 })
      .fromTo(".product-reveal-image", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }, "-=0.5")
      .fromTo(".reveal-text-top", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2 }, "-=1.0")
      .fromTo(".reveal-text-bottom", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 1.2 }, "-=0.8")
      .to({}, { duration: 1.0 }); // Let the reveal sit pinned for a moment

    // 3. Horizontal Museum Scroll through 6 Collections
    const horizTween = gsap.to(horizontalTrackRef.current, {
      x: () => -(horizontalTrackRef.current!.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: horizontalTriggerRef.current,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => `+=${horizontalTrackRef.current!.scrollWidth - window.innerWidth}`,
        invalidateOnRefresh: true,
      }
    });

    // Fade-in effect for elements within each horizontal slide as they enter viewport
    products.forEach((product) => {
      gsap.fromTo(`.slide-info-${product.id}`, 
        { opacity: 0, x: 50 },
        { 
          opacity: 1, 
          x: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: `.slide-container-${product.id}`,
            containerAnimation: horizTween,
            start: "left 65%",
            toggleActions: "play none none reverse",
          }
        }
      );
    });

  }, { scope: scrollWrapperRef });

  return (
    <SmoothScroll>
      <div ref={scrollWrapperRef} className="relative w-full bg-brand-black text-brand-cream overflow-x-hidden selection:bg-brand-copper selection:text-brand-black">
        
        {/* Global Luxury Header */}
        <header className="fixed top-0 left-0 w-full flex justify-between items-center px-[6%] py-6 z-50 bg-gradient-to-b from-brand-black/90 to-transparent backdrop-blur-[2px] border-b border-brand-cream/5">
          <div 
            onClick={() => scrollToSection("hero-section")}
            className="font-serif text-xl md:text-2xl font-light tracking-[0.4em] text-brand-cream hover:text-brand-gold transition-colors duration-300 cursor-pointer"
          >
            MASON & CO
          </div>
          
          <nav className="hidden md:flex items-center gap-10">
            <button 
              onClick={() => scrollToSection("hero-section")} 
              className="text-[10px] font-medium uppercase tracking-[0.25em] hover:text-brand-copper transition-colors duration-300 cursor-pointer bg-transparent border-none"
            >
              Plantation
            </button>
            <button 
              onClick={() => scrollToSection("product-reveal")} 
              className="text-[10px] font-medium uppercase tracking-[0.25em] hover:text-brand-copper transition-colors duration-300 cursor-pointer bg-transparent border-none"
            >
              Reveal
            </button>
            <button 
              onClick={() => scrollToSection("product-collection")} 
              className="text-[10px] font-medium uppercase tracking-[0.25em] hover:text-brand-copper transition-colors duration-300 cursor-pointer bg-transparent border-none"
            >
              Collection
            </button>
            <button 
              onClick={() => scrollToSection("gift-section")} 
              className="text-[10px] font-medium uppercase tracking-[0.25em] hover:text-brand-copper transition-colors duration-300 cursor-pointer bg-transparent border-none"
            >
              Gifting
            </button>
            <button 
              onClick={() => scrollToSection("about-section")} 
              className="text-[10px] font-medium uppercase tracking-[0.25em] hover:text-brand-copper transition-colors duration-300 cursor-pointer bg-transparent border-none"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection("product-collection")} 
              className="text-[9px] font-medium uppercase tracking-[0.25em] px-5 py-2 border border-brand-gold rounded-none text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all duration-300 cursor-pointer bg-transparent"
            >
              Acquire
            </button>
          </nav>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 cursor-pointer z-50 bg-transparent border-none"
            aria-label="Toggle Menu"
          >
            <span className={`w-6 h-[1px] bg-brand-cream transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
            <span className={`w-6 h-[1px] bg-brand-cream transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-[1px] bg-brand-cream transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 w-full h-screen bg-brand-black/95 z-40 flex flex-col justify-center items-center gap-8 md:hidden pointer-events-auto"
            >
              <button 
                onClick={() => { setMobileMenuOpen(false); scrollToSection("hero-section"); }} 
                className="text-sm uppercase tracking-[0.2em] hover:text-brand-copper bg-transparent border-none cursor-pointer"
              >
                Plantation
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); scrollToSection("product-reveal"); }} 
                className="text-sm uppercase tracking-[0.2em] hover:text-brand-copper bg-transparent border-none cursor-pointer"
              >
                Reveal
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); scrollToSection("product-collection"); }} 
                className="text-sm uppercase tracking-[0.2em] hover:text-brand-copper bg-transparent border-none cursor-pointer"
              >
                Collection
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); scrollToSection("gift-section"); }} 
                className="text-sm uppercase tracking-[0.2em] hover:text-brand-copper bg-transparent border-none cursor-pointer"
              >
                Gifting
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); scrollToSection("about-section"); }} 
                className="text-sm uppercase tracking-[0.2em] hover:text-brand-copper bg-transparent border-none cursor-pointer"
              >
                About
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); scrollToSection("product-collection"); }} 
                className="text-sm uppercase tracking-[0.2em] px-8 py-3 border border-brand-gold rounded-none text-brand-gold hover:bg-brand-gold hover:text-brand-black bg-transparent cursor-pointer"
              >
                Acquire
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECTION 1: HERO PINNED IMAGE SEQUENCE */}
        <div id="hero-section" ref={heroTriggerRef} className="relative w-full h-[300vh] bg-brand-black">
          <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
            {/* The 240-frame Canvas scrubber */}
            <HeroSequenceCanvas scrollProgress={heroProgress} />
            
            {/* Cinematic text overlays controlled by GSAP Timeline */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 z-10 pointer-events-none">
              
              <div className="hero-text-1 absolute max-w-[850px] opacity-0 translate-y-[30px] filter blur-[10px]">
                <h1 className="font-serif leading-none tracking-tight font-extralight text-brand-cream text-4xl md:text-6xl">
                  FROM SOUTH INDIAN SOIL
                </h1>
                <p className="mt-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-brand-cream/60">
                  A single-origin narrative born from monsoon mist
                </p>
              </div>

              <div className="hero-text-2 absolute max-w-[850px] opacity-0 translate-y-[30px] filter blur-[10px]">
                <h1 className="font-serif leading-none tracking-tight font-extralight text-brand-cream text-4xl md:text-6xl">
                  EVERY BEAN HAS A STORY
                </h1>
                <p className="mt-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-brand-cream/60">
                  Nourished in the shadows of wild Western Ghats
                </p>
              </div>

              <div className="hero-text-3 absolute max-w-[850px] opacity-0 translate-y-[30px] filter blur-[10px]">
                <h1 className="font-serif leading-none tracking-tight font-extralight text-brand-cream text-4xl md:text-6xl">
                  CRAFTED BY HAND
                </h1>
                <p className="mt-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-brand-cream/60">
                  Honoring traditional techniques and careful selection
                </p>
              </div>

              <div className="hero-text-4 absolute max-w-[850px] opacity-0 translate-y-[30px] filter blur-[10px]">
                <h1 className="font-serif leading-none tracking-tight font-extralight text-brand-cream text-4xl md:text-6xl">
                  EXTRAORDINARY CHOCOLATE
                </h1>
                <p className="mt-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-brand-cream/60">
                  Designed for sensory elevation
                </p>
              </div>

            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none opacity-60">
              <span className="relative w-4 h-8 border border-brand-cream/30 rounded-none">
                <span className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-brand-gold rounded-none animate-scroll-wheel"></span>
              </span>
              <span className="text-[8px] uppercase tracking-[0.2em] text-brand-cream/40">Scroll to Explore</span>
            </div>

          </div>
        </div>

        {/* SECTION 2: PRODUCT REVEAL */}
        <div id="product-reveal" ref={revealTriggerRef} className="relative w-full h-[200vh] bg-brand-black">
          {/* Black overlay that fades in as frame 240 ends */}
          <div className="reveal-bg-overlay absolute inset-0 bg-[#070707] z-0 pointer-events-none" />
          
          <div className="sticky top-0 h-screen w-screen flex flex-col md:flex-row justify-center items-center overflow-hidden z-10 px-[8%] gap-12">
            
            {/* Left Column: Product Photo (Museum-style reveal) */}
            <div className="relative z-10 w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center">
              <img 
                src="/images/product_dark.png" 
                alt="Mason & Co Signature Bar" 
                className="product-reveal-image w-auto h-[60vh] md:h-[70vh] object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.9)] opacity-0"
              />
              {/* Volumetric glow back-light */}
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(198,124,78,0.12)_0%,transparent_65%)] pointer-events-none z-0"></div>
            </div>

            {/* Right Column: Reveal Statement */}
            <div className="w-full md:w-1/2 flex flex-col justify-center text-left max-w-[500px]">
              <div className="reveal-text-top opacity-0 translate-y-8 mb-6">
                <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-brand-copper">Direct Reveal</span>
                <h2 className="font-serif text-4xl md:text-5xl font-light text-brand-cream leading-tight mt-3">
                  Emerging from <br />
                  <span className="italic text-brand-gold">pure origin.</span>
                </h2>
              </div>
              <div className="reveal-text-bottom opacity-0 translate-y-8">
                <div className="w-12 h-[1px] bg-brand-copper/30 mb-6" />
                <p className="text-xs md:text-sm font-sans font-light text-brand-cream/75 leading-relaxed">
                  The documentary ends. The craftsmanship concludes. Inside our organic wrapping lies the culmination of soil, shadow, and precise convection roasting. Pure single-origin alchemy, presented with absolute clarity.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 3: PRODUCT COLLECTION (HORIZONTAL SCROLL) */}
        <div id="product-collection" ref={horizontalTriggerRef} className="relative bg-[#070707]">
          
          {/* Pinned horizontal tracks wrapper */}
          <div className="sticky top-0 left-0 w-screen h-screen overflow-hidden">
            
            {/* The moving track containing all product slides */}
            <div ref={horizontalTrackRef} className="flex h-full w-[600vw]">
              
              {products.map((product) => (
                <div 
                  key={product.id}
                  className={`slide-container-${product.id} w-screen h-screen flex-shrink-0 flex flex-col md:flex-row bg-[#080808] text-brand-cream border-r border-brand-cream/5 relative group`}
                >
                  
                  {/* Left Side: Product Portrait Presentation */}
                  <div className="w-full md:w-1/2 h-[45%] md:h-full flex items-center justify-center relative bg-[#060606] p-8 overflow-hidden">
                    <img 
                      src={product.image}
                      alt={product.title}
                      className="max-h-[35vh] md:max-h-[65vh] w-auto object-contain transition-all duration-700 ease-out group-hover:scale-105 drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)] group-hover:drop-shadow-[0_35px_55px_rgba(198,124,78,0.18)] z-10"
                    />
                    
                    {/* Apple-style light sweep sheen reflection overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-brand-cream/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.8s] ease-out z-20 pointer-events-none" />
                    
                    {/* Shadow highlight backdrop */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(26,18,11,0.5)_0%,transparent_80%)] pointer-events-none" />
                  </div>

                  {/* Right Side: Editorial Grid & Details (reveals with scroll target) */}
                  <div className={`slide-info-${product.id} w-full md:w-1/2 h-[55%] md:h-full flex flex-col justify-center p-[6%] md:p-[8%] bg-brand-black overflow-y-auto`}>
                    
                    <span className="text-[8px] font-semibold uppercase tracking-[0.35em] text-brand-copper mb-2 block">
                      {product.subtitle}
                    </span>
                    <h3 className="font-serif text-2xl md:text-4xl font-light text-brand-cream leading-tight mb-5">
                      {product.title}
                    </h3>
                    
                    <div className="w-12 h-[1px] bg-brand-copper/30 mb-6" />

                    {/* Museum details metadata table */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-6 text-[10px] md:text-xs font-sans font-light">
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-brand-copper/70 block mb-0.5 font-medium">Origin</span>
                        <span className="text-brand-cream/80">{product.origin}</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-brand-copper/70 block mb-0.5 font-medium font-sans">Flavor Notes</span>
                        <span className="text-brand-cream/80">{product.flavorNotes}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[8px] uppercase tracking-wider text-brand-copper/70 block mb-0.5 font-medium">Ingredients</span>
                        <span className="text-brand-cream/85">{product.ingredients}</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-brand-copper/70 block mb-0.5 font-medium">Pairings</span>
                        <span className="text-brand-cream/80">{product.pairings}</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-brand-copper/70 block mb-0.5 font-medium font-sans">Awards</span>
                        <span className="text-brand-gold font-medium italic">{product.awards}</span>
                      </div>
                    </div>

                    {/* Short Story */}
                    <div className="border-t border-brand-cream/10 pt-4 mt-2">
                      <p className="text-[11px] md:text-[12px] text-brand-cream/60 leading-relaxed font-sans font-light italic">
                        &ldquo;{product.story}&rdquo;
                      </p>
                    </div>

                    {/* Subtle button to purchase */}
                    <div className="mt-6">
                      <button className="text-[9px] uppercase tracking-[0.2em] text-brand-cream border-b border-brand-copper pb-1 hover:text-brand-gold hover:border-brand-gold transition-all duration-300 bg-transparent border-none cursor-pointer">
                        Acquire Collection Bar
                      </button>
                    </div>

                  </div>

                </div>
              ))}

            </div>

          </div>
        </div>

        {/* SECTION 4: GIFTING SECTION */}
        <div id="gift-section" className="relative w-full py-28 bg-[#090909] px-[8%] border-t border-brand-cream/5">
          <div className="max-w-[1200px] mx-auto">
            
            <div className="text-center mb-16">
              <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-brand-copper mb-2 block">Curation</span>
              <h2 className="font-serif text-3xl md:text-5xl font-light text-brand-cream">The Luxury Gifting Suite</h2>
              <div className="w-12 h-[1px] bg-brand-copper/30 mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Image presentation */}
              <div className="relative overflow-hidden group aspect-square flex items-center justify-center bg-[#070707] p-8 border border-brand-cream/5">
                <img 
                  src="/images/product_gift_box.png" 
                  alt="Mason & Co Curated Gift Box" 
                  className="max-h-[70%] w-auto object-contain transition-transform duration-700 group-hover:scale-105 drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Editorial composition */}
              <div className="flex flex-col justify-center text-left">
                <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-brand-copper mb-3 block font-sans">Artisan Packaging</span>
                <h3 className="font-serif text-2xl md:text-3xl font-light text-brand-cream mb-5">Curated with Intention</h3>
                <p className="text-xs md:text-sm font-sans font-light text-brand-cream/70 leading-relaxed mb-6">
                  Presented in bespoke matte-black rigid boxes, wrapped with soft satin ribbon and embossed with gold leaf typography. Our gift boxes are designed for corporate curation and personal luxury celebrations, offering a selection of three or six custom-origin bars.
                </p>
                <div className="flex flex-col gap-3 text-xs text-brand-cream/80 mb-8 font-sans font-light">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-brand-gold"></div>
                    <span>Includes personalized, hand-written cotton card</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-brand-gold"></div>
                    <span>Wrapped in protective insulated metallic parchment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-brand-gold"></div>
                    <span>Tailored bespoke combinations available</span>
                  </div>
                </div>

                <div>
                  <button className="px-8 py-3.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-brand-black bg-brand-cream hover:bg-brand-gold transition-colors duration-300 border-none cursor-pointer">
                    Explore Gifting Catalogue
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 5: ABOUT SECTION */}
        <div id="about-section" className="relative w-full py-28 bg-brand-black px-[8%] border-t border-brand-cream/5">
          <div className="max-w-[1200px] mx-auto">
            
            <div className="text-center mb-20">
              <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-brand-copper mb-2 block">Heritage</span>
              <h2 className="font-serif text-3xl md:text-5xl font-light text-brand-cream">Artisan Sourcing & Craft</h2>
              <div className="w-12 h-[1px] bg-brand-copper/30 mx-auto mt-4" />
            </div>

            {/* Layout inspired by luxury editorial magazines */}
            <div className="flex flex-col gap-24">
              
              {/* Row 1: Plantation Story */}
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="w-full md:w-1/2 order-2 md:order-1 flex flex-col justify-center text-left">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-brand-copper mb-3 block">01 / The Estates</span>
                  <h3 className="font-serif text-2xl md:text-3xl font-light text-brand-cream mb-5">Shadows of the Western Ghats</h3>
                  <p className="text-xs md:text-sm font-sans font-light text-brand-cream/70 leading-relaxed mb-4">
                    Our organic cacao grows under a canopy of coconut, pepper, and banana trees in Southern India. This agroforest ecosystem naturally shades the pods, allowing the sugars in the pulp to mature slowly, creating deep cherry and honey notes.
                  </p>
                  <p className="text-xs md:text-sm font-sans font-light text-brand-cream/70 leading-relaxed">
                    By partnering directly with small, multi-generational farming families, we ensure sustainable land management, fair wages, and an authentic single-origin narrative in every bite.
                  </p>
                </div>
                <div className="w-full md:w-1/2 order-1 md:order-2 overflow-hidden aspect-[16/10] bg-[#0c0c0c] border border-brand-cream/5">
                  <img 
                    src="/images/about_plantation.png" 
                    alt="Western Ghats Cacao Plantation" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>

              {/* Row 2: Artisan Wrapping */}
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="w-full md:w-1/2 overflow-hidden aspect-[16/10] bg-[#0c0c0c] border border-brand-cream/5">
                  <img 
                    src="/images/about_artisan.png" 
                    alt="Artisan wrapping chocolate" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <div className="w-full md:w-1/2 flex flex-col justify-center text-left">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-brand-copper mb-3 block">02 / The Workshop</span>
                  <h3 className="font-serif text-2xl md:text-3xl font-light text-brand-cream mb-5">Tempered & Wrapped by Hand</h3>
                  <p className="text-xs md:text-sm font-sans font-light text-brand-cream/70 leading-relaxed mb-4">
                    In our clean workspace, we process the beans in micro-batches. Continuous stone grinding for 72 hours refines the texture until it reaches a perfect, silky viscosity.
                  </p>
                  <p className="text-xs md:text-sm font-sans font-light text-brand-cream/70 leading-relaxed">
                    Once tempered, each individual bar is wrapped carefully in gold foil and textured recycled paper by local female artisans. A slow, meditative process that rejects corporate automation in favor of human touch and local community empowerment.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* SECTION 6: FOOTER */}
        <footer className="relative w-full py-16 bg-[#060606] px-[8%] border-t border-brand-cream/5 text-[11px] font-sans font-light text-brand-cream/50">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between gap-12">
            
            <div className="flex flex-col gap-4 text-left">
              <span className="font-serif text-lg tracking-[0.3em] text-brand-cream">MASON & CO</span>
              <p className="max-w-[280px] leading-relaxed text-brand-cream/40">
                Crafting fine organic single-origin chocolate from the Western Ghats. Honoring soil, community, and time.
              </p>
            </div>

            <div className="flex gap-16 text-left">
              <div className="flex flex-col gap-3">
                <span className="text-[8px] uppercase tracking-widest text-brand-copper font-medium">Explore</span>
                <button onClick={() => scrollToSection("hero-section")} className="hover:text-brand-cream transition-colors text-left bg-transparent border-none cursor-pointer font-sans font-light text-[11px]">Estates</button>
                <button onClick={() => scrollToSection("product-collection")} className="hover:text-brand-cream transition-colors text-left bg-transparent border-none cursor-pointer font-sans font-light text-[11px]">Collection</button>
                <button onClick={() => scrollToSection("gift-section")} className="hover:text-brand-cream transition-colors text-left bg-transparent border-none cursor-pointer font-sans font-light text-[11px]">Gifting</button>
              </div>
              
              <div className="flex flex-col gap-3">
                <span className="text-[8px] uppercase tracking-widest text-brand-copper font-medium">Estates</span>
                <span>Western Ghats, India</span>
                <span>Malabar Coast, India</span>
                <span>Anaimalai Hills, India</span>
              </div>
              
              <div className="flex flex-col gap-3">
                <span className="text-[8px] uppercase tracking-widest text-brand-copper font-medium">Legal</span>
                <a href="#" className="hover:text-brand-cream transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-brand-cream transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-brand-cream transition-colors">Shipping & Returns</a>
              </div>
            </div>

          </div>

          <div className="max-w-[1200px] mx-auto mt-16 pt-8 border-t border-brand-cream/5 flex flex-col md:flex-row justify-between items-center gap-4 text-brand-cream/30">
            <span>© {new Date().getFullYear()} Mason & Co. All rights reserved.</span>
            <span>Handcrafted with purpose.</span>
          </div>
        </footer>

        {/* Ambient Synthesized Forest Audio Controller */}
        <AmbientAudio />

      </div>
    </SmoothScroll>
  );
}
