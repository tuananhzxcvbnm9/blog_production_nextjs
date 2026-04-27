'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validators';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: FormData) => {
    setError('');
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) return setError('Invalid credentials');
    router.push('/admin');
  };

  return <div className="mx-auto max-w-md rounded-2xl border p-6"><h1 className="text-2xl font-bold">Login</h1><form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3"><input {...register('email')} className="w-full rounded border px-3 py-2" placeholder="Email"/><p className="text-xs text-red-500">{errors.email?.message}</p><input type="password" {...register('password')} className="w-full rounded border px-3 py-2" placeholder="Password"/><p className="text-xs text-red-500">{errors.password?.message}</p>{error && <p className="text-sm text-red-500">{error}</p>}<button disabled={isSubmitting} className="w-full rounded bg-black py-2 text-white">{isSubmitting ? 'Loading...' : 'Sign in'}</button></form></div>;
}
