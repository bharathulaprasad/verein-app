import prisma from "@/lib/prisma";
import Link from "next/link";
import { CalendarDays, MapPin, Mail, Phone, Users } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export default async function Home() {
  // Fetch ALL data from the database
  const upcomingEvents = await prisma.event.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: "asc" },
    take: 6,
  });
  
  const boardMembers = await prisma.boardMember.findMany({
    orderBy: { order: "asc" },
  });
  
  const vereinInfo = await prisma.vereinInfo.findFirst();

  return (
    <div className="space-y-16 transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <section className="text-center py-12 bg-blue-50 dark:bg-slate-900/50 rounded-2xl shadow-sm border border-blue-100 dark:border-slate-800 mt-6 transition-colors">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 dark:text-blue-400 mb-6">
          Herzlich Willkommen bei der <br />
          <span className="text-blue-600 dark:text-blue-500">Siedlervereinigung Siemens Nürnberg e.V.</span>
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto px-4">
          Wir sind Mitglied im Verband Wohneigentum Bezirksverband Mittelfranken e.V. und bestehen seit der Mitte der 1930er Jahre. Mit verschiedenen Veranstaltungen für unsere Mitglieder, Freunde und Bekannte halten wir ein aktives Vereinsleben aufrecht.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
		  
		  <Link href="/about" className="bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-blue-500 dark:hover:bg-blue-400 transition">
			Mehr über uns erfahren
		  </Link>
		  
		  <Link href="/api/auth/signin" className="bg-blue-800 dark:bg-slate-800 text-white px-8 py-3 rounded-lg font-bold shadow hover:bg-blue-700 dark:hover:bg-slate-700 transition">
			Mitglieder Login
		  </Link>
		  
		  <a href="#kontakt" className="bg-white dark:bg-slate-900 text-blue-800 dark:text-blue-400 border-2 border-blue-800 dark:border-blue-600 px-8 py-3 rounded-lg font-bold shadow hover:bg-blue-50 dark:hover:bg-slate-800 transition">
			Kontakt
		  </a>
		</div>
      </section>

      {/* 2. AKTUELLES & TERMINE (EVENTS) */}
      <section id="aktuelles" className="max-w-5xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <CalendarDays className="text-blue-600 dark:text-blue-400 w-8 h-8" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Aktuelles & Termine</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Static Recurring Event */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 dark:border-amber-600 p-6 rounded-r-lg shadow-sm transition-colors">
            <h3 className="text-xl font-bold text-amber-900 dark:text-amber-500">! Wichtiger Termin !</h3>
            <p className="text-amber-800 dark:text-amber-400 font-semibold mt-2 text-lg">SVS - Kaffeerunden</p>
            <p className="text-gray-700 dark:text-gray-300 mt-1 flex items-center">
              <CalendarDays className="w-4 h-4 mr-2" /> Jeden 2. Dienstag im Monat, 15:00 Uhr
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-1 flex items-center">
              <MapPin className="w-4 h-4 mr-2" /> Der Beck - Hornbach, Trierer Str. 171, 90469 Nürnberg
            </p>
          </div>

          {/* Dynamic Events from Database */}
          {upcomingEvents.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-lg shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors">
              Derzeit keine weiteren Sonderveranstaltungen geplant.
            </div>
          ) : (
            upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-lg shadow-sm transition-colors">
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-400">{event.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">{event.description}</p>
                <div className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                    {new Date(event.date).toLocaleDateString("de-DE", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })} Uhr
                  </p>
                  <p className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                    {event.location}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 3. KONTAKT & VORSTAND (Dynamic from DB) */}
      <section id="kontakt" className="max-w-6xl mx-auto mt-16 pt-8 border-t border-gray-200 dark:border-slate-800 transition-colors">
  <div className="flex items-center space-x-3 mb-8">
    <Users className="text-blue-600 dark:text-blue-400 w-8 h-8" />
    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Kontakt & Vorstand</h2>
  </div>
  
  <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-3xl">
    Haben Sie Fragen an die Siedlervereinigung? Nutzen Sie unser Kontaktformular oder melden Sie sich direkt bei einem unserer Vorstände. E-Mail: <a href={`mailto:${vereinInfo?.contactEmail || "svs_nbg@web.de"}`} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">{vereinInfo?.contactEmail || "svs_nbg@web.de"}</a>
  </p>

  <div className="grid lg:grid-cols-2 gap-12">
    
    {/* Left Column: The New Contact Form */}
    <div>
      <ContactForm />
    </div>

    {/* Right Column: Board Members */}
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Ihre Ansprechpartner</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {boardMembers.map((member) => (
          <div key={member.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 transition-colors">
            <h4 className="font-bold text-blue-900 dark:text-blue-400 text-sm uppercase tracking-wider">{member.role}</h4>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{member.name}</p>
            <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p className="flex items-center"><Phone className="w-4 h-4 mr-2 text-slate-400" /> {member.phone}</p>
              <p className="flex items-center"><Mail className="w-4 h-4 mr-2 text-slate-400" /> <a href={`mailto:${member.email}`} className="hover:text-blue-500 truncate">{member.email}</a></p>
            </div>
          </div>
        ))}
      </div>
    </div>
    
  </div>
</section>
    </div>
  );
}