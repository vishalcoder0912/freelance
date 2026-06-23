import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Scene3D from "./Scene3D";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null!);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          gsap.to(ref.current, {
            innerText: target,
            duration: 2,
            ease: "power2.out",
            snap: { innerText: 1 },
          });
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <span ref={ref}>
      0{suffix}
    </span>
  );
}

function MagneticButton({ children, href }: { children: React.ReactNode; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null!);

  const onMove = useCallback((e: React.MouseEvent) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(ref.current, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
  }, []);

  const onLeave = useCallback(() => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-block"
    >
      {children}
    </a>
  );
}

export default function Hero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const titleRef = useRef<HTMLHeadingElement>(null!);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      setMouse({ x: (e.clientX / window.innerWidth) * 2 - 1, y: -(e.clientY / window.innerHeight) * 2 + 1 });
    };
    window.addEventListener("mousemove", onMouse);
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  useEffect(() => {
    const chars = titleRef.current?.querySelectorAll(".char");
    if (chars) {
      gsap.fromTo(chars, { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 1, stagger: 0.03, ease: "power4.out", delay: 0.3 });
    }
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-premium-black">
      <div className="absolute inset-0 z-0">
        <Scene3D mouse={mouse} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-premium-black/20 to-premium-black" />

      <div className="relative z-10 flex h-full items-center">
        <div className="container-main w-full">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-gold text-sm uppercase tracking-[0.3em] font-medium"
            >
              Since 2020 · Made in India
            </motion.p>

            <h1
              ref={titleRef}
              className="mt-6 font-heading text-[clamp(2.5rem,7vw,7rem)] leading-[1.05] font-bold text-luxury-white text-balance"
            >
              {"India's Most Trusted Salon & Barber Furniture Manufacturer".split(" ").map((word, i) => (
                <span key={i} className="inline-block mr-[0.15em]">
                  {word.split("").map((char, j) => (
                    <span key={j} className="char inline-block opacity-0">
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-8 max-w-xl text-lg leading-relaxed text-gray-400"
            >
              Factory-direct premium furniture crafted for ambitious salon owners, luxury grooming studios, and multi-location salon chains across India.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-10 flex flex-wrap gap-5"
            >
              <MagneticButton href="#quote">
                <span className="inline-block bg-gold px-10 py-4 text-lg font-semibold text-premium-black transition-all hover:bg-gold/90">
                  Get Free Project Consultation
                </span>
              </MagneticButton>
              <MagneticButton href="#collections">
                <span className="inline-block border border-gold/50 px-10 py-4 text-lg font-semibold text-gold transition-all hover:bg-gold/10">
                  Explore Collections
                </span>
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="mt-14 grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-4"
            >
              {[
                { label: "Salons Served", target: 5000, suffix: "+" },
                { label: "Product Categories", target: 19, suffix: "" },
                { label: "Pan India Delivery", target: 100, suffix: "%" },
                { label: "On-Site Warranty", target: 1, suffix: "Yr" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-2xl font-bold text-gold md:text-3xl">
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-[0.2em] text-gray-600">Scroll</span>
          <div className="h-10 w-[1px] bg-gradient-to-b from-gold to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
