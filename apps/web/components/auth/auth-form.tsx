'use client';

import { useState, type HTMLInputTypeAttribute } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { loginSchema, registerSchema } from '@/lib/validators';

type AuthMode = 'login' | 'register';

type AuthFormData = {
  name?: string;
  email: string;
  password: string;
};

type LoginResponse = {
  ok: boolean;
  user?: {
    userId: string;
    email: string;
    role: 'ADMIN' | 'EDITOR' | 'AUTHOR';
  };
};

type AuthFormProps = {
  mode: AuthMode;
};

const authPageCopy: Record<
  AuthMode,
  {
    title: string;
    description: string;
    submitLabel: string;
    submittingLabel: string;
    altLabel: string;
    altHref: string;
    altCta: string;
  }
> = {
  login: {
    title: 'Đăng nhập',
    description: 'Đăng nhập để viết bài, quản lý nội dung và truy cập trang quản trị.',
    submitLabel: 'Đăng nhập',
    submittingLabel: 'Đang đăng nhập...',
    altLabel: 'Chưa có tài khoản?',
    altHref: '/register',
    altCta: 'Tạo tài khoản'
  },
  register: {
    title: 'Đăng ký tài khoản',
    description: 'Tạo tài khoản tác giả để bắt đầu chia sẻ câu chuyện của bạn trên Nova Flow.',
    submitLabel: 'Tạo tài khoản',
    submittingLabel: 'Đang tạo tài khoản...',
    altLabel: 'Đã có tài khoản?',
    altHref: '/login',
    altCta: 'Đăng nhập ngay'
  }
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [apiError, setApiError] = useState('');

  const isRegister = mode === 'register';
  const copy = authPageCopy[mode];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AuthFormData>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema)
  });

  const onSubmit = async (data: AuthFormData) => {
    setApiError('');

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const payload = (await res.json().catch(() => null)) as { error?: string } | null;
      setApiError(payload?.error || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
      return;
    }

    if (isRegister) {
      router.push('/login?registered=1');
      return;
    }

    const payload = (await res.json().catch(() => null)) as LoginResponse | null;
    const canAccessAdmin = payload?.user?.role === 'ADMIN' || payload?.user?.role === 'EDITOR';
    router.push(canAccessAdmin ? '/admin' : '/');
    router.refresh();
  };

  return (
    <section className="mx-auto w-full max-w-5xl px-2 py-8 sm:px-4">
      <div className="grid overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/95 shadow-xl shadow-blue-100/40 dark:border-zinc-800 dark:bg-zinc-900/90 dark:shadow-none lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-500 p-8 text-white lg:block">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-100">Nova Flow</p>
          <h2 className="mt-6 text-4xl font-bold leading-tight">Không chỉ là blog. Đây là nơi để bạn xây cộng đồng.</h2>
          <p className="mt-4 text-sm text-blue-100">Đăng nhập hoặc đăng ký để bắt đầu hành trình viết lách chuyên nghiệp với giao diện biên tập hiện đại.</p>
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{copy.title}</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{copy.description}</p>

          {mode === 'login' && searchParams.get('registered') === '1' && (
            <p className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">
              Đăng ký thành công. Mời bạn đăng nhập để tiếp tục.
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
            {isRegister && (
              <AuthInput
                label="Tên hiển thị"
                placeholder="Nguyễn Văn A"
                error={errors.name?.message}
                inputProps={register('name')}
              />
            )}

            <AuthInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              inputProps={register('email')}
            />

            <AuthInput
              label="Mật khẩu"
              type="password"
              placeholder="Tối thiểu 8 ký tự"
              error={errors.password?.message}
              inputProps={register('password')}
            />

            {apiError && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">{apiError}</p>}

            <button
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? copy.submittingLabel : copy.submitLabel}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            {copy.altLabel}{' '}
            <Link href={copy.altHref} className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
              {copy.altCta}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

type AuthInputProps = {
  label: string;
  placeholder: string;
  error?: string;
  type?: HTMLInputTypeAttribute;
  inputProps: UseFormRegisterReturn;
};

function AuthInput({ label, placeholder, error, type = 'text', inputProps }: AuthInputProps) {
  return (
    <label className="block space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
      <span>{label}</span>
      <input
        type={type}
        {...inputProps}
        placeholder={placeholder}
        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/70"
      />
      <span className="min-h-5 text-xs text-red-500">{error}</span>
    </label>
  );
}
