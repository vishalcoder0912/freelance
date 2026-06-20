"use client";

import React, { useState } from 'react';
import { products, Product } from '../data/products';
import { useCart } from '../hooks/useCart';
import { useWishlistStore } from '../store/useWishlistStore';
import { useAdminStore } from '../store/useAdminStore';

interface ProductCatalogProps {
  onOpenDetail: (product: Product) => void;
  onAddToCompare: (product: Product) => void;
  comparedIds: string[];
}

const CATEGORIES = [
  "All",
  "Best Sellers",
  "Dark Chocolate",
  "Milk Chocolate",
  "Single Origin",
  "Limited Editions",
  "Gift Boxes",
  "Festive Collections",
  "Chocolate Bundles",
  "Subscriptions",
  "Corporate Gifting"
];

export default function ProductCatalog({ onOpenDetail, onAddToCompare, comparedIds }: ProductCatalogProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const { addItem, toggleCart } = useCart();
  const { items: wishlistItems, toggleWishlist } = useWishlistStore();
  const { inventory } = useAdminStore();

  // Filter products by category
  const filteredProducts = products.filter(product => {
    if (activeCategory === "All") return true;
    return product.category.includes(activeCategory);
  });

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    
    // Check stock
    const stock = inventory[product.id] ?? 50;
    if (stock <= 0) return;

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
    toggleCart(true);
  };

  return (
    <div id="product-collection" className="w-full bg-[#060606] py-24 px-[6%] border-t border-brand-cream/5 text-brand-cream relative">
      <div className="max-w-[1300px] mx-auto space-y-16">
        
        {/* Title Block */}
        <div className="text-center space-y-4">
          <span className="text-[8px] font-sans font-semibold uppercase tracking-[0.35em] text-brand-copper block">
            ATELIER BROWSER
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-brand-cream">
            The Product Ecosystem
          </h2>
          <div className="w-16 h-[1px] bg-brand-copper/30 mx-auto" />
          <p className="text-[10px] font-sans text-brand-cream/40 uppercase tracking-widest max-w-md mx-auto leading-relaxed">
            Filter our certified micro-batch curations by terroir, harvest, or presentation.
          </p>
        </div>

        {/* Categories Scroller Tabs */}
        <div className="w-full overflow-x-auto pb-4 scrollbar-none flex justify-start md:justify-center border-b border-brand-cream/5">
          <div className="flex gap-8 px-4 whitespace-nowrap">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`pb-4 text-[9px] font-sans font-medium uppercase tracking-[0.25em] transition-all duration-300 border-b relative focus:outline-none cursor-pointer ${
                  activeCategory === category
                    ? 'text-brand-gold border-brand-copper font-semibold'
                    : 'text-brand-cream/45 border-transparent hover:text-brand-cream'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlistItems.includes(product.id);
            const isCompared = comparedIds.includes(product.id);
            const stock = inventory[product.id] ?? 50;
            const isOutOfStock = stock <= 0;

            return (
              <div
                key={product.id}
                onClick={() => onOpenDetail(product)}
                className="group bg-[#0A0A0A] border border-brand-cream/5 flex flex-col justify-between hover:border-brand-copper/30 transition-all duration-700 relative cursor-pointer overflow-hidden"
              >
                {/* Wishlist and Compare floating controls */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCompare(product);
                    }}
                    className={`p-2 bg-black/60 hover:bg-brand-copper hover:text-brand-black transition-all border border-brand-cream/10 rounded-full focus:outline-none cursor-pointer ${
                      isCompared ? 'text-brand-gold border-brand-gold' : 'text-brand-cream/70'
                    }`}
                    title={isCompared ? "Compared" : "Add to Compare"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="p-2 bg-black/60 hover:bg-brand-copper hover:text-brand-black transition-all border border-brand-cream/10 rounded-full focus:outline-none cursor-pointer"
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={isWishlisted ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className={`w-4 h-4 ${isWishlisted ? 'text-brand-gold' : 'text-brand-cream/70'}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </button>
                </div>

                {/* Product Image Panel */}
                <div className="h-64 w-full bg-[#040404] flex items-center justify-center relative p-6 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-[85%] w-auto object-contain transform group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Apple light sweep reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-brand-cream/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2s] ease-out pointer-events-none" />
                  
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                      <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.25em] text-brand-copper border border-brand-copper/35 px-4 py-2">
                        Atelier Depleted
                      </span>
                    </div>
                  )}

                  {product.cacaoPercentage && (
                    <div className="absolute bottom-4 left-4 bg-brand-black/80 border border-brand-cream/10 px-2 py-1 text-[8px] font-mono text-brand-gold uppercase tracking-wider">
                      {product.cacaoPercentage}% Cacao
                    </div>
                  )}
                </div>

                {/* Details Footer */}
                <div className="p-6 space-y-4 bg-[#0A0A0A] flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-xs font-serif font-light text-brand-cream group-hover:text-brand-copper transition-colors duration-300">
                          {product.title}
                        </h3>
                        <p className="text-[8px] font-sans tracking-widest text-brand-cream/40 uppercase mt-1">
                          {product.subtitle}
                        </p>
                      </div>
                      <span className="text-[11px] font-sans text-brand-gold font-medium">
                        {product.price}
                      </span>
                    </div>
                    
                    <p className="text-[9px] font-sans font-light italic text-brand-cream/50 mt-3 line-clamp-2 leading-relaxed">
                      {product.flavorNotes}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-brand-cream/5 flex justify-between items-center gap-3">
                    <span className="text-[8px] font-sans uppercase tracking-widest text-brand-cream/30">
                      {product.weight}
                    </span>
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      disabled={isOutOfStock}
                      className={`px-4 py-2.5 text-[8px] font-sans font-semibold uppercase tracking-[0.2em] border transition-all duration-500 flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer ${
                        isOutOfStock
                          ? 'bg-transparent border-brand-cream/10 text-brand-cream/20 cursor-not-allowed'
                          : 'bg-brand-copper border-brand-copper text-brand-black hover:bg-brand-gold hover:border-brand-gold'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Acquire
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
