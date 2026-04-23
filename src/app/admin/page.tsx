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
  // ✨ Pleasant, subtle sky-blue tinted background
  <div className="min-h-screen bg-sky-50/50 py-12 px-4 font-sans">
   <div className="max-w-5xl mx-auto space-y-8">
     
    {/* ✨ Soft, welcoming header */}
    <div className="flex items-center space-x-5 mb-8 border-b border-slate-200 pb-6">
     <div className="p-3.5 bg-white rounded-2xl shadow-sm border border-slate-100">
       <Inbox className="w-8 h-8 text-indigo-500" />
     </div>
     <div>
      {/* Softer slate-800 instead of harsh black */}
      <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
        Vorstand Postfach
      </h1>
      <p className="text-slate-500 mt-1">
        Alle Nachrichten aus dem Kontaktformular
      </p>
     </div>
    </div>

    {messages.length === 0 ? (
     <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center text-slate-500 shadow-sm">
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