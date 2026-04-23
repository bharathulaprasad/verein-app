import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
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
  // Meta Background Gray
  <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 transition-colors duration-600">
   <div className="max-w-3xl mx-auto space-y-4">
     
    
    <div className="mb-4 px-4 sm:px-0">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white"> 
        Vorstand Postfach
      </h1>
      <p className="text-[#65676B] text-[15px] mt-1">
        Alle Nachrichten aus dem Kontaktformular
      </p>
    </div>

    {messages.length === 0 ? (
     <div className="bg-white p-8 rounded-lg shadow-sm text-center text-[#65676B] font-medium">
      Keine neuen Nachrichten vorhanden.
     </div>
    ) : (
     <div className="space-y-4">
      {messages.map((msg) => (
       <MessageCard key={msg.id} msg={msg} />
      ))}
     </div>
    )}
   </div>
  </div>
 );
}