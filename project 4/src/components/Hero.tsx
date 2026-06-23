import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Truck, Tag, Palette, Award, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import SafeImage from "./ui/SafeImage";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80",
    name: "Luxury Backwash Stations",
  },
  {
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80",
    name: "Heavy Duty Barber Chairs",
  },
  {
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&q=80",
    name: "Ergonomic Styling Chairs",
  },
];

const highlights = [
  {
    title: "1 Year On-Site",
    desc: "Metro cities, pan-India",
    icon: Award,
  },
  {
    title: "Bulk Dispatch",
    desc: "Chains & franchise setups",
    icon: Truck,
  },
  {
    title: "Wholesale Pricing",
    desc: "No retail markup",
    icon: Tag,
  },
  {
    title: "Customization",
    desc: "Tailored to your needs",
    icon: Palette,
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full bg-[#fcfbfa] pt-28 lg:pt-36">
      {/* Hero Content Fold */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8 pb-20">
          
          {/* Text content - Left column */}
          <div className="lg:col-span-6 space-y-6 text-left z-10">
            {/* Gold Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[#f2edd8] border border-[#dfd4a3] px-4 py-1.5 rounded-full"
            >
              <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#937b2d] uppercase flex items-center gap-1">
                ★ INDIA'S #1 SALON FURNITURE MANUFACTURER
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-premium-black leading-[1.1]"
            >
              Premium Salon & <br />
              <span className="font-script text-gold font-normal italic tracking-normal block mt-2 normal-case">
                Barber Furniture.
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl font-body leading-relaxed"
            >
              Direct from the factory to your salon. You dream it, we build it to perfection. Highly customizable, ergonomic, and built to last.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <a href="#collections">
                <Button className="rounded-full shadow-lg hover:shadow-xl shadow-gold/20 flex items-center gap-2 group transition-all">
                  Explore Collection
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Button>
              </a>
              <a href="#contact">
                <Button variant="outline" className="rounded-full border-premium-black text-premium-black hover:bg-premium-black/5">
                  Get a Bulk Quote
                </Button>
              </a>
            </motion.div>

            {/* In-row benefits */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-gray-100 text-gray-500 text-[10px] sm:text-xs font-semibold tracking-wider"
            >
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-gold" />
                <span>PAN-INDIA DELIVERY</span>
              </div>
              <div className="h-3 w-px bg-gray-200 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-gold" />
                <span>1 YEAR WARRANTY</span>
              </div>
              <div className="h-3 w-px bg-gray-200 hidden sm:block" />
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-gold" />
                <span>FACTORY DIRECT</span>
              </div>
            </motion.div>
          </div>

          {/* Fading Slider - Right column */}
          <div className="lg:col-span-6 relative h-[350px] sm:h-[450px] lg:h-[500px] w-full rounded-2xl overflow-hidden bg-gray-100 shadow-xl border border-gray-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <SafeImage
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].name}
                  className="h-full w-full object-cover"
                  fallbackIcon="💈"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white text-left">
                  <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Featured Product</span>
                  <p className="font-heading text-lg sm:text-xl font-bold">{slides[currentSlide].name}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Dots */}
            <div className="absolute bottom-6 right-6 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === i ? "w-6 bg-gold" : "w-2 bg-white/50"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Core Highlights Grid (Beige background bar below fold) */}
      <div className="w-full bg-[#f5f4ed] border-t border-b border-gray-150 py-10 shadow-inner">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm transition-all duration-300 hover:scale-102 hover:shadow-md cursor-pointer"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fcfbfa] border border-[#e8dfc3] text-gold flex-shrink-0">
                    <IconComp size={22} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-premium-black uppercase tracking-wider">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
