"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Footer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let waveOffset = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = 80; // height of the river wave at the bottom
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const drawWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      waveOffset += 0.005; // speed of the river flow

      // Chocolate river flow - drawing multiple layered sine waves in chocolate tones
      const waves = [
        { amplitude: 15, frequency: 0.003, color: "#140d0b", speedMult: 1 },
        { amplitude: 10, frequency: 0.005, color: "#1d120f", speedMult: 1.5 },
        { amplitude: 8, frequency: 0.007, color: "#251510", speedMult: 0.8 },
      ];

      waves.forEach((w) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let x = 0; x <= canvas.width; x++) {
          const y =
            canvas.height -
            30 -
            Math.sin(x * w.frequency + waveOffset * w.speedMult) * w.amplitude;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fillStyle = w.color;
        ctx.fill();
      });

      animId = requestAnimationFrame(drawWave);
    };

    drawWave();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <footer className="relative bg-[#0c0807] pt-12 md:pt-24 border-t border-[#e5ad6b]/10 overflow-hidden">
      
      {/* Footer Directory Info */}
      <div className="container mx-auto px-6 md:px-12 max-w-7xl pb-8 md:pb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 text-left">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-4">
            <span className="font-serif text-xl font-bold tracking-[0.25em] text-[#f8eadc]">
              DARKINS
            </span>
            <p className="text-[#c8b5a4]/80 text-xs leading-relaxed font-light">
              Indian bean-to-bar chocolate roasters. Vegan, gluten-free, and stone-ground with minimal ingredients in New Delhi.
            </p>
            <span className="text-[10px] text-[#d4af37] font-semibold tracking-wider uppercase">
              Okhla Phase I, New Delhi, India
            </span>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold mb-2">
              Collections
            </h4>
            <a href="/shop" className="text-xs text-[#c8b5a4] hover:text-[#e5ad6b] transition-colors">
              Bar Selection
            </a>
            <a href="/shop" className="text-xs text-[#c8b5a4] hover:text-[#e5ad6b] transition-colors">
              Tasting packs
            </a>
            <a href="/gifting" className="text-xs text-[#c8b5a4] hover:text-[#e5ad6b] transition-colors">
              Luxury Gifting Box
            </a>
            <a href="/shop" className="text-xs text-[#c8b5a4] hover:text-[#e5ad6b] transition-colors">
              Chocolate hazelnut spreads
            </a>
          </div>

          {/* Column 3: Atelier */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold mb-2">
              Experience
            </h4>
            <a href="/experiences" className="text-xs text-[#c8b5a4] hover:text-[#e5ad6b] transition-colors">
              Factory Tours (₹1,600)
            </a>
            <a href="/experiences" className="text-xs text-[#c8b5a4] hover:text-[#e5ad6b] transition-colors">
              Tempering Workshops
            </a>
            <a href="/experiences" className="text-xs text-[#c8b5a4] hover:text-[#e5ad6b] transition-colors">
              Sensory Tastings
            </a>
            <a href="/story" className="text-xs text-[#c8b5a4] hover:text-[#e5ad6b] transition-colors">
              Bean-to-Bar Process
            </a>
          </div>

          {/* Column 4: Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold mb-2">
              Inquire
            </h4>
            <span className="text-xs text-[#c8b5a4]">Email: info@darkins.in</span>
            <span className="text-xs text-[#c8b5a4]">Phone: +91 9999 123456</span>
            <div className="flex items-center gap-4 mt-3">
              <a href="#" className="text-xs text-[#c8b5a4] hover:text-[#e5ad6b]">Instagram</a>
              <a href="#" className="text-xs text-[#c8b5a4] hover:text-[#e5ad6b]">Facebook</a>
              <a href="#" className="text-xs text-[#c8b5a4] hover:text-[#e5ad6b]">LinkedIn</a>
            </div>
          </div>

        </div>

        {/* Bottom row copyrights */}
        <div className="mt-8 pt-4 md:mt-16 md:pt-8 border-t border-[#c58c48]/10 flex flex-col sm:flex-row items-center justify-between text-[10px] tracking-widest text-[#c8b5a4]/50 uppercase gap-4">
          <span>© 2026 Darkins Chocolates. All Rights Reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#e5ad6b]">Privacy Policy</a>
            <a href="#" className="hover:text-[#e5ad6b]">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Canvas Layer for animated chocolate river */}
      <div className="w-full relative h-[60px] pointer-events-none z-0 mt-8">
        <canvas ref={canvasRef} className="absolute bottom-0 left-0 w-full h-full" />
      </div>

    </footer>
  );
}
