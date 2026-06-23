import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const items = [
  { label: "5000+ Salons Furnished", value: 5000, suffix: "+" },
  { label: "25+ States Delivered", value: 25, suffix: "+" },
  { label: "100+ Salon Chains", value: 100, suffix: "+" },
  { label: "1 Year Warranty", value: 1, suffix: "" },
  { label: "Factory Direct", value: 100, suffix: "%" },
];

function CountUp({ target, suffix, isActive }: { target: number; suffix: string; isActive: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isActive, target]);

  return (
    <span>
      {Math.round(count)}
      {suffix}
    </span>
  );
}

export default function TrustBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="bg-accent py-10">
      <div className="container-main">
        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-5">
          {items.map((item) => (
            <div key={item.label}>
              <p className="font-heading text-3xl font-bold text-secondary md:text-4xl">
                <CountUp target={item.value} suffix={item.suffix} isActive={isInView} />
              </p>
              <p className="mt-1 text-sm text-gray-400">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
