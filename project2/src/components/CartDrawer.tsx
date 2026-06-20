"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useCart } from '../hooks/useCart';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, addItem } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // GSAP animate open
      gsap.to(backdropRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
        pointerEvents: 'auto'
      });
      gsap.to(drawerRef.current, {
        x: 0,
        duration: 0.5,
        ease: 'power3.out'
      });
    } else {
      document.body.style.overflow = '';
      // GSAP animate close
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        pointerEvents: 'none'
      });
      gsap.to(drawerRef.current, {
        x: '100%',
        duration: 0.4,
        ease: 'power3.in'
      });
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    toggleCart(false);
  };

  // Helper to parse price
  const parsePrice = (priceStr: string): number => {
    if (priceStr.toLowerCase().includes('demand')) return 0;
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
  };

  const subtotal = items.reduce((acc, item) => {
    return acc + (parsePrice(item.product.price) * item.quantity);
  }, 0);

  const hasOnDemand = items.some(item => item.product.price.toLowerCase().includes('demand'));

  return (
    <>
      {/* Backdrop */}
      <div 
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 bg-black/80 z-50 opacity-0 pointer-events-none transition-all duration-300"
        style={{ backdropFilter: 'blur(5px)' }}
      />

      {/* Drawer */}
      <div 
        ref={drawerRef}
        className="fixed top-0 right-0 h-screen w-full md:w-[480px] bg-[#070707] border-l border-brand-cream/10 z-50 shadow-2xl flex flex-col translate-x-full transition-transform duration-700 ease-in-out"
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-brand-cream/5">
          <div>
            <h2 className="font-serif text-xl tracking-[0.2em] uppercase text-brand-cream">
              Your Collection
            </h2>
            <p className="text-[8px] font-sans uppercase tracking-widest text-brand-copper mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'} selected
            </p>
          </div>
          
          <button 
            onClick={handleClose}
            className="group flex items-center gap-2 text-brand-cream/60 hover:text-brand-cream bg-transparent border-none cursor-pointer p-2 focus:outline-none"
            aria-label="Close Drawer"
          >
            <span className="text-[8px] font-sans uppercase tracking-[0.25em] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Close
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="1.2" 
              stroke="currentColor" 
              className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-500"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto py-6 px-8 space-y-6 scrollbar-thin">
          {items.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-center space-y-6 py-12">
              <span className="font-serif text-lg text-brand-cream/40 italic">
                Your collection is currently empty.
              </span>
              <p className="text-[10px] font-sans tracking-wider text-brand-cream/30 uppercase max-w-[280px] leading-relaxed">
                Explore our single-origin bean varieties to begin your flavor story.
              </p>
              <button 
                onClick={handleClose}
                className="px-6 py-3 text-[9px] font-sans font-semibold uppercase tracking-[0.25em] text-brand-black bg-brand-cream hover:bg-brand-copper hover:text-brand-black transition-colors duration-500 border-none cursor-pointer"
              >
                Return to Gallery
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div 
                key={item.product.id}
                className="flex gap-6 pb-6 border-b border-brand-cream/5 last:border-0 group"
              >
                {/* Product Image Panel */}
                <div className="w-20 h-20 bg-[#0B0B0B] flex-shrink-0 flex items-center justify-center border border-brand-cream/5 overflow-hidden group-hover:border-brand-copper/30 transition-colors duration-500 relative">
                  <img 
                    src={item.product.image} 
                    alt={item.product.title} 
                    className="max-h-[85%] w-auto object-contain transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-xs font-serif font-light text-brand-cream group-hover:text-brand-copper transition-colors duration-300">
                          {item.product.title}
                        </h3>
                        <p className="text-[8px] font-sans tracking-widest text-brand-cream/40 uppercase mt-0.5">
                          {item.product.subtitle}
                        </p>
                      </div>
                      <span className="text-[11px] font-sans text-brand-gold font-medium">
                        {item.product.price}
                      </span>
                    </div>
                    
                    <p className="text-[9px] font-sans font-light italic text-brand-cream/50 mt-1 line-clamp-1">
                      {item.product.flavorNotes}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    {/* Quantity selectors - resized for easy touch interactions */}
                    <div className="flex items-center border border-brand-cream/10 bg-[#040404] h-9">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-3.5 h-full text-brand-cream/50 hover:text-brand-cream hover:bg-brand-cream/5 flex items-center justify-center transition-all border-none cursor-pointer text-xs focus:outline-none"
                        aria-label="Decrease quantity"
                      >
                        —
                      </button>
                      <span className="px-3 text-[10px] font-sans font-medium text-brand-cream select-none">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-3.5 h-full text-brand-cream/50 hover:text-brand-cream hover:bg-brand-cream/5 flex items-center justify-center transition-all border-none cursor-pointer text-xs focus:outline-none"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove button - larger padding for better touch target */}
                    <button 
                      onClick={() => removeItem(item.product.id)}
                      className="text-[9px] font-sans uppercase tracking-widest text-brand-cream/40 hover:text-brand-copper bg-transparent border-none cursor-pointer focus:outline-none transition-colors duration-300 py-2 px-3"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Recommendations / Cross-sells inside scroll area */}
          {items.length > 0 && (
            <div className="pt-6 border-t border-brand-cream/10 space-y-4 text-left">
              <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-brand-copper block">
                Cross-Sell Recommendations
              </span>
              
              <div className="space-y-3">
                {(() => {
                  const { products: allProducts } = require('../data/products');
                  const cartIds = items.map((item) => item.product.id);
                  const crossSells = allProducts.filter(
                    (p: any) => !cartIds.includes(p.id) && p.id !== 'corporate-executive-set'
                  ).slice(0, 2);

                  if (crossSells.length === 0) return null;

                  return crossSells.map((prod: any) => (
                    <div key={prod.id} className="flex justify-between items-center bg-[#050505] p-3 border border-brand-cream/5 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black flex items-center justify-center p-1 border border-brand-cream/5">
                          <img src={prod.image} alt="" className="max-h-full object-contain" />
                        </div>
                        <div>
                          <p className="text-[10px] font-serif text-brand-cream font-light">{prod.title}</p>
                          <p className="text-[7px] text-brand-cream/40 uppercase tracking-widest">{prod.weight}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-sans text-brand-gold font-medium">{prod.price}</span>
                        <button
                          onClick={() => addItem(prod)}
                          className="px-3 py-1.5 text-[8px] font-sans uppercase font-bold text-brand-black bg-brand-copper hover:bg-brand-gold transition-colors border-none cursor-pointer focus:outline-none"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="bg-[#050505] border-t border-brand-cream/5 px-8 pt-6 pb-8 md:pb-6 space-y-4 pb-[safe]">
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-sans">
                <span className="text-brand-cream/50 uppercase tracking-wider">Subtotal</span>
                <span className="text-brand-gold font-medium">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              {hasOnDemand && (
                <div className="text-[8px] font-sans text-brand-copper/80 tracking-wide uppercase leading-normal">
                  * Dynamic corporate curations included. Final pricing updated on check.
                </div>
              )}
              <div className="flex justify-between text-[9px] font-sans text-brand-cream/40">
                <span className="uppercase tracking-wider">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="pt-1 space-y-2">
              <Link href="/checkout" onClick={handleClose} className="block w-full">
                <button className="w-full py-4 text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-brand-black bg-brand-copper hover:bg-brand-gold transition-colors duration-500 border-none cursor-pointer flex items-center justify-center gap-2 group h-12">
                  Proceed to Checkout
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="2.0" 
                    stroke="currentColor" 
                    className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </Link>
              <button 
                onClick={handleClose}
                className="w-full py-3 text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-brand-cream bg-transparent border border-brand-cream/15 hover:border-brand-copper hover:text-brand-copper transition-colors duration-500 cursor-pointer flex items-center justify-center gap-2 h-12 focus:outline-none"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
