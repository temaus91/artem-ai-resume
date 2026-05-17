import { useState } from 'react';
import { AlertTriangle, CheckCircle2, CircleSlash } from 'lucide-react';
import { useJDAnalyzer } from '@/hooks/useJDAnalyzer';

const strongSample = `Senior Full-Stack Engineer (Platform): Build internal developer tooling, own Java/TypeScript services, mentor ICs, and improve test automation reliability across teams.`;
const weakSample = `Staff Mobile Growth Engineer: 5+ years iOS/Android, deep A/B experimentation ownership, consumer growth funnels, and design-led product iterations.`;

const verdictConfig = {
  strong_fit: {
    label: 'Strong Fit',
    className: 'border-success/30 bg-success-muted/70 text-success',
    icon: CheckCircle2,
  },
  worth_conversation: {
    label: 'Worth Conversation',
    className: 'border-warning/35 bg-warning-muted/70 text-warning',
    icon: AlertTriangle,
  },
  probably_not: {
    label: 'Probably Not',
    className: 'border-destructive/30 bg-destructive/10 text-destructive',
    icon: CircleSlash,
  },
};

const FitAssessment = () => {
  const [jd, setJd] = useState('');
  const { result, error, analyze, loading } = useJDAnalyzer();

  return (
    <section id="fit-assessment" className="py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-serif text-foreground mb-2">Honest Fit Assessment</h2>
          <p className="text-muted-foreground">Paste a job description. Get an honest assessment of whether I’m the right person—including when I’m not.</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setJd(strongSample)} className="px-3 py-1 rounded bg-secondary text-sm">Strong Fit Example</button>
            <button onClick={() => setJd(weakSample)} className="px-3 py-1 rounded bg-secondary text-sm">Weak Fit Example</button>
          </div>
          <label htmlFor="job-description" className="sr-only">Job description</label>
          <textarea
            id="job-description"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste job description here..."
            className="w-full min-h-56 bg-secondary rounded-xl border border-border p-4 outline-none transition-colors focus:border-accent"
          />
          <button
            onClick={() => void analyze(jd)}
            disabled={loading || jd.length < 40}
            className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-medium transition-transform disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
            aria-busy={loading}
          >
            {loading ? 'Analyzing…' : 'Analyze Fit'}
          </button>

          {loading ? (
            <div className="rounded-xl border border-border bg-secondary/40 p-5">
              <div className="mb-4 h-7 w-40 rounded-full bg-muted animate-skeleton" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded-full bg-muted animate-skeleton" />
                <div className="h-3 w-5/6 rounded-full bg-muted animate-skeleton" />
                <div className="h-3 w-2/3 rounded-full bg-muted animate-skeleton" />
              </div>
            </div>
          ) : null}

          {error && (
            <p className="rounded-xl border border-warning/30 bg-warning-muted/40 p-3 text-sm text-foreground">
              {error}
            </p>
          )}

          {result && (
            <div className="border border-border rounded-xl p-5 bg-secondary/40 space-y-4">
              {(() => {
                const config = verdictConfig[result.verdict];
                const Icon = config.icon;
                return (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-text-subtle">
                        Honest assessment
                      </p>
                      <h3 className="mt-1 text-2xl font-serif text-foreground">{result.headline}</h3>
                    </div>
                    <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${config.className}`}>
                      <Icon className="h-4 w-4" />
                      {config.label}
                    </span>
                  </div>
                );
              })()}
              <p>{result.opening}</p>
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-text-subtle mb-2">Where I do not fit</h4>
                <ul className="space-y-2">
                  {result.gaps.map((gap, idx) => (
                    <li key={idx} className="rounded-lg border border-border bg-card/70 p-3 text-sm">
                      <span className="font-medium text-foreground">{gap.gap_title}</span>
                      <span className="text-muted-foreground">: {gap.explanation}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-text-subtle mb-1">What transfers</h4>
                <p>{result.transfers}</p>
              </div>
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-text-subtle mb-1">My recommendation</h4>
                <p>{result.recommendation}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default FitAssessment;
