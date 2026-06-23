import Reveal from "./Reveal";
import { manufacturingSteps } from "../data/content";

export default function ManufacturingProcess() {
  return (
    <section className="bg-surface py-24">
      <div className="container-main">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="font-heading text-4xl text-primary md:text-5xl">
              Built Inside Our Factory.
              <br />
              <span className="text-secondary">Trusted Across India.</span>
            </h2>
          </Reveal>
        </div>
        <div className="mt-16">
          <div className="relative flex flex-col items-center gap-0 md:flex-row md:justify-between">
            <div className="absolute left-6 top-0 hidden h-full w-px bg-secondary/30 md:left-1/2 md:-translate-x-1/2 md:block" />
            {manufacturingSteps.map((step, i) => (
              <Reveal key={step} direction="up" delay={i * 0.12}>
                <div className="relative z-10 flex flex-col items-center px-6 py-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-secondary bg-primary text-lg font-bold text-secondary">
                    {i + 1}
                  </div>
                  <p className="mt-3 text-center font-semibold text-primary">{step}</p>
                  {i < manufacturingSteps.length - 1 && (
                    <span className="mt-1 text-2xl text-secondary/40 md:hidden">↓</span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
