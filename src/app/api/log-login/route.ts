import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // 1. Check if the user is actually logged in
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    // 2. Get the location data sent from the client
    const body = await req.json();
    const { city, country } = body;

    // 3. Extract user info (Fallback to email if ID or Name is missing)
    const userId = (session.user as any).id || session.user.email || "Unknown";
    const userName = session.user.name || "Unknown";

    // 4. Save to Database
    await prisma.loginLog.create({
      data: {
        userId: userId,
        userName: userName,
        city: city || "Unbekannt",
        country: country || "Unbekannt",
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving login log:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}