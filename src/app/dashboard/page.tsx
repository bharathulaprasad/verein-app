import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin"); // Automatically protect route
  }

  // Safely fetch secure user data using Prisma 7
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    include: {  events: { include: { event: true } } }
  });

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-slate-800">Mitglieder-Dashboard</h1>
      
      <div className="flex items-center space-x-6 mb-8 border-b border-slate-100 pb-6">
        {session.user?.image ? (
          <img src={session.user.image} alt="Profile" className="w-20 h-20 rounded-full border-2 border-blue-100" />
        ) : (
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold text-2xl">
            {session.user?.name?.charAt(0) || "M"}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-semibold">Hallo, {session.user?.name}</h2>
          <p className="text-slate-500">Mitgliedsstatus: <span className="font-semibold text-blue-600">{user?.role}</span></p>
          <p className="text-slate-500">E-Mail: <span className="font-semibold text-blue-600">{user?.email}</span></p>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4 text-slate-700">Ihre anstehenden Veranstaltungen</h3>
      {!user?.events || user.events.length === 0 ? (
        <p className="text-slate-500 bg-slate-50 p-4 rounded-md">Sie sind derzeit für keine Veranstaltungen angemeldet.</p>
      ) : (
        <ul className="space-y-4">
          {user.events.map((e) => (
            <li key={e.eventId} className="p-4 bg-blue-50/50 border border-blue-100 rounded-md flex justify-between">
              <span className="font-bold text-blue-900">{e.event.title}</span> 
              <span className="text-slate-600">{new Date(e.event.date).toLocaleDateString("de-DE")}</span>
              <span className="text-slate-600">{new Date(e.event.date).toLocaleTimeString("de-DE")}</span>
              <span className="font-bold text-blue-900">{e.event.location}</span> 
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}