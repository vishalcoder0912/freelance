import { useState } from "react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackIcon?: string;
}

export default function SafeImage({
  src,
  alt,
  className,
  fallbackIcon = "🛋️",
  ...props
}: SafeImageProps) {
  const [errorCount, setErrorCount] = useState(0);

  // If both Unsplash and Picsum fail, show CSS fallback
  if (errorCount >= 2) {
    return (
      <div className={`w-full h-full bg-gradient-to-tr from-[#f2f1ea] to-[#ffffff] flex flex-col items-center justify-center border border-[#dfd4a3]/20 p-6 text-center select-none ${className}`}>
        <span className="text-4xl filter drop-shadow-sm mb-3">{fallbackIcon}</span>
        <span className="text-[11px] font-black text-gold uppercase tracking-[0.2em]">{alt || "Salon Product"}</span>
      </div>
    );
  }

  // Determine current source
  let currentSrc = src;
  if (errorCount === 1 && src) {
    // Generate a seeded picsum URL based on the alt text
    const seed = encodeURIComponent(alt || "salon-furniture");
    currentSrc = `https://picsum.photos/seed/${seed}/800/600`;
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => setErrorCount((prev) => prev + 1)}
      {...props}
    />
  );
}
