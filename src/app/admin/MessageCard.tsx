"use client";

import { useState } from "react";
import { Calendar, Mail, User, CheckCircle2, Circle } from "lucide-react";
import { toggleMessageReadStatus } from "./actions";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export default function MessageCard({ msg }: { msg: ContactMessage }) {
  const [isRead, setIsRead] = useState(msg.isRead);

  const handleToggle = async () => {
    setIsRead(!isRead);
    try {
      await toggleMessageReadStatus(msg.id, isRead);
    } catch (error) {
      console.error("Failed to update status", error);
      setIsRead(isRead);
      alert("Fehler beim Aktualisieren des Status.");
    }
  };

  return (
    <div className={`bg-white p-6 rounded-2xl flex flex-col md:flex-row gap-6 transition-all duration-300 relative overflow-hidden ${
      isRead 
        ? "border border-slate-100 shadow-sm opacity-90" 
        : "border border-indigo-100 shadow-md shadow-indigo-100/50"
    }`}>
      
      {/* ✨ Calming Indigo Unread Indicator */}
      {!isRead && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-400"></div>}

      {/* Meta Info */}
      <div className="md:w-1/3 space-y-3 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
        <p className="flex items-center text-slate-700 font-semibold">
          <User className="w-4 h-4 mr-2 text-indigo-300" /> {msg.name}
        </p>
        <p className="flex items-center text-sm text-slate-500">
          <Mail className="w-4 h-4 mr-2 text-indigo-300" /> 
          <a href={`mailto:${msg.email}`} className="hover:text-indigo-500 transition-colors truncate">{msg.email}</a>
        </p>
        <p className="flex items-center text-sm text-slate-400">
          <Calendar className="w-4 h-4 mr-2 text-indigo-300" /> 
          {new Date(msg.createdAt).toLocaleDateString("de-DE", { 
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
          })} Uhr
        </p>
      </div>

      {/* The Actual Message & Buttons */}
      <div className="md:w-2/3 flex flex-col">
        {/* Softer slate-600 text for easier reading */}
        <p className={`text-slate-600 whitespace-pre-wrap flex-grow leading-relaxed ${
            isRead ? "font-normal" : "font-medium text-slate-800"
        }`}>
          {msg.message}
        </p>
         
        <div className="mt-6 pt-4 border-t border-slate-50 flex flex-wrap gap-3 justify-end">
          
          {/* Toggle Button */}
          <button 
            onClick={handleToggle}
            className={`flex items-center gap-2 text-sm font-medium py-2.5 px-4 rounded-xl transition-colors ${
              isRead 
                ? "bg-slate-50 text-slate-500 hover:bg-slate-100" 
                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            }`}
          >
            {isRead ? (
              <><Circle className="w-4 h-4" /> Als ungelesen markieren</>
            ) : (
              <><CheckCircle2 className="w-4 h-4" /> Als gelesen markieren</>
            )}
          </button>

          {/* ✨ Pleasant Indigo Primary Button */}
          <a 
            href={`mailto:${msg.email}?subject=Re: Ihre Anfrage an den SVS NBG e.V.`}
            className="flex items-center gap-2 text-sm bg-indigo-500 text-white font-medium py-2.5 px-6 rounded-xl hover:bg-indigo-600 transition-colors active:scale-95 shadow-sm shadow-indigo-200"
          >
            Antworten
          </a>
        </div>
      </div>

    </div>
  );
}