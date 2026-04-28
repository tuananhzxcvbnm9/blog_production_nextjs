'use client';

import Link from 'next/link';
import { LogOut, PenLine, ShieldAlert } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
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

const roleLabelMap: Record<SessionUser['role'], string> = {
  ADMIN: 'Admin',
  EDITOR: 'Editor',
  AUTHOR: 'Author'
};

export function HeaderAuthActions() {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<AuthState>({ status: 'loading' });
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.status === 401) {
          if (!active) return;
          setState({ status: 'unauthenticated' });
          return;
        }
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
  }, [pathname]);

  const onLogout = async () => {
    setLoggingOut(true);
    setLogoutError('');
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (!res.ok) throw new Error('Không thể đăng xuất');
      setState({ status: 'unauthenticated' });
      router.push('/login');
      router.refresh();
    } catch {
      setLogoutError('Đăng xuất thất bại. Vui lòng thử lại.');
    } finally {
      setLoggingOut(false);
    }
  };

  if (state.status === 'loading') {
    return <div className="h-10 w-44 animate-pulse rounded-xl bg-zinc-200/80 dark:bg-zinc-800" aria-label="Đang tải trạng thái tài khoản" />;
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

  const canAccessAdmin = ['ADMIN', 'EDITOR'].includes(state.user.role);

  return (
    <div className="flex items-center gap-2">
      {logoutError && (
        <span className="hidden text-xs text-red-500 md:inline">{logoutError}</span>
      )}
      <span className="hidden rounded-xl border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-600 md:inline-block dark:border-zinc-700 dark:text-zinc-300">
        {roleLabelMap[state.user.role]}
      </span>

      {canAccessAdmin ? (
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
        >
          <PenLine size={14} />
          <span className="hidden sm:inline">Viết bài</span>
        </Link>
      ) : (
        <span className="hidden items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 md:inline-flex dark:border-amber-900/80 dark:bg-amber-950/40 dark:text-amber-300">
          <ShieldAlert size={14} />
          Chưa có quyền admin
        </span>
      )}

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
