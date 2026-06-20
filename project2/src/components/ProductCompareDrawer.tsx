"use client";

import React, { useState } from 'react';
import { Product } from '../data/products';
import { useCart } from '../hooks/useCart';
import { useAdminStore } from '../store/useAdminStore';

interface ProductCompareDrawerProps {
  comparedProducts: Product[];
  onRemove: (productId: string) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductCompareDrawer({
  comparedProducts,
  onRemove,
  onClear,
  isOpen,
  onClose
}: ProductCompareDrawerProps) {
  const { addItem, toggleCart } = useCart();
  const { inventory } = useAdminStore();
  const [minimized, setMinimized] = useState(false);

  if (!isOpen || comparedProducts.length === 0) return null;

  const handleAddComparedToCart = (product: Product) => {
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
    <div className="fixed bottom-0 left-0 w-full z-45 bg-[#080808] border-t border-brand-cream/15 text-brand-cream transition-all duration-500 shadow-[0_-10px_30px_rgba(0,0,0,0.95)] max-h-screen overflow-hidden">
      
      {/* Header controls bar */}
      <div className="flex justify-between items-center px-6 py-4 bg-[#050505] border-b border-brand-cream/5">
        <div className="flex items-center gap-3">
          <span className="text-[8px] font-mono tracking-widest text-brand-copper uppercase">Terroir Comparator</span>
          <span className="text-[8px] font-sans border border-brand-cream/10 px-2 py-0.5 uppercase tracking-widest bg-brand-cream/5 text-brand-gold">
            {comparedProducts.length} Sourced Bar{comparedProducts.length > 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMinimized(!minimized)}
            className="text-[9px] font-sans uppercase tracking-widest text-brand-cream/60 hover:text-brand-cream bg-transparent border-none cursor-pointer focus:outline-none py-1 px-2"
          >
            {minimized ? "Expand Matrix" : "Minimize"}
          </button>
          
          <button
            onClick={onClear}
            className="text-[9px] font-sans uppercase tracking-widest text-brand-copper hover:text-brand-cream bg-transparent border-none cursor-pointer focus:outline-none py-1 px-2"
          >
            Clear All
          </button>

          <button
            onClick={onClose}
            className="text-brand-cream/60 hover:text-brand-cream bg-transparent border-none cursor-pointer focus:outline-none p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main comparative table content */}
      {!minimized && (
        <div className="overflow-x-auto w-full p-6 select-none max-h-[50vh] scrollbar-thin">
          <div className="min-w-[700px] grid grid-cols-4 gap-6 text-left">
            
            {/* Left Column labels */}
            <div className="space-y-6 text-[8px] font-sans font-bold uppercase tracking-widest text-brand-copper flex flex-col justify-between py-2.5">
              <div className="h-24 flex items-center">Product Specimen</div>
              <div className="border-t border-brand-cream/5 pt-3">Acquisition Cost</div>
              <div className="border-t border-brand-cream/5 pt-3">Cacao Terroir %</div>
              <div className="border-t border-brand-cream/5 pt-3">Weight Curation</div>
              <div className="border-t border-brand-cream/5 pt-3">Estate Coordinates</div>
              <div className="border-t border-brand-cream/5 pt-3">Tasting Notes</div>
              <div className="border-t border-brand-cream/5 pt-3">Inclusions</div>
              <div className="border-t border-brand-cream/5 pt-3">Sommelier Pairings</div>
              <div className="border-t border-brand-cream/5 pt-3">Catalog Actions</div>
            </div>

            {/* Product Columns (up to 3 products) */}
            {[0, 1, 2].map((idx) => {
              const product = comparedProducts[idx];
              if (!product) {
                return (
                  <div key={idx} className="border border-dashed border-brand-cream/5 bg-black/20 flex flex-col items-center justify-center h-full p-8 text-center text-[9px] font-sans tracking-widest uppercase text-brand-cream/20 italic">
                    Add another bar <br /> to compare
                  </div>
                );
              }

              const stock = inventory[product.id] ?? 50;
              const isOutOfStock = stock <= 0;

              return (
                <div key={product.id} className="space-y-6 text-[10px] font-sans font-light text-brand-cream/80 relative">
                  
                  {/* Floating Remove Button */}
                  <button
                    onClick={() => onRemove(product.id)}
                    className="absolute top-0 right-0 p-1 hover:text-brand-copper transition-colors focus:outline-none bg-transparent border-none cursor-pointer"
                    title="Remove specimen"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Header card info */}
                  <div className="h-24 flex gap-3 items-center pr-6">
                    <div className="w-16 h-16 bg-black border border-brand-cream/5 flex items-center justify-center p-1.5 overflow-hidden flex-shrink-0">
                      <img src={product.image} className="max-h-full object-contain" alt={product.title} />
                    </div>
                    <div>
                      <h4 className="font-serif text-[11px] font-light text-brand-cream leading-tight">{product.title}</h4>
                      <p className="text-[7px] text-brand-cream/40 uppercase tracking-wider mt-0.5">{product.subtitle}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="border-t border-brand-cream/5 pt-3 text-brand-gold font-medium font-sans">
                    {product.price}
                  </div>

                  {/* Cacao % */}
                  <div className="border-t border-brand-cream/5 pt-3 font-mono font-bold text-brand-cream">
                    {product.cacaoPercentage ? `${product.cacaoPercentage}% Cacao` : 'Blend Collection'}
                  </div>

                  {/* Weight */}
                  <div className="border-t border-brand-cream/5 pt-3">
                    {product.weight}
                  </div>

                  {/* Origin */}
                  <div className="border-t border-brand-cream/5 pt-3 text-brand-cream/70 line-clamp-1" title={product.origin}>
                    {product.origin}
                  </div>

                  {/* Flavor Notes */}
                  <div className="border-t border-brand-cream/5 pt-3 text-brand-cream/70 italic line-clamp-2 leading-relaxed">
                    &ldquo;{product.flavorNotes}&rdquo;
                  </div>

                  {/* Ingredients */}
                  <div className="border-t border-brand-cream/5 pt-3 text-brand-cream/60 line-clamp-2 leading-relaxed" title={product.ingredients}>
                    {product.ingredients}
                  </div>

                  {/* Pairings */}
                  <div className="border-t border-brand-cream/5 pt-3 text-brand-cream/70 line-clamp-1" title={product.pairings}>
                    {product.pairings}
                  </div>

                  {/* Action Button */}
                  <div className="border-t border-brand-cream/5 pt-3 pr-2">
                    <button
                      onClick={() => handleAddComparedToCart(product)}
                      disabled={isOutOfStock}
                      className={`w-full py-2.5 text-[8px] font-sans font-semibold uppercase tracking-[0.2em] border transition-all duration-500 focus:outline-none cursor-pointer ${
                        isOutOfStock
                          ? 'bg-transparent border-brand-cream/10 text-brand-cream/20 cursor-not-allowed'
                          : 'bg-brand-copper border-brand-copper text-brand-black hover:bg-brand-gold hover:border-brand-gold'
                      }`}
                    >
                      Acquire Bar
                    </button>
                  </div>

                </div>
              );
            })}

          </div>
        </div>
      )}

    </div>
  );
}
