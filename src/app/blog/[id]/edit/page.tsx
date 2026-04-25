import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import EditArticleForm from "./EditArticleForm";

export default async function EditArticlePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  const articleId = resolvedParams.id;

  const session = await getServerSession(authOptions);
  if (!session?.user) return notFound(); // Security check

  // Fetch the existing article from the database
  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!article) return notFound();

  // Pass the article data to our Client Form Component
  return <EditArticleForm article={article} />;
}