"use client";
import React from 'react';
import { ReactLenis } from 'lenis/react';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple style easeOutExpo
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
