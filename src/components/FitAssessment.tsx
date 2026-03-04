import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useJDAnalyzer } from '@/hooks/useJDAnalyzer';

const strongSample = `Senior Full-Stack Engineer (Platform): Build internal developer tooling, own Java/TypeScript services, mentor ICs, and improve test automation reliability across teams.`;
const weakSample = `Staff Mobile Growth Engineer: 5+ years iOS/Android, deep A/B experimentation ownership, consumer growth funnels, and design-led product iterations.`;

const FitAssessment = () => {
  const [jd, setJd] = useState('');
  const { result, analyze, loading } = useJDAnalyzer();

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
          <textarea value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste job description here…" className="w-full min-h-56 bg-secondary rounded-xl p-4" />
          <button onClick={() => void analyze(jd)} disabled={loading || jd.length < 40} className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-medium">
            {loading ? 'Analyzing…' : 'Analyze Fit'}
          </button>

          {result && (
            <div className="border border-border rounded-xl p-5 bg-secondary/40 space-y-4">
              <p className="font-semibold flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> ⚠️ Honest Assessment — {result.headline}</p>
              <p>{result.opening}</p>
              <div>
                <h4 className="font-semibold mb-1">WHERE I DON'T FIT</h4>
                <ul className="list-disc pl-6 space-y-1">
                  {result.gaps.map((gap, idx) => (
                    <li key={idx}><strong>{gap.gap_title}</strong>: {gap.explanation}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1">WHAT TRANSFERS</h4>
                <p>{result.transfers}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">MY RECOMMENDATION</h4>
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
