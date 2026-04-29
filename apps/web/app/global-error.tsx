'use client';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return <html><body><div className="flex min-h-screen items-center justify-center p-6"><div className="rounded-2xl border p-6 text-center"><h2 className="text-2xl font-bold">Something went wrong</h2><p className="mt-2 text-sm text-zinc-500">Đã xảy ra lỗi không mong muốn.</p><button onClick={reset} className="mt-4 rounded-xl bg-zinc-900 px-4 py-2 text-white">Try again</button></div></div></body></html>;
}
