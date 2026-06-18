"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import CinematicImage from "./CinematicImage";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageAlt: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Mouse coordinates relative to card center for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for smooth movement
  const springConfig = { damping: 25, stiffness: 200, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Normalized values between -0.5 and 0.5
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative group w-full bg-[#140d0b] border border-[#c58c48]/10 rounded-md p-4 flex flex-col justify-between transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)] hover:border-[#e5ad6b]/20"
    >
      <div style={{ transform: "translateZ(30px)" }} className="relative z-10">
        {/* Aspect Ratio 4:5 image container */}
        <CinematicImage
          alt={product.imageAlt}
          aspectRatio="4:5"
          effectType="product"
          className="w-full"
        />

        {/* Product Details overlay info */}
        <div className="mt-5 flex flex-col">
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#d4af37]">
            {product.category}
          </span>
          <h3 className="font-serif text-lg md:text-xl text-[#f8eadc] mt-1.5 font-medium group-hover:text-[#e5ad6b] transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-xs text-[#c8b5a4] mt-2 leading-relaxed font-light line-clamp-2 h-8">
            {product.description}
          </p>
        </div>
      </div>

      <div
        style={{ transform: "translateZ(15px)" }}
        className="mt-6 flex items-center justify-between z-10 pt-4 border-t border-[#c58c48]/10"
      >
        <span className="font-mono text-sm text-[#f8eadc] font-semibold">
          ₹{product.price.toLocaleString("en-IN")}
        </span>

        {/* Magnetic Button effect inside card */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-sm bg-[#c58c48] text-[#090605] text-[9px] uppercase tracking-[0.2em] font-bold transition-all duration-300 hover:bg-[#e5ad6b]"
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}
