"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

// Helper to check permissions
async function checkAuth() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;
  if (!session || (userRole !== "ADMIN" && userRole !== "VORSTAND")) {
    throw new Error("Nicht autorisiert");
  }
}

export async function createEvent(formData: FormData) {
  await checkAuth();

  const title = formData.get("title") as string;
  const dateString = formData.get("date") as string; // Comes in as YYYY-MM-DDTHH:mm
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;

  if (!title || !dateString) return { error: "Titel und Datum sind Pflichtfelder." };

  await prisma.event.create({
    data: {
      title,
      date: new Date(dateString), // Converts HTML datetime-local to Prisma DateTime
      location,
      description,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/"); // Update the home page too!
  return { success: true };
}

export async function deleteEvent(id: string) {
  await checkAuth();
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  revalidatePath("/");
}