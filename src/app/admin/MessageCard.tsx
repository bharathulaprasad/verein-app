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
    // 🍓 CHANGED: Beautiful white/translucent cards with rose-tinted borders
    <div className={`bg-white/90 backdrop-blur-md dark:bg-slate-900/80 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6 transition-all duration-300 relative overflow-hidden ${
      isRead 
        ? "border border-rose-100 dark:border-rose-900/30 opacity-75 hover:opacity-100" 
        : "border-2 border-rose-300 dark:border-rose-500/50 shadow-rose-100 dark:shadow-rose-900/20 shadow-lg scale-[1.01]"
    }`}>
      
      {/* 🍓 CHANGED: Vibrant strawberry unread indicator */}
      {!isRead && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-rose-400 to-pink-500"></div>}

      {/* Meta Info */}
      <div className="md:w-1/3 space-y-3 border-b md:border-b-0 md:border-r border-rose-100 dark:border-rose-900/30 pb-4 md:pb-0 md:pr-6">
        <p className="flex items-center text-gray-800 dark:text-gray-200 font-bold">
          <User className="w-4 h-4 mr-2 text-rose-400" /> {msg.name}
        </p>
        <p className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Mail className="w-4 h-4 mr-2 text-rose-400" /> 
          <a href={`mailto:${msg.email}`} className="hover:text-rose-500 transition-colors truncate">{msg.email}</a>
        </p>
        <p className="flex items-center text-sm text-gray-500 dark:text-gray-500">
          <Calendar className="w-4 h-4 mr-2 text-rose-400" /> 
          {new Date(msg.createdAt).toLocaleDateString("de-DE", { 
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
          })} Uhr
        </p>
      </div>

      {/* The Actual Message & Buttons */}
      <div className="md:w-2/3 flex flex-col">
        <p className={`text-gray-700 dark:text-gray-300 whitespace-pre-wrap flex-grow leading-relaxed ${
            isRead ? "font-normal" : "font-medium text-gray-900 dark:text-gray-100"
        }`}>
          {msg.message}
        </p>
         
        <div className="mt-6 pt-4 border-t border-rose-50 dark:border-rose-900/30 flex flex-wrap gap-3 justify-end">
          
          {/* 🍓 CHANGED: Strawberry themed toggle buttons */}
          <button 
            onClick={handleToggle}
            className={`flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-xl transition-all active:scale-95 ${
              isRead 
                ? "bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-rose-50 hover:text-rose-600 border border-gray-200 dark:border-gray-700" 
                : "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/60"
            }`}
          >
            {isRead ? (
              <><Circle className="w-4 h-4" /> Als ungelesen markieren</>
            ) : (
              <><CheckCircle2 className="w-4 h-4" /> Als gelesen markieren</>
            )}
          </button>

          {/* 🍓 CHANGED: Vibrant gradient reply button */}
          <a 
            href={`mailto:${msg.email}?subject=Re: Ihre Anfrage an den SVS NBG e.V.`}
            className="flex items-center gap-2 text-sm bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold py-2 px-5 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all shadow-md shadow-rose-200 dark:shadow-none active:scale-95"
          >
            Antworten
          </a>
        </div>
      </div>

    </div>
  );
}