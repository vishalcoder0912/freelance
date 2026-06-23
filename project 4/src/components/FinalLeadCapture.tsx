import { useState } from "react";
import Reveal from "./Reveal";

export default function FinalLeadCapture() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    projectType: "",
    budget: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Consultation requested! (Firebase integration pending)");
  };

  return (
    <section
      className="relative flex items-center py-24"
      id="quote"
    >
      <div
        className="absolute inset-0 bg-cover bg-center brightness-50"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80)",
        }}
      />
      <div className="container-main relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="font-heading text-4xl text-white md:text-5xl">
              Planning Your Next Salon?
              <br />
              <span className="text-secondary">Let's Build It Together.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <form onSubmit={handleSubmit} className="mt-10 space-y-4">
              <input
                type="text"
                placeholder="Full Name *"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-white/20 bg-white/10 px-5 py-4 text-white placeholder-gray-400 focus:border-secondary focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-white/20 bg-white/10 px-5 py-4 text-white placeholder-gray-400 focus:border-secondary focus:outline-none"
              />
              <input
                type="text"
                placeholder="City *"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border border-white/20 bg-white/10 px-5 py-4 text-white placeholder-gray-400 focus:border-secondary focus:outline-none"
              />
              <select
                value={form.projectType}
                onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                className="w-full border border-white/20 bg-white/10 px-5 py-4 text-gray-300 focus:border-secondary focus:outline-none"
              >
                <option value="">Project Type</option>
                <option value="salon">Salon</option>
                <option value="barber">Barber Lounge</option>
                <option value="spa">Spa & Wellness</option>
                <option value="nail">Nail Studio</option>
                <option value="other">Other</option>
              </select>
              <select
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                className="w-full border border-white/20 bg-white/10 px-5 py-4 text-gray-300 focus:border-secondary focus:outline-none"
              >
                <option value="">Budget Range</option>
                <option value="2-5">₹2L - ₹5L</option>
                <option value="5-10">₹5L - ₹10L</option>
                <option value="10-20">₹10L - ₹20L</option>
                <option value="20+">₹20L+</option>
              </select>
              <button
                type="submit"
                className="w-full bg-secondary px-10 py-4 text-lg font-semibold text-primary transition hover:bg-yellow-400"
              >
                Request Consultation
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
