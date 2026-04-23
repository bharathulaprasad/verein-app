import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import EventClientForm from "./EventClientForm"; // We will create this next!
import { Calendar, MapPin, Trash2 } from "lucide-react";
import { deleteEvent } from "./actions";

export default async function AdminEventsPage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;
  
  if (!session || (userRole !== "ADMIN" && userRole !== "VORSTAND")) {
    redirect("/");
  }

  // Fetch upcoming events (sorted closest date first)
  const events = await prisma.event.findMany({
    where: { date: { gte: new Date() } }, // Only show future events
    orderBy: { date: "asc" },
  });

  return (
    <div className="min-h-screen bg-[#F0F2F5] py-8 px-0 sm:px-4 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="px-4 sm:px-0">
          <h1 className="text-[24px] font-bold text-[#050505]">Termine Verwalten</h1>
          <p className="text-[#65676B] text-[15px] mt-0.5">
            Neue Vereins-Termine anlegen oder löschen
          </p>
        </div>

        {/* The Form Component */}
        <EventClientForm />

        {/* List of Upcoming Events */}
        <div className="px-4 sm:px-0 mt-8">
          <h2 className="text-[18px] font-bold text-[#050505] mb-4">Anstehende Termine</h2>
          
          {events.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1)] text-center text-[#65676B]">
              Keine anstehenden Termine gefunden.
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="bg-white p-4 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1)] flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-[#050505] text-[16px]">{event.title}</h3>
                    <div className="flex items-center text-[#65676B] text-[13px] mt-1 space-x-3">
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
                  
                  {/* Delete Button calling Server Action */}
                  <form action={async () => {
                    "use server";
                    await deleteEvent(event.id);
                  }}>
                    <button type="submit" className="p-2 text-[#65676B] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Löschen">
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