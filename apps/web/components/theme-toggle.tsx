'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <button className="h-10 w-10 rounded-xl border border-zinc-200 bg-white/70 dark:border-zinc-800 dark:bg-zinc-900/70" aria-label="Toggle theme" />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white/80 text-zinc-600 shadow-sm transition hover:-translate-y-0.5 hover:text-blue-600 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300"
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
