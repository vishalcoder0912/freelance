import Reveal from "./Reveal";
import { caseStudy } from "../data/content";

export default function CaseStudies() {
  return (
    <section className="py-24" id="case-studies">
      <div className="container-main">
        <Reveal>
          <h2 className="font-heading text-4xl text-primary md:text-5xl">Results Beyond Furniture</h2>
        </Reveal>
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <Reveal direction="left">
            <div className="h-full overflow-hidden rounded-sm">
              <img
                src={caseStudy.image}
                alt={caseStudy.client}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <div>
            <Reveal direction="right">
              <h3 className="font-heading text-2xl font-semibold text-primary">{caseStudy.client}</h3>
              <p className="text-sm text-gray-500">{caseStudy.location}</p>
            </Reveal>
            <div className="mt-6 space-y-6">
              <Reveal direction="right" delay={0.1}>
                <div>
                  <h4 className="font-semibold text-secondary">Challenge</h4>
                  <p className="mt-1 text-gray-600">{caseStudy.challenge}</p>
                </div>
              </Reveal>
              <Reveal direction="right" delay={0.2}>
                <div>
                  <h4 className="font-semibold text-secondary">Solution</h4>
                  <p className="mt-1 text-gray-600">{caseStudy.solution}</p>
                </div>
              </Reveal>
              <Reveal direction="right" delay={0.3}>
                <div>
                  <h4 className="font-semibold text-secondary">Outcome</h4>
                  <p className="mt-1 text-gray-600">{caseStudy.outcome}</p>
                </div>
              </Reveal>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {caseStudy.metrics.map((m) => (
                <Reveal key={m.label} direction="up" delay={0.3}>
                  <div className="rounded-sm border border-gray-200 bg-white p-5 text-center shadow-sm">
                    <p className="font-heading text-3xl font-bold text-secondary">{m.value}</p>
                    <p className="mt-1 text-sm text-gray-500">{m.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
