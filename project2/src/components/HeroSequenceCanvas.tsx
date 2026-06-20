"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroSequenceCanvasProps {
  scrollProgress: number; // 0 to 1
}

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  speedFactor: number;
}

export default function HeroSequenceCanvas({ scrollProgress }: HeroSequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const currentFrameRef = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  // Mouse coords for depth parallax
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  
  // Dust particles overlay inside canvas
  const dustParticlesRef = useRef<DustParticle[]>([]);

  // Virtualized image frame cache
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const lastBufferedFrameRef = useRef(-999);

  // Interpolated focal points for mobile panning to center cacao pod and storytelling elements
  const getFocalPoint = (idx: number): { fx: number; fy: number } => {
    if (idx <= 40) {
      const t = idx / 40;
      return { fx: 0.4 + t * 0.08, fy: 0.5 };
    } else if (idx <= 100) {
      const t = (idx - 40) / 60;
      return { fx: 0.48 + t * 0.10, fy: 0.5 };
    } else if (idx <= 160) {
      const t = (idx - 100) / 60;
      return { fx: 0.58 - t * 0.06, fy: 0.55 };
    } else {
      const t = Math.min(1, (idx - 160) / 40);
      return { fx: 0.52 - t * 0.02, fy: 0.5 };
    }
  };

  // Manage sliding window frame buffer
  const manageFrameBuffer = (centerFrame: number) => {
    const cache = cacheRef.current;
    const totalFrames = 240;
    
    // Virtual window configurations (Ahead-look priority for down scroll)
    // Reduce buffer and unload window size on mobile to optimize performance and save bandwidth
    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;
    const bufferAhead = isMobileDevice ? 12 : 25;   
    const bufferBehind = isMobileDevice ? 6 : 10;  
    
    // Retention window thresholds
    const unloadAhead = isMobileDevice ? 20 : 45;   
    const unloadBehind = isMobileDevice ? 10 : 20;  

    const start = Math.max(0, centerFrame - bufferBehind);
    const end = Math.min(totalFrames - 1, centerFrame + bufferAhead);

    // 1. Fetch missing frames inside active buffer window
    for (let i = start; i <= end; i++) {
      if (!cache.has(i)) {
        const img = new Image();
        const paddedIndex = String(i + 1).padStart(3, "0");
        img.src = `/images/ezgif-frame-${paddedIndex}.webp`;
        cache.set(i, img);
      }
    }

    // 2. Garbage collect distant frames to free GPU/Browser memory
    cache.forEach((img, idx) => {
      // Retain first 15 frames so that returning to top is always instant
      if (idx < 15) return;

      if (idx < centerFrame - unloadBehind || idx > centerFrame + unloadAhead) {
        img.onload = null;
        img.onerror = null;
        img.src = ''; // Cancels pending network download
        cache.delete(idx);
      }
    });
  };

  // 1. Initial preload of first 15 frames for instant boot
  useEffect(() => {
    const initialCount = 15;
    let loadedCount = 0;
    const cache = cacheRef.current;

    for (let i = 0; i < initialCount; i++) {
      const img = new Image();
      const paddedIndex = String(i + 1).padStart(3, "0");
      img.onload = () => {
        loadedCount++;
        setLoadingPercent(Math.round((loadedCount / initialCount) * 100));
        if (loadedCount === initialCount) {
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        setLoadingPercent(Math.round((loadedCount / initialCount) * 100));
        if (loadedCount === initialCount) {
          setIsLoaded(true);
        }
      };
      img.src = `/images/ezgif-frame-${paddedIndex}.webp`;
      cache.set(i, img);
    }

    // Initialize 2D canvas dust particles (approx 60 dots on desktop, 25 on mobile)
    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;
    const particlesCount = isMobileDevice ? 25 : 60;
    const particles: DustParticle[] = [];
    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.5,
        size: 0.8 + Math.random() * 1.8,
        opacity: 0.15 + Math.random() * 0.45,
        speedFactor: 0.8 + Math.random() * 0.8,
      });
    }
    dustParticlesRef.current = particles;

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      // Clean up all loaded images
      cache.forEach((img) => {
        img.onload = null;
        img.onerror = null;
        img.src = '';
      });
      cache.clear();
    };
  }, []);

  // 2. Track mouse position for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseMoveEvent) => {
      if (typeof window === "undefined") return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      mouseRef.current.targetX = (clientX / innerWidth) - 0.5;
      mouseRef.current.targetY = (clientY / innerHeight) - 0.5;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 3. Render Canvas animation loop
  useEffect(() => {
    if (!isLoaded) return;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animationFrameId.current = requestAnimationFrame(render);
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animationFrameId.current = requestAnimationFrame(render);
        return;
      }

      // Optimize canvas dimensions dynamically
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      
      // Cap device pixel ratio on mobile to optimize GPU and improve FPS
      const rawDpr = window.devicePixelRatio || 1;
      const dpr = isMobile ? Math.min(1.5, rawDpr) : rawDpr;
      
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);
      }

      // Lerp mouse positions for smooth panning
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Lerp frame scrubbing
      const targetFrame = scrollProgress * 239;
      currentFrameRef.current += (targetFrame - currentFrameRef.current) * 0.12;

      // Clamp frame index
      const frameIndex = Math.max(0, Math.min(239, Math.round(currentFrameRef.current)));
      
      // Manage buffering window
      if (Math.abs(frameIndex - lastBufferedFrameRef.current) > 3) {
        lastBufferedFrameRef.current = frameIndex;
        manageFrameBuffer(frameIndex);
      }

      const cache = cacheRef.current;
      let img = cache.get(frameIndex);

      // Fallback: draw closest loaded frame from buffer cache if target is still downloading
      if (img && !img.complete) {
        let closestImg = null;
        for (let offset = 1; offset < 240; offset++) {
          const prevIdx = frameIndex - offset;
          const nextIdx = frameIndex + offset;
          
          if (prevIdx >= 0 && cache.has(prevIdx)) {
            const prevImg = cache.get(prevIdx)!;
            if (prevImg.complete) {
              closestImg = prevImg;
              break;
            }
          }
          if (nextIdx < 240 && cache.has(nextIdx)) {
            const nextImg = cache.get(nextIdx)!;
            if (nextImg.complete) {
              closestImg = nextImg;
              break;
            }
          }
        }
        if (closestImg) {
          img = closestImg;
        }
      }

      if (img && img.complete) {
        ctx.clearRect(0, 0, width, height);

        // Aspect ratio calculations (object-fit: cover)
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;
        let dWidth = width;
        let dHeight = height;

        if (imgRatio > canvasRatio) {
          dWidth = height * imgRatio;
        } else {
          dHeight = width / imgRatio;
        }

        // Dynamic focal point calculations on mobile
        let focalX = 0.5;
        let focalY = 0.5;
        if (isMobile) {
          const fp = getFocalPoint(frameIndex);
          focalX = fp.fx;
          focalY = fp.fy;
        }

        // Calculate rendering position based on focal point
        let renderX = width / 2 - focalX * dWidth;
        let renderY = height / 2 - focalY * dHeight;

        // Clamp to avoid black margins
        if (imgRatio > canvasRatio) {
          renderX = Math.max(width - dWidth, Math.min(0, renderX));
          renderY = 0;
        } else {
          renderY = Math.max(height - dHeight, Math.min(0, renderY));
          renderX = 0;
        }

        // Scale and pan values (reduced values on mobile to avoid motion sickness and fit cropped area)
        const offsetScale = isMobile ? 1.02 : 1.06;
        const panMax = isMobile ? 20 : 45;
        const panX = -mouse.x * panMax;
        const panY = -mouse.y * panMax;

        ctx.save();
        ctx.translate(renderX + dWidth / 2 + panX, renderY + dHeight / 2 + panY);
        ctx.scale(offsetScale, offsetScale);
        ctx.drawImage(img, -dWidth / 2, -dHeight / 2, dWidth, dHeight);
        ctx.restore();

        // 4. Draw Floating Dust Particles inside the Canvas
        ctx.save();
        const particles = dustParticlesRef.current;
        particles.forEach((p) => {
          p.x += p.vx + mouse.x * 0.5 * p.speedFactor;
          p.y += p.vy * p.speedFactor + mouse.y * 0.5 * p.speedFactor;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          
          ctx.fillStyle = `rgba(198, 124, 78, ${p.opacity})`;
          
          // Disable canvas shadows on mobile to increase rendering speed and prevent lag
          if (!isMobile) {
            ctx.shadowBlur = 4;
            ctx.shadowColor = "#C67C4E";
          }
          
          ctx.fill();
        });
        ctx.restore();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isLoaded, scrollProgress]);

  // 5. Cinematic Zoom transition: scale and fade out Canvas at 95%-100%
  const zoomFactor = scrollProgress >= 0.95 
    ? 1.0 + (scrollProgress - 0.95) * 60.0 
    : 1.0;
  
  const opacityFactor = scrollProgress >= 0.95
    ? Math.max(0, 1.0 - (scrollProgress - 0.95) * 20.0) 
    : 1.0;

  return (
    <div className="absolute inset-0 w-full h-full bg-brand-black overflow-hidden z-0 select-none pointer-events-none">
      
      {/* 240-Frame Canvas Engine */}
      <div 
        ref={containerRef}
        className="w-full h-full origin-center transition-transform duration-100 ease-out"
        style={{
          transform: `scale(${zoomFactor})`,
          opacity: opacityFactor,
        }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
      </div>

      {/* Cinematic Overlays (above the Canvas) */}

      {/* Gradient Vignette (frames the luxury scene) */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: "radial-gradient(circle, transparent 20%, rgba(40, 24, 17, 0.65) 70%, #24150E 100%)",
        }}
      />

      {/* Luxury Film Grain Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035] select-none mix-blend-overlay animate-grain" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Luxury Loading Screen Overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-brand-black flex flex-col justify-center items-center z-[999] pointer-events-auto"
          >
            <div className="flex flex-col items-center gap-6 max-w-[400px] text-center px-6">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="font-serif text-3xl font-extralight tracking-[0.4em] text-brand-cream"
              >
                MASON & CO
              </motion.span>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "120px" }}
                transition={{ duration: 1.0, delay: 0.2 }}
                className="h-[1px] bg-brand-copper/30"
              />
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-[10px] uppercase tracking-[0.25em] text-brand-cream"
              >
                PREPARING THE CINEMATIC JOURNEY
              </motion.span>
              
              {/* Dynamic Percent Indicator */}
              <div className="font-serif text-4xl text-brand-gold italic mt-2">
                {loadingPercent}%
              </div>
              
              {/* Loading Bar */}
              <div className="w-48 h-[2px] bg-brand-cream/15 rounded-none overflow-hidden mt-2">
                <div 
                  className="h-full bg-brand-gold transition-all duration-300 ease-out" 
                  style={{ width: `${loadingPercent}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Custom mouse event type helper
type MouseMoveEvent = {
  clientX: number;
  clientY: number;
};
