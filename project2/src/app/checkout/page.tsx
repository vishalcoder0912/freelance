"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAdminStore } from '@/store/useAdminStore';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, itemCount, clearCart } = useCart();
  const { validateCoupon, addOrder, deductStock } = useAdminStore();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'card' | 'netbanking' | 'wallets' | 'cod'>('qr');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  // Form States
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Coupon States
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    setMounted(true);
    // Generate random Order ID
    const randomId = `MC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderId(randomId);
  }, []);

  const handleCopyUpi = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText('9319758795@omni');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const coupon = validateCoupon(couponCode);
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponCode('');
    } else {
      setCouponError('Invalid or expired promotional code.');
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  // Helper to parse price
  const parsePrice = (priceStr: string): number => {
    if (priceStr.toLowerCase().includes('demand')) return 0;
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => {
    return acc + (parsePrice(item.product.price) * item.quantity);
  }, 0);

  const hasOnDemand = items.some(item => item.product.price.toLowerCase().includes('demand'));
  
  // Coupon Discount
  let discount = 0;
  let freeShippingCoupon = false;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round(subtotal * (appliedCoupon.value / 100));
    } else if (appliedCoupon.discountType === 'fixed') {
      discount = Math.min(subtotal, appliedCoupon.value);
    } else if (appliedCoupon.discountType === 'free_shipping') {
      freeShippingCoupon = true;
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const tax = Math.round(discountedSubtotal * 0.05);
  
  // Free shipping over ₹1000, or via coupon, else ₹150 (if cart has items)
  const shipping = items.length === 0 || freeShippingCoupon 
    ? 0 
    : (discountedSubtotal >= 1000 || hasOnDemand ? 0 : 150);

  // COD surcharge
  const codSurcharge = activeTab === 'cod' ? 50 : 0;

  const total = discountedSubtotal + tax + shipping + codSurcharge;

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsProcessing(true);
    // Simulate luxury processing delay
    setTimeout(() => {
      // Add Order to Admin Store ledger
      addOrder({
        id: orderId,
        customerName: name || 'Guest Collector',
        customerEmail: email,
        address,
        city,
        postalCode,
        items: items.map(item => ({
          productId: item.product.id,
          title: item.product.title,
          quantity: item.quantity,
          price: item.product.price
        })),
        subtotal,
        tax,
        shipping: shipping + codSurcharge,
        total,
        paymentMethod: activeTab === 'qr' ? 'UPI QR Code' 
                     : activeTab === 'card' ? 'Credit/Debit Card'
                     : activeTab === 'netbanking' ? 'Net Banking'
                     : activeTab === 'wallets' ? 'Wallet App'
                     : 'Cash on Delivery'
      });

      // Deduct inventory items
      items.forEach(item => {
        deductStock(item.product.id, item.quantity);
      });

      setIsProcessing(false);
      setIsPaid(true);
    }, 2500);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleReturnHome = () => {
    clearCart();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-brand-black text-brand-cream flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border border-brand-copper/20 border-t-brand-copper animate-spin rounded-none"></div>
          <span className="text-[9px] uppercase tracking-[0.3em] text-brand-cream/40">Securing Session...</span>
        </div>
      </div>
    );
  }

  // If cart is empty and not paid, show empty state
  if (items.length === 0 && !isPaid) {
    return (
      <div className="min-h-screen bg-[#060606] text-brand-cream flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-serif text-3xl font-light mb-4 text-brand-cream">
          Your Collection is Empty
        </h1>
        <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-brand-cream/40 mb-8 max-w-sm leading-relaxed">
          Before entering checkout, please select from our single-origin collections.
        </p>
        <Link href="/">
          <button className="px-8 py-3.5 text-[9px] font-sans font-semibold uppercase tracking-[0.25em] text-brand-black bg-brand-cream hover:bg-brand-copper hover:text-brand-black transition-colors duration-500 border-none cursor-pointer">
            Begin Collection
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream overflow-x-hidden selection:bg-brand-copper selection:text-brand-black font-sans relative">
      
      {/* Printable Invoice Container (Hidden on Screen, Visible on Print) */}
      <div className="hidden print:block p-12 bg-white text-black font-serif min-h-screen max-w-[800px] mx-auto">
        <div className="flex justify-between items-start border-b border-black/10 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-light tracking-widest">MASON & CO</h1>
            <p className="text-[10px] font-sans text-black/50 mt-1 uppercase tracking-wider">Fine Single-Origin Cacao</p>
          </div>
          <div className="text-right text-xs font-sans space-y-1 text-black/70">
            <p className="font-semibold text-black">INVOICE CERTIFICATE</p>
            <p>Order ID: {orderId}</p>
            <p>Date: {new Date().toLocaleDateString('en-IN')}</p>
            <p>Status: PAID / CERTIFIED</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 text-xs font-sans mb-8 text-left">
          <div>
            <h3 className="font-bold uppercase tracking-wider mb-2 text-black/50 text-[9px]">Issued To</h3>
            <p className="font-semibold text-black text-sm">{name || 'Guest Collector'}</p>
            <p className="text-black/70 mt-1">{email}</p>
            <p className="text-black/70 mt-0.5">{address}</p>
            <p className="text-black/70">{city} - {postalCode}</p>
          </div>
          <div>
            <h3 className="font-bold uppercase tracking-wider mb-2 text-black/50 text-[9px]">Sourced From</h3>
            <p className="font-semibold text-black text-sm">Mason & Co Atelier</p>
            <p className="text-black/70 mt-1">Western Ghats Estate Cooperative</p>
            <p className="text-black/70">Tamil Nadu / Karnataka, India</p>
          </div>
        </div>

        <table className="w-full text-xs font-sans mb-8">
          <thead>
            <tr className="border-b border-black/20 text-black/50 text-left font-bold uppercase tracking-wider text-[9px]">
              <th className="pb-3 w-3/5">Collection Item</th>
              <th className="pb-3 text-center">Qty</th>
              <th className="pb-3 text-right">Unit Price</th>
              <th className="pb-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {items.map((item) => (
              <tr key={item.product.id} className="text-black/80">
                <td className="py-4 text-left">
                  <p className="font-semibold text-black">{item.product.title}</p>
                  <p className="text-[10px] text-black/50 italic mt-0.5">{item.product.subtitle} / {item.product.origin}</p>
                </td>
                <td className="py-4 text-center">{item.quantity}</td>
                <td className="py-4 text-right">{item.product.price}</td>
                <td className="py-4 text-right">
                  ₹{(parsePrice(item.product.price) * item.quantity).toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="w-1/2 ml-auto text-xs font-sans space-y-3 pt-4 border-t border-black/10 text-left">
          <div className="flex justify-between text-black/70">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Promotional Discount ({appliedCoupon?.code})</span>
              <span>-₹{discount.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between text-black/70">
            <span>GST (5%)</span>
            <span>₹{tax.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-black/70">
            <span>Shipping & Surcharge</span>
            <span>{shipping + codSurcharge === 0 ? 'Complimentary' : `₹${shipping + codSurcharge}`}</span>
          </div>
          <div className="flex justify-between text-base font-serif font-bold text-black border-t border-black/20 pt-3">
            <span>Total Certified</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="mt-16 text-center border-t border-black/10 pt-8 text-[10px] font-sans text-black/40 leading-relaxed uppercase tracking-wider">
          <p>This document certifies the acquisition of micro-batch organic single-origin chocolate.</p>
          <p className="mt-1 font-semibold text-black">Thank you for supporting sustainable agroforestry farming.</p>
        </div>
      </div>

      {/* Screen Layout Container (Hidden on Print) */}
      <div className="print:hidden flex flex-col min-h-screen">
        
        {/* Simple Editorial Header */}
        <header className="w-full flex justify-between items-center px-[6%] py-6 z-50 bg-[#070707] border-b border-brand-cream/5">
          <div 
            onClick={handleReturnHome}
            className="font-serif text-xl md:text-2xl font-light tracking-[0.45em] text-brand-cream hover:text-brand-gold transition-all duration-700 cursor-pointer"
          >
            MASON & CO
          </div>
          <div className="text-[8px] font-sans uppercase tracking-[0.25em] text-brand-cream/40 flex items-center gap-3">
            <span>Checkout</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-copper"></span>
            <span className="text-brand-cream/70 font-semibold">{isPaid ? 'Success' : 'Transaction'}</span>
          </div>
        </header>

        {isPaid ? (
          /* CINEMATIC SUCCESS STATE */
          <div className="flex-1 flex items-center justify-center py-20 px-6 bg-[#060606]">
            <div className="max-w-[650px] w-full text-center space-y-10">
              
              {/* Success Badge */}
              <div className="relative w-20 h-20 mx-auto bg-brand-copper/10 border border-brand-copper/30 flex items-center justify-center rounded-none animate-scale-in">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-brand-gold">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <div className="absolute inset-0 bg-brand-gold/5 blur-md"></div>
              </div>

              {/* Editorial Titles */}
              <div className="space-y-3">
                <span className="text-[8px] font-sans font-semibold uppercase tracking-[0.35em] text-brand-copper">TRANSACTION COMPLETED</span>
                <h1 className="font-serif text-4xl md:text-6xl font-light tracking-wide text-brand-cream leading-tight">
                  Your Curation is <br />
                  <span className="italic text-brand-gold">Secured.</span>
                </h1>
                <p className="text-xs font-sans font-light text-brand-cream/50 max-w-md mx-auto mt-4 leading-relaxed">
                  Thank you for securing your order. We are preparing your single-origin bars inside our climate-controlled local packaging atelier.
                </p>
              </div>

              {/* Order Info Card */}
              <div className="bg-[#0B0B0B] border border-brand-cream/10 p-8 text-left space-y-4 max-w-md mx-auto">
                <div className="flex justify-between text-xs font-sans text-brand-cream/60">
                  <span className="uppercase tracking-wider">Order ID</span>
                  <span className="text-brand-cream font-medium font-mono">{orderId}</span>
                </div>
                <div className="flex justify-between text-xs font-sans text-brand-cream/60">
                  <span className="uppercase tracking-wider">Estimated Delivery</span>
                  <span className="text-brand-cream font-medium">3 - 5 Business Days</span>
                </div>
                <div className="flex justify-between text-xs font-sans text-brand-cream/60">
                  <span className="uppercase tracking-wider">Shipment Region</span>
                  <span className="text-brand-cream font-medium">{city || 'National Sourced Address'}</span>
                </div>
                <div className="border-t border-brand-cream/10 pt-4 flex justify-between text-xs font-sans">
                  <span className="uppercase tracking-wider text-brand-copper">Amount Transacted</span>
                  <span className="text-brand-gold font-bold text-sm">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* CTA actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 max-w-md mx-auto">
                <button 
                  onClick={handlePrint}
                  className="w-full sm:w-1/2 py-4 text-[9px] font-sans font-semibold uppercase tracking-[0.25em] text-brand-cream bg-transparent border border-brand-cream/20 hover:border-brand-copper hover:text-brand-copper transition-all duration-500 cursor-pointer"
                >
                  Download Invoice
                </button>
                <button 
                  onClick={handleReturnHome}
                  className="w-full sm:w-1/2 py-4 text-[9px] font-sans font-semibold uppercase tracking-[0.25em] text-brand-black bg-brand-copper hover:bg-brand-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all duration-500 border-none cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>

            </div>
          </div>
        ) : (
          /* CHECKOUT TRANSACTION STATE */
          <div className="flex-1 w-full max-w-[1300px] mx-auto px-[6%] py-12 pb-32 lg:pb-12 grid grid-cols-1 lg:grid-cols-12 gap-16 text-left">
            
            {/* Left Column - Form & Payments (7/12 width) */}
            <form onSubmit={handlePaymentSubmit} className="lg:col-span-7 space-y-12">
              
              {/* Step 1: Customer Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-sans font-bold w-6 h-6 rounded-none bg-brand-cream/5 border border-brand-cream/10 flex items-center justify-center text-brand-copper">01</span>
                  <h2 className="font-serif text-lg tracking-wider uppercase text-brand-cream">Shipping & Contact Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-sans uppercase tracking-widest text-brand-cream/50" htmlFor="email">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="collector@luxury.com" 
                      className="w-full bg-[#0B0B0B] border border-brand-cream/10 focus:border-brand-copper px-4 py-3 text-xs text-brand-cream placeholder-brand-cream/20 outline-none transition-colors h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-sans uppercase tracking-widest text-brand-cream/50" htmlFor="name">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Gautam Sen" 
                      className="w-full bg-[#0B0B0B] border border-brand-cream/10 focus:border-brand-copper px-4 py-3 text-xs text-brand-cream placeholder-brand-cream/20 outline-none transition-colors h-11"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[9px] font-sans uppercase tracking-widest text-brand-cream/50" htmlFor="address">Shipping Address</label>
                    <input 
                      type="text" 
                      id="address" 
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Apartment, Suite, Street Address" 
                      className="w-full bg-[#0B0B0B] border border-brand-cream/10 focus:border-brand-copper px-4 py-3 text-xs text-brand-cream placeholder-brand-cream/20 outline-none transition-colors h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-sans uppercase tracking-widest text-brand-cream/50" htmlFor="city">City</label>
                    <input 
                      type="text" 
                      id="city" 
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai" 
                      className="w-full bg-[#0B0B0B] border border-brand-cream/10 focus:border-brand-copper px-4 py-3 text-xs text-brand-cream placeholder-brand-cream/20 outline-none transition-colors h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-sans uppercase tracking-widest text-brand-cream/50" htmlFor="postal">Postal PIN Code</label>
                    <input 
                      type="text" 
                      id="postal" 
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="400001" 
                      className="w-full bg-[#0B0B0B] border border-brand-cream/10 focus:border-brand-copper px-4 py-3 text-xs text-brand-cream placeholder-brand-cream/20 outline-none transition-colors h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-sans font-bold w-6 h-6 rounded-none bg-brand-cream/5 border border-brand-cream/10 flex items-center justify-center text-brand-copper">02</span>
                  <h2 className="font-serif text-lg tracking-wider uppercase text-brand-cream">Bespoke Payment Channel</h2>
                </div>

                {/* Luxury Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-sans border-b border-brand-cream/5 pb-4">
                  {[
                    { id: 'qr', label: 'Scan UPI QR' },
                    { id: 'card', label: 'Credit/Debit' },
                    { id: 'netbanking', label: 'Net Banking' },
                    { id: 'wallets', label: 'Wallets' },
                    { id: 'cod', label: 'Cash On Delivery' }
                  ].map((tab) => (
                    <button 
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`h-12 flex items-center justify-center text-[8px] font-sans font-semibold uppercase tracking-widest border transition-all duration-300 cursor-pointer ${
                        activeTab === tab.id 
                          ? 'border-brand-copper text-brand-copper bg-brand-copper/5' 
                          : 'border-brand-cream/10 text-brand-cream/45 hover:text-brand-cream'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="pt-2">
                  
                  {/* Tab 1: UPI QR (Default & Dynamic) */}
                  {activeTab === 'qr' && (
                    <div className="flex flex-col items-center md:flex-row gap-8 bg-[#0B0B0B] border border-brand-cream/10 p-6 md:p-8">
                      {/* Dynamic QR SVG */}
                      <div className="relative p-2 bg-white border border-brand-copper/30 shadow-[0_0_30px_rgba(198,124,78,0.15)] flex-shrink-0 w-[166px] h-[166px] flex items-center justify-center">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=0b0b0b&bgcolor=ffffff&data=${encodeURIComponent(
                            `upi://pay?pa=9319758795@omni&pn=Mason%20and%20Co&am=${total}&tr=${orderId}&tn=Mason%20Order%20${orderId}&cu=INR`
                          )}`} 
                          alt="Dynamic UPI QR Code" 
                          className="w-[150px] h-[150px] object-contain"
                        />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-white p-1 shadow-md border border-brand-copper/20 flex items-center justify-center">
                          <span className="text-[12px] leading-none select-none">🍂</span>
                        </div>
                      </div>

                      {/* UPI QR Metadata Details */}
                      <div className="flex-1 space-y-5 text-center md:text-left w-full">
                        <div>
                          <span className="text-[7px] font-sans font-bold uppercase tracking-widest text-brand-copper">COMPLIANT UPI INSTANT PAY</span>
                          <h3 className="font-serif text-lg font-light text-brand-cream mt-1">Scan Code or Select UPI Copy</h3>
                        </div>
                        
                        <div className="space-y-3 font-sans text-xs text-brand-cream/60">
                          <div className="flex justify-between items-center bg-[#050505] px-4 py-3 border border-brand-cream/5">
                            <div>
                              <p className="text-[7px] font-sans uppercase tracking-widest text-brand-cream/30 text-left">Merchant VPA ID</p>
                              <p className="text-brand-cream font-mono mt-0.5">9319758795@omni</p>
                            </div>
                            <button 
                              type="button"
                              onClick={handleCopyUpi}
                              className="px-3 py-1.5 text-[8px] font-sans font-bold uppercase tracking-widest text-brand-cream/80 bg-brand-cream/5 hover:bg-brand-copper hover:text-brand-black transition-colors outline-none cursor-pointer border border-brand-cream/10"
                            >
                              {copied ? 'Copied' : 'Copy ID'}
                            </button>
                          </div>

                          {/* UPI Deep link for Mobile Checkout */}
                          <div className="block md:hidden">
                            <a 
                              href={`upi://pay?pa=9319758795@omni&pn=Mason%20And%20Co&tr=${orderId}&am=${total}&cu=INR`}
                              className="w-full py-3.5 px-4 text-[9px] font-sans font-semibold uppercase tracking-widest text-brand-black bg-brand-gold hover:bg-brand-copper transition-colors flex items-center justify-center gap-2 border border-brand-gold text-center select-none cursor-pointer"
                            >
                              ⚡ Open UPI App (GPay / PhonePe)
                            </a>
                            <p className="text-[8px] text-brand-cream/30 font-sans text-center mt-1.5 uppercase tracking-wider">
                              * Tap to pay instantly using any installed UPI App
                            </p>
                          </div>

                          <div className="flex justify-between items-center text-xs">
                            <span className="uppercase tracking-wider">Transaction Amount</span>
                            <span className="text-brand-gold font-bold text-sm">₹{total.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        {/* Interactive QR Refresh Trigger */}
                        <div className="text-left">
                          <button 
                            type="button"
                            onClick={() => {
                              const freshId = `MC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
                              setOrderId(freshId);
                            }}
                            className="text-[8px] font-sans uppercase tracking-[0.25em] text-brand-cream/50 hover:text-brand-copper transition-colors border-b border-brand-cream/20 pb-0.5 bg-transparent border-none cursor-pointer"
                          >
                            Refresh UPI QR Token
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Credit Card */}
                  {activeTab === 'card' && (
                    <div className="bg-[#0B0B0B] border border-brand-cream/10 p-6 md:p-8 space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="sm:col-span-3 space-y-2">
                          <label className="text-[9px] font-sans uppercase tracking-widest text-brand-cream/50" htmlFor="cardnum">Card Number</label>
                          <input 
                            type="text" 
                            id="cardnum" 
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="4111 2222 3333 4444" 
                            maxLength={16}
                            className="w-full bg-[#050505] border border-brand-cream/10 focus:border-brand-copper px-4 py-3 text-xs text-brand-cream placeholder-brand-cream/20 outline-none transition-colors h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-sans uppercase tracking-widest text-brand-cream/50" htmlFor="expiry">Expiry Date</label>
                          <input 
                            type="text" 
                            id="expiry" 
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY" 
                            maxLength={5}
                            className="w-full bg-[#050505] border border-brand-cream/10 focus:border-brand-copper px-4 py-3 text-xs text-brand-cream placeholder-brand-cream/20 outline-none transition-colors h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-sans uppercase tracking-widest text-brand-cream/50" htmlFor="cvv">CVV Code</label>
                          <input 
                            type="password" 
                            id="cvv" 
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="***" 
                            maxLength={3}
                            className="w-full bg-[#050505] border border-brand-cream/10 focus:border-brand-copper px-4 py-3 text-xs text-brand-cream placeholder-brand-cream/20 outline-none transition-colors h-11"
                          />
                        </div>
                        <div className="flex items-end pb-1 text-[10px] text-brand-cream/35 uppercase tracking-wider font-sans">
                          🔒 256-bit SSL secure
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Netbanking */}
                  {activeTab === 'netbanking' && (
                    <div className="bg-[#0B0B0B] border border-brand-cream/10 p-6 md:p-8 space-y-4">
                      <p className="text-[10px] font-sans uppercase tracking-widest text-brand-cream/50">Select Preferred Institution</p>
                      <div className="grid grid-cols-2 gap-3 text-[10px] font-sans uppercase tracking-wider">
                        {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map((bank) => (
                          <div key={bank} className="border border-brand-cream/10 p-4 hover:border-brand-copper hover:bg-brand-cream/5 transition-all cursor-pointer text-left flex justify-between items-center">
                            <span>{bank}</span>
                            <span className="w-1.5 h-1.5 bg-brand-cream/30 rounded-full"></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab 4: Wallets */}
                  {activeTab === 'wallets' && (
                    <div className="bg-[#0B0B0B] border border-brand-cream/10 p-6 md:p-8 space-y-4">
                      <p className="text-[10px] font-sans uppercase tracking-widest text-brand-cream/50">Select Preferred Wallet</p>
                      <div className="grid grid-cols-2 gap-3 text-[10px] font-sans uppercase tracking-wider">
                        {['Paytm', 'Google Pay', 'PhonePe', 'Amazon Pay'].map((wallet) => (
                          <div key={wallet} className="border border-brand-cream/10 p-4 hover:border-brand-copper hover:bg-brand-cream/5 transition-all cursor-pointer text-left flex justify-between items-center">
                            <span>{wallet}</span>
                            <span className="w-1.5 h-1.5 bg-brand-cream/30 rounded-full"></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab 5: COD */}
                  {activeTab === 'cod' && (
                    <div className="bg-[#0B0B0B] border border-brand-cream/10 p-6 md:p-8 space-y-4 text-left">
                      <p className="text-[10px] font-sans uppercase tracking-widest text-brand-cream/50">Cash on Delivery Protocol</p>
                      <p className="text-[11px] font-sans font-light text-brand-cream/70 leading-relaxed">
                        Secure cash transaction verified at delivery. A surcharge of ₹50 applies for COD logistics. Please ensure exact change is ready for our dispatch curator.
                      </p>
                    </div>
                  )}

                </div>
              </div>

              {/* Submit / Simulation Button - Sticky Bottom on Mobile */}
              <div className="fixed bottom-0 left-0 w-full bg-[#070707] border-t border-brand-cream/10 p-4 z-40 lg:relative lg:bottom-auto lg:left-auto lg:bg-transparent lg:border-t-0 lg:p-0 lg:z-auto lg:pt-4">
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-brand-black bg-brand-copper hover:bg-brand-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] disabled:bg-brand-cream/10 disabled:text-brand-cream/30 transition-all duration-500 border-none cursor-pointer flex items-center justify-center gap-2 h-14"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-3.5 h-3.5 border border-brand-black/30 border-t-brand-black animate-spin rounded-full"></span>
                      Confirming Secure Transaction...
                    </>
                  ) : (
                    <>
                      Authorize Payment &bull; ₹{total.toLocaleString('en-IN')}
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Right Column - Order Summary (5/12 width) */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28 lg:h-fit">
              
              <div className="bg-[#080808] border border-brand-cream/10 p-6 md:p-8 space-y-6">
                <h3 className="font-serif text-lg tracking-wider uppercase text-brand-cream pb-4 border-b border-brand-cream/5">
                  Order Summary
                </h3>

                {/* Items List */}
                <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-2 scrollbar-thin">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center gap-4 text-xs font-sans">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#0B0B0B] border border-brand-cream/5 flex-shrink-0 flex items-center justify-center p-1.5">
                          <img src={item.product.image} alt={item.product.title} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div>
                          <p className="font-medium text-brand-cream line-clamp-1">{item.product.title}</p>
                          <p className="text-[8px] text-brand-cream/40 uppercase tracking-widest mt-0.5">{item.quantity} &times; {item.product.weight}</p>
                        </div>
                      </div>
                      <span className="text-brand-gold font-medium">
                        ₹{(parsePrice(item.product.price) * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon input */}
                <div className="border-t border-brand-cream/5 pt-4">
                  {appliedCoupon ? (
                    <div className="flex justify-between items-center bg-[#0C120C] border border-emerald-500/20 px-3 py-2 text-[10px]">
                      <div>
                        <span className="text-emerald-400 font-mono font-bold block">{appliedCoupon.code} APPLIED</span>
                        <span className="text-[8px] text-brand-cream/50 uppercase">
                          {appliedCoupon.discountType === 'percentage' 
                            ? `${appliedCoupon.value}% Reduction` 
                            : appliedCoupon.discountType === 'fixed' 
                              ? `₹${appliedCoupon.value} Reduction` 
                              : 'Free Luxury Shipping'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-[9px] font-sans text-brand-copper uppercase tracking-wider hover:text-brand-cream bg-transparent border-none cursor-pointer focus:outline-none"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promotional Code (GOLDEN20)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 bg-black border border-brand-cream/10 px-3 py-2 text-[10px] text-brand-cream placeholder-brand-cream/20 outline-none focus:border-brand-copper font-mono uppercase"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-brand-cream hover:bg-brand-copper hover:text-brand-black text-brand-black text-[9px] font-sans font-bold uppercase tracking-wider transition-colors border-none cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && <p className="text-[9px] text-brand-copper/80 mt-1.5 uppercase font-sans text-left">{couponError}</p>}
                </div>

                {/* Pricing Tiers */}
                <div className="border-t border-brand-cream/5 pt-4 space-y-3 font-sans text-xs">
                  <div className="flex justify-between text-brand-cream/50">
                    <span className="uppercase tracking-wider">Subtotal</span>
                    <span className="text-brand-cream">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span className="uppercase tracking-wider">Coupon Discount</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  
                  {hasOnDemand && (
                    <div className="text-[8px] font-sans text-brand-copper/80 tracking-wide uppercase leading-normal">
                      * Includes corporate dynamic item curations.
                    </div>
                  )}

                  <div className="flex justify-between text-brand-cream/50">
                    <span className="uppercase tracking-wider">GST (5%)</span>
                    <span className="text-brand-cream">₹{tax.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-brand-cream/50">
                    <span className="uppercase tracking-wider">Luxury Courier</span>
                    <span className="text-brand-cream">
                      {shipping === 0 ? 'Complimentary' : `₹${shipping}`}
                    </span>
                  </div>

                  {activeTab === 'cod' && (
                    <div className="flex justify-between text-brand-cream/50">
                      <span className="uppercase tracking-wider">COD Surcharge</span>
                      <span className="text-brand-cream">₹50</span>
                    </div>
                  )}

                  <div className="border-t border-brand-cream/10 pt-4 flex justify-between text-sm font-serif text-brand-cream">
                    <span className="uppercase tracking-widest text-brand-copper">Certified Total</span>
                    <span className="text-brand-gold font-bold text-base">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Complimentary Trust Badges */}
              <div className="grid grid-cols-2 gap-4 text-center font-sans text-[8px] uppercase tracking-widest text-brand-cream/30">
                <div className="border border-brand-cream/5 p-4 flex flex-col items-center gap-2">
                  <span>🍃</span>
                  <span>100% Organic Cacao</span>
                </div>
                <div className="border border-brand-cream/5 p-4 flex flex-col items-center gap-2">
                  <span>🤝</span>
                  <span>Fair Trade Cooperative</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
