import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// This runs when a NEW visitor arrives (Increments DB)
export async function POST() {
  try {
    const stat = await prisma.pageStat.upsert({
      where: { pageName: 'home' },
      update: { count: { increment: 1 } },
      create: { pageName: 'home', count: 1 },
    });
    return NextResponse.json({ success: true, count: stat.count });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// This runs when the user refreshes the page (Just reads DB, no increment)
export async function GET() {
  try {
    const stat = await prisma.pageStat.findUnique({
      where: { pageName: 'home' }
    });
    return NextResponse.json({ success: true, count: stat?.count || 0 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}