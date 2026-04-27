import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  let db = 'ok';
  try { await prisma.$queryRaw`SELECT 1`; } catch { db = 'error'; }
  return NextResponse.json({ status: db === 'ok' ? 'ok' : 'degraded', timestamp: new Date().toISOString(), version: process.env.npm_package_version || '1.0.0', checks: { db } });
}
