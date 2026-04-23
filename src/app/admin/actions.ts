"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function toggleMessageReadStatus(id: string, currentStatus: boolean) {
  // Optional but recommended: Verify session again inside the action
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;
  
  if (!session || (userRole !== "ADMIN" && userRole !== "VORSTAND")) {
    throw new Error("Unauthorized");
  }

  // Update the database
  await prisma.contactMessage.update({
    where: { id },
    data: { isRead: !currentStatus },
  });
}