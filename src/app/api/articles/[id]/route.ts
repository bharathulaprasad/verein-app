import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const articleId = resolvedParams.id;

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Nicht autorisiert" }, { status: 401 });
    }

    const article = await prisma.article.findUnique({ where: { id: articleId } });
    if (!article) return NextResponse.json({ success: false, error: "Artikel nicht gefunden" }, { status: 404 });

    const userId = (session.user as any).id || session.user.email;
    const isAuthor = article.authorId === userId;
    
    const boardMember = await prisma.boardMember.findFirst({ where: { email: session.user.email as string } });
    const isVorsitzer = !!boardMember;

    if (!isAuthor && !isVorsitzer) {
      return NextResponse.json({ success: false, error: "Keine Berechtigung zum Bearbeiten." }, { status: 403 });
    }

    const body = await req.json();
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        title: body.title,
        content: body.content,
        imageUrl: body.imageUrl || null,
        isPublished: body.isPublished,
      }
    });

    return NextResponse.json({ success: true, article: updatedArticle });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Fehler beim Aktualisieren." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const articleId = resolvedParams.id;

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Nicht autorisiert" }, { status: 401 });
    }

    // Find original article
    const article = await prisma.article.findUnique({ where: { id: articleId } });
    if (!article) return NextResponse.json({ success: false, error: "Artikel nicht gefunden" }, { status: 404 });

    // Authorization Check (Same as PUT)
    const userId = (session.user as any).id || session.user.email;
    const isAuthor = article.authorId === userId;
    
    const boardMember = await prisma.boardMember.findFirst({ where: { email: session.user.email as string } });
    const isVorsitzer = !!boardMember;

    if (!isAuthor && !isVorsitzer) {
      return NextResponse.json({ success: false, error: "Keine Berechtigung zum Löschen." }, { status: 403 });
    }

    // ✨ DELETE the article from the database
    await prisma.article.delete({
      where: { id: articleId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Fehler beim Löschen." }, { status: 500 });
  }
}