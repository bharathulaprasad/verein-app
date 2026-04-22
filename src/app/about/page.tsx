import prisma from "@/lib/prisma";
import { Users, Landmark, FileText, HeartHandshake } from "lucide-react";

export const metadata = {
  title: "Über uns | SVS NBG e.V.",
};

export default async function AboutPage() {
  const vereinInfo = await prisma.vereinInfo.findFirst();
  const boardMembers = await prisma.boardMember.findMany({
    orderBy: { order: "asc" },
  });

  if (!vereinInfo) return <div className="text-center p-12">Bitte Datenbank seeden!</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-12 transition-colors duration-300">
      
      {/* 1. Header & Vereinsgeschichte */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 transition-colors">
        <div className="flex items-center space-x-4 mb-6">
          <HeartHandshake className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl font-extrabold text-blue-900 dark:text-blue-400">Über uns</h1>
        </div>
        
        <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>{vereinInfo.aboutText}</p>
          <p className="bg-blue-50 dark:bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-600 dark:border-blue-500 mt-6">
            Falls wir Ihr Interesse an unserer Siedlungsgemeinschaft geweckt haben, dann kontaktieren Sie uns doch einfach per E-Mail unter <a href={`mailto:${vereinInfo.contactEmail}`} className="text-blue-700 dark:text-blue-400 font-bold hover:underline">{vereinInfo.contactEmail}</a> oder melden sich bei einem unserer Vorstände.
          </p>
        </div>
      </section>

      {/* 2. Der Vorstand */}
      <section>
        <div className="flex items-center space-x-3 mb-6 px-2">
          <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Vorstand der SVS NBG e.V.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {boardMembers.map((member) => (
            <div key={member.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 transition-colors">
              <h3 className="text-blue-900 dark:text-blue-400 font-bold uppercase tracking-wider text-sm mb-1">{member.role}</h3>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{member.name}</p>
              <div className="mt-4 space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <p>{member.address}</p>
                <p><strong>Telefon:</strong> {member.phone}</p>
                <p><strong>Mail:</strong> <a href={`mailto:${member.email}`} className="hover:text-blue-500">{member.email}</a></p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Rechtliches & Bankverbindung */}
      <section className="grid md:grid-cols-2 gap-6 pb-8">
        <div className="bg-slate-100 dark:bg-slate-800/80 p-6 rounded-xl flex items-start space-x-4 transition-colors">
          <Landmark className="w-8 h-8 text-slate-500 dark:text-slate-400 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Bankverbindung</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              <strong>Bank:</strong> {vereinInfo.bankName}<br />
              <strong>IBAN:</strong> {vereinInfo.iban}<br />
              <strong>BIC:</strong> {vereinInfo.bic}
            </p>
          </div>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800/80 p-6 rounded-xl flex items-start space-x-4 transition-colors">
          <FileText className="w-8 h-8 text-slate-500 dark:text-slate-400 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Registergericht</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {vereinInfo.registerCourt}<br />
              <strong>Registernummer:</strong> {vereinInfo.registerNumber}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}