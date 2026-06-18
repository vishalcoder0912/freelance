"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/sections/Header";
import Experiences from "@/components/sections/Experiences";
import Newsletter from "@/components/sections/Newsletter";
import Footer from "@/components/sections/Footer";

export default function ExperiencesPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "factory-tour",
    date: "",
    timeSlot: "11:00 AM",
    guests: "2",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      experience: "factory-tour",
      date: "",
      timeSlot: "11:00 AM",
      guests: "2",
      notes: "",
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
            Sensory Atelier
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-[#f8eadc] mt-2 md:mt-4 font-serif uppercase">
            Curated <span className="text-gold-gradient italic">Ateliers.</span>
          </h1>
          <p className="text-[#c8b5a4] text-xs md:text-sm mt-3 md:mt-4 max-w-xl mx-auto leading-relaxed font-light">
            Indulge in a hands-on roasting masterclass, trace the conching process, or decode the flavor wheel in our premium tasting salon.
          </p>
        </div>

        {/* Existing Experiences Component */}
        <Experiences />

        {/* Booking Reservation Section */}
        <section id="booking-form" className="relative py-10 md:py-28 px-6 md:px-12 border-t border-[#e5ad6b]/10 bg-[#0c0807]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,140,72,0.04),transparent_60%)] pointer-events-none" />
          
          <div className="container mx-auto max-w-3xl relative z-10">
            <div className="mb-6 md:mb-12 text-center">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.4em] text-[#d4af37]">
                Reservation Portal
              </span>
              <h2 className="font-serif text-2xl md:text-4xl text-[#f8eadc] mt-1.5 md:mt-3 font-serif">
                Secure Your <span className="italic text-gold-gradient">Session.</span>
              </h2>
              <p className="text-xs md:text-sm text-[#c8b5a4] mt-2 font-light max-w-md mx-auto">
                Select your preferred atelier and date. We will confirm your slots and send details via email within 24 hours.
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
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Radhika Sen"
                          className="w-full bg-[#0c0807] border border-[#c58c48]/20 rounded-sm px-4 py-3 text-xs md:text-sm text-[#f8eadc] placeholder-[#c8b5a4]/30 focus:outline-none focus:border-[#e5ad6b] transition-all"
                        />
                      </div>

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
                          placeholder="e.g. radhika@vogue.in"
                          className="w-full bg-[#0c0807] border border-[#c58c48]/20 rounded-sm px-4 py-3 text-xs md:text-sm text-[#f8eadc] placeholder-[#c8b5a4]/30 focus:outline-none focus:border-[#e5ad6b] transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          placeholder="e.g. +91 98765 43210"
                          className="w-full bg-[#0c0807] border border-[#c58c48]/20 rounded-sm px-4 py-3 text-xs md:text-sm text-[#f8eadc] placeholder-[#c8b5a4]/30 focus:outline-none focus:border-[#e5ad6b] transition-all"
                        />
                      </div>

                      {/* Experience Selection */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-[#d4af37] font-semibold">
                          Select Experience
                        </label>
                        <select
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          className="w-full bg-[#0c0807] border border-[#c58c48]/20 rounded-sm px-4 py-3 text-xs md:text-sm text-[#f8eadc] focus:outline-none focus:border-[#e5ad6b] transition-all"
                        >
                          <option value="factory-tour">The Bean-to-Bar Factory Tour (₹1,600)</option>
                          <option value="workshop">Artisanal Tempering Workshop (₹2,500)</option>
                          <option value="tasting">Private Sensory Tasting (₹1,200)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Date */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-[#d4af37] font-semibold">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full bg-[#0c0807] border border-[#c58c48]/20 rounded-sm px-4 py-3 text-xs md:text-sm text-[#f8eadc] focus:outline-none focus:border-[#e5ad6b] transition-all"
                        />
                      </div>

                      {/* Time Slot */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-[#d4af37] font-semibold">
                          Time Slot
                        </label>
                        <select
                          value={formData.timeSlot}
                          onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                          className="w-full bg-[#0c0807] border border-[#c58c48]/20 rounded-sm px-4 py-3 text-xs md:text-sm text-[#f8eadc] focus:outline-none focus:border-[#e5ad6b] transition-all"
                        >
                          <option value="11:00 AM">11:00 AM - Morning</option>
                          <option value="02:00 PM">02:00 PM - Afternoon</option>
                          <option value="05:00 PM">05:00 PM - Sunset Flight</option>
                        </select>
                      </div>

                      {/* Guests */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-[#d4af37] font-semibold">
                          Number of Guests
                        </label>
                        <select
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                          className="w-full bg-[#0c0807] border border-[#c58c48]/20 rounded-sm px-4 py-3 text-xs md:text-sm text-[#f8eadc] focus:outline-none focus:border-[#e5ad6b] transition-all"
                        >
                          <option value="1">1 Guest</option>
                          <option value="2">2 Guests</option>
                          <option value="3">3 Guests</option>
                          <option value="4">4 Guests</option>
                          <option value="5+">5+ Guests (Private group)</option>
                        </select>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-[#d4af37] font-semibold">
                        Special Requests / Dietary Restrictions
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="e.g. Allergies, celebrating an anniversary, corporate inquiry..."
                        rows={3}
                        className="w-full bg-[#0c0807] border border-[#c58c48]/20 rounded-sm px-4 py-3 text-xs md:text-sm text-[#f8eadc] placeholder-[#c8b5a4]/30 focus:outline-none focus:border-[#e5ad6b] transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-[#c58c48] text-[#090605] text-[10px] uppercase tracking-[0.25em] font-bold rounded-sm transition-all duration-300 hover:bg-[#e5ad6b] hover:shadow-[0_10px_30px_rgba(197,140,72,0.25)] flex items-center justify-center disabled:opacity-50"
                    >
                      {loading ? "Processing..." : "Submit Reservation Inquiry"}
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
                        Thank you, <span className="text-[#f8eadc] font-medium">{formData.name}</span>. We have received your booking request for the <span className="text-[#e5ad6b]">{formData.experience === "factory-tour" ? "Bean-to-Bar Factory Tour" : formData.experience === "workshop" ? "Artisanal Tempering Workshop" : "Private Sensory Tasting"}</span> on <span className="text-[#f8eadc] font-medium">{formData.date}</span> at <span className="text-[#f8eadc] font-medium">{formData.timeSlot}</span>.
                      </p>
                    </div>

                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 border border-[#e5ad6b]/30 text-[#f8eadc] text-[9.5px] uppercase tracking-widest font-semibold hover:bg-[#e5ad6b]/10 transition-colors"
                    >
                      Book Another Session
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
