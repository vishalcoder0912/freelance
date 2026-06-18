"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section
      id="contact"
      className="relative py-24 md:py-36 bg-[#090605] px-6 md:px-12 border-t border-[#e5ad6b]/10"
    >
      {/* Background spotlights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,140,72,0.05),transparent_45%)] pointer-events-none" />

      <div className="container mx-auto max-w-4xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="border border-[#c58c48]/15 bg-[#140d0b] rounded-md p-10 md:p-16 shadow-[0_30px_70px_rgba(0,0,0,0.55)] relative overflow-hidden"
        >
          {/* Subtle gold lines */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#e5ad6b]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#e5ad6b]/20 to-transparent" />

          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.4em] text-[#d4af37]">
            Private Society
          </span>

          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#f8eadc] mt-4 font-serif leading-tight">
            The Darkins <span className="text-gold-gradient italic">Club.</span>
          </h2>

          <p className="text-[#c8b5a4] text-xs md:text-sm mt-4 max-w-lg mx-auto leading-relaxed font-light">
            Receive exclusive invitations to rare micro-batch bean origins, seasonal chocolate workshop releases, and VIP pricing for private tastings.
          </p>

          <div className="mt-10 max-w-md mx-auto">
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
        </motion.div>
      </div>
    </section>
  );
}
