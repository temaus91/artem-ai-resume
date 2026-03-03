'use client';

import { useState } from 'react';
import type { JDAnalysisResult } from '@/types/domain';

export function useJDAnalyzer() {
  const [result, setResult] = useState<JDAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async (jobDescription: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      });
      const json = await response.json();
      setResult(json);
      return json as JDAnalysisResult;
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, analyze };
}
