'use client';

import { useForm } from 'react-hook-form';

export default function NewPostPage() {
  const { register } = useForm();
  return <div className="space-y-4"><h1 className="text-2xl font-bold">Create post</h1><form className="grid gap-3 rounded-xl border p-4"><input {...register('title')} placeholder="Title" className="rounded border px-3 py-2"/><textarea {...register('content')} placeholder="Content" className="min-h-40 rounded border px-3 py-2"/><button className="rounded bg-black py-2 text-white">Save draft</button></form></div>;
}
