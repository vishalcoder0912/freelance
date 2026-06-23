import Reveal from "./Reveal";
import { collections } from "../data/content";

export default function Collections() {
  return (
    <section className="bg-primary py-24" id="collections">
      <div className="container-main">
        <Reveal>
          <h2 className="font-heading text-4xl text-white md:text-5xl">Explore Collections</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {collections.map((item, i) => (
            <Reveal key={item.id} direction="up" delay={i * 0.15}>
              <div className="group relative h-80 cursor-pointer overflow-hidden rounded-sm">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/90 via-primary/30 to-transparent p-8">
                  <h3 className="font-heading text-2xl font-semibold text-white transition duration-300 group-hover:text-secondary">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-gray-300 transition duration-300 group-hover:translate-y-0 translate-y-2">
                    {item.description}
                  </p>
                  <span className="mt-3 inline-block text-sm text-secondary opacity-0 transition duration-300 group-hover:opacity-100">
                    Explore →
                  </span>
                </div>
                <div className="absolute inset-0 border border-white/0 transition duration-300 group-hover:border-secondary" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
