export default function Loading() {
  return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }).map((_, idx) => <div key={idx} className="animate-pulse overflow-hidden rounded-3xl border bg-white p-4 dark:bg-zinc-900"><div className="h-40 rounded-2xl bg-zinc-100 dark:bg-zinc-800" /><div className="mt-4 h-5 rounded bg-zinc-100 dark:bg-zinc-800" /><div className="mt-2 h-4 rounded bg-zinc-100 dark:bg-zinc-800" /></div>)}</div>;
}
