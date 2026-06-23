import Reveal from "./Reveal";
import { testimonials } from "../data/content";

export default function Testimonials() {
  return (
    <section className="bg-primary py-24">
      <div className="container-main">
        <Reveal>
          <h2 className="font-heading text-4xl text-white md:text-5xl">What Our Clients Say</h2>
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal key={item.name} direction="up" delay={i * 0.15}>
              <div className="rounded-sm border border-white/10 bg-white/5 p-8 backdrop-blur">
                <p className="text-lg leading-relaxed text-gray-200">
                  "{item.text}"
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-sm text-gray-400">
                      {item.salon}, {item.location}
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-secondary">
                  {"★".repeat(item.rating)}
                  {"☆".repeat(5 - item.rating)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
