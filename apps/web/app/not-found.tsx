import Link from 'next/link';

export default function NotFound() {
  return <div className="py-24 text-center"><p className="text-7xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">404</p><p className="mt-3 text-zinc-500">Không tìm thấy trang bạn yêu cầu.</p><div className="mt-6 flex justify-center gap-3"><Link href="/" className="rounded-xl bg-zinc-900 px-4 py-2 text-white">Về trang chủ</Link><Link href="/search" className="rounded-xl border px-4 py-2">Tìm kiếm</Link></div></div>;
}
