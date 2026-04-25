import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Nicht autorisiert" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, imageUrl, isPublished } = body;

    if (!title || !content) {
      return NextResponse.json({ success: false, error: "Titel und Inhalt sind erforderlich." }, { status: 400 });
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        imageUrl: imageUrl || null,
        isPublished: isPublished ?? true,
        authorId: (session.user as any).id || session.user.email || "Unknown",
        authorName: session.user.name || "Mitglied",
      }
    });

    return NextResponse.json({ success: true, article });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json({ success: false, error: "Fehler beim Speichern." }, { status: 500 });
  }
}