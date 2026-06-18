"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface DustParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
}

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: DustParticle[] = [];
    const particleCount = 15;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 400;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Initialize dust particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedY: (Math.random() * 0.3 + 0.1) * -1, // drift up
        speedX: (Math.random() - 0.5) * 0.2, // slight sway
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        // wrap edges
        if (p.y < -5) {
          p.y = canvas.height + 5;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -5) p.x = canvas.width + 5;
        if (p.x > canvas.width + 5) p.x = -5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 173, 107, ${p.opacity})`;
        ctx.shadowBlur = 3;
        ctx.shadowColor = "rgba(229, 173, 107, 0.3)";
        ctx.fill();
      });

      animId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      id="contact"
      className="relative py-12 md:py-36 bg-[#090605] px-6 md:px-12 border-t border-[#e5ad6b]/10"
    >
      {/* Background spotlights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,140,72,0.04),transparent_55%)] pointer-events-none" />

      <div className="container mx-auto max-w-4xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="border border-[#c58c48]/15 bg-[#140d0b] rounded-md p-6 md:p-16 shadow-[0_30px_70px_rgba(0,0,0,0.55)] hover:shadow-[0_30px_70px_rgba(229,173,107,0.08)] hover:border-[#e5ad6b]/35 transition-all duration-750 relative overflow-hidden"
        >
          {/* Dust particle background canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" />

          {/* Subtle gold lines */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#e5ad6b]/20 to-transparent z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#e5ad6b]/20 to-transparent z-10" />

          <div className="relative z-10">
            <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.4em] text-[#d4af37]">
              Private Society
            </span>

            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#f8eadc] mt-4 font-serif leading-tight">
              The Darkins <span className="text-gold-gradient italic">Club.</span>
            </h2>

            <p className="text-[#c8b5a4] text-xs md:text-sm mt-4 max-w-lg mx-auto leading-relaxed font-light">
              Receive exclusive invitations to rare micro-batch bean origins, seasonal chocolate workshop releases, and VIP pricing for private tastings.
            </p>

            <div className="mt-6 md:mt-10 max-w-md mx-auto">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs tracking-widest text-[#e5ad6b] uppercase py-3 px-4 border border-[#e5ad6b]/20 bg-[#1d120f] rounded-sm"
                >
                  Welcome to the Circle. Verification email sent.
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow px-5 py-4 rounded-sm bg-[#090605] border border-[#c58c48]/20 text-xs text-[#f8eadc] placeholder:text-[#c8b5a4]/45 outline-none focus:border-[#e5ad6b] transition-colors duration-300"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-[#c58c48] text-[#090605] text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm hover:bg-[#e5ad6b] transition-colors duration-300 active:scale-95"
                  >
                    Join Club
                  </button>
                </form>
              )}
            </div>

            <div className="mt-8 text-[9px] tracking-wider text-[#c8b5a4]/50 uppercase">
              We value your privacy. Unsubscribe at any time.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
