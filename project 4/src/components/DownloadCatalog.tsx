import { useState } from "react";
import Reveal from "./Reveal";

export default function DownloadCatalog() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Catalog download initiated (Firebase integration pending).");
  };

  return (
    <section className="bg-primary py-24" id="catalog">
      <div className="container-main grid items-center gap-12 lg:grid-cols-2">
        <Reveal direction="left">
          <div>
            <h2 className="font-heading text-4xl text-white md:text-5xl">Download 2026 Catalog</h2>
            <p className="mt-4 text-lg text-gray-300">
              Browse our complete collection of premium salon furniture and infrastructure solutions.
            </p>
            <div className="mt-8">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80"
                alt="Catalog Preview"
                className="rounded-sm shadow-lg"
              />
            </div>
          </div>
        </Reveal>
        <Reveal direction="right">
          <form onSubmit={handleSubmit} className="rounded-sm bg-white/5 border border-white/10 p-8 backdrop-blur">
            <h3 className="text-xl font-semibold text-white">Get Your Free Copy</h3>
            <div className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Full Name *"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:border-secondary focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email Address *"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:border-secondary focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:border-secondary focus:outline-none"
              />
              <input
                type="text"
                placeholder="City *"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:border-secondary focus:outline-none"
              />
              <button
                type="submit"
                className="w-full bg-secondary px-8 py-4 font-semibold text-primary transition hover:bg-yellow-400"
              >
                Download 2026 Catalog
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
