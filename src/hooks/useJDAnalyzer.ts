'use client';

import { useState } from 'react';
import { extractApiErrorMessage } from '@/lib/client-api-errors';
import type { JDAnalysisResult } from '@/types/domain';

export function useJDAnalyzer() {
  const [result, setResult] = useState<JDAnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const analyze = async (jobDescription: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/analyze-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      });
      const json = await response.json();
      if (!response.ok) {
        setResult(null);
        const message = extractApiErrorMessage(json, 'Unable to analyze this job description right now.');
        setError(message);
        return null;
      }
      setResult(json);
      return json as JDAnalysisResult;
    } catch {
      setResult(null);
      setError('Unable to analyze this job description right now.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { result, error, loading, analyze };
}
