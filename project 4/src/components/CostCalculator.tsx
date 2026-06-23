import { useState } from "react";
import Reveal from "./Reveal";

export default function CostCalculator() {
  const [size, setSize] = useState(500);
  const [chairs, setChairs] = useState(4);
  const [wash, setWash] = useState(2);
  const [premium, setPremium] = useState(false);

  const estimatedPrice = (() => {
    let base = size * 800;
    base += chairs * 35000;
    base += wash * 45000;
    if (premium) base *= 1.5;
    return base;
  })();

  return (
    <section className="bg-surface py-24" id="calculator">
      <div className="container-main">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <Reveal>
              <h2 className="font-heading text-4xl text-primary md:text-5xl">Salon Cost Calculator</h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-3 text-lg text-gray-600">Estimate your salon setup investment instantly.</p>
            </Reveal>
          </div>
          <Reveal direction="up" delay={0.3}>
            <div className="mt-10 rounded-sm bg-white p-8 shadow-md">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-primary">Salon Size (sq ft): {size}</label>
                  <input
                    type="range"
                    min={200}
                    max={3000}
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="mt-2 w-full accent-secondary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-primary">Styling Chairs: {chairs}</label>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={chairs}
                    onChange={(e) => setChairs(Number(e.target.value))}
                    className="mt-2 w-full accent-secondary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-primary">Wash Stations: {wash}</label>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={wash}
                    onChange={(e) => setWash(Number(e.target.value))}
                    className="mt-2 w-full accent-secondary"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-primary">Premium Quality</label>
                  <input
                    type="checkbox"
                    checked={premium}
                    onChange={(e) => setPremium(e.target.checked)}
                    className="h-5 w-5 accent-secondary"
                  />
                </div>
              </div>
              <div className="mt-8 border-t border-gray-100 pt-6 text-center">
                <p className="text-sm text-gray-500">Estimated Investment</p>
                <p className="font-heading text-5xl font-bold text-secondary">
                  ₹{(estimatedPrice / 100000).toFixed(1)}L
                </p>
                <p className="mt-1 text-lg text-gray-500">
                  (₹{estimatedPrice.toLocaleString("en-IN")})
                </p>
                <button className="mt-6 inline-block bg-secondary px-10 py-4 font-semibold text-primary transition hover:bg-yellow-400">
                  Get Detailed Quote
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
