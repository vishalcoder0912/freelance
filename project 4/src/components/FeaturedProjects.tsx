import Reveal from "./Reveal";
import { projects } from "../data/content";

export default function FeaturedProjects() {
  return (
    <section className="py-24" id="projects">
      <div className="container-main">
        <div className="mb-14 text-center">
          <Reveal>
            <h2 className="font-heading text-4xl text-primary md:text-5xl">Spaces We Helped Create</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 text-lg text-gray-600">Real salon transformations across India.</p>
          </Reveal>
        </div>
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {projects.map((project, i) => (
            <Reveal key={project.id} direction="up" delay={i * 0.1}>
              <div className="group relative mb-6 cursor-pointer overflow-hidden rounded-sm">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/80 via-transparent to-transparent p-6 opacity-0 transition group-hover:opacity-100">
                  <h3 className="font-heading text-xl font-semibold text-white">{project.title}</h3>
                  <p className="text-sm text-gray-300">
                    {project.location} · {project.industry}
                  </p>
                  <p className="mt-2 text-secondary font-semibold">{project.budget}</p>
                  <span className="mt-2 inline-block text-sm text-secondary underline underline-offset-4 opacity-0 transition group-hover:opacity-100">
                    View Project →
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
