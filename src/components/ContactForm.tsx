"use client";

import { useActionState } from "react";
import { submitContactForm } from "@/app/actions/contact";
import { Send, CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ContactForm() {
  const { data: session, status: sessionStatus } = useSession();
  const [state, formAction, isPending] = useActionState(submitContactForm, null);

  // 1. Loading State (Checking if user is logged in)
  if (sessionStatus === "loading") {
    return (
      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 text-center h-full flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Lade Formular...</p>
      </div>
    );
  }

  // 2. Locked State (Guest User)
  if (!session) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 text-center flex flex-col items-center justify-center h-full transition-colors">
        <Lock className="w-12 h-12 text-blue-300 dark:text-slate-600 mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Nur für Mitglieder</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Bitte loggen Sie sich ein, um dem Vorstand eine direkte Nachricht zu senden.
        </p>
        <Link 
          href="/api/auth/signin" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
        >
          Zum Mitglieder Login
        </Link>
      </div>
    );
  }

  // 3. Success State (Message Sent)
  if (state?.success) {
    return (
      <div className="bg-green-50 dark:bg-green-900/30 p-8 rounded-xl border border-green-200 dark:border-green-800 text-center transition-colors h-full flex flex-col justify-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 dark:text-green-400">Vielen Dank, {session.user?.name?.split(' ')[0]}!</h3>
        <p className="text-green-700 dark:text-green-300 mt-2">Ihre Nachricht wurde erfolgreich gesendet.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 text-green-700 dark:text-green-400 font-semibold hover:underline"
        >
          Weitere Nachricht senden
        </button>
      </div>
    );
  }

  // 4. Active Form State (Logged-In User)
  return (
    <form 
      action={formAction} 
      className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 transition-colors"
    >
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Schreiben Sie uns</h3>
      
      {state?.error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-md mb-6 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" /> {state.error}
        </div>
      )}

      <div className="space-y-4">
        {/* Name Field (Pre-filled but editable just in case) */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <input 
            type="text" id="name" name="name" 
            defaultValue={session.user?.name || ""} 
            required disabled={isPending}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
          />
        </div>
        
        {/* Email Field (Pre-filled, disabled, and greyed out!) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-Mail Adresse (Google/Facebook)</label>
          <input 
            type="email" id="email" name="email" 
            defaultValue={session.user?.email || ""} 
            disabled // This greys it out and prevents typing!
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-gray-400 cursor-not-allowed outline-none transition-all"
          />
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nachricht</label>
          <textarea 
            id="message" name="message" rows={4} required disabled={isPending}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
            placeholder={`Hallo Vorstand, ich habe eine Frage bezüglich...`}
          ></textarea>
        </div>

        <button 
          type="submit" disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all"
        >
          {isPending ? "Wird gesendet..." : <><Send className="w-5 h-5 mr-2" /> Nachricht senden</>}
        </button>
      </div>
    </form>
  );
}