"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import { revalidatePath } from "next/cache";

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
  const dateString = formData.get("date") as string; 
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;
  const recurrence = formData.get("recurrence") as string;

  if (!title || !dateString) return { error: "Titel und Datum sind Pflichtfelder." };

  const baseDate = new Date(dateString);
  const eventsToCreate = [];

  if (recurrence === "weekly") {
    // Every 7 days
    for (let i = 0; i < 12; i++) {
      const nextDate = new Date(baseDate);
      nextDate.setDate(baseDate.getDate() + (i * 7));
      eventsToCreate.push({ title, date: nextDate, location, description });
    }
  } else if (recurrence === "monthly") {
    // Exact same numerical date (e.g., every 15th of the month)
    for (let i = 0; i < 12; i++) {
      const nextDate = new Date(baseDate);
      nextDate.setMonth(baseDate.getMonth() + i);
      eventsToCreate.push({ title, date: nextDate, location, description });
    }
  } else if (recurrence === "monthly_weekday") {
    // ✨ SMART RULE: e.g., "Every 2nd Tuesday"
    // 1. Figure out which weekday it is (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = baseDate.getDay(); 
    // 2. Figure out if it's the 1st, 2nd, 3rd, or 4th occurrence in the month
    const nthOccurrence = Math.floor((baseDate.getDate() - 1) / 7) + 1; 

    for (let i = 0; i < 12; i++) {
      // Get the 1st day of the target month
      const firstOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, 1, baseDate.getHours(), baseDate.getMinutes());
      
      // Find the first time our target dayOfWeek happens in this month
      let diff = dayOfWeek - firstOfMonth.getDay();
      if (diff < 0) diff += 7; // Shift to next week if the day already passed this week
      
      // Add weeks to reach the N-th occurrence
      const targetDateNumber = firstOfMonth.getDate() + diff + ((nthOccurrence - 1) * 7);
      
      // Create the final date
      const nextDate = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth(), targetDateNumber, baseDate.getHours(), baseDate.getMinutes());
      
      eventsToCreate.push({ title, date: nextDate, location, description });
    }
  } else {
    // Single event
    eventsToCreate.push({ title, date: baseDate, location, description });
  }

  // Save all to database
  await prisma.event.createMany({
    data: eventsToCreate,
  });

  revalidatePath("/admin/events");
  revalidatePath("/"); 
  return { success: true };
}

export async function deleteEvent(id: string) {
  await checkAuth();
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  revalidatePath("/");
}