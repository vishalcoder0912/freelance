import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

export default function Calculator() {
  const [size, setSize] = useState(500);
  const [chairs, setChairs] = useState(4);
  const [barber, setBarber] = useState(2);
  const [wash, setWash] = useState(2);
  const [premium, setPremium] = useState(false);

  const estimate = ((size * 650) + (chairs * 35000) + (barber * 28000) + (wash * 40000)) * (premium ? 1.45 : 1);

  return (
    <section className="bg-[#fcfbfa] py-24 border-b border-gray-100" id="calculator">
      <div className="container-main">
        <div className="mx-auto max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-sm uppercase tracking-[0.3em] text-gold font-bold font-body"
          >
            Investment Planning
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-center font-heading text-4xl font-bold text-premium-black md:text-5xl"
          >
            Calculate Your Salon Setup Investment
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-12 rounded-2xl border border-gray-150 bg-white p-6 sm:p-10 shadow-lg text-left"
          >
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <label className="flex justify-between text-sm font-semibold text-gray-700">
                  <span>Salon Size</span>
                  <span className="text-gold font-bold">{size} sq ft</span>
                </label>
                <input
                  type="range"
                  min={200}
                  max={3000}
                  step={50}
                  value={size}
                  onChange={(e) => setSize(+e.target.value)}
                  className="mt-3.5 w-full accent-gold h-2 bg-gray-100 rounded-lg cursor-pointer"
                />
              </div>
              
              <div>
                <label className="flex justify-between text-sm font-semibold text-gray-700">
                  <span>Styling Chairs</span>
                  <span className="text-gold font-bold">{chairs}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={chairs}
                  onChange={(e) => setChairs(+e.target.value)}
                  className="mt-3.5 w-full accent-gold h-2 bg-gray-100 rounded-lg cursor-pointer"
                />
              </div>
              
              <div>
                <label className="flex justify-between text-sm font-semibold text-gray-700">
                  <span>Barber Chairs</span>
                  <span className="text-gold font-bold">{barber}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={barber}
                  onChange={(e) => setBarber(+e.target.value)}
                  className="mt-3.5 w-full accent-gold h-2 bg-gray-100 rounded-lg cursor-pointer"
                />
              </div>
              
              <div>
                <label className="flex justify-between text-sm font-semibold text-gray-700">
                  <span>Wash Stations</span>
                  <span className="text-gold font-bold">{wash}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={wash}
                  onChange={(e) => setWash(+e.target.value)}
                  className="mt-3.5 w-full accent-gold h-2 bg-gray-100 rounded-lg cursor-pointer"
                />
              </div>
              
              <div className="flex items-center gap-3.5 md:col-span-2 py-2">
                <input
                  type="checkbox"
                  id="premium"
                  checked={premium}
                  onChange={(e) => setPremium(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-gold focus:ring-gold accent-gold cursor-pointer"
                />
                <label htmlFor="premium" className="text-sm font-semibold text-gray-600 cursor-pointer select-none">
                  Upgrade to Premium Italian/Rose-Gold Finishes
                </label>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-100 pt-8 text-center space-y-4">
              <p className="text-xs uppercase font-extrabold tracking-widest text-gray-400">Estimated Investment Range</p>
              <div>
                <p className="font-heading text-5xl sm:text-6xl font-black text-gold">
                  ₹{(estimate / 100000).toFixed(1)}L
                </p>
                <p className="text-sm text-gray-500 font-semibold mt-1">
                  (Approx. ₹{estimate.toLocaleString("en-IN")})
                </p>
              </div>
              
              <div className="mt-6 flex flex-wrap justify-center gap-4 pt-2">
                <a href="#contact">
                  <Button size="lg" className="rounded-full shadow-md hover:shadow-lg">
                    Get Detailed Proposal
                  </Button>
                </a>
                <Button size="lg" variant="outline" className="rounded-full border-premium-black text-premium-black hover:bg-premium-black/5">
                  Download Price List
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
