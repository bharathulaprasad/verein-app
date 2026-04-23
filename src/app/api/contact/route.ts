import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";

// Resend mit deinem API Key initialisieren
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // 1. Nachricht in der Datenbank speichern (damit sie im "Postfach" erscheint)
    await prisma.contactMessage.create({
      data: { 
        name, 
        email, 
        message,
        isRead: false 
      },
    });

    // 2. E-Mail sofort an den Vorstand senden!
    await resend.emails.send({
      from: 'SVS Website <onboarding@resend.dev>', // Kostenlose Resend Test-Adresse
      to: process.env.DEVELOPER_EMAIL as string,    // E-Mail aus deiner .env Datei
      replyTo: email,                              // Vorstand kann direkt auf die Mail antworten!
      subject: `🚨 Neue Nachricht im Postfach von: ${name}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>Neue Kontaktanfrage (SVS NBG e.V.)</h2>
          <p><strong>Von:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
          <hr />
          <p style="white-space: pre-wrap; background: #f4f4f5; padding: 15px; border-radius: 8px;">${message}</p>
          <hr />
          <p style="font-size: 12px; color: #666;">
            Tipp: Du kannst einfach auf diese E-Mail antworten, deine Antwort geht direkt an ${name}.<br/>
            Oder logge dich ins Dashboard ein, um die Nachricht als gelesen zu markieren.
          </p>
        </div>
      `
    });

    // Melde dem Frontend (dem Browser), dass alles geklappt hat
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Fehler beim Speichern oder Senden:", error);
    return NextResponse.json({ error: "Fehler aufgetreten" }, { status: 500 });
  }
}