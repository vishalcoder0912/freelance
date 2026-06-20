"use client";

import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { products } from '../data/products';

export default function CorporateGifting() {
  const { addItem, toggleCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [volume, setVolume] = useState('50-200');
  const [customBranding, setCustomBranding] = useState(false);
  const [notes, setNotes] = useState('');

  const corporateProduct = products.find(p => p.id === 'corporate-executive-set');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !company) return;

    setIsSubmitting(true);
    // Simulate luxury API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const handleQuickAdd = () => {
    if (!corporateProduct) return;
    addItem(corporateProduct);
    toggleCart(true);
  };

  return (
    <div id="gift-section" className="relative w-full py-24 bg-[#050505] px-[6%] border-t border-brand-cream/5 text-left text-brand-cream">
      <div className="max-w-[1200px] mx-auto space-y-16">
        
        {/* Title Block */}
        <div className="text-center space-y-4">
          <span className="text-[8px] font-sans font-semibold uppercase tracking-[0.35em] text-brand-copper block">
            CORPORATE CURATING
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-brand-cream">
            The Gifting & Corporate Suite
          </h2>
          <div className="w-16 h-[1px] bg-brand-copper/30 mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start pt-6">
          
          {/* Left Editorial Grid: Details & Quick Add */}
          <div className="lg:col-span-5 space-y-8">
            <div className="editorial-image-frame aspect-square flex items-center justify-center bg-[#030303] p-12 border border-brand-cream/5 relative group overflow-hidden">
              <img 
                src="/images/product_gift_box.png" 
                alt="Mason & Co Corporate Curation Gift Box" 
                className="max-h-[85%] w-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)] transform group-hover:scale-105 transition-transform duration-[2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/50 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="space-y-4">
              <span className="text-[8px] font-sans font-semibold uppercase tracking-[0.35em] text-brand-copper block">Bespoke Curation</span>
              <h3 className="font-serif text-2xl font-light text-brand-cream">Curated Executive Statements</h3>
              <p className="text-xs font-sans font-light text-brand-cream/65 leading-relaxed">
                Make an impression with single-origin fine cacao. Housed in rigid boxes finished in textured matte-black paper, embossed with custom gold foil. Tailored with your company's greeting cards, corporate seals, and bespoke flavors.
              </p>

              <div className="space-y-2 text-[10px] font-sans font-light text-brand-cream/75 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-brand-gold"></div>
                  <span>Incorporate corporate insignias on outer wrappers</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-brand-gold"></div>
                  <span>Climate-controlled priority dispatch to multiple locations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-brand-gold"></div>
                  <span>Bulk tier pricing structures with custom invoicing</span>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  onClick={handleQuickAdd}
                  className="px-6 py-3.5 text-[8px] font-sans font-semibold uppercase tracking-[0.2em] text-brand-cream bg-transparent border border-brand-cream/25 hover:border-brand-copper hover:text-brand-copper transition-all duration-500 cursor-pointer focus:outline-none"
                >
                  Acquire Specimen Box (₹1,250)
                </button>
              </div>
            </div>
          </div>

          {/* Right Custom Quote Inquiry Form */}
          <div className="lg:col-span-7 bg-[#0A0A0A] border border-brand-cream/5 p-8 md:p-10 space-y-6">
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-light text-brand-cream">Request an Atelier Quote</h3>
              <p className="text-[8px] font-sans uppercase tracking-widest text-brand-cream/40">Complete the parameters to consult our gifting curator</p>
            </div>
            
            <div className="w-full h-[1px] bg-brand-cream/5" />

            {isSubmitted ? (
              <div className="py-12 text-center space-y-4 animate-scale-in">
                <div className="w-12 h-12 bg-brand-copper/10 border border-brand-copper/35 flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-brand-gold">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-[8px] font-sans font-bold uppercase tracking-[0.3em] text-brand-gold block">Inquiry Logged</span>
                <h4 className="font-serif text-lg text-brand-cream font-light">Quote Request Submitted</h4>
                <p className="text-[10px] font-sans font-light text-brand-cream/50 max-w-sm mx-auto leading-relaxed">
                  Thank you. Our Corporate Curator is validating inventory parameters. We will contact you at <span className="font-medium text-brand-cream font-mono">{email}</span> within 4 business hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2.5 text-[8px] font-sans uppercase tracking-widest text-brand-black bg-brand-cream hover:bg-brand-copper transition-colors duration-500 border-none cursor-pointer focus:outline-none"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-[10px] font-sans font-light">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-widest text-brand-cream/50">Consultant Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black border border-brand-cream/10 px-4 py-3 text-brand-cream focus:outline-none focus:border-brand-copper font-sans"
                      placeholder="e.g. Vikramaditya A."
                    />
                  </div>

                  {/* Business Email */}
                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-widest text-brand-cream/50">Business Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black border border-brand-cream/10 px-4 py-3 text-brand-cream focus:outline-none focus:border-brand-copper font-sans"
                      placeholder="e.g. corporate@company.com"
                    />
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-widest text-brand-cream/50">Organization Name</label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-black border border-brand-cream/10 px-4 py-3 text-brand-cream focus:outline-none focus:border-brand-copper font-sans"
                      placeholder="e.g. Apex Holdings"
                    />
                  </div>

                  {/* Approximate Volume */}
                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-widest text-brand-cream/50">Approximate Curation Volume</label>
                    <select
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      className="w-full bg-black border border-brand-cream/10 px-4 py-3 text-brand-cream focus:outline-none focus:border-brand-copper font-sans"
                    >
                      <option value="50-200">50 to 200 boxes</option>
                      <option value="200-500">200 to 500 boxes</option>
                      <option value="500+">500+ boxes (Custom Cacao Blend)</option>
                    </select>
                  </div>

                </div>

                {/* Custom Branding Toggle */}
                <div className="flex items-center justify-between border border-brand-cream/10 p-4 bg-black">
                  <div className="text-left space-y-1 pr-4">
                    <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-brand-cream block">Bespoke Custom Branding</span>
                    <span className="text-[8px] font-sans text-brand-cream/45 block">Engrave your corporate seal & ribbon logos</span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setCustomBranding(!customBranding)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      customBranding ? 'bg-brand-copper' : 'bg-brand-cream/10'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                        customBranding ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Message notes */}
                <div className="space-y-2">
                  <label className="text-[8px] uppercase tracking-widest text-brand-cream/50">Curation Directions & Custom Details</label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-black border border-brand-cream/10 px-4 py-3 text-brand-cream focus:outline-none focus:border-brand-copper font-sans resize-none"
                    placeholder="Specify target delivery date, custom flavor choices, and structural instructions..."
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-brand-black bg-brand-copper hover:bg-brand-gold transition-all duration-500 border-none cursor-pointer focus:outline-none flex items-center justify-center gap-2 h-12"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border border-brand-black/20 border-t-brand-black animate-spin rounded-full"></span>
                      Submitting Quote Parameters...
                    </>
                  ) : (
                    "Submit Quote Request"
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
