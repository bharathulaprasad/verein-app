import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Inbox } from "lucide-react";
import MessageCard from "./MessageCard"; // <-- Import the new client component

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
     {/* Render the extracted client component */}
     {messages.map((msg) => (
      <MessageCard key={msg.id} msg={msg} />
     ))}
    </div>
   )}
  </div>
 );
}