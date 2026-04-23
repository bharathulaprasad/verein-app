"use client";

import { useState } from "react";
import { Calendar, Mail, User, CheckCircle2, Circle } from "lucide-react";
import { toggleMessageReadStatus } from "./actions";

// Define the type based on your Prisma model
type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export default function MessageCard({ msg }: { msg: ContactMessage }) {
  // Store the read status locally for instant UI updates
  const [isRead, setIsRead] = useState(msg.isRead);

  const handleToggle = async () => {
    // 1. Optimistic Update: Instantly change the UI
    setIsRead(!isRead);

    // 2. Update Database in the background
    try {
      await toggleMessageReadStatus(msg.id, isRead);
    } catch (error) {
      console.error("Failed to update status", error);
      // Revert if the server action fails
      setIsRead(isRead);
      alert("Fehler beim Aktualisieren des Status.");
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border flex flex-col md:flex-row gap-6 transition-colors relative overflow-hidden ${
      isRead ? "border-gray-200 dark:border-slate-800 opacity-80" : "border-amber-200 dark:border-amber-900/50"
    }`}>
      
      {/* Unread indicator line */}
      {!isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>}

      {/* Meta Info (Sender & Date) */}
      <div className="md:w-1/3 space-y-3 border-b md:border-b-0 md:border-r border-gray-100 dark:border-slate-800 pb-4 md:pb-0 md:pr-6">
        <p className="flex items-center text-gray-800 dark:text-gray-200 font-semibold">
          <User className="w-4 h-4 mr-2 text-slate-400" /> {msg.name}
        </p>
        <p className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Mail className="w-4 h-4 mr-2 text-slate-400" /> 
          <a href={`mailto:${msg.email}`} className="hover:text-blue-500 truncate">{msg.email}</a>
        </p>
        <p className="flex items-center text-sm text-gray-500 dark:text-gray-500">
          <Calendar className="w-4 h-4 mr-2 text-slate-400" /> 
          {new Date(msg.createdAt).toLocaleDateString("de-DE", { 
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
          })} Uhr
        </p>
      </div>

      {/* The Actual Message & Buttons */}
      <div className="md:w-2/3 flex flex-col">
        <p className={`text-gray-700 dark:text-gray-300 whitespace-pre-wrap flex-grow ${
            isRead ? "font-normal" : "font-medium"
        }`}>
          {msg.message}
        </p>
         
        <div className="mt-4 pt-4 border-t border-gray-50 dark:border-slate-800/50 flex flex-wrap gap-3 justify-end">
          
          {/* NEW Toggle Button */}
          <button 
            onClick={handleToggle}
            className={`flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg transition-colors ${
              isRead 
                ? "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700" 
                : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40"
            }`}
          >
            {isRead ? (
              <><Circle className="w-4 h-4" /> Als ungelesen markieren</>
            ) : (
              <><CheckCircle2 className="w-4 h-4" /> Als gelesen markieren</>
            )}
          </button>

          {/* Existing Answer Button */}
          <a 
            href={`mailto:${msg.email}?subject=Re: Ihre Anfrage an den SVS NBG e.V.`}
            className="flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold py-2 px-4 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            Antworten
          </a>
        </div>
      </div>

    </div>
  );
}