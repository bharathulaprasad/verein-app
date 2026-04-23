"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

  revalidatePath("/admin"); 
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

  revalidatePath("/admin"); // Refresh the page list
}