"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function toggleEventParticipation(eventId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    throw new Error("Sie müssen eingeloggt sein.");
  }

  const userId = (session?.user as any)?.id;

  // 1. Check if the user is already attending this specific event
  // We use findUnique with the composite key (eventId_userId)
  const existingAttendance = await prisma.eventAttendee.findUnique({
    where: {
      eventId_userId: {
        eventId: eventId,
        userId: userId,
      }
    },
  });

  // 2. Toggle the status
  if (existingAttendance) {
    // If they are already attending, cancel it (Delete)
    await prisma.eventAttendee.delete({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId,
        }
      },
    });
  } else {
    // If they are not attending, add them! (Create)
    await prisma.eventAttendee.create({
      data: {
        eventId: eventId,
        userId: userId,
      },
    });
  }

  // 3. Refresh the home page to update the UI count
  revalidatePath("/");
}