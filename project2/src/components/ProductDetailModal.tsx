"use client";

import React, { useState, useEffect } from 'react';
import { Product, products } from '../data/products';
import { useCart } from '../hooks/useCart';
import { useWishlistStore } from '../store/useWishlistStore';
import { useReviewStore, Review } from '../store/useReviewStore';
import { useAdminStore } from '../store/useAdminStore';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCompare: (product: Product) => void;
  comparedIds: string[];
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCompare,
  comparedIds
}: ProductDetailModalProps) {
  const { addItem, toggleCart } = useCart();
  const { items: wishlistItems, toggleWishlist } = useWishlistStore();
  const { inventory } = useAdminStore();
  
  // Review store actions
  const { getReviewsForProduct, getAverageRating, addReview } = useReviewStore();
  
  // Local state
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'farmer' | 'reviews'>('details');
  const [shareCopied, setShareCopied] = useState(false);
  
  // Review form states
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setQuantity(1);
      setActiveTab('details');
      setReviewSubmitted(false);
      setReviewName('');
      setReviewText('');
      setReviewRating(5);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!product) return null;

  const stock = inventory[product.id] ?? 50;
  const isOutOfStock = stock <= 0;
  const isWishlisted = wishlistItems.includes(product.id);
  const isCompared = comparedIds.includes(product.id);
  
  // Reviews calculations
  const productReviews = getReviewsForProduct(product.id);
  const { rating: avgRating, count: reviewsCount } = getAverageRating(product.id);

  // Recommendations / Cross-sells
  const crossSellId = product.frequentlyBoughtWith[0] || 'sig-dark-75';
  const crossSellProduct = products.find(p => p.id === crossSellId) || products[0];
  const isCrossSellOutOfStock = (inventory[crossSellProduct.id] ?? 50) <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        title: product.title,
        subtitle: product.subtitle,
        image: product.image,
        origin: product.origin,
        flavorNotes: product.flavorNotes,
        ingredients: product.ingredients,
        weight: product.weight,
        price: product.price,
        pairings: product.pairings,
        awards: product.awards,
        story: product.story
      });
    }
    toggleCart(true);
    onClose();
  };

  const handleAddBundle = () => {
    if (isOutOfStock || isCrossSellOutOfStock) return;
    
    // Add primary item
    addItem({
      id: product.id,
      title: product.title,
      subtitle: product.subtitle,
      image: product.image,
      origin: product.origin,
      flavorNotes: product.flavorNotes,
      ingredients: product.ingredients,
      weight: product.weight,
      price: product.price,
      pairings: product.pairings,
      awards: product.awards,
      story: product.story
    });

    // Add recommended item
    addItem({
      id: crossSellProduct.id,
      title: crossSellProduct.title,
      subtitle: crossSellProduct.subtitle,
      image: crossSellProduct.image,
      origin: crossSellProduct.origin,
      flavorNotes: crossSellProduct.flavorNotes,
      ingredients: crossSellProduct.ingredients,
      weight: crossSellProduct.weight,
      price: crossSellProduct.price,
      pairings: crossSellProduct.pairings,
      awards: crossSellProduct.awards,
      story: crossSellProduct.story
    });

    toggleCart(true);
    onClose();
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/product/${product.id}`;
      navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewText) return;
    addReview(product.id, reviewName, reviewRating, reviewText, true);
    setReviewSubmitted(true);
    setReviewText('');
    setReviewName('');
  };

  const parsePriceNum = (priceStr: string): number => {
    if (priceStr.toLowerCase().includes('demand')) return 0;
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
  };

  const productPriceNum = parsePriceNum(product.price);
  const crossSellPriceNum = parsePriceNum(crossSellProduct.price);
  const bundleTotal = Math.round((productPriceNum + crossSellPriceNum) * 0.95); // 5% bundle discount

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 z-50 backdrop-blur-[5px]"
          />

          {/* Slide-out Editorial Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 120 }}
            className="fixed top-0 right-0 h-screen w-full lg:w-[60%] xl:w-[50%] bg-[#080808] border-l border-brand-cream/10 z-50 shadow-2xl flex flex-col pointer-events-auto"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-8 py-6 border-b border-brand-cream/5">
              <span className="text-[8px] font-mono tracking-widest text-brand-copper uppercase">
                Product Dossier / MC-{product.id.toUpperCase()}
              </span>
              <button
                onClick={onClose}
                className="group flex items-center gap-2 text-brand-cream/60 hover:text-brand-cream bg-transparent border-none cursor-pointer focus:outline-none p-1"
                aria-label="Close details"
              >
                <span className="text-[8px] font-sans uppercase tracking-[0.25em] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Close
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin">
              
              {/* Product Hero block */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Left image display */}
                <div className="md:col-span-5 bg-[#040404] aspect-square flex items-center justify-center border border-brand-cream/5 relative group p-6 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-[85%] w-auto object-contain transform group-hover:scale-[1.03] transition-transform duration-[2s]"
                  />
                  {product.cacaoPercentage && (
                    <div className="absolute top-4 left-4 bg-brand-black/80 border border-brand-cream/10 px-2 py-1 text-[8px] font-mono text-brand-gold uppercase tracking-wider">
                      {product.cacaoPercentage}% Cacao
                    </div>
                  )}
                </div>

                {/* Right metadata summary */}
                <div className="md:col-span-7 space-y-4 text-left">
                  <span className="text-[8px] font-sans font-semibold uppercase tracking-[0.35em] text-brand-copper block">
                    {product.subtitle}
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-light text-brand-cream leading-tight">
                    {product.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    {/* Stars */}
                    <div className="flex text-brand-gold gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-[10px]">
                          {i < Math.round(avgRating) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="text-[9px] font-sans uppercase tracking-widest text-brand-cream/45">
                      {avgRating} ({reviewsCount} {reviewsCount === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                  
                  <div className="text-xl font-sans text-brand-gold font-medium pt-2">
                    {product.price}
                  </div>

                  <p className="text-xs font-sans font-light text-brand-cream/65 leading-relaxed italic border-l border-brand-copper/35 pl-4 py-1">
                    &ldquo;{product.story}&rdquo;
                  </p>

                  {/* Actions Bar */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleShare}
                      className="p-2 border border-brand-cream/10 bg-transparent text-brand-cream/60 hover:text-brand-copper hover:border-brand-copper/50 transition-all rounded-none cursor-pointer text-xs flex items-center justify-center focus:outline-none"
                      title="Share product link"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                      </svg>
                      {shareCopied && <span className="ml-2 text-[8px] uppercase tracking-wider text-brand-gold">Copied!</span>}
                    </button>

                    <button
                      onClick={() => onAddToCompare(product)}
                      className={`p-2 border bg-transparent transition-all rounded-none cursor-pointer text-xs flex items-center justify-center focus:outline-none ${
                        isCompared 
                          ? 'border-brand-gold text-brand-gold' 
                          : 'border-brand-cream/10 text-brand-cream/60 hover:text-brand-copper hover:border-brand-copper/50'
                      }`}
                      title={isCompared ? "Compared" : "Compare Product"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                      </svg>
                    </button>

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="p-2 border border-brand-cream/10 bg-transparent text-brand-cream/60 hover:text-brand-copper hover:border-brand-copper/50 transition-all rounded-none cursor-pointer text-xs flex items-center justify-center focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-4 h-4 ${isWishlisted ? 'text-brand-gold' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-8 border-b border-brand-cream/5 text-[9px] font-sans font-semibold uppercase tracking-[0.25em]">
                {['details', 'farmer', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-4 border-b relative focus:outline-none cursor-pointer ${
                      activeTab === tab
                        ? 'text-brand-gold border-brand-copper'
                        : 'text-brand-cream/40 border-transparent hover:text-brand-cream'
                    }`}
                  >
                    {tab} {tab === 'reviews' && `(${productReviews.length})`}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="text-left py-2 min-h-[200px]">
                {activeTab === 'details' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] font-sans font-light leading-relaxed">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-brand-copper font-medium block mb-1">Origin Coordinates</span>
                        <span className="text-brand-cream/80">{product.origin}</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-brand-copper font-medium block mb-1">Flavor Notes</span>
                        <span className="text-brand-cream/80">{product.flavorNotes}</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-brand-copper font-medium block mb-1">Ingredients</span>
                        <span className="text-brand-cream/80">{product.ingredients}</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-brand-copper font-medium block mb-1">Awards</span>
                        <span className="text-brand-gold font-medium italic">{product.awards}</span>
                      </div>
                    </div>
                    
                    <div className="bg-[#050505] p-5 border border-brand-cream/5 space-y-4">
                      <span className="text-[8px] uppercase tracking-widest text-brand-copper font-bold block">Nutritional Matrix (Per 100g)</span>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-brand-cream/40 block text-[9px]">Calories</span>
                          <span className="text-brand-cream text-xs font-mono">{product.nutritionalFacts.calories}</span>
                        </div>
                        <div>
                          <span className="text-brand-cream/40 block text-[9px]">Total Fat</span>
                          <span className="text-brand-cream text-xs font-mono">{product.nutritionalFacts.fat}</span>
                        </div>
                        <div>
                          <span className="text-brand-cream/40 block text-[9px]">Sugar</span>
                          <span className="text-brand-cream text-xs font-mono">{product.nutritionalFacts.sugar}</span>
                        </div>
                        <div>
                          <span className="text-brand-cream/40 block text-[9px]">Protein</span>
                          <span className="text-brand-cream text-xs font-mono">{product.nutritionalFacts.protein}</span>
                        </div>
                      </div>
                      <div className="text-[8px] text-brand-cream/30 pt-2 border-t border-brand-cream/5">
                        * Values are certified organic, raw-tested micro-batch calculations.
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'farmer' && (
                  <div className="space-y-4 text-left font-sans font-light text-[11px] leading-relaxed">
                    <div className="flex flex-col sm:flex-row gap-4 items-baseline">
                      <span className="text-brand-gold font-serif text-lg font-light">{product.farmerSpotlight.name}</span>
                      <span className="text-[8px] uppercase tracking-widest text-brand-copper font-mono">{product.farmerSpotlight.location}</span>
                    </div>
                    <div className="w-12 h-[1px] bg-brand-copper/30" />
                    <p className="text-brand-cream/70 leading-relaxed italic">
                      &ldquo;{product.farmerSpotlight.story}&rdquo;
                    </p>
                    <p className="text-brand-cream/50 text-[10px]">
                      By maintaining direct trade relationships, Mason & Co returns premium values back to rural estate collectives, financing local water conservation efforts.
                    </p>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-8">
                    {/* Review List */}
                    <div className="space-y-4 divide-y divide-brand-cream/5">
                      {productReviews.length === 0 ? (
                        <p className="text-[10px] font-sans uppercase tracking-widest text-brand-cream/30 italic">No reviews submitted yet. Be the first to catalog your experience.</p>
                      ) : (
                        productReviews.map((rev) => (
                          <div key={rev.id} className="pt-4 first:pt-0 space-y-2 text-left">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <span className="text-xs font-medium text-brand-cream block">{rev.author}</span>
                                <span className="text-[8px] font-mono text-brand-cream/40">{new Date(rev.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex gap-2 items-center">
                                {rev.isVerified && (
                                  <span className="text-[7px] border border-brand-gold/30 px-1.5 py-0.5 rounded-none font-mono text-brand-gold uppercase tracking-wider bg-brand-gold/5">
                                    Verified Collector
                                  </span>
                                )}
                                <div className="text-brand-gold text-[9px] font-mono">
                                  {rev.rating} ★
                                </div>
                              </div>
                            </div>
                            <p className="text-[11px] font-sans font-light leading-relaxed text-brand-cream/75 italic">
                              &ldquo;{rev.text}&rdquo;
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Submit Review Form */}
                    {reviewSubmitted ? (
                      <div className="bg-[#050505] p-5 border border-brand-gold/20 text-center space-y-3">
                        <span className="text-[8px] font-sans font-semibold uppercase tracking-[0.3em] text-brand-gold block">Review Submitted</span>
                        <p className="text-[10px] font-sans font-light text-brand-cream/60">Thank you. Your tasting catalog entry has been certified and logged.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="bg-[#040404] p-6 border border-brand-cream/5 space-y-4">
                        <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-brand-copper block">Catalog Your Tasting Experience</span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[8px] font-sans uppercase tracking-wider text-brand-cream/50">Your Name</label>
                            <input
                              type="text"
                              required
                              value={reviewName}
                              onChange={(e) => setReviewName(e.target.value)}
                              className="w-full bg-[#080808] border border-brand-cream/10 px-3 py-2 text-[10px] text-brand-cream focus:outline-none focus:border-brand-copper font-sans"
                              placeholder="e.g. Anand R."
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-[8px] font-sans uppercase tracking-wider text-brand-cream/50">Sensory Score (Rating)</label>
                            <select
                              value={reviewRating}
                              onChange={(e) => setReviewRating(parseInt(e.target.value))}
                              className="w-full bg-[#080808] border border-brand-cream/10 px-3 py-2 text-[10px] text-brand-cream focus:outline-none focus:border-brand-copper font-sans"
                            >
                              <option value={5}>5 ★ - Absolute Luxury</option>
                              <option value={4}>4 ★ - Premium Complex</option>
                              <option value={3}>3 ★ - Balanced Traditional</option>
                              <option value={2}>2 ★ - Moderate Acidity</option>
                              <option value={1}>1 ★ - Needs Refining</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-sans uppercase tracking-wider text-brand-cream/50">Tasting Journal Notes</label>
                          <textarea
                            required
                            rows={3}
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="w-full bg-[#080808] border border-brand-cream/10 px-3 py-2 text-[10px] text-brand-cream focus:outline-none focus:border-brand-copper font-sans resize-none"
                            placeholder="Describe flavor notes, texture, acidity, and mouthfeel..."
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 text-[8px] font-sans font-semibold uppercase tracking-[0.25em] text-brand-black bg-brand-cream hover:bg-brand-copper hover:text-brand-black transition-all duration-500 border-none cursor-pointer focus:outline-none"
                        >
                          Submit Curation Review
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Frequently Bought Together (Bundles Cross Sell) */}
              <div className="border-t border-brand-cream/5 pt-8 space-y-4 text-left">
                <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-brand-copper block">Frequently Sourced Together</span>
                <div className="bg-[#050505] p-5 border border-brand-cream/5 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4">
                    {/* Primary Mini image */}
                    <div className="w-12 h-12 bg-black flex items-center justify-center border border-brand-cream/5 overflow-hidden p-1">
                      <img src={product.image} className="max-h-full object-contain" alt={product.title} />
                    </div>
                    <span className="text-brand-cream/40 text-xs font-mono">+</span>
                    {/* Secondary Mini image */}
                    <div className="w-12 h-12 bg-black flex items-center justify-center border border-brand-cream/5 overflow-hidden p-1">
                      <img src={crossSellProduct.image} className="max-h-full object-contain" alt={crossSellProduct.title} />
                    </div>
                    <div className="text-left space-y-1">
                      <p className="text-[10px] font-serif text-brand-cream leading-tight">
                        {product.title} + {crossSellProduct.title}
                      </p>
                      <p className="text-[8px] font-mono text-brand-gold uppercase tracking-wider">
                        Atelier Terroir Bundle (Save 5%)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-brand-cream/45 line-through font-mono mr-2">
                        ₹{productPriceNum + crossSellPriceNum}
                      </span>
                      <span className="text-xs text-brand-gold font-bold font-sans">
                        ₹{bundleTotal}
                      </span>
                    </div>
                    <button
                      onClick={handleAddBundle}
                      disabled={isOutOfStock || isCrossSellOutOfStock}
                      className="px-4 py-2.5 bg-brand-gold hover:bg-brand-copper text-brand-black text-[8px] font-sans font-semibold uppercase tracking-[0.2em] border-none cursor-pointer focus:outline-none transition-colors duration-500"
                    >
                      Acquire Bundle
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer Controls (Sticky Add to Cart) */}
            <div className="bg-[#050505] border-t border-brand-cream/5 p-8 flex justify-between items-center gap-6">
              
              {/* Quantity selector */}
              {!isOutOfStock && (
                <div className="flex items-center border border-brand-cream/10 bg-black h-12">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 h-full text-brand-cream/50 hover:text-brand-cream hover:bg-brand-cream/5 flex items-center justify-center transition-all border-none cursor-pointer focus:outline-none"
                  >
                    —
                  </button>
                  <span className="px-4 text-[10px] font-mono text-brand-cream select-none">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(stock, q + 1))}
                    className="px-4 h-full text-brand-cream/50 hover:text-brand-cream hover:bg-brand-cream/5 flex items-center justify-center transition-all border-none cursor-pointer focus:outline-none"
                  >
                    +
                  </button>
                </div>
              )}

              {/* Purchase button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 h-12 flex items-center justify-center text-center text-[9px] font-sans font-semibold uppercase tracking-[0.25em] transition-all duration-500 border-none focus:outline-none ${
                  isOutOfStock
                    ? 'bg-transparent border border-brand-cream/10 text-brand-cream/20 cursor-not-allowed'
                    : 'bg-brand-copper hover:bg-brand-gold text-brand-black hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] cursor-pointer'
                }`}
              >
                {isOutOfStock ? 'Catalog Depleted (Out of Stock)' : `Acquire Curation — ${product.price}`}
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
