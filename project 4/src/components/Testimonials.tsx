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
    <section ref={ref} className="bg-premium-black py-24">
      <div className="container-main">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center text-sm uppercase tracking-[0.3em] text-gold"
        >
          Testimonials
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="mt-4 text-center font-heading text-4xl text-luxury-white md:text-5xl lg:text-6xl"
        >
          What Our <span className="text-gold">Clients Say</span>
        </motion.h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="group rounded-sm border border-white/10 bg-white/5 p-8 backdrop-blur transition-all duration-500 hover:bg-white/10 hover:border-gold/30"
            >
              <div className="text-gold text-lg">
                {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
              </div>
              <p className="mt-4 text-lg leading-relaxed text-gray-300">"{item.text}"</p>
              <div className="mt-6 flex items-center gap-4">
                <img src={item.image} alt={item.name} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-luxury-white">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.salon}, {item.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
