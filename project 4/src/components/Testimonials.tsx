import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const testimonials = [
  {
    name: "Priya Sharma",
    salon: "Blush Beauty Studio",
    location: "Mumbai",
    rating: 5,
    text: "Salon Factory furnished all three of our branches. The quality is exceptional and their team understood our vision perfectly. Our clients immediately noticed the upgrade.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
  {
    name: "Rahul Verma",
    salon: "The Barber Collective",
    location: "Bangalore",
    rating: 5,
    text: "The hydraulic chairs are built like tanks. Six months of heavy use and they still feel brand new. The gold finish adds a premium touch our clients love.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
  {
    name: "Ananya Kapoor",
    salon: "IVÉRA™ House of Grooming",
    location: "Delhi",
    rating: 5,
    text: "They didn't just supply furniture — they helped us design the entire layout. Our per-customer revenue increased 40% after the renovation.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  },
];

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null!);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="bg-[#faf9f6] py-24 border-b border-gray-100">
      <div className="container-main">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center text-sm uppercase tracking-[0.3em] text-gold font-bold font-body"
        >
          Testimonials
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="mt-4 text-center font-heading text-4xl font-bold text-premium-black md:text-5xl lg:text-6xl"
        >
          What Our <span className="text-gold">Clients Say</span>
        </motion.h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="group rounded-2xl border border-gray-150 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gold/40 cursor-pointer flex flex-col justify-between text-left"
            >
              <div>
                <div className="text-gold text-lg flex gap-0.5">
                  {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                </div>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-600 font-body italic">
                  "{item.text}"
                </p>
              </div>
              
              <div className="mt-6 flex items-center gap-4 pt-4 border-t border-gray-50">
                <img src={item.image} alt={item.name} className="h-12 w-12 rounded-full object-cover border border-gray-100 shadow-inner" />
                <div>
                  <p className="font-bold text-premium-black text-sm sm:text-base font-body">{item.name}</p>
                  <p className="text-xs text-gray-500 font-semibold">{item.salon}, {item.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
