"use client";

import { useState, useTransition } from "react";
import { toggleEventParticipation } from "@/app/actions/events";
import { CheckCircle2, UserPlus, Users } from "lucide-react";

interface EventRsvpButtonProps {
  eventId: string;
  initialIsParticipating: boolean;
  participantCount: number;
  isLoggedIn: boolean;
  userRole?: string;
}

export default function EventRsvpButton({ 
  eventId, 
  initialIsParticipating, 
  participantCount,
  isLoggedIn ,
  userRole
}: EventRsvpButtonProps) {
  
  const [isPending, startTransition] = useTransition();
  const [isParticipating, setIsParticipating] = useState(initialIsParticipating);
  const [count, setCount] = useState(participantCount);

  const handleToggle = () => {
    if (!isLoggedIn) {
      alert("Bitte loggen Sie sich ein, um sich für diesen Termin anzumelden.");
      return;
    }
    if (userRole === "GUEST") {
      alert("Gäste können sich leider nicht für Termine anmelden. Bitte aktualisieren Sie Ihre Zugriffsrechte. Bitte wenden Sie sich an den Vorstand.");
      return;
    }

    // Instant Optimistic UI Update
    setIsParticipating(!isParticipating);
    setCount(isParticipating ? count - 1 : count + 1);

    // Background Database Update
    startTransition(async () => {
      try {
        await toggleEventParticipation(eventId);
      } catch (error) {
        console.error("Failed to toggle participation", error);
        setIsParticipating(isParticipating); // Revert on failure
        setCount(participantCount);
        alert("Ein Fehler ist aufgetreten.");
      }
    });
  };

  return (
    <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 font-medium">
        <Users className="w-4 h-4 mr-1.5" />
        {count} Teilnehmer
      </div>

      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`flex items-center gap-2 text-sm font-bold py-2 px-4 rounded-lg transition-all active:scale-95 disabled:opacity-70 ${
          isParticipating 
            ? "bg-green-100 text-green-700 hover:bg-red-50 hover:text-red-600 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-red-900/30 dark:hover:text-red-400 group" 
            : "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
        }`}
      >
        {isParticipating ? (
          <>
            <CheckCircle2 className="w-4 h-4 group-hover:hidden" />
            <span className="group-hover:hidden">Ich nehme teil</span>
            <span className="hidden group-hover:inline">Absagen?</span>
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" /> Teilnehmen
          </>
        )}
      </button>
    </div>
  );
}