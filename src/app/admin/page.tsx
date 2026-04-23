import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Inbox } from "lucide-react";
import MessageCard from "./MessageCard"; 

export default async function AdminDashboard() {
 const session = await getServerSession(authOptions);

 const userRole = (session?.user as any)?.role;
 if (!session || (userRole !== "ADMIN" && userRole !== "VORSTAND")) {
  redirect("/"); 
 }

 const messages = await prisma.contactMessage.findMany({
  orderBy: { createdAt: "desc" },
 });

 return (
  // 🍓 CHANGED: Added a full-page soft strawberry background (rose-50)
  <div className="min-h-screen bg-rose-50 dark:bg-rose-950 py-12 px-4 transition-colors duration-300">
   <div className="max-w-5xl mx-auto space-y-8">
     
    {/* 🍓 CHANGED: Vibrant pink border and gradient icon */}
    <div className="flex items-center space-x-4 mb-8 border-b border-rose-200 dark:border-rose-900/50 pb-6">
     <div className="p-3 bg-white dark:bg-rose-900/50 rounded-2xl shadow-sm border border-rose-100 dark:border-rose-800">
       <Inbox className="w-8 h-8 text-rose-500 dark:text-rose-400" />
     </div>
     <div>
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-rose-50 tracking-tight">
        Vorstand Postfach
      </h1>
      <p className="text-rose-600/80 dark:text-rose-300/80 font-medium mt-1">
        Alle Nachrichten aus dem Kontaktformular
      </p>
     </div>
    </div>

    {messages.length === 0 ? (
     // 🍓 CHANGED: Soft tinted empty state
     <div className="bg-white/80 backdrop-blur-sm dark:bg-rose-900/20 p-12 rounded-2xl border border-rose-100 dark:border-rose-800/50 text-center text-rose-400 dark:text-rose-300/70 shadow-sm transition-colors">
      Keine neuen Nachrichten vorhanden.
     </div>
    ) : (
     <div className="space-y-6">
      {messages.map((msg) => (
       <MessageCard key={msg.id} msg={msg} />
      ))}
     </div>
    )}
   </div>
  </div>
 );
}