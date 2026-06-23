import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

export default function Calculator() {
  const [size, setSize] = useState(500);
  const [chairs, setChairs] = useState(4);
  const [barber, setBarber] = useState(2);
  const [wash, setWash] = useState(2);
  const [premium, setPremium] = useState(false);

  const estimate = ((size * 600) + (chairs * 35000) + (barber * 28000) + (wash * 40000)) * (premium ? 1.5 : 1);

  return (
    <section className="bg-premium-black py-24" id="calculator">
      <div className="container-main">
        <div className="mx-auto max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-sm uppercase tracking-[0.3em] text-gold"
          >
            Investment Planning
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-center font-heading text-4xl text-luxury-white md:text-5xl"
          >
            Calculate Your Salon Setup Investment
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-12 rounded-sm border border-white/10 bg-white/5 p-8 backdrop-blur"
          >
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <label className="flex justify-between text-sm text-gray-400">
                  <span>Salon Size</span>
                  <span className="text-gold">{size} sq ft</span>
                </label>
                <input type="range" min={200} max={3000} value={size} onChange={(e) => setSize(+e.target.value)} className="mt-2 w-full accent-gold" />
              </div>
              <div>
                <label className="flex justify-between text-sm text-gray-400">
                  <span>Styling Chairs</span>
                  <span className="text-gold">{chairs}</span>
                </label>
                <input type="range" min={0} max={20} value={chairs} onChange={(e) => setChairs(+e.target.value)} className="mt-2 w-full accent-gold" />
              </div>
              <div>
                <label className="flex justify-between text-sm text-gray-400">
                  <span>Barber Chairs</span>
                  <span className="text-gold">{barber}</span>
                </label>
                <input type="range" min={0} max={10} value={barber} onChange={(e) => setBarber(+e.target.value)} className="mt-2 w-full accent-gold" />
              </div>
              <div>
                <label className="flex justify-between text-sm text-gray-400">
                  <span>Wash Stations</span>
                  <span className="text-gold">{wash}</span>
                </label>
                <input type="range" min={0} max={10} value={wash} onChange={(e) => setWash(+e.target.value)} className="mt-2 w-full accent-gold" />
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <input type="checkbox" id="premium" checked={premium} onChange={(e) => setPremium(e.target.checked)} className="h-5 w-5 accent-gold" />
                <label htmlFor="premium" className="text-sm text-gray-400">Premium Quality Materials & Finishes</label>
              </div>
            </div>

            <div className="mt-10 border-t border-white/10 pt-8 text-center">
              <p className="text-sm uppercase tracking-wider text-gray-500">Estimated Investment</p>
              <p className="mt-2 font-heading text-5xl font-bold text-gold md:text-6xl">
                ₹{(estimate / 100000).toFixed(1)}L
              </p>
              <p className="mt-1 text-gray-500">(₹{estimate.toLocaleString("en-IN")})</p>
              <div className="mt-6 flex justify-center gap-4">
                <Button size="lg">Get Detailed Proposal</Button>
                <Button size="lg" variant="outline">Download Report</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
