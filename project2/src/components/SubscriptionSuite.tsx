"use client";

import React, { useState } from 'react';
import { products, Product } from '../data/products';
import { useCart } from '../hooks/useCart';
import { useAdminStore } from '../store/useAdminStore';

export default function SubscriptionSuite() {
  const { addItem, toggleCart } = useCart();
  const { inventory } = useAdminStore();
  
  // States for term selections
  const [clubTerm, setClubTerm] = useState<'3' | '6' | '12'>('3');
  const [discoveryTerm, setDiscoveryTerm] = useState<'1' | '4'>('1'); // 1 quarter or 4 quarters (1 year)

  // Find products
  const monthlyClubProduct = products.find(p => p.id === 'monthly-club-subscription');
  const seasonalProduct = products.find(p => p.id === 'seasonal-discovery-subscription');

  const handleSubscribe = (productId: string, termText: string, termMultiplier: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // We can calculate dynamic term pricing if needed
    const rawPrice = 999;
    const finalPriceText = `₹${(rawPrice * termMultiplier).toLocaleString('en-IN')}`;

    // Add to cart as a customized subscription item
    addItem({
      id: `${product.id}-${termText}`,
      title: `${product.title} (${termText})`,
      subtitle: `ATELIER SUBSCRIPTION - PRE-PAID`,
      image: product.image,
      origin: product.origin,
      flavorNotes: `${product.flavorNotes} / Sourced for ${termText}`,
      ingredients: product.ingredients,
      weight: `${product.weight.split(' ')[0]} x ${termMultiplier}`,
      price: finalPriceText,
      pairings: product.pairings,
      awards: product.awards,
      story: `${product.story} (Configured: ${termText} pre-paid term)`
    });

    toggleCart(true);
  };

  return (
    <div id="subscription-section" className="w-full bg-[#050505] py-24 px-[6%] border-t border-brand-cream/5 text-brand-cream text-left relative">
      <div className="max-w-[1200px] mx-auto space-y-16">
        
        {/* Title */}
        <div className="text-center space-y-4">
          <span className="text-[8px] font-sans font-semibold uppercase tracking-[0.35em] text-brand-copper block">
            TERROIR CLUB
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-brand-cream">
            The Chocolate Club Subscriptions
          </h2>
          <div className="w-16 h-[1px] bg-brand-copper/30 mx-auto" />
          <p className="text-[10px] font-sans text-brand-cream/40 uppercase tracking-widest max-w-md mx-auto leading-relaxed text-center">
            Receive freshly refined, micro-batch chocolate selections delivered directly to your doorstep on a recurring cycle.
          </p>
        </div>

        {/* Subscription cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6">
          
          {/* Card 1: Monthly Club */}
          {monthlyClubProduct && (
            <div className="bg-[#0A0A0A] border border-brand-cream/5 p-8 flex flex-col justify-between hover:border-brand-copper/20 transition-all duration-700 space-y-8 relative group">
              <div className="space-y-6">
                <div className="flex justify-between items-baseline border-b border-brand-cream/5 pb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-light text-brand-cream">{monthlyClubProduct.title}</h3>
                    <p className="text-[8px] font-sans uppercase tracking-widest text-brand-copper mt-1">Monthly micro-batches</p>
                  </div>
                  <span className="text-xl font-sans text-brand-gold font-medium">₹999<span className="text-[10px] text-brand-cream/40">/mo</span></span>
                </div>

                <p className="text-xs font-sans font-light text-brand-cream/65 leading-relaxed">
                  Join our exclusive tasting club. Every month, receive 3 signature single-origin bars stone-ground for 72 hours, including unreleased test flavors and custom terroir experiments shipped straight from our refining room.
                </p>

                {/* Term Selector */}
                <div className="space-y-2">
                  <label className="text-[8px] font-sans uppercase tracking-widest text-brand-cream/50 block">Pre-Paid Membership Term</label>
                  <div className="grid grid-cols-3 gap-2 border border-brand-cream/10 p-1 bg-black">
                    <button
                      onClick={() => setClubTerm('3')}
                      className={`py-2 text-[9px] font-sans uppercase tracking-wider transition-all focus:outline-none cursor-pointer border-none ${
                        clubTerm === '3' ? 'bg-brand-copper text-brand-black font-semibold' : 'bg-transparent text-brand-cream/60 hover:text-brand-cream'
                      }`}
                    >
                      3 Months
                    </button>
                    <button
                      onClick={() => setClubTerm('6')}
                      className={`py-2 text-[9px] font-sans uppercase tracking-wider transition-all focus:outline-none cursor-pointer border-none ${
                        clubTerm === '6' ? 'bg-brand-copper text-brand-black font-semibold' : 'bg-transparent text-brand-cream/60 hover:text-brand-cream'
                      }`}
                    >
                      6 Months
                    </button>
                    <button
                      onClick={() => setClubTerm('12')}
                      className={`py-2 text-[9px] font-sans uppercase tracking-wider transition-all focus:outline-none cursor-pointer border-none ${
                        clubTerm === '12' ? 'bg-brand-copper text-brand-black font-semibold' : 'bg-transparent text-brand-cream/60 hover:text-brand-cream'
                      }`}
                    >
                      12 Months
                    </button>
                  </div>
                </div>

                {/* Bullets */}
                <div className="space-y-2 text-[10px] font-sans font-light text-brand-cream/75 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-brand-gold"></div>
                    <span>3 artisanal bars shipped in temperature-controlled boxes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-brand-gold"></div>
                    <span>Includes tasting notes, cacao origin journal, & scoring sheet</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-brand-gold"></div>
                    <span>Complimentary shipping nationwide</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSubscribe('monthly-club-subscription', `${clubTerm} Month Term`, parseInt(clubTerm))}
                className="w-full py-4 text-[9px] font-sans font-semibold uppercase tracking-[0.25em] text-brand-black bg-brand-copper hover:bg-brand-gold transition-colors duration-500 border-none cursor-pointer focus:outline-none flex items-center justify-center gap-2"
              >
                Join Monthly Club (Pre-Pay ₹{parseInt(clubTerm) * 999})
              </button>
            </div>
          )}

          {/* Card 2: Seasonal Discovery Box */}
          {seasonalProduct && (
            <div className="bg-[#0A0A0A] border border-brand-cream/5 p-8 flex flex-col justify-between hover:border-brand-copper/20 transition-all duration-700 space-y-8 relative group">
              <div className="space-y-6">
                <div className="flex justify-between items-baseline border-b border-brand-cream/5 pb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-light text-brand-cream">{seasonalProduct.title}</h3>
                    <p className="text-[8px] font-sans uppercase tracking-widest text-brand-copper mt-1">Quarterly thematic boxes</p>
                  </div>
                  <span className="text-xl font-sans text-brand-gold font-medium">₹1,499<span className="text-[10px] text-brand-cream/40">/box</span></span>
                </div>

                <p className="text-xs font-sans font-light text-brand-cream/65 leading-relaxed">
                  Celebrate nature’s rhythms. Every season (Spring, Summer, Autumn, Winter Monsoon), receive a curated crate compiling micro-lot chocolate infusions, single-estate bars, organic cocoa nib infusions, and handcrafted local gifts from the Western Ghats.
                </p>

                {/* Term Selector */}
                <div className="space-y-2">
                  <label className="text-[8px] font-sans uppercase tracking-widest text-brand-cream/50 block">Pre-Paid Membership Term</label>
                  <div className="grid grid-cols-2 gap-2 border border-brand-cream/10 p-1 bg-black">
                    <button
                      onClick={() => setDiscoveryTerm('1')}
                      className={`py-2 text-[9px] font-sans uppercase tracking-wider transition-all focus:outline-none cursor-pointer border-none ${
                        discoveryTerm === '1' ? 'bg-brand-copper text-brand-black font-semibold' : 'bg-transparent text-brand-cream/60 hover:text-brand-cream'
                      }`}
                    >
                      Single Box
                    </button>
                    <button
                      onClick={() => setDiscoveryTerm('4')}
                      className={`py-2 text-[9px] font-sans uppercase tracking-wider transition-all focus:outline-none cursor-pointer border-none ${
                        discoveryTerm === '4' ? 'bg-brand-copper text-brand-black font-semibold' : 'bg-transparent text-brand-cream/60 hover:text-brand-cream'
                      }`}
                    >
                      Full Year (4 Boxes)
                    </button>
                  </div>
                </div>

                {/* Bullets */}
                <div className="space-y-2 text-[10px] font-sans font-light text-brand-cream/75 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-brand-gold"></div>
                    <span>500g of thematic single origin products and infusions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-brand-gold"></div>
                    <span>Includes hand-crafted local gifts (brass lamps, honey, incense)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-brand-gold"></div>
                    <span>Interactive harvest cards revealing soil details</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSubscribe('seasonal-discovery-subscription', discoveryTerm === '1' ? '1 Box Curation' : 'Annual Crate (4 Boxes)', discoveryTerm === '1' ? 1.5 : 5.2)} // pre-calculated rates
                className="w-full py-4 text-[9px] font-sans font-semibold uppercase tracking-[0.25em] text-brand-black bg-brand-copper hover:bg-brand-gold transition-colors duration-500 border-none cursor-pointer focus:outline-none flex items-center justify-center gap-2"
              >
                Acquire Discovery Box (Pre-Pay ₹{discoveryTerm === '1' ? 1499 : 5200})
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
