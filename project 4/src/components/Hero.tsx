import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden bg-primary">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
      <div className="container-main relative z-10 grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal direction="up">
            <h1 className="font-heading text-5xl leading-tight text-white md:text-6xl lg:text-7xl">
              Build a Salon
              <br />
              <span className="text-secondary">Clients Remember.</span>
            </h1>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <p className="mt-6 text-lg leading-relaxed text-gray-300 md:text-xl">
              Premium salon furniture engineered for luxury salons, barber lounges, and beauty chains across India.
            </p>
          </Reveal>
          <Reveal direction="up" delay={0.4}>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#quote"
                className="inline-block bg-secondary px-8 py-4 font-semibold text-primary transition hover:bg-yellow-400"
              >
                Get Project Quote
              </a>
              <a
                href="#collections"
                className="inline-block border border-white/30 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                Explore Collections
              </a>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.6}>
            <ul className="mt-10 grid grid-cols-2 gap-3 text-sm text-gray-400">
              {["Factory Direct Pricing", "5000+ Salons Furnished", "Pan India Delivery", "Custom Manufacturing"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-secondary">✓</span>
                    {item}
                  </li>
                )
              )}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
