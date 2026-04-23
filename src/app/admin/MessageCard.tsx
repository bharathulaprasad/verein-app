"use client";

import { useState } from "react";
import { User, CheckCircle2, Circle } from "lucide-react";
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
    <div className={`p-4 sm:p-5 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-colors duration-200 ${
      isRead 
        ? "bg-white" 
        : "bg-[#E7F3FF]" // Meta's exact unread notification blue
    }`}>
      
      {/* HEADER: Avatar, Name, Timestamp (Facebook Style) */}
      <div className="flex items-center space-x-3 mb-3">
        {/* Fake Avatar Circle */}
        <div className="w-10 h-10 rounded-full bg-[#E4E6EB] flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-[#65676B]" />
        </div>
        
        <div className="flex flex-col">
          <p className="text-[#050505] font-semibold text-[15px] leading-tight">
            {msg.name}
          </p>
          <div className="flex items-center text-[#65676B] text-[13px] mt-0.5 space-x-1">
            <span>
              {new Date(msg.createdAt).toLocaleDateString("de-DE", { 
                day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' 
              })} Uhr
            </span>
            <span>·</span>
            <a href={`mailto:${msg.email}`} className="hover:underline text-[#65676B]">
              {msg.email}
            </a>
          </div>
        </div>
      </div>

      {/* BODY: The Actual Message */}
      <div className="mt-2 pl-0 sm:pl-13"> {/* Indent slightly on desktop to align with text */}
        <p className={`text-[15px] whitespace-pre-wrap leading-relaxed ${
            isRead ? "text-[#050505]" : "text-[#050505] font-medium"
        }`}>
          {msg.message}
        </p>
      </div>
         
      {/* FOOTER: Facebook Style Buttons */}
      <div className="mt-4 pt-4 border-t border-[#CED0D4]/50 flex flex-wrap gap-2 justify-end">
        
        {/* Meta Secondary Gray Button */}
        <button 
          onClick={handleToggle}
          className="flex items-center gap-1.5 text-[15px] font-semibold py-1.5 px-3.5 rounded-md transition-colors bg-[#E4E6EB] text-[#050505] hover:bg-[#D8DADF]"
        >
          {isRead ? (
            <><Circle className="w-4 h-4" /> Als ungelesen markieren</>
          ) : (
            <><CheckCircle2 className="w-4 h-4" /> Als gelesen markieren</>
          )}
        </button>

        {/* Meta Primary Blue Button */}
        <a 
          href={`mailto:${msg.email}?subject=Re: Ihre Anfrage an den SVS NBG e.V.`}
          className="flex items-center gap-1.5 text-[15px] bg-[#0866FF] text-white font-semibold py-1.5 px-3.5 rounded-md hover:bg-[#1877F2] transition-colors"
        >
          Antworten
        </a>
      </div>

    </div>
  );
}