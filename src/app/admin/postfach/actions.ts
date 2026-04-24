"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import { revalidatePath } from "next/cache";

export async function toggleMessageReadStatus(id: string, currentStatus: boolean) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;
  
  if (!session || (userRole !== "ADMIN" && userRole !== "VORSTAND")) {
    throw new Error("Unauthorized");
  }

  await prisma.contactMessage.update({
    where: { id },
    data: { isRead: !currentStatus },
  });

  revalidatePath("/", "layout"); // Refresh the homepage to update the unread message count
}

// ✨ ADD THIS NEW FUNCTION ✨
export async function deleteMessage(id: string) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;
  
  if (!session || (userRole !== "ADMIN" && userRole !== "VORSTAND")) {
    throw new Error("Unauthorized");
  }

  await prisma.contactMessage.delete({
    where: { id },
  });

  revalidatePath("/", "layout"); // Refresh the homepage to update the unread message count
}