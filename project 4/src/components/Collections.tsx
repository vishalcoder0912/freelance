import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { collections } from "../data/content";
import { ArrowRight } from "lucide-react";
import SafeImage from "./ui/SafeImage";

const getCollectionIcon = (title: string) => {
  switch (title) {
    case "Unisex Chairs": return "🪑";
    case "Barber Chairs": return "💈";
    case "Manicure-Pedicure Stations": return "💅";
    case "Hair Wash Stations": return "🚿";
    case "Beauty Machine": return "⚡";
    case "Nail Art": return "🎨";
    case "Salon Accessories": return "⚙️";
    case "Reception Desk": return "🏢";
    default: return "🛋️";
  }
};

export default function Collections() {
  const ref = useRef<HTMLDivElement>(null!);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="bg-[#fcfbfa] py-24" id="collections">
      <div className="container-main">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-gray-100 pb-8">
          <div className="text-left">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="text-xs font-bold uppercase tracking-[0.3em] text-gold"
            >
              THE SELECTION
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="mt-3 font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-premium-black"
            >
              Premium Salon Furniture.
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <a
              href="#collections"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#555] hover:text-gold transition-colors duration-300 group"
            >
              VIEW ALL CATEGORIES
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 text-gold" />
            </a>
          </motion.div>
        </div>

        {/* 8 Categories Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="group bg-white rounded-2xl border border-gray-150 shadow-sm p-4 flex flex-col justify-between h-[340px] cursor-pointer transition-all duration-300 hover:scale-102 hover:shadow-xl hover:border-[#dfd4a3]"
            >
              {/* Product Image Container */}
              <div className="w-full h-[210px] rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center relative p-3">
                <SafeImage
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                  fallbackIcon={getCollectionIcon(item.title)}
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Card Footer Content */}
              <div className="pt-4 pb-2 flex items-center justify-between">
                <div className="text-left flex-1 pr-4">
                  <h3 className="font-heading text-lg font-bold text-[#222] group-hover:text-gold transition-colors duration-300 leading-tight">
                    {item.title}
                  </h3>
                  {/* Underline matching the screenshot */}
                  <div className="w-8 h-[1px] bg-gray-300 mt-2 group-hover:w-full group-hover:bg-gold transition-all duration-500" />
                </div>
                
                {/* Arrow Button appearing on hover */}
                <div className="w-8 h-8 rounded-full border border-[#dfd4a3] bg-transparent text-gold flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex-shrink-0">
                  <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
