"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/sections/Header";
import Gifting from "@/components/sections/Gifting";
import Newsletter from "@/components/sections/Newsletter";
import Footer from "@/components/sections/Footer";

export default function GiftingPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    packageType: "wooden-chests",
    quantity: "25",
    eventDate: "",
    customization: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      packageType: "wooden-chests",
      quantity: "25",
      eventDate: "",
      customization: "",
    });
    setSubmitted(false);
  };

  return (
    <div className="relative bg-[#090605] text-[#f8eadc] flex flex-col min-h-screen">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Header */}
      <Header />

      <main className="flex-grow pt-16 md:pt-32">
        {/* Editorial Title */}
        <div className="text-center py-6 px-6 md:py-12 bg-[radial-gradient(circle_at_50%_0%,rgba(197,140,72,0.08),transparent_50%)]">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.4em] text-[#d4af37]">
            Bespoke Services
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-[#f8eadc] mt-2 md:mt-4 font-serif uppercase">
            Luxury <span className="text-gold-gradient italic">Gifting.</span>
          </h1>
          <p className="text-[#c8b5a4] text-xs md:text-sm mt-3 md:mt-4 max-w-xl mx-auto leading-relaxed font-light">
            Indulge your guests and clients. Handcrafted solid teak wood chests, blind-debossed copper hot stamping, and custom single-origin flights.
          </p>
        </div>

        {/* Existing Gifting component */}
        <Gifting />

        {/* Bespoke Inquiry Form Section */}
        <section id="inquiry-form" className="relative py-10 md:py-28 px-6 md:px-12 border-t border-[#e5ad6b]/10 bg-[#0c0807]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,140,72,0.04),transparent_60%)] pointer-events-none" />

          <div className="container mx-auto max-w-3xl relative z-10">
            <div className="mb-6 md:mb-12 text-center">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.4em] text-[#d4af37]">
                Corporate & Wedding Inquiry
              </span>
              <h2 className="font-serif text-2xl md:text-4xl text-[#f8eadc] mt-1.5 md:mt-3 font-serif">
                Bespoke <span className="italic text-gold-gradient">Commission.</span>
              </h2>
              <p className="text-xs md:text-sm text-[#c8b5a4] mt-2 font-light max-w-md mx-auto">
                Customize box layouts, foil inserts, ribbon colors, and chocolate infusions. Share your requirements, and our gifting designer will coordinate.
              </p>
            </div>

            <div className="bg-[#140d0b] border border-[#c58c48]/15 rounded-md p-4 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-[#d4af37] font-semibold">
                          Contact Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Ananya Kapoor"
                          className="w-full bg-[#0c0807] border border-[#c58c48]/20 rounded-sm px-4 py-3 text-xs md:text-sm text-[#f8eadc] placeholder-[#c8b5a4]/30 focus:outline-none focus:border-[#e5ad6b] transition-all"
                        />
                      </div>

                      {/* Company Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-[#d4af37] font-semibold">
                          Company / Event Name
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g. Kapoor Weddings / Vogue India"
                          className="w-full bg-[#0c0807] border border-[#c58c48]/20 rounded-sm px-4 py-3 text-xs md:text-sm text-[#f8eadc] placeholder-[#c8b5a4]/30 focus:outline-none focus:border-[#e5ad6b] transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Email */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-[#d4af37] font-semibold">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. ananya@harpersbazaar.in"
                          className="w-full bg-[#0c0807] border border-[#c58c48]/20 rounded-sm px-4 py-3 text-xs md:text-sm text-[#f8eadc] placeholder-[#c8b5a4]/30 focus:outline-none focus:border-[#e5ad6b] transition-all"
                        />
                      </div>

                      {/* Phone */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-[#d4af37] font-semibold">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. +91 99999 12345"
                          className="w-full bg-[#0c0807] border border-[#c58c48]/20 rounded-sm px-4 py-3 text-xs md:text-sm text-[#f8eadc] placeholder-[#c8b5a4]/30 focus:outline-none focus:border-[#e5ad6b] transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Package Type */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-[#d4af37] font-semibold">
                          Gifting Package
                        </label>
                        <select
                          value={formData.packageType}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData({
                              ...formData,
                              packageType: val,
                              quantity: val === "wooden-chests" ? "25" : "50",
                            });
                          }}
                          className="w-full bg-[#0c0807] border border-[#c58c48]/20 rounded-sm px-4 py-3 text-xs md:text-sm text-[#f8eadc] focus:outline-none focus:border-[#e5ad6b] transition-all"
                        >
                          <option value="wooden-chests">Signature Cacao Chests (Min. 25)</option>
                          <option value="copper-sleeves">Copper-Stamped Sleeves (Min. 50)</option>
                        </select>
                      </div>

                      {/* Quantity */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-[#d4af37] font-semibold">
                          Quantity Needed
                        </label>
                        <input
                          type="number"
                          required
                          min={formData.packageType === "wooden-chests" ? 25 : 50}
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          className="w-full bg-[#0c0807] border border-[#c58c48]/20 rounded-sm px-4 py-3 text-xs md:text-sm text-[#f8eadc] focus:outline-none focus:border-[#e5ad6b] transition-all"
                        />
                      </div>

                      {/* Event Date */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-[#d4af37] font-semibold">
                          Delivery Date
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.eventDate}
                          onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                          className="w-full bg-[#0c0807] border border-[#c58c48]/20 rounded-sm px-4 py-3 text-xs md:text-sm text-[#f8eadc] focus:outline-none focus:border-[#e5ad6b] transition-all"
                        />
                      </div>
                    </div>

                    {/* Customization specifications */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-[#d4af37] font-semibold">
                        Custom Details & Specifications
                      </label>
                      <textarea
                        value={formData.customization}
                        onChange={(e) => setFormData({ ...formData, customization: e.target.value })}
                        placeholder="e.g. Embossed names, specific chocolate bar choices, customized copper latches, velvet lining color preferences..."
                        rows={4}
                        className="w-full bg-[#0c0807] border border-[#c58c48]/20 rounded-sm px-4 py-3 text-xs md:text-sm text-[#f8eadc] placeholder-[#c8b5a4]/30 focus:outline-none focus:border-[#e5ad6b] transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-[#c58c48] text-[#090605] text-[10px] uppercase tracking-[0.25em] font-bold rounded-sm transition-all duration-300 hover:bg-[#e5ad6b] hover:shadow-[0_10px_30px_rgba(197,140,72,0.25)] flex items-center justify-center disabled:opacity-50"
                    >
                      {loading ? "Processing..." : "Submit Custom Inquiry"}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8 flex flex-col items-center gap-6"
                  >
                    <div className="w-16 h-16 rounded-full border border-[#e5ad6b] flex items-center justify-center bg-[#1d120f]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="#e5ad6b"
                        className="w-8 h-8"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>

                    <div>
                      <h3 className="font-serif text-2xl text-[#f8eadc]">Inquiry Submitted</h3>
                      <p className="text-xs text-[#c8b5a4] mt-2 max-w-sm leading-relaxed">
                        Thank you, <span className="text-[#f8eadc] font-medium">{formData.name}</span>. Your inquiry for <span className="text-[#f8eadc] font-medium">{formData.quantity}x</span> <span className="text-[#e5ad6b]">{formData.packageType === "wooden-chests" ? "Signature Cacao Chests" : "Copper-Stamped Sleeves"}</span> has been received. Our luxury packaging coordinator will contact you at <span className="text-[#f8eadc] font-medium">{formData.email}</span> within 24 hours.
                      </p>
                    </div>

                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 border border-[#e5ad6b]/30 text-[#f8eadc] text-[9.5px] uppercase tracking-widest font-semibold hover:bg-[#e5ad6b]/10 transition-colors"
                    >
                      New Inquiry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}
