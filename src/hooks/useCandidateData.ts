'use client';

import { useQuery } from '@tanstack/react-query';
import { artemProfile } from '@/data/artem-profile';

export function useCandidateData() {
  return useQuery({
    queryKey: ['candidate-data'],
    queryFn: async () => artemProfile,
  });
}
