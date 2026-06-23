import Reveal from "./Reveal";
import { benefits } from "../data/content";

export default function WhySalonFactory() {
  return (
    <section className="py-24" id="why-us">
      <div className="container-main grid items-center gap-12 lg:grid-cols-2">
        <Reveal direction="left">
          <div className="h-[500px] overflow-hidden rounded-sm">
            <img
              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80"
              alt="Salon Factory Manufacturing"
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
        <div>
          <Reveal direction="right">
            <h2 className="font-heading text-4xl text-primary md:text-5xl">Why Salon Factory</h2>
          </Reveal>
          <div className="mt-10 space-y-8">
            {benefits.map((item, i) => (
              <Reveal key={item.title} direction="right" delay={i * 0.15}>
                <div className="group flex gap-5 border-l-2 border-secondary/30 p-4 transition hover:border-secondary">
                  <div className="mt-1 text-2xl">{item.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-primary">{item.title}</h3>
                    <p className="mt-1 text-gray-600">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
