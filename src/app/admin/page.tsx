import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Inbox, Calendar, Mail, User } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  // 1. SECURE THE ROUTE: Only let ADMIN or VORSTAND in!
  const userRole = (session?.user as any)?.role;
  if (!session || (userRole !== "ADMIN" && userRole !== "VORSTAND")) {
    redirect("/"); // Kick unauthorized users back to the homepage
  }

  // 2. Fetch all messages from the database, newest first
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 transition-colors duration-300">
      
      <div className="flex items-center space-x-4 mb-8 border-b border-gray-200 dark:border-slate-800 pb-6">
        <Inbox className="w-10 h-10 text-amber-500" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Vorstand Postfach</h1>
          <p className="text-gray-500 dark:text-gray-400">Alle Nachrichten aus dem Kontaktformular</p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-xl border border-gray-200 dark:border-slate-800 text-center text-gray-500 dark:text-gray-400 shadow-sm transition-colors">
          Keine neuen Nachrichten vorhanden.
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 flex flex-col md:flex-row gap-6 transition-colors relative overflow-hidden">
              
              {/* Unread indicator line (Optional visual flair) */}
              {!msg.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>}

              {/* Meta Info (Sender & Date) */}
              <div className="md:w-1/3 space-y-3 border-b md:border-b-0 md:border-r border-gray-100 dark:border-slate-800 pb-4 md:pb-0 md:pr-6">
                <p className="flex items-center text-gray-800 dark:text-gray-200 font-semibold">
                  <User className="w-4 h-4 mr-2 text-slate-400" /> {msg.name}
                </p>
                <p className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4 mr-2 text-slate-400" /> 
                  <a href={`mailto:${msg.email}`} className="hover:text-blue-500">{msg.email}</a>
                </p>
                <p className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400" /> 
                  {new Date(msg.createdAt).toLocaleDateString("de-DE", { 
                    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })} Uhr
                </p>
              </div>

              {/* The Actual Message */}
              <div className="md:w-2/3">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{msg.message}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-slate-800/50 flex justify-end">
                  <a 
                    href={`mailto:${msg.email}?subject=Re: Ihre Anfrage an den SVS NBG e.V.`}
                    className="text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold py-2 px-4 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                  >
                    Antworten
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}