"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, MapPin, Briefcase } from "lucide-react";

const STARS = [
  { id: 1, name: "Arjun Sharma", role: "SDE-2 at Google", salary: "₹42 LPA", prev: "Fresher", duration: "8 months", skills: ["DSA", "System Design", "Go"], x: 20, y: 30, size: 12, color: "#7CFFB2", story: "I was a 2023 fresher with no internships. CareerVeda AI built my roadmap, I practiced 300+ problems, did 40 mock interviews. Got the Google offer in 8 months." },
  { id: 2, name: "Priya Nair", role: "PM at Razorpay", salary: "₹28 LPA", prev: "Support Engineer", duration: "5 months", skills: ["Product Thinking", "SQL", "User Research"], x: 50, y: 20, size: 10, color: "#6C63FF", story: "Switched from support to PM with CareerVeda's career switch program. The AI mentor matched me with a Razorpay PM who guided me every step." },
  { id: 3, name: "Rahul Verma", role: "ML Engineer at Swiggy", salary: "₹32 LPA", prev: "Python Developer", duration: "6 months", skills: ["PyTorch", "MLOps", "AWS"], x: 75, y: 35, size: 14, color: "#00D4FF", story: "The AI Skill Gap detector found I needed MLOps skills. Completed the roadmap, built 3 projects, and landed Swiggy in 6 months. Resume AI got me 12 calls in a week." },
  { id: 4, name: "Sneha Reddy", role: "Frontend at Microsoft", salary: "₹24 LPA", prev: "Freelancer", duration: "4 months", skills: ["React", "TypeScript", "System Design"], x: 35, y: 65, size: 9, color: "#F59E0B", story: "Was freelancing for 2 years with no corporate experience. The CareerVeda roadmap and mock interview coach helped me crack Microsoft MSIDC in 4 months." },
  { id: 5, name: "Karan Mehta", role: "DevOps at Amazon", salary: "₹35 LPA", prev: "IT Admin", duration: "7 months", skills: ["AWS", "Kubernetes", "Terraform"], x: 65, y: 70, size: 11, color: "#EF4444", story: "Transitioned from IT Admin to DevOps. The dream job simulator showed me exactly what Amazon wanted. Got the offer letter on my 28th birthday." },
  { id: 6, name: "Ananya Singh", role: "Data Scientist at Flipkart", salary: "₹22 LPA", prev: "Statistics Student", duration: "5 months", skills: ["Python", "ML", "Spark"], x: 85, y: 55, size: 8, color: "#7CFFB2", story: "Fresh out of college with a Stats degree. The AI roadmap bridged my academic knowledge to industry skills. Got placed before graduation." },
];

export default function SuccessGalaxySection() {
  const [selected, setSelected] = useState<typeof STARS[0] | null>(null);

  return (
    <section className="section" id="success">
      <div className="container-cv">
        <div className="text-center mb-16">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-[#7CFFB2] font-semibold mb-3 tracking-widest text-sm uppercase">
            Success Galaxy
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold mb-4">
            Every Star Has a{" "}
            <span className="gradient-text-accent">Story</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-[#94A3B8] text-lg max-w-xl mx-auto">
            Click on any star to read their journey from student to top professional.
          </motion.p>
        </div>

        {/* Galaxy */}
        <div className="relative h-96 md:h-[500px] glass-card rounded-3xl overflow-hidden mb-8">
          {/* Background stars */}
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
                animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}

          {/* Success stars */}
          {STARS.map((star) => (
            <motion.button
              key={star.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
              onClick={() => setSelected(star)}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: star.id * 0.5 }}
            >
              <div
                className="rounded-full cursor-pointer transition-all group-hover:scale-150"
                style={{
                  width: star.size,
                  height: star.size,
                  background: star.color,
                  boxShadow: `0 0 ${star.size * 2}px ${star.color}80`,
                }}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap">
                <div className="glass-card rounded-xl px-3 py-2 text-xs">
                  <p className="font-semibold" style={{ color: star.color }}>{star.name}</p>
                  <p className="text-[#94A3B8]">{star.role}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(5,8,22,0.8)] backdrop-blur-sm"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card-strong rounded-3xl p-8 max-w-lg w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black" style={{ background: `${selected.color}20`, border: `1px solid ${selected.color}40`, color: selected.color }}>
                      {selected.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{selected.name}</h3>
                      <p className="text-sm" style={{ color: selected.color }}>{selected.role}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-xl glass-card flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)]">
                    <X size={16} />
                  </button>
                </div>

                <p className="text-[#94A3B8] text-sm leading-relaxed mb-6">&ldquo;{selected.story}&rdquo;</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="glass-card rounded-xl p-3 text-center">
                    <TrendingUp size={16} className="mx-auto mb-1 text-[#7CFFB2]" />
                    <div className="font-bold text-sm text-[#7CFFB2]">{selected.salary}</div>
                    <div className="text-xs text-[#94A3B8]">Package</div>
                  </div>
                  <div className="glass-card rounded-xl p-3 text-center">
                    <MapPin size={16} className="mx-auto mb-1 text-[#00D4FF]" />
                    <div className="font-bold text-sm text-[#00D4FF]">{selected.duration}</div>
                    <div className="text-xs text-[#94A3B8]">Journey</div>
                  </div>
                  <div className="glass-card rounded-xl p-3 text-center">
                    <Briefcase size={16} className="mx-auto mb-1 text-[#F59E0B]" />
                    <div className="font-bold text-sm text-[#F59E0B]">{selected.prev}</div>
                    <div className="text-xs text-[#94A3B8]">Before</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selected.skills.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-xl text-xs font-medium" style={{ background: `${selected.color}15`, color: selected.color, border: `1px solid ${selected.color}25` }}>{s}</span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
