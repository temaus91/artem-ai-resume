import { Github, Layers, Sparkles } from "lucide-react";
import { artemProfile } from "@/data/artem-profile";

const Projects = () => {
  return (
    <section id="projects" className="py-10 md:py-16 px-6 border-y border-border/60 bg-secondary/20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-mono uppercase tracking-wider text-accent mb-3">
            Personal work
          </p>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-3">
            Projects
          </h2>
          <p className="text-muted-foreground">
            Things I built outside employment. Useful signal, but separate from Oracle and Amazon experience.
          </p>
        </div>

        <div className="grid gap-5">
          {artemProfile.projects.map((project) => (
            <article
              key={project.name}
              className="rounded-xl border border-border bg-card/80 p-5 md:p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-subtle">
                    <span className="inline-flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5" />
                      {project.role}
                    </span>
                    {project.period ? <span>{project.period}</span> : null}
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif text-foreground">
                    {project.name}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm md:text-base text-muted-foreground">
                    {project.summary}
                  </p>
                </div>

                {project.sourceUrl ? (
                  <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                ) : null}
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
                <ul className="space-y-2">
                  {project.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2 text-sm text-muted-foreground">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap content-start gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
