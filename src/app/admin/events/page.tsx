import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import EventClientForm from "./EventClientForm";
import { Calendar, MapPin, Trash2 } from "lucide-react";
import { deleteEvent } from "./actions";

export default async function AdminEventsPage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;
  
  if (!session || (userRole !== "ADMIN" && userRole !== "VORSTAND")) {
    redirect("/");
  }

  const events = await prisma.event.findMany({
    where: { date: { gte: new Date() } }, 
    orderBy: { date: "asc" },
  });

  return (
    <div className="py-8 px-0 sm:px-4 font-sans transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="px-4 sm:px-0">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Termine Verwalten</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Neue Vereins-Termine anlegen oder löschen
          </p>
        </div>

        <EventClientForm />

        <div className="px-4 sm:px-0 mt-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Anstehende Termine</h2>
          
          {events.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center text-slate-500 dark:text-slate-400">
              Keine anstehenden Termine gefunden.
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-[16px]">{event.title}</h3>
                    <div className="flex items-center text-slate-500 dark:text-slate-400 text-[13px] mt-1 space-x-3">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {new Date(event.date).toLocaleDateString("de-DE", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} Uhr
                      </span>
                      {event.location && (
                        <span className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <form action={async () => {
                    "use server";
                    await deleteEvent(event.id);
                  }}>
                    <button type="submit" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Löschen">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}