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

        <div className="mb-6 rounded-2xl border border-border bg-card/80 p-5 md:p-6">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-accent">Request flow</p>
              <h3 className="mt-1 text-2xl font-serif text-foreground">Grounded answer path</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Same shape for chat and structured fit checks.
            </p>
          </div>

          <svg
            viewBox="0 0 760 220"
            role="img"
            aria-label="Question flows through scope check, prompt guardrails, resume evidence, OpenAI, and a concise answer with evidence labels."
            className="h-auto w-full"
          >
            <defs>
              <linearGradient id="flowLine" x1="0" x2="1">
                <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.35" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <rect x="1" y="1" width="758" height="218" rx="20" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" />
            {[
              ["Question", "Recruiter asks about fit", 40],
              ["Guardrails", "Scope and anti-hype rules", 210],
              ["Evidence", "Profile, projects, gaps", 390],
              ["Answer", "Plain text plus evidence", 570],
            ].map(([title, body, x]) => (
              <g key={title}>
                <rect x={Number(x)} y="72" width="150" height="76" rx="14" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
                <text x={Number(x) + 18} y="104" fill="hsl(var(--foreground))" fontSize="15" fontFamily="Inter, system-ui, sans-serif">
                  {title}
                </text>
                <text x={Number(x) + 18} y="126" fill="hsl(var(--muted-foreground))" fontSize="11" fontFamily="Inter, system-ui, sans-serif">
                  {body}
                </text>
              </g>
            ))}
            {[190, 370, 550].map((x) => (
              <g key={x}>
                <path d={`M ${x} 110 L ${x + 28} 110`} stroke="url(#flowLine)" strokeWidth="2" strokeLinecap="round" />
                <path d={`M ${x + 21} 103 L ${x + 28} 110 L ${x + 21} 117`} fill="none" stroke="url(#flowLine)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            ))}
            <path d="M 465 70 C 470 36 510 34 528 58" fill="none" stroke="hsl(var(--accent))" strokeOpacity="0.55" strokeWidth="2" />
            <text x="500" y="44" fill="hsl(var(--accent))" fontSize="11" fontFamily="JetBrains Mono, monospace">
              optional Supabase history
            </text>
            <path d="M 466 150 C 475 184 532 186 548 158" fill="none" stroke="hsl(var(--primary))" strokeOpacity="0.55" strokeWidth="2" />
            <text x="460" y="193" fill="hsl(var(--primary))" fontSize="11" fontFamily="JetBrains Mono, monospace">
              strict JSON for JD checks
            </text>
          </svg>
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
