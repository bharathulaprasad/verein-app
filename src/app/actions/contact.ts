"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 

export async function submitContactForm(prevState: any, formData: FormData) {
  // 1. Get the secure session from the server
  const session = await getServerSession(authOptions);

  // 2. Block unauthorized users
  if (!session || !session.user?.email) {
    return { error: "Sie müssen angemeldet sein, um eine Nachricht zu senden." };
  }

  // 3. Extract the data. Force the email to be the trusted OAuth email!
  const name = formData.get("name") as string || session.user.name || "Unbekannt";
  const email = session.user.email; 
  const message = formData.get("message") as string;

  if (!message) {
    return { error: "Bitte geben Sie eine Nachricht ein." };
  }

  try {
    // 4. Save to database securely
    await prisma.contactMessage.create({
      data: { name, email, message },
    });

    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später." };
  }
}