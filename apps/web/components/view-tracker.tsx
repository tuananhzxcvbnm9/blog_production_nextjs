'use client';

import { useEffect } from 'react';

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/posts/${slug}/view`, { method: 'POST' }).catch(() => undefined);
  }, [slug]);

  return null;
}
