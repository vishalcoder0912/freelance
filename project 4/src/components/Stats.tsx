import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { statsData } from "../data/content";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null!);

  useGSAP(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current.querySelector(".stat-value"),
        { innerText: 0 },
        {
          innerText: value,
          duration: 2,
          ease: "power2.out",
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
          },
        }
      );
    }
  }, []);

  return (
    <div ref={ref} className="text-center">
      <p className="stat-value font-heading text-5xl font-bold text-gold md:text-6xl">
        {0}{suffix}
      </p>
      <p className="mt-2 text-sm uppercase tracking-wider text-gray-500">{label}</p>
    </div>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null!);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="bg-beige py-20 border-y border-gold/10">
      <div className="container-main">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {statsData.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <StatItem {...stat} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
