import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ArticlePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  const articleId = resolvedParams.id;

  const session = await getServerSession(authOptions);

  // 1. Fetch the article
  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!article) return notFound();

  // 2. CHECK PERMISSIONS: Is this user allowed to edit?
  let canEdit = false;
  if (session?.user) {
    const userId = (session.user as any).id || session.user.email;
    
    if (article.authorId === userId) {
      canEdit = true;
    } else {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      if (dbUser?.role === "VORSTAND" || dbUser?.role === "ADMIN") {
        canEdit = true;
      }
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6 md:p-8 min-h-screen pt-12">
      <div className="flex justify-between items-center mb-8">
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-1" /> Zurück zur Startseite
        </Link>

        {/* EDIT BUTTON (Only visible to Author or Vorstand) */}
        {canEdit && (
          <Link href={`/blog/${article.id}/edit`} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-bold shadow transition flex items-center text-sm">
            <Edit className="w-4 h-4 mr-2" /> Artikel bearbeiten
          </Link>
        )}
      </div>

      {article.imageUrl && (
        <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-sm">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
        {article.title}
      </h1>
      
      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-10 pb-6 border-b border-gray-200 dark:border-slate-800">
        <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">{article.authorName}</span>
        <span>•</span>
        <span className="ml-2">{new Date(article.createdAt).toLocaleDateString("de-DE", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        {!article.isPublished && (
          <span className="ml-4 bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-bold uppercase">
            Entwurf
          </span>
        )}
      </div>

      {/* Renders the text preserving line breaks */}
      <div className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
        {article.content}
      </div>
    </main>
  );
}