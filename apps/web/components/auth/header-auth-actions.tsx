'use client';

import Link from 'next/link';
import { LogOut, PenLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type SessionUser = {
  userId: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'AUTHOR';
};

type AuthState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'authenticated'; user: SessionUser }
  | { status: 'unauthenticated' };

export function HeaderAuthActions() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({ status: 'loading' });
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!res.ok) throw new Error('Không thể tải phiên đăng nhập');

        const payload = (await res.json()) as { user?: SessionUser | null };
        if (!active) return;

        if (payload.user) {
          setState({ status: 'authenticated', user: payload.user });
          return;
        }

        setState({ status: 'unauthenticated' });
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : 'Lỗi không xác định';
        setState({ status: 'error', message });
      }
    }

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  const onLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setState({ status: 'unauthenticated' });
      router.push('/login');
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  if (state.status === 'loading') {
    return <div className="h-10 w-36 animate-pulse rounded-xl bg-zinc-200/80 dark:bg-zinc-800" aria-label="Đang tải trạng thái tài khoản" />;
  }

  if (state.status === 'error') {
    return (
      <Link
        href="/login"
        title={state.message}
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-200"
      >
        Đăng nhập
      </Link>
    );
  }

  if (state.status === 'unauthenticated') {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-200"
        >
          Đăng nhập
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
        >
          Đăng ký
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/admin/posts/new"
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
      >
        <PenLine size={14} />
        <span className="hidden sm:inline">Viết bài</span>
      </Link>

      <button
        onClick={onLogout}
        disabled={loggingOut}
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-700 dark:text-zinc-200"
      >
        <LogOut size={14} />
        <span className="hidden sm:inline">{loggingOut ? 'Đang thoát...' : 'Đăng xuất'}</span>
      </button>
    </div>
  );
}
