const details = [
  {
    label: "Evidence",
    title: "Static resume source",
    body: "Profile, roles, skills, projects, failures, and gaps live in local typed data, so the public site works without a database.",
  },
  {
    label: "Prompting",
    title: "Guardrails over hype",
    body: "The system prompt tells the assistant to stay concise, admit missing evidence, avoid overselling, and redirect unrelated requests.",
  },
  {
    label: "Trust",
    title: "Evidence-aware answers",
    body: "Substantive answers are asked to include a short evidence line, such as Oracle, Amazon, Projects, Failures, Skills, or Known gaps.",
  },
  {
    label: "Fit checks",
    title: "Structured JD output",
    body: "The job-description analyzer asks OpenAI for a strict JSON shape so the UI can separate verdict, gaps, transfers, and recommendation.",
  },
  {
    label: "Persistence",
    title: "Optional chat history",
    body: "Supabase chat storage is optional. Without service credentials, the resume still runs from local profile evidence.",
  },
  {
    label: "Safety",
    title: "Basic abuse controls",
    body: "OpenAI-backed routes use a simple in-memory rate limit so the public demo is not an unlimited API surface.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="text-sm font-mono uppercase tracking-wider text-accent mb-3">
            Implementation notes
          </p>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-3">
            How this works
          </h2>
          <p className="text-muted-foreground">
            A compact look at the engineering choices behind the resume assistant.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {details.map((item) => (
            <article key={item.title} className="rounded-xl border border-border bg-card/80 p-5">
              <p className="text-xs font-mono uppercase tracking-wider text-accent mb-3">
                {item.label}
              </p>
              <h3 className="text-xl font-serif text-foreground mb-2">{item.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
