// Real social proof: counts come from Shelby's own events (see server/analytics.mjs), never invented.
import { useEffect, useState } from 'react';
import { api } from './api';

export function useDropCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  useEffect(() => { api<Record<string, number>>('/api/proof/drops').then(setCounts).catch(() => {}); }, []);
  return counts;
}
