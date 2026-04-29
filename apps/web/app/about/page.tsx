import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — NOVA FLOW',
  description: 'Learn more about NOVA FLOW and our mission to share production-ready engineering knowledge.',
  openGraph: {
    title: 'About — NOVA FLOW',
    description: 'Learn more about NOVA FLOW and our mission to share production-ready engineering knowledge.'
  }
};

export default function AboutPage() {
  return <div className="space-y-6"><h1 className="text-3xl font-bold">About</h1><p>Our mission is to share production-ready knowledge.</p></div>;
}
