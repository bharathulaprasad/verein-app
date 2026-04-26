import prisma from "@/lib/prisma";
import Link from "next/link";
import { CalendarDays, MapPin, Mail, Phone, Users } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { formatWhatsAppNumber } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import WhatsAppCard from "@/components/WhatsAppCard";
import BoardCarousel from '@/components/BoardCarousel'; 
import VisitorStats from "@/components/VisitorStats"; 
import LocationCard from '@/components/LocationCard';
import EventCarousel from '@/components/EventCarousel';
import ArticleCarousel from "@/components/ArticleCarousel";

export default async function Home() {
  
  const session = await getServerSession(authOptions);
  let isAdminOrVorstand = false;
  const userId = (session?.user as any)?.id;
  if (session?.user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: { role: true }
    });
    isAdminOrVorstand = dbUser?.role === "VORSTAND" || dbUser?.role === "ADMIN";
  }
  // ==========================================
  // 1. DATENBANK-ABFRAGEN (Alles oben!)
  // ==========================================
  
  const upcomingEvents = await prisma.event.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: "asc" },
    // take: 6,
    include: {
      attendees: {
        include: {
          user: true 
        }
      }
    }
  });
  
  
  const boardMembers = await prisma.boardMember.findMany({
    orderBy: { order: "asc" },
  });
  
  const vereinInfo = await prisma.vereinInfo.findFirst();
  const latestArticles = await prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    //take: 3,
  });

  // ✨ WHATSAPP DATEN ABFRAGEN UND FORMATIEREN
  const chairman1 = await prisma.boardMember.findFirst({
    where: { role: { startsWith: "1. Vorsitzend" } }, // Achtung: Prüfe, ob es in deiner DB wirklich "role" und "1. Vorsitzender" heißt!
    select: { role:true, phone: true, name: true }
  });

    const chairman2 = await prisma.boardMember.findFirst({
    where: { role: { startsWith: "2. Vorsitzend" } }, // Achtung: Prüfe, ob es in deiner DB wirklich "role" und "2. Vorsitzende" heißt!
    select: { role:true, phone: true, name: true }
  });

  const whatsappNumber1 = formatWhatsAppNumber(chairman1?.phone);
  const whatsappNumber2 = formatWhatsAppNumber(chairman2?.phone);
  const chairmanName1 = chairman1?.name ? chairman1.name.split(' ')[0] : "Vorstand";
  const chairmanName2 = chairman2?.name ? chairman2.name.split(' ')[0] : "Vorstand";

  const role1 = chairman1?.role || "1. Vorstand";
  const role2 = chairman2?.role || "2. Vorstand";
  // ==========================================
  // 2. HTML & DESIGN (Alles im return!)
  // ==========================================
  return (
    <div className="space-y-16 transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      
      <section className="relative overflow-hidden py-12 lg:py-20 bg-blue-50 dark:bg-slate-900/50 rounded-3xl shadow-sm border border-blue-100 dark:border-slate-800 mt-6 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* LINKE SPALTE: Text & Buttons */}
          <div className="w-full lg:w-7/12 text-center lg:text-left flex flex-col items-center lg:items-start">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-900 dark:text-blue-400 mb-6 leading-tight">
              Herzlich Willkommen bei der <br />
              <span className="text-blue-600 dark:text-blue-500">Siedlervereinigung Siemens Nürnberg e.V.</span>
            </h1>
            
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mb-8 leading-relaxed">
              Wir sind Mitglied im Verband Wohneigentum Bezirksverband Mittelfranken e.V. und bestehen seit der Mitte der 1930er Jahre. Mit verschiedenen Veranstaltungen für unsere Mitglieder, Freunde und Bekannte halten wir ein aktives Vereinsleben in der historischen <strong className="text-blue-800 dark:text-blue-400">Kettlersiedlung</strong> aufrecht.
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link href="/about" className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-blue-500 transition-colors">
                Mehr erfahren
              </Link>
              
              {session ? (
                <Link href="/blog/new" className="bg-green-600 dark:bg-green-500 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-green-500 transition-colors flex items-center">
                  <span className="mr-2">📝</span> Artikel schreiben
                </Link>
              ) : (
                <Link href="/api/auth/signin" className="bg-blue-800 dark:bg-slate-800 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-blue-700 transition-colors">
                  Mitglieder Login
                </Link>
              )}

              <a href="#kontakt" className="bg-white dark:bg-slate-900 text-blue-800 dark:text-blue-400 border-2 border-blue-800 dark:border-blue-600 px-6 py-3 rounded-lg font-bold shadow hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors">
                Kontakt
              </a>
            </div>
          </div>

          {/* RECHTE SPALTE: Ausgelagerte 3D-Karte (inkl. Wetter) */}
          <div className="w-full lg:w-5/12 flex justify-center mt-8 lg:mt-0">
            <LocationCard />
          </div>
          
        </div>
      </section>

      {/* 2. AKTUELLES & TERMINE (EVENTS) */}
     <section id="aktuelles" className="max-w-7xl mx-auto px-6 lg:px-8 mt-20">
        
        {/* Überschrift */}
        <div className="flex items-center space-x-3 mb-8">
          <CalendarDays className="text-blue-600 dark:text-blue-400 w-8 h-8" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Aktuelles & Termine</h2>
        </div>

        {/* Hier übergeben wir einfach die Daten an unser neues Carousel */}
        <EventCarousel 
          events={upcomingEvents}
          userId={userId}
          isLoggedIn={!!session}
          isAdminOrVorstand={isAdminOrVorstand}
        />
        
      </section>

      {/* new 2.1 LATEST ARTICLES */}
      <ArticleCarousel articles={latestArticles} />

      {/* 3. KONTAKT & VORSTAND (Dynamic from DB) */}
       <section id="kontakt" className="max-w-6xl mx-auto mt-16 pt-8 border-t border-gray-200 dark:border-slate-800 transition-colors">
        
        <div className="flex items-center space-x-3 mb-8">
          <Users className="text-blue-600 dark:text-blue-400 w-8 h-8" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Kontakt & Vorstand</h2>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 mb-4 max-w-3xl">
          Haben Sie Fragen an die Siedlervereinigung? Nutzen Sie unser Kontaktformular oder melden Sie sich direkt bei einem unserer Vorstände. E-Mail: <a href={`mailto:${vereinInfo?.contactEmail || "svs_nbg@web.de"}`} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">{vereinInfo?.contactEmail || "svs_nbg@web.de"}</a>
        </p>

        {/* ✨ WHATSAPP KARTE */}
        {session && (whatsappNumber1 || whatsappNumber2) && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {whatsappNumber1 && (
              <WhatsAppCard 
                whatsappNumber={whatsappNumber1} 
                chairmanName={chairmanName1} 
                role={role1} 
              />
            )}
            
            {whatsappNumber2 && (
              <WhatsAppCard 
                whatsappNumber={whatsappNumber2} 
                chairmanName={chairmanName2} 
                role={role2} 
              />
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12 mt-8">
          
          {/* Linke Spalte: Das Kontaktformular */}
          <div>
            <ContactForm />
          </div>

          {/* Rechte Spalte: NEUES VORSTANDS-CAROUSEL */}
          <div className="flex w-full overflow-hidden">
            <BoardCarousel members={boardMembers} />
          </div>
          
        </div>
      </section>
      {/* ✨ 4. VISITOR STATS (NEW!) ✨ */}
       <section className="max-w-6xl mx-auto pb-12">
        <VisitorStats />
      </section>
    </div>
  );
}