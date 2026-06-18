"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CinematicImage from "../CinematicImage";

interface TimelineStep {
  number: string;
  stage: string;
  title: string;
  description: string;
  imageAlt: string;
}

export default function StoryTimeline() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollSectionRef = useRef<HTMLDivElement | null>(null);

  const steps: TimelineStep[] = [
    {
      number: "01",
      stage: "Ethical Sourcing",
      title: "Handpicked Indian Beans",
      description:
        "We partner directly with organic estate farms in Andhra Pradesh and the Malabar Coast, sourcing premium Trinitario cacao beans at above-market prices.",
      imageAlt: "Organic Cacao Farm Harvesting",
    },
    {
      number: "02",
      stage: "Small-Batch Roasting",
      title: "Unlocking Flavor Profiles",
      description:
        "Each origin bean is precision roasted at our Okhla factory to draw out its individual notes of red fruit, roasted nuts, or subtle earthiness.",
      imageAlt: "Precision Cocoa Bean Roasting Process",
    },
    {
      number: "03",
      stage: "Winnowing & Cracking",
      title: "Releasing Cacao Nibs",
      description:
        "The roasted beans are gently cracked open. A custom wind chamber separates the thin, papery husks from the rich, aromatic cacao nibs.",
      imageAlt: "Winnowing Process Separating Shells",
    },
    {
      number: "04",
      stage: "Stone Grinding & Conching",
      title: "72 Hours of Perfection",
      description:
        "The nibs are stone-ground with unrefined cane sugar for up to 72 hours, conching to aerate and reduce acidity for a micro-smooth texture.",
      imageAlt: "Slow Stone Grinder Conching Chocolate",
    },
    {
      number: "05",
      stage: "Tempering & Molding",
      title: "The Signature Snap",
      description:
        "The glossy, liquid chocolate is tempered to perfectly align crystals, creating a glossy finish, clean snap, and smooth melt.",
      imageAlt: "Tempered Glossy Chocolate Molds",
    },
  ];

  useGSAP(
    () => {
      // Register ScrollTrigger inside useGSAP context
      gsap.registerPlugin(ScrollTrigger);

      if (!scrollSectionRef.current) return;

      const sections = gsap.utils.toArray(".timeline-card");
      const amountToScroll = scrollSectionRef.current.offsetWidth - window.innerWidth;

      if (amountToScroll <= 0) return;

      const pinTrigger = gsap.to(scrollSectionRef.current, {
        x: -amountToScroll,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => {
            const isMobile = window.innerWidth < 768;
            return `+=${amountToScroll * (isMobile ? 0.75 : 1.2)}`;
          },
          invalidateOnRefresh: true,
        },
      });

      // Animate line filler on scroll
      gsap.fromTo(
        ".timeline-line-filler",
        { width: "0%" },
        {
          width: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => {
              const isMobile = window.innerWidth < 768;
              return `+=${amountToScroll * (isMobile ? 0.75 : 1.2)}`;
            },
            scrub: 0.5,
          },
        }
      );

      return () => {
        pinTrigger.scrollTrigger?.kill();
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} id="story" className="relative bg-[#090605]">
      {/* Horizontal Scroll wrapper */}
      <div className="relative h-[65svh] md:h-screen overflow-hidden flex items-center">
        {/* Dynamic dark radial overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(29,18,15,0.2),transparent_70%)] pointer-events-none z-10" />

        <div
          ref={scrollSectionRef}
          className="flex flex-nowrap items-center px-6 md:px-24 h-full relative z-20"
          style={{ width: "fit-content" }}
        >
          {/* Static Title Card inside horizontal slide */}
          <div className="w-[80vw] md:w-[45vw] flex-shrink-0 flex flex-col justify-center pr-6 md:pr-16 select-none">
            <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.4em] text-[#d4af37]">
              Our Craft
            </span>
            <h2 className="font-serif text-3xl md:text-6xl font-bold tracking-tight text-[#f8eadc] mt-2 md:mt-4 leading-tight font-serif">
              The <br />
              <span className="italic text-gold-gradient">Bean-To-Bar</span> <br />
              Journey.
            </h2>
            <p className="text-[#c8b5a4] text-xs md:text-sm mt-3 md:mt-6 font-light leading-relaxed max-w-sm">
              We guide every single step of the process. Swipe or scroll down to trace how a raw cacao pod becomes a luxury chocolate bar.
            </p>
            {/* Scroll progress tracking bar */}
            <div className="relative w-32 md:w-40 h-[2px] bg-[#34211a] mt-6 md:mt-12 rounded-full overflow-hidden">
              <div className="timeline-line-filler absolute top-0 left-0 h-full w-0 bg-gradient-to-r from-[#e5ad6b] to-[#c58c48]" />
            </div>
          </div>

          {/* Timeline Cards */}
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="timeline-card w-[85vw] md:w-[65vw] flex-shrink-0 mr-8 md:mr-24 flex flex-col justify-center h-[55svh] md:h-[85vh] relative"
            >
              {/* Aspect ratio frame 21:9 for immersive story */}
              <div className="w-full relative rounded-md overflow-hidden border border-[#c58c48]/15 bg-[#140d0b]">
                <CinematicImage
                  alt={step.imageAlt}
                  aspectRatio="21:9"
                  effectType="story"
                  className="w-full"
                />

                {/* Left/right border lines */}
                <div className="absolute top-0 bottom-0 left-8 md:left-12 w-[1px] bg-gradient-to-b from-transparent via-[#e5ad6b]/15 to-transparent z-10" />
              </div>

              {/* Text Meta Info */}
              <div className="mt-4 md:mt-8 grid grid-cols-[60px_1fr] md:grid-cols-[100px_1fr] items-start gap-3 md:gap-4">
                <span className="font-serif text-2xl md:text-5xl font-bold italic text-[#d4af37]/50 tracking-wide">
                  {step.number}
                </span>
                <div>
                  <span className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
                    {step.stage}
                  </span>
                  <h3 className="font-serif text-lg md:text-2xl text-[#f8eadc] mt-0.5 md:mt-1 font-medium">
                    {step.title}
                  </h3>
                  <p className="text-[#c8b5a4]/90 text-[11px] md:text-sm font-light mt-1.5 md:mt-3 leading-relaxed max-w-2xl">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* End Card */}
          <div className="w-[60vw] md:w-[35vw] flex-shrink-0 flex flex-col justify-center pl-4 md:pl-8">
            <h3 className="font-serif text-2xl md:text-4xl text-[#f8eadc] leading-tight">
              A Ritual of <br />
              <span className="text-gold-gradient italic">Pure Indulgence.</span>
            </h3>
            <p className="text-[#c8b5a4] text-xs md:text-sm mt-2 md:mt-4 font-light leading-relaxed max-w-xs">
              No soy lecithin, no artificial vanilla, no shortcuts. Just pure cacao and raw sugar.
            </p>
            <a
              href="#collection"
              className="mt-4 md:mt-8 self-start text-[10px] uppercase tracking-[0.25em] font-semibold text-[#e5ad6b] hover:text-[#f8eadc] transition-colors duration-300"
            >
              Indulge Now &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
