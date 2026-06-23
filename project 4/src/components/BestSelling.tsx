import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { bestSellers } from "../data/content";
import { Button } from "./ui/button";

export default function BestSelling() {
  const ref = useRef<HTMLDivElement>(null!);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="bg-luxury-white py-24" id="products">
      <div className="container-main">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center text-sm uppercase tracking-[0.3em] text-gold"
        >
          Best Sellers
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="mt-4 text-center font-heading text-4xl text-premium-black md:text-5xl lg:text-6xl"
        >
          Our <span className="text-gold">Flagship</span> Products
        </motion.h2>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="group perspective"
            >
              <div className="relative overflow-hidden transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(-5deg)rotateX(5deg)] group-hover:shadow-2xl">
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-premium-black/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="inline-block rounded-full bg-gold/90 px-3 py-1 text-xs font-semibold text-premium-black">
                      {product.warranty} Warranty
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-premium-black">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{product.tagline}</p>
                  <ul className="mt-4 space-y-1.5">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="h-1 w-1 rounded-full bg-gold" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button size="sm" className="w-full">Get Quote</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
