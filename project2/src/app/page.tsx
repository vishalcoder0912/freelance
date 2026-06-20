"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Custom Hooks & Stores
import { useCart } from '@/hooks/useCart';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useReviewStore } from '@/store/useReviewStore';
import { useAdminStore } from '@/store/useAdminStore';

// Database
import { products, Product } from '@/data/products';

// Modular Components
import SmoothScroll from '@/components/SmoothScroll';
import CartDrawer from '@/components/CartDrawer';
import ProductCatalog from '@/components/ProductCatalog';
import ProductDetailModal from '@/components/ProductDetailModal';
import ProductCompareDrawer from '@/components/ProductCompareDrawer';
import SubscriptionSuite from '@/components/SubscriptionSuite';
import CorporateGifting from '@/components/CorporateGifting';
import AtelierAdmin from '@/components/AtelierAdmin';

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

export default function Home() {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const heroTriggerRef = useRef<HTMLDivElement>(null);
  const revealTriggerRef = useRef<HTMLDivElement>(null);
  const horizontalTriggerRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const cartIconRef = useRef<HTMLDivElement>(null);

  // Zustand State Connectors
  const { addItem, toggleCart, itemCount } = useCart();
  const { items: wishlistItems } = useWishlistStore();
  const { getAverageRating } = useReviewStore();

  // Curated list of products specifically shown in the cinematic horizontal scroll (5 items)
  const horizontalProducts = products.filter(p => 
    ['sig-dark-75', 'malabar-milk-55', 'anaimalai-85', 'monsoon-harvest-spiced', 'artisan-curations-box'].includes(p.id)
  );

  // UI Open/Close States
  const [heroProgress, setHeroProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  
  const [adminOpen, setAdminOpen] = useState(false);
  
  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');
  const [searchCacao, setSearchCacao] = useState<number>(50); // min cacao limit
  const [maxPrice, setMaxPrice] = useState<number>(3000);

  // Parallax mouse movements for first product reveal
  const [revealParallax, setRevealParallax] = useState({ x: 0, y: 0 });

  // Handle header scrolling
  const scrollToSection = (id: string) => {
    if (typeof window === 'undefined') return;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Track mouse coordinates inside reveal section
  const handleRevealMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window === 'undefined') return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const targetX = (clientX / innerWidth - 0.5) * 35; // max 35px shift
    const targetY = (clientY / innerHeight - 0.5) * 35;
    setRevealParallax({ x: targetX, y: targetY });
  };

  const handleRevealMouseLeave = () => {
    setRevealParallax({ x: 0, y: 0 });
  };

  // Parabolic fly-to-cart animation
  const handleAddToCart = (productId: string, imageSrc: string) => {
    if (typeof window === 'undefined') return;

    // Map old trigger ID to new DB ID
    const lookupId = productId === 'dark' ? 'sig-dark-75' : productId === 'gift' ? 'artisan-curations-box' : productId;
    const product = products.find(p => p.id === lookupId);
    if (!product) return;

    const productImg = document.querySelector(`.product-img-${productId}`) as HTMLImageElement;
    const cartIcon = cartIconRef.current;

    if (!productImg || !cartIcon) {
      addItem(product);
      return;
    }

    const imgRect = productImg.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    // Create floating clone on body
    const clone = document.createElement('img');
    clone.src = imageSrc;
    clone.style.position = 'fixed';
    clone.style.left = `${imgRect.left}px`;
    clone.style.top = `${imgRect.top}px`;
    clone.style.width = `${imgRect.width}px`;
    clone.style.height = `${imgRect.height}px`;
    clone.style.objectFit = 'contain';
    clone.style.zIndex = '9999';
    clone.style.pointerEvents = 'none';
    clone.style.filter = 'drop-shadow(0 15px 30px rgba(0,0,0,0.5))';
    document.body.appendChild(clone);

    // Dynamic flight timeline with parabolic curvature
    const tl = gsap.timeline({
      onComplete: () => {
        clone.remove();
        addItem(product);
        
        // Tactile pulsate response on the cart bag
        gsap.fromTo(cartIcon, 
          { scale: 1 }, 
          { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.out" }
        );
      }
    });

    tl.to(clone, {
      x: cartRect.left - imgRect.left + (cartRect.width / 2) - (imgRect.width / 2),
      y: cartRect.top - imgRect.top + (cartRect.height / 2) - (imgRect.height / 2),
      scale: 0.05,
      opacity: 0.1,
      rotation: 360,
      duration: 1.1,
      ease: "power2.inOut"
    });
  };

  // Compare functions
  const handleAddToCompare = (product: Product) => {
    setComparedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        // limit to 3 compared items
        return [...prev.slice(1), product];
      }
      return [...prev, product];
    });
    setCompareOpen(true);
  };

  const handleRemoveCompare = (id: string) => {
    setComparedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearCompare = () => {
    setComparedProducts([]);
    setCompareOpen(false);
  };

  // Open detail modal
  const handleOpenDetail = (product: Product) => {
    setSelectedProduct(product);
    setDetailOpen(true);
  };

  // GSAP Animations match media
  useGSAP(() => {
    let mm = gsap.matchMedia();

    // DESKTOP TRIGGER CONFIG (>= 768px)
    mm.add("(min-width: 768px)", () => {
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
        .fromTo(".hero-text-1", { opacity: 0, y: 45, filter: "blur(12px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 })
        .to(".hero-text-1", { opacity: 0, y: -45, filter: "blur(12px)", duration: 1 }, "+=0.7")
        .fromTo(".hero-text-2", { opacity: 0, y: 45, filter: "blur(12px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 })
        .to(".hero-text-2", { opacity: 0, y: -45, filter: "blur(12px)", duration: 1 }, "+=0.7")
        .fromTo(".hero-text-3", { opacity: 0, y: 45, filter: "blur(12px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 })
        .to(".hero-text-3", { opacity: 0, y: -45, filter: "blur(12px)", duration: 1 }, "+=0.7")
        .fromTo(".hero-text-4", { opacity: 0, y: 45, filter: "blur(12px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 })
        .to(".hero-text-4", { opacity: 0, y: -45, filter: "blur(12px)", duration: 1 }, "+=0.7");

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
        .fromTo(".product-reveal-image", { opacity: 0, scale: 0.82, filter: "brightness(0.2) blur(4px)" }, { opacity: 1, scale: 1, filter: "brightness(1) blur(0px)", duration: 1.5, ease: "power2.out" }, "-=0.6")
        .fromTo(".reveal-text-top", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2 }, "-=1.1")
        .fromTo(".reveal-text-bottom", { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 1.2 }, "-=0.8")
        .to({}, { duration: 1.0 });

    });

    // UNIVERSAL HORIZONTAL MUSEUM SCROLL (Active on both Desktop and Mobile)
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
        onUpdate: (self) => {
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${self.progress * 100}%`;
          }
        }
      }
    });

    // Dynamic camera-inspired product entry/exit transitions
    horizontalProducts.forEach((product) => {
      // 1. Incoming Image Scroll Transition (scales up, fades in, shifts depth from right to center)
      gsap.fromTo(`.slide-image-wrapper-${product.id}`,
        {
          scale: 0.92,
          opacity: 0,
          z: -120,
          rotationY: 12,
          transformPerspective: 1000
        },
        {
          scale: 1,
          opacity: 1,
          z: 0,
          rotationY: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: `.slide-container-${product.id}`,
            containerAnimation: horizTween,
            start: "left 95%",
            end: "left 5%",
            scrub: true
          }
        }
      );

      // 2. Outgoing Image Scroll Transition (scales down, depth shifts back, fades as it exits left)
      gsap.to(`.slide-image-wrapper-${product.id}`, {
        scale: 0.96,
        opacity: 0.85,
        z: -60,
        rotationY: -8,
        transformPerspective: 1000,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: `.slide-container-${product.id}`,
          containerAnimation: horizTween,
          start: "right 95%",
          end: "right 5%",
          scrub: true
        }
      });

      // 3. Text Info Panel Incoming Transition
      gsap.fromTo(`.slide-info-${product.id}`,
        {
          opacity: 0,
          x: 80,
          filter: "blur(8px)"
        },
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: `.slide-container-${product.id}`,
            containerAnimation: horizTween,
            start: "left 90%",
            end: "left 15%",
            scrub: true
          }
        }
      );

      // 4. Text Info Panel Outgoing Transition
      gsap.to(`.slide-info-${product.id}`, {
        opacity: 0.2,
        x: -60,
        filter: "blur(4px)",
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: `.slide-container-${product.id}`,
          containerAnimation: horizTween,
          start: "right 85%",
          end: "right 5%",
          scrub: true
        }
      });
    });

    // MOBILE TRIGGER CONFIG (< 767px)
    mm.add("(max-width: 767px)", () => {
      // 1. Hero Pinned scrubbing of 240 frames (shorter scroll, no layout blocking)
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

      // Shorter, snappy mobile hero overlays
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroTriggerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      });

      heroTl
        .fromTo(".hero-text-1", { opacity: 0, y: 30, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 })
        .to(".hero-text-1", { opacity: 0, y: -30, filter: "blur(8px)", duration: 1 }, "+=0.5")
        .fromTo(".hero-text-2", { opacity: 0, y: 30, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 })
        .to(".hero-text-2", { opacity: 0, y: -30, filter: "blur(8px)", duration: 1 }, "+=0.5")
        .fromTo(".hero-text-3", { opacity: 0, y: 30, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 })
        .to(".hero-text-3", { opacity: 0, y: -30, filter: "blur(8px)", duration: 1 }, "+=0.5")
        .fromTo(".hero-text-4", { opacity: 0, y: 30, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 })
        .to(".hero-text-4", { opacity: 0, y: -30, filter: "blur(8px)", duration: 1 }, "+=0.5");

      // 2. Product Reveal scroll trigger (no pinning, scrolls naturally with standard animations)
      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: revealTriggerRef.current,
          start: "top 70%",
          end: "bottom 30%",
          toggleActions: "play none none reverse"
        }
      });

      revealTl
        .fromTo(".reveal-bg-overlay", { opacity: 0 }, { opacity: 1, duration: 0.6 })
        .fromTo(".product-reveal-image", { opacity: 0, scale: 0.9, filter: "brightness(0.5) blur(2px)" }, { opacity: 1, scale: 1, filter: "brightness(1) blur(0px)", duration: 0.8 }, "-=0.3")
        .fromTo(".reveal-text-top", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.6")
        .fromTo(".reveal-text-bottom", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");
    });

    return () => {
      mm.revert();
    };
  }, { scope: scrollWrapperRef });

  // Filter products for predictive search
  const searchedProducts = products.filter(product => {
    const matchesQuery = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.flavorNotes.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.ingredients.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = searchCategory === 'All' || product.category.includes(searchCategory);
    
    // Cacao Filter
    const matchesCacao = !product.cacaoPercentage || product.cacaoPercentage >= searchCacao;
    
    // Price Filter
    const rawPrice = parseInt(product.price.replace(/[^0-9]/g, ''), 10) || 0;
    const matchesPrice = product.price.toLowerCase().includes('demand') || rawPrice <= maxPrice;

    return matchesQuery && matchesCategory && matchesCacao && matchesPrice;
  });

  return (
    <SmoothScroll>
      <div ref={scrollWrapperRef} className="relative w-full bg-brand-black text-brand-cream overflow-x-hidden selection:bg-brand-copper selection:text-brand-black">
        
        {/* Global Luxury Header */}
        <header className="fixed top-0 left-0 w-full flex justify-between items-center px-[6%] py-6 z-50 bg-gradient-to-b from-brand-black/95 to-transparent backdrop-blur-[4px] border-b border-brand-cream/5">
          <div 
            onClick={() => scrollToSection("hero-section")}
            className="font-serif text-sm sm:text-lg md:text-2xl font-light tracking-[0.3em] sm:tracking-[0.45em] text-brand-cream hover:text-brand-gold transition-all duration-700 cursor-pointer select-none"
          >
            MASON & CO
          </div>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-10">
            <button 
              onClick={() => scrollToSection("hero-section")} 
              className="text-[9px] font-sans font-medium uppercase tracking-[0.25em] hover:text-brand-copper transition-colors duration-500 cursor-pointer bg-transparent border-none"
            >
              Origins
            </button>
            <button 
              onClick={() => scrollToSection("product-collection")} 
              className="text-[9px] font-sans font-medium uppercase tracking-[0.25em] hover:text-brand-copper transition-colors duration-500 cursor-pointer bg-transparent border-none"
            >
              Atelier Shop
            </button>
            <button 
              onClick={() => scrollToSection("subscription-section")} 
              className="text-[9px] font-sans font-medium uppercase tracking-[0.25em] hover:text-brand-copper transition-colors duration-500 cursor-pointer bg-transparent border-none"
            >
              Club
            </button>
            <button 
              onClick={() => scrollToSection("gift-section")} 
              className="text-[9px] font-sans font-medium uppercase tracking-[0.25em] hover:text-brand-copper transition-colors duration-500 cursor-pointer bg-transparent border-none"
            >
              Gifting
            </button>
            <button 
              onClick={() => scrollToSection("reviews-section")} 
              className="text-[9px] font-sans font-medium uppercase tracking-[0.25em] hover:text-brand-copper transition-colors duration-500 cursor-pointer bg-transparent border-none"
            >
              Testimonials
            </button>
            <button 
              onClick={() => scrollToSection("about-section")} 
              className="text-[9px] font-sans font-medium uppercase tracking-[0.25em] hover:text-brand-copper transition-colors duration-500 cursor-pointer bg-transparent border-none"
            >
              Heritage
            </button>
            
            {/* Search Icon */}
            <div
              onClick={() => setSearchOpen(true)}
              className="p-2 text-brand-cream/60 hover:text-brand-gold transition-all duration-500 cursor-pointer"
              title="Search curations"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21-21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
              </svg>
            </div>

            {/* Elegant Cart Icon with counter */}
            <div 
              ref={cartIconRef} 
              onClick={() => toggleCart(true)}
              className="relative p-2 hover:text-brand-gold transition-all duration-500 cursor-pointer pointer-events-auto"
              aria-label="View Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-copper text-brand-black text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-sans">
                  {itemCount}
                </span>
              )}
            </div>
          </nav>

          {/* Mobile Right Controls: Hamburger + Cart + Search */}
          <div className="flex md:hidden items-center gap-2">
            <div
              onClick={() => setSearchOpen(true)}
              className="p-2 text-brand-cream hover:text-brand-gold transition-all duration-500 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21-21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
              </svg>
            </div>

            <div 
              onClick={() => toggleCart(true)}
              className="relative p-2 hover:text-brand-gold transition-all duration-500 cursor-pointer pointer-events-auto z-50 flex text-brand-cream"
              aria-label="View Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-copper text-brand-black text-[8px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center font-sans">
                  {itemCount}
                </span>
              )}
            </div>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex flex-col gap-1.5 cursor-pointer z-50 bg-transparent border-none p-2 focus:outline-none"
              aria-label="Toggle Menu"
            >
              <span className={`w-6 h-[1px] bg-brand-cream transition-all duration-500 ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
              <span className={`w-6 h-[1px] bg-brand-cream transition-all duration-500 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-[1px] bg-brand-cream transition-all duration-500 ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Fullscreen Overlay Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 w-full h-dvh bg-brand-black/98 z-40 flex flex-col justify-between p-8 pt-24 pb-12 md:hidden pointer-events-auto backdrop-blur-xl"
            >
              <div className="flex flex-col gap-6 text-left pl-4 mt-8">
                {[
                  { name: "Origins", id: "hero-section", num: "01" },
                  { name: "Spotlight", id: "product-reveal", num: "02" },
                  { name: "Atelier Shop", id: "product-collection", num: "03" },
                  { name: "Terroir Club", id: "subscription-section", num: "04" },
                  { name: "Gifting Suite", id: "gift-section", num: "05" },
                  { name: "Heritage", id: "about-section", num: "06" },
                ].map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-baseline gap-4 group cursor-pointer"
                    onClick={() => { setMobileMenuOpen(false); scrollToSection(item.id); }}
                  >
                    <span className="font-serif text-brand-copper text-xs italic">{item.num}</span>
                    <span className="font-serif text-3xl font-light tracking-wider text-brand-cream group-hover:text-brand-gold transition-colors duration-300">
                      {item.name}
                    </span>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-baseline gap-4 mt-4 pt-6 border-t border-brand-cream/10 cursor-pointer"
                  onClick={() => { setMobileMenuOpen(false); toggleCart(true); }}
                >
                  <span className="font-serif text-brand-copper text-xs italic">07</span>
                  <span className="font-serif text-2xl font-light tracking-wider text-brand-gold flex items-center gap-2">
                    Cart Collection ({itemCount})
                  </span>
                </motion.div>
              </div>

              <div className="border-t border-brand-cream/5 pt-6 pl-4 flex flex-col gap-2 text-[9px] font-sans tracking-widest text-brand-cream/40 uppercase">
                <span>Coordinates: 11.9416° N, 79.8083° E</span>
                <span>Western Ghats, India</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECTION 1: HERO PINNED IMAGE SEQUENCE */}
        <div id="hero-section" ref={heroTriggerRef} className="relative w-full h-[180vh] md:h-[300vh] bg-brand-black">
          <div className="sticky top-0 left-0 w-full h-dvh md:h-screen overflow-hidden flex items-center justify-center">
            
            <HeroSequenceCanvas scrollProgress={heroProgress} />
            
            <div className="absolute inset-0 flex flex-col justify-end pb-32 md:pb-0 md:justify-center items-center text-center px-6 z-10 pointer-events-none">
              
              <div className="hero-text-1 absolute max-w-[850px] opacity-0 translate-y-[45px] filter blur-[12px]">
                <h1 className="font-serif leading-none tracking-tight font-extralight text-brand-cream text-[clamp(1.75rem,6vw,4.5rem)]">
                  FROM SOUTH INDIAN SOIL
                </h1>
                <p className="mt-5 text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-brand-cream/50 font-sans">
                  A single-origin narrative born from monsoon mist
                </p>
              </div>

              <div className="hero-text-2 absolute max-w-[850px] opacity-0 translate-y-[45px] filter blur-[12px]">
                <h1 className="font-serif leading-none tracking-tight font-extralight text-brand-cream text-[clamp(1.75rem,6vw,4.5rem)]">
                  EVERY BEAN HAS A STORY
                </h1>
                <p className="mt-5 text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-brand-cream/50 font-sans">
                  Nourished in the shadows of wild Western Ghats
                </p>
              </div>

              <div className="hero-text-3 absolute max-w-[850px] opacity-0 translate-y-[45px] filter blur-[12px]">
                <h1 className="font-serif leading-none tracking-tight font-extralight text-brand-cream text-[clamp(1.75rem,6vw,4.5rem)]">
                  CRAFTED BY HAND
                </h1>
                <p className="mt-5 text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-brand-cream/50 font-sans">
                  Honoring traditional techniques and careful selection
                </p>
              </div>

              <div className="hero-text-4 absolute max-w-[850px] opacity-0 translate-y-[45px] filter blur-[12px]">
                <h1 className="font-serif leading-none tracking-tight font-extralight text-brand-cream text-[clamp(1.75rem,6vw,4.5rem)]">
                  EXTRAORDINARY CHOCOLATE
                </h1>
                <p className="mt-5 text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-brand-cream/50 font-sans">
                  Designed for sensory elevation
                </p>
              </div>

            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none opacity-60">
              <span className="relative w-4 h-8 border border-brand-cream/20 rounded-none">
                <span className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-2.5 bg-brand-gold rounded-none animate-scroll-wheel"></span>
              </span>
              <span className="text-[8px] uppercase tracking-[0.25em] text-brand-cream/40 font-sans">Scroll to Begin</span>
            </div>

          </div>
        </div>

        {/* SECTION 2: DEDICATED PRODUCT REVEAL */}
        <div 
          id="product-reveal" 
          ref={revealTriggerRef} 
          className="relative w-full h-auto py-16 md:py-0 md:h-[200vh] bg-brand-black overflow-hidden"
          onMouseMove={handleRevealMouseMove}
          onMouseLeave={handleRevealMouseLeave}
        >
          <div className="reveal-bg-overlay absolute inset-0 bg-[#060606] z-0 pointer-events-none" />
          
          <div className="relative md:sticky md:top-0 min-h-dvh w-full flex flex-col md:flex-row justify-center items-center z-10 px-[8%] py-12 md:py-0 gap-8 md:gap-20">
            
            {/* Left Column: Spotlight Product Photo */}
            <div className="relative z-10 w-full md:w-1/2 h-auto md:h-full flex items-center justify-center">
              <div 
                className="transition-transform duration-[1200ms] ease-out-expo select-none"
                style={{ transform: `translate(${revealParallax.x}px, ${revealParallax.y}px)` }}
              >
                <img 
                  src="/images/product_dark.png" 
                  alt="Mason & Co Signature Bar" 
                  className="product-reveal-image w-auto max-h-[40vh] md:max-h-[72vh] object-contain drop-shadow-[0_40px_75px_rgba(0,0,0,0.95)] opacity-0 z-10 relative"
                />
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,124,78,0.16)_0%,transparent_60%)] pointer-events-none z-0"></div>
            </div>

            {/* Right Column: Editorial Reveal Statement */}
            <div className="w-full md:w-1/2 flex flex-col justify-center text-left max-w-[500px] z-10 px-4 md:px-0">
              <div className="reveal-text-top opacity-0 translate-y-8 mb-6 sm:mb-8">
                <span className="text-[8px] font-sans font-semibold uppercase tracking-[0.35em] text-brand-copper">THE REVEAL</span>
                <h2 className="font-serif text-[clamp(1.75rem,5vw,3.75rem)] font-light text-brand-cream leading-tight mt-3">
                  THE SIGNATURE <br />
                  <span className="italic text-brand-gold">SEVENTY-FIVE.</span>
                </h2>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-brand-copper font-medium font-sans">A monument to single origin cacao</p>
              </div>
              <div className="reveal-text-bottom opacity-0 translate-y-8">
                <div className="w-16 h-[1px] bg-brand-copper/30 mb-6" />
                <p className="text-xs sm:text-sm font-sans font-light text-brand-cream/70 leading-relaxed mb-6">
                  The plantation story concludes. The bean transformation is complete. Inside our organic wrapping lies the pure expression of Western Ghats soil. Micro-batch roasted, stone-ground for 72 hours, and presented with absolute clarity.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => handleAddToCart("dark", "/images/product_dark.png")}
                    className="relative w-full sm:w-auto h-12 px-8 text-[9px] font-sans font-bold uppercase tracking-[0.25em] text-brand-black bg-brand-copper border border-brand-copper hover:bg-transparent hover:text-brand-copper hover:shadow-[0_0_15px_rgba(198,124,78,0.2)] transition-all duration-500 ease-out-expo cursor-pointer focus:outline-none overflow-hidden active:scale-95 flex items-center justify-center gap-2 group/btn"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-[1.2s] ease-out-expo pointer-events-none" />
                    Add To Collection
                  </button>
                  <button 
                    onClick={() => {
                      const sigDark = products.find(p => p.id === 'sig-dark-75');
                      if (sigDark) handleOpenDetail(sigDark);
                    }}
                    className="relative w-full sm:w-auto h-12 px-8 text-[9px] font-sans font-bold uppercase tracking-[0.25em] text-brand-cream bg-transparent border border-brand-cream/20 hover:border-brand-copper hover:text-brand-copper transition-all duration-500 ease-out-expo cursor-pointer focus:outline-none overflow-hidden active:scale-95 flex items-center justify-center gap-2 group/btn"
                  >
                    <span className="absolute inset-0 bg-brand-copper/5 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-[600ms] ease-out-expo pointer-events-none" />
                    Tasting Dossier
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 3: CINEMATIC MUSEUM HORIZONTAL SCROLL */}
        <div id="museum-collection" ref={horizontalTriggerRef} className="relative bg-[#060606]">
          <div className="relative sticky top-0 left-0 w-screen h-screen overflow-hidden">
            <div ref={horizontalTrackRef} className="flex flex-row h-full w-[500vw]">
              {horizontalProducts.map((product) => (
                <div 
                  key={product.id}
                  className={`slide-container-${product.id} w-screen h-full flex-shrink-0 flex flex-col md:flex-row bg-[#060606] text-brand-cream border-r border-brand-cream/5 relative group`}
                >
                  {/* Left Side: Product Portrait Presentation with Depth Shift & Lift */}
                  <div className="w-full md:w-1/2 h-[45dvh] md:h-full flex items-center justify-center relative bg-[#040404] p-6 md:p-12 overflow-hidden">
                    <div className={`slide-image-wrapper-${product.id} w-full h-full flex items-center justify-center`}>
                      <div className={`slide-image-${product.id} transition-all duration-[800ms] ease-out-expo group-hover:-translate-y-3.5 group-hover:rotate-1 group-hover:scale-[1.03] flex items-center justify-center w-full h-full`}>
                        <img 
                          src={product.image}
                          alt={product.title}
                          className={`product-img-${product.id} max-h-[35vh] md:max-h-[60vh] w-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)] group-hover:drop-shadow-[0_35px_65px_rgba(0,0,0,0.95)] z-10 relative`}
                        />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-brand-cream/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2.2s] ease-out-expo z-25 pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(26,18,11,0.45)_0%,transparent_75%)] pointer-events-none" />
                  </div>

                  {/* Right Side: Editorial Grid & Details */}
                  <div className={`slide-info-${product.id} w-full md:w-1/2 h-[55dvh] md:h-full flex flex-col justify-center p-6 sm:p-10 md:p-[8%] bg-brand-black md:overflow-y-auto text-left`}>
                    <span className="text-[8px] font-sans font-semibold uppercase tracking-[0.35em] text-brand-copper mb-2 block">
                      {product.subtitle}
                    </span>
                    <h3 className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] font-light text-brand-cream leading-tight mb-4">
                      {product.title}
                    </h3>
                    
                    <div className="w-12 h-[1px] bg-brand-copper/30 mb-6" />

                    <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 mb-6 text-[10px] font-sans font-light">
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-brand-copper/70 block mb-1 font-medium font-sans">Origin</span>
                        <span className="text-brand-cream/80">{product.origin}</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-brand-copper/70 block mb-1 font-medium font-sans">Flavor Notes</span>
                        <span className="text-brand-cream/80">{product.flavorNotes}</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-brand-copper/70 block mb-1 font-medium font-sans">Weight</span>
                        <span className="text-brand-cream/80">{product.weight}</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-brand-copper/70 block mb-1 font-medium font-sans">Price</span>
                        <span className="text-brand-gold font-medium font-sans">{product.price}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[8px] uppercase tracking-wider text-brand-copper/70 block mb-1 font-medium font-sans">Ingredients</span>
                        <span className="text-brand-cream/80 leading-normal">{product.ingredients}</span>
                      </div>
                    </div>

                    <div className="border-t border-brand-cream/10 pt-4 mt-2 mb-6 hidden sm:block">
                      <p className="text-xs text-brand-cream/60 leading-relaxed font-sans font-light italic">
                        &ldquo;{product.story}&rdquo;
                      </p>
                    </div>

                    <div className="flex flex-row gap-3">
                      {/* Premium Acquire Button with sweeping light effect */}
                      <button 
                        onClick={() => handleAddToCart(product.id, product.image)}
                        className="relative h-12 px-6 text-[9px] font-sans font-bold uppercase tracking-[0.25em] text-brand-black bg-brand-copper border border-brand-copper hover:bg-transparent hover:text-brand-copper hover:shadow-[0_0_15px_rgba(198,124,78,0.2)] transition-all duration-500 ease-out-expo cursor-pointer focus:outline-none overflow-hidden active:scale-95 flex items-center justify-center gap-2 group/btn"
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-[1.2s] ease-out-expo pointer-events-none" />
                        Acquire Curation
                      </button>

                      {/* Premium hollow Inspect Button with up-sweep cover */}
                      <button 
                        onClick={() => handleOpenDetail(product)}
                        className="relative h-12 px-6 text-[9px] font-sans font-bold uppercase tracking-[0.25em] text-brand-cream bg-transparent border border-brand-cream/20 hover:border-brand-copper hover:text-brand-copper transition-all duration-500 ease-out-expo cursor-pointer focus:outline-none overflow-hidden active:scale-95 flex items-center justify-center gap-2 group/btn"
                      >
                        <span className="absolute inset-0 bg-brand-copper/5 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-[600ms] ease-out-expo pointer-events-none" />
                        Inspect Dossier
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-6 md:bottom-12 left-[8%] right-[8%] h-[1px] bg-brand-cream/10 z-30 pointer-events-none">
              <div ref={progressBarRef} className="h-[2px] bg-brand-copper scroll-progress-line absolute top-[-0.5px] left-0 w-0" />
            </div>
          </div>
        </div>

        {/* SECTION 4: FULL PRODUCT CATALOG BROWSER */}
        <ProductCatalog 
          onOpenDetail={handleOpenDetail}
          onAddToCompare={handleAddToCompare}
          comparedIds={comparedProducts.map(p => p.id)}
        />

        {/* SECTION 5: SUBSCRIPTION SUITE */}
        <SubscriptionSuite />

        {/* SECTION 6: CUSTOMER REVIEWS (Luxury Testimonial masonry) */}
        <div id="reviews-section" className="relative w-full py-24 bg-brand-black px-[6%] border-t border-brand-cream/5 text-left text-brand-cream">
          <div className="max-w-[1200px] mx-auto space-y-16">
            <div className="text-center space-y-4">
              <span className="text-[8px] font-sans font-semibold uppercase tracking-[0.35em] text-brand-copper block">Atelier Feedbacks</span>
              <h2 className="font-serif text-3xl md:text-5xl font-light text-brand-cream">Certified Collector Reviews</h2>
              <div className="w-16 h-[1px] bg-brand-copper/30 mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
              {[
                {
                  author: "Aditya Roy",
                  rating: 5,
                  verify: true,
                  text: "The Signature 75% represents a turning point for Indian craft chocolate. Incredible clarity of cherry flavor, stone-ground texture is silken.",
                  origin: "Collector from Mumbai"
                },
                {
                  author: "Elena Petrova",
                  rating: 5,
                  verify: true,
                  text: "Bespoke packaging, meticulous design. The Anaimalai 85% oolong tea undertones are complex and magnificent. Pairs perfectly with single malts.",
                  origin: "Sommelier from St. Petersburg"
                },
                {
                  author: "Preeti Nair",
                  rating: 5,
                  verify: true,
                  text: "The monthly chocolate club subscription has been a revelation. We receive experimental small batches every month. Zero delay, absolute luxury.",
                  origin: "Monthly Club Member"
                },
                {
                  author: "Charles M.",
                  rating: 4,
                  verify: true,
                  text: "Clean ingredients, zero artificial emulsifiers. The Malabar Coast milk chocolate balances sweetness with rich cacao notes beautifully.",
                  origin: "Collector from Bangalore"
                },
                {
                  author: "Nisha Vasan",
                  rating: 5,
                  verify: false,
                  text: "Our corporate team was deeply impressed with the Custom Logo Branded boxes. Beautiful gold lettering, outstanding micro-batch quality.",
                  origin: "VP at Axis Capital"
                },
                {
                  author: "Karan Johar",
                  rating: 5,
                  verify: true,
                  text: "The Damask Rose & Pistachio white bar is floral and decadent. Housed in a gorgeous rigid black box, it makes the ultimate gesture of taste.",
                  origin: "Holiday Collector"
                }
              ].map((rev, idx) => (
                <div key={idx} className="bg-[#0A0A0A] border border-brand-cream/5 p-6 space-y-4 flex flex-col justify-between hover:border-brand-copper/20 transition-all duration-500">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-serif text-sm font-light text-brand-cream">{rev.author}</span>
                      <div className="text-brand-gold text-[9px] font-mono">
                        {"★".repeat(rev.rating)}
                      </div>
                    </div>
                    {rev.verify && (
                      <span className="text-[7px] border border-brand-gold/30 px-1.5 py-0.5 rounded-none font-mono text-brand-gold uppercase tracking-wider bg-brand-gold/5 inline-block">
                        Verified Purchase
                      </span>
                    )}
                    <p className="text-[11px] font-sans font-light leading-relaxed text-brand-cream/70 italic">
                      &ldquo;{rev.text}&rdquo;
                    </p>
                  </div>
                  <div className="text-[8px] font-mono text-brand-cream/40 uppercase tracking-widest pt-3 border-t border-brand-cream/5">
                    {rev.origin}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 7: CORPORATE GIFTING SUITE */}
        <CorporateGifting />

        {/* SECTION 8: ABOUT SECTION (ASYMMETRICAL EDITORIAL GRID) */}
        <div id="about-section" className="relative w-full py-32 bg-brand-black px-[8%] border-t border-brand-cream/5">
          <div className="max-w-[1200px] mx-auto">
            
            <div className="text-center mb-24">
              <span className="text-[8px] font-sans font-semibold uppercase tracking-[0.35em] text-brand-copper mb-3 block">HERITAGE</span>
              <h2 className="font-serif text-3xl md:text-5xl font-light text-brand-cream">Artisan Sourcing & Craft</h2>
              <div className="w-16 h-[1px] bg-brand-copper/30 mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-24 md:gap-x-16">
              
              {/* Left Column */}
              <div className="md:col-span-5 flex flex-col justify-start">
                <div className="editorial-image-frame aspect-[10/13] bg-[#030303] border border-brand-cream/5 mb-8">
                  <img 
                    src="/images/about_plantation.png" 
                    alt="Western Ghats Cacao Plantation" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="text-left max-w-[420px]">
                  <span className="text-[8px] font-sans font-semibold uppercase tracking-[0.35em] text-brand-copper mb-3 block">01 / THE ESTATES</span>
                  <h3 className="font-serif text-2xl md:text-3xl font-light text-brand-cream mb-4">Western Ghats Shadows</h3>
                  <p className="text-xs md:text-sm font-sans font-light text-brand-cream/65 leading-relaxed mb-4">
                    Our organic cacao grows under a canopy of coconut, pepper, and banana trees in Southern India. This agroforest ecosystem naturally shades the pods, allowing the sugars in the pulp to mature slowly, creating deep cherry and honey notes.
                  </p>
                  <p className="text-xs md:text-sm font-sans font-light text-brand-cream/65 leading-relaxed">
                    By partnering directly with small, multi-generational farming families, we ensure sustainable land management, fair wages, and an authentic single-origin narrative in every bite.
                  </p>
                  <div className="mt-6">
                    <button 
                      onClick={() => scrollToSection("hero-section")}
                      className="text-[9px] font-sans uppercase tracking-[0.25em] text-brand-cream border-b border-brand-copper pb-1 hover:text-brand-gold hover:border-brand-gold transition-all duration-500 bg-transparent border-none cursor-pointer"
                    >
                      Discover Origins
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="md:col-span-7 flex flex-col justify-start md:pt-32">
                <div className="editorial-image-frame aspect-[16/10] bg-[#030303] border border-brand-cream/5 mb-8">
                  <img 
                    src="/images/about_artisan.png" 
                    alt="Artisan wrapping chocolate" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="text-left max-w-[550px] md:pl-8">
                  <span className="text-[8px] font-sans font-semibold uppercase tracking-[0.35em] text-brand-copper mb-3 block font-sans">02 / THE WORKSHOP</span>
                  <h3 className="font-serif text-2xl md:text-3xl font-light text-brand-cream mb-4 font-serif">Wrapped by Hand</h3>
                  <p className="text-xs md:text-sm font-sans font-light text-brand-cream/65 leading-relaxed mb-4 font-sans">
                    In our clean workspace, we process the beans in micro-batches. Continuous stone grinding for 72 hours refines the texture until it reaches a perfect, silky viscosity.
                  </p>
                  <p className="text-xs md:text-sm font-sans font-light text-brand-cream/65 leading-relaxed mb-6 font-sans">
                    Once tempered, each individual bar is wrapped carefully in gold foil and textured recycled paper by local female artisans. A slow, meditative process that rejects corporate automation in favor of human touch and local community empowerment.
                  </p>
                  <div>
                    <button 
                      onClick={() => scrollToSection("product-collection")}
                      className="relative w-full sm:w-auto h-12 px-8 text-[9px] font-sans font-bold uppercase tracking-[0.25em] text-brand-black bg-brand-cream border border-brand-cream hover:bg-transparent hover:text-brand-cream transition-all duration-500 ease-out-expo cursor-pointer focus:outline-none overflow-hidden active:scale-95 flex items-center justify-center gap-2 group/btn"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-[1.2s] ease-out-expo pointer-events-none" />
                      Explore Collection
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* SECTION 9: FOOTER */}
        <footer className="relative w-full py-20 bg-[#040404] px-[8%] border-t border-brand-cream/5 text-[11px] font-sans font-light text-brand-cream/40">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between gap-16">
            
            <div className="flex flex-col gap-4 text-left">
              <span className="font-serif text-xl tracking-[0.3em] text-brand-cream">MASON & CO</span>
              <p className="max-w-[280px] leading-relaxed text-brand-cream/35 font-sans">
                Crafting fine organic single-origin chocolate from the Western Ghats. Honoring soil, community, and time.
              </p>
            </div>

            <div className="flex gap-20 text-left">
              <div className="flex flex-col gap-3.5">
                <span className="text-[8px] uppercase tracking-widest text-brand-copper font-medium font-sans">Explore</span>
                <button onClick={() => scrollToSection("hero-section")} className="hover:text-brand-cream transition-colors text-left bg-transparent border-none cursor-pointer font-sans font-light text-[11px]">Estates</button>
                <button onClick={() => scrollToSection("product-collection")} className="hover:text-brand-cream transition-colors text-left bg-transparent border-none cursor-pointer font-sans font-light text-[11px]">Collection</button>
                <button onClick={() => scrollToSection("gift-section")} className="hover:text-brand-cream transition-colors text-left bg-transparent border-none cursor-pointer font-sans font-light text-[11px]">Gifting</button>
              </div>
              
              <div className="flex flex-col gap-3.5 font-sans">
                <span className="text-[8px] uppercase tracking-widest text-brand-copper font-medium">Estates</span>
                <span>Western Ghats, India</span>
                <span>Malabar Coast, India</span>
                <span>Anaimalai Hills, India</span>
              </div>
              
              <div className="flex flex-col gap-3.5">
                <span className="text-[8px] uppercase tracking-widest text-brand-copper font-medium font-sans">Atelier Node</span>
                <button 
                  onClick={() => setAdminOpen(true)}
                  className="text-left text-brand-gold hover:text-brand-cream bg-transparent border-none cursor-pointer font-sans font-light text-[11px] uppercase tracking-wider"
                >
                  ⚡ System Console
                </button>
                <a href="#" className="hover:text-brand-cream transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-brand-cream transition-colors">Shipping & Returns</a>
              </div>
            </div>

          </div>

          <div className="max-w-[1200px] mx-auto mt-20 pt-8 border-t border-brand-cream/5 flex flex-col md:flex-row justify-between items-center gap-4 text-brand-cream/25">
            <span>© {new Date().getFullYear()} Mason & Co. All rights reserved.</span>
            <span>Handcrafted with purpose.</span>
          </div>
        </footer>

        {/* Floating Mobile Cart Trigger button */}
        {itemCount > 0 && (
          <div className="fixed bottom-6 right-6 z-40 md:hidden animate-scale-in">
            <button
              onClick={() => toggleCart(true)}
              className="w-14 h-14 bg-brand-copper hover:bg-brand-gold text-brand-black rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(198,124,78,0.35)] border border-brand-cream/10 cursor-pointer focus:outline-none relative select-none"
              aria-label="Open Cart Collection"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-brand-cream text-brand-black text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md border border-brand-copper font-sans">
                {itemCount}
              </span>
            </button>
          </div>
        )}

        {/* PREDICTIVE SEARCH FULLSCREEN OVERLAY */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 w-full h-screen bg-black/95 z-55 flex flex-col justify-start p-8 md:p-20 text-left backdrop-blur-xl"
            >
              <div className="max-w-[800px] w-full mx-auto space-y-8">
                
                {/* Search Header Input bar */}
                <div className="flex justify-between items-center border-b border-brand-cream/20 pb-4">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search by flavor, origin, or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none text-2xl md:text-3xl font-serif text-brand-cream focus:outline-none placeholder-brand-cream/35 flex-1"
                  />
                  <button
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="p-2 text-brand-cream/50 hover:text-brand-cream bg-transparent border-none cursor-pointer focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[10px] font-sans font-light">
                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-widest text-brand-copper block">Category</label>
                    <select
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      className="w-full bg-[#080808] border border-brand-cream/10 px-3 py-2 text-brand-cream focus:outline-none focus:border-brand-copper"
                    >
                      <option value="All">All Categories</option>
                      <option value="Dark Chocolate">Dark Chocolate</option>
                      <option value="Milk Chocolate">Milk Chocolate</option>
                      <option value="Single Origin">Single Origin</option>
                      <option value="Limited Editions">Limited Editions</option>
                      <option value="Gift Boxes">Gift Boxes</option>
                      <option value="Subscriptions">Subscriptions</option>
                    </select>
                  </div>

                  {/* Cacao slider */}
                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-widest text-brand-copper block flex justify-between">
                      <span>Min Cacao Intensity</span>
                      <span className="font-mono text-brand-gold">{searchCacao}%</span>
                    </label>
                    <input
                      type="range"
                      min={30}
                      max={90}
                      value={searchCacao}
                      onChange={(e) => setSearchCacao(parseInt(e.target.value))}
                      className="w-full accent-brand-copper bg-brand-cream/10 h-1 cursor-pointer"
                    />
                  </div>

                  {/* Price slider */}
                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-widest text-brand-copper block flex justify-between">
                      <span>Max Budget</span>
                      <span className="font-mono text-brand-gold">₹{maxPrice}</span>
                    </label>
                    <input
                      type="range"
                      min={300}
                      max={3000}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                      className="w-full accent-brand-copper bg-brand-cream/10 h-1 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Autocomplete Predictions Panel */}
                <div className="space-y-4">
                  <span className="text-[8px] uppercase tracking-widest text-brand-cream/35 block">
                    Catalog Predictions ({searchedProducts.length} matches)
                  </span>

                  <div className="max-h-[50vh] overflow-y-auto divide-y divide-brand-cream/5 scrollbar-thin space-y-4">
                    {searchedProducts.length === 0 ? (
                      <p className="text-xs text-brand-cream/40 italic font-sans py-4">No matching specimens found in our active inventory range.</p>
                    ) : (
                      searchedProducts.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            setSearchOpen(false);
                            handleOpenDetail(product);
                          }}
                          className="flex justify-between items-center py-3 hover:bg-brand-cream/[0.02] px-2 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-4 text-left">
                            <div className="w-10 h-10 bg-black flex items-center justify-center border border-brand-cream/5 overflow-hidden p-1">
                              <img src={product.image} className="max-h-full object-contain" alt="" />
                            </div>
                            <div>
                              <h4 className="font-serif text-sm text-brand-cream group-hover:text-brand-gold transition-colors">{product.title}</h4>
                              <p className="text-[8px] font-sans text-brand-cream/45 uppercase tracking-wider">{product.subtitle}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs text-brand-gold font-mono">{product.price}</span>
                            <span className="block text-[7px] text-brand-cream/30 uppercase tracking-widest mt-0.5">{product.origin}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient Synthesized Forest Audio Controller */}
        <AmbientAudio />

        {/* Sliding Luxury Cart Drawer */}
        <CartDrawer />

        {/* SPECIMEN DETAIL MODAL */}
        <ProductDetailModal
          product={selectedProduct}
          isOpen={detailOpen}
          onClose={() => { setDetailOpen(false); setSelectedProduct(null); }}
          onAddToCompare={handleAddToCompare}
          comparedIds={comparedProducts.map(p => p.id)}
        />

        {/* COMPARE SPECIMENS DRAWER */}
        <ProductCompareDrawer
          comparedProducts={comparedProducts}
          isOpen={compareOpen && comparedProducts.length > 0}
          onClose={() => setCompareOpen(false)}
          onRemove={handleRemoveCompare}
          onClear={handleClearCompare}
        />

        {/* ATELIER CONTROL CONSOLE */}
        <AtelierAdmin
          isOpen={adminOpen}
          onClose={() => setAdminOpen(false)}
        />

      </div>
    </SmoothScroll>
  );
}
