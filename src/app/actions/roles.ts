'use server'

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";  // adjust path if needed
import prisma from "@/lib/prisma"; // adjust path to your prisma client
import { revalidatePath } from "next/cache";

// 1. Fetch all users
export async function getUsers() {
  const session = await getServerSession(authOptions);
  
  // Security check: Only ADMINs can fetch this list
  // @ts-ignore
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { createdAt: 'desc' }
  });
}

// 2. Update user role
export async function updateUserRole(userId: string, newRole: 'GUEST' | 'ADMIN' | 'MEMBER') {
  const session = await getServerSession(authOptions);
  
  // Security check: Only ADMINs can change roles
  // @ts-ignore
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  // Prevent admin from removing their own admin status accidentally
  // @ts-ignore
  if (userId === session.user.id && newRole !== 'ADMIN') {
    throw new Error('You cannot downgrade your own admin role.');
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  // Refresh the page data
  revalidatePath('/admin/users');
  return { success: true };
}