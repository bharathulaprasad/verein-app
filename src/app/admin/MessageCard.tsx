"use client";

import { useState } from "react";
import { User, CheckCircle2, Circle, Trash2 } from "lucide-react"; // ✨ Added Trash2
import { toggleMessageReadStatus, deleteMessage } from "./actions"; // ✨ Added deleteMessage

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
  const [isDeleted, setIsDeleted] = useState(false); // ✨ Added deleted state

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

  const handleDelete = async () => {
    // 1. Ask for confirmation so they don't click it by accident
    const confirmed = confirm("Möchten Sie diese Nachricht wirklich löschen?");
    if (!confirmed) return;

    // 2. Optimistic Update: Instantly hide the card!
    setIsDeleted(true);

    // 3. Delete from database
    try {
      await deleteMessage(msg.id);
    } catch (error) {
      console.error("Failed to delete message", error);
      // Revert the UI if the server failed
      setIsDeleted(false);
      alert("Fehler beim Löschen der Nachricht.");
    }
  };

  // ✨ If it is deleted, don't render the card at all!
  if (isDeleted) return null;

  return (
    <div className={`p-4 sm:p-5 rounded-xl border transition-colors duration-200 ${
      isRead 
        ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm" 
        : "bg-blue-50 dark:bg-slate-800 border-blue-200 dark:border-blue-900 shadow-md"
    }`}>
      
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-slate-500 dark:text-slate-400" />
        </div>
        
        <div className="flex flex-col">
          <p className="text-slate-900 dark:text-white font-semibold text-[15px] leading-tight">
            {msg.name}
          </p>
          <div className="flex items-center text-slate-500 dark:text-slate-400 text-[13px] mt-0.5 space-x-1">
            <span>
              {new Date(msg.createdAt).toLocaleDateString("de-DE", { 
                day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' 
              })} Uhr
            </span>
            <span>·</span>
            <a href={`mailto:${msg.email}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {msg.email}
            </a>
          </div>
        </div>
      </div>

      <div className="mt-2 pl-0 sm:pl-13"> 
        <p className={`text-[15px] whitespace-pre-wrap leading-relaxed ${
            isRead ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white font-medium"
        }`}>
          {msg.message}
        </p>
      </div>
         
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-2 justify-between items-center">
        
        {/* ✨ NEW: Delete Button (Placed on the left using mr-auto) */}
        <button 
          onClick={handleDelete}
          className="flex items-center gap-1.5 text-[15px] font-medium py-1.5 px-3.5 rounded-lg transition-colors text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 mr-auto"
          title="Nachricht löschen"
        >
          <Trash2 className="w-4 h-4" /> 
          <span className="hidden sm:inline">Löschen</span> {/* Hides text on tiny phones to save space */}
        </button>

        {/* Existing Action Buttons (Placed on the right) */}
        <div className="flex gap-2">
          <button 
            onClick={handleToggle}
            className="flex items-center gap-1.5 text-[15px] font-medium py-1.5 px-3.5 rounded-lg transition-colors bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            {isRead ? (
              <><Circle className="w-4 h-4" /> Als ungelesen markieren</>
            ) : (
              <><CheckCircle2 className="w-4 h-4" /> Als gelesen markieren</>
            )}
          </button>

          <a 
            href={`mailto:${msg.email}?subject=Re: Ihre Anfrage an den SVS NBG e.V.`}
            className="flex items-center gap-1.5 text-[15px] bg-blue-600 text-white font-medium py-1.5 px-3.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Antworten
          </a>
        </div>

      </div>
    </div>
  );
}