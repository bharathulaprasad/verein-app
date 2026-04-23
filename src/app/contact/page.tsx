// app/contact/page.tsx
"use client"; // This is a Client Component because it handles form typing and button clicks

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // ✨ THIS IS THE FUNCTION THAT TRIGGERS YOUR API ROUTE ✨
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the page from refreshing
    setStatus("loading");

    // 1. Gather the data the user typed into the form
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      // 2. THE TRIGGER: Send the data to your backend route!
      // This fetch targets "/api/contact", which exactly matches your app/api/contact/route.ts file!
      const response = await fetch("/api/contact", {
        method: "POST", // This tells Next.js to run the "export async function POST" in your route.ts
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // 3. Check if the server replied with success
      if (response.ok) {
        setStatus("success"); // Show the green checkmark
      } else {
        setStatus("error"); // Show the red error
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
    }
  };

  // Standard Tailwind classes for the inputs (Supports Dark Mode!)
  const inputClasses = "w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl text-[15px] text-slate-900 dark:text-white outline-none transition-colors";

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 transition-colors duration-300">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
          Kontaktieren Sie uns
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Schreiben Sie dem Web Entwickler eine Nachricht.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        
        {/* IF SUCCESS: Show a beautiful green checkmark instead of the form */}
        {status === "success" ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Nachricht gesendet!</h2>
            <p className="text-slate-500 dark:text-slate-400">
              Vielen Dank für Ihre Nachricht. Der Web Entwickler wurde per E-Mail benachrichtigt.
            </p>
          </div>
        ) : (
          
          /* IF IDLE/LOADING: Show the actual form */
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {status === "error" && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                Es gab ein Problem beim Senden. Bitte versuchen Sie es später noch einmal.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Name</label>
                <input name="name" required type="text" placeholder="Max Mustermann" className={inputClasses} disabled={status === "loading"} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">E-Mail</label>
                <input name="email" required type="email" placeholder="max@beispiel.de" className={inputClasses} disabled={status === "loading"} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Nachricht</label>
              <textarea name="message" required rows={5} placeholder="Ihre Nachricht an den Verein..." className={`${inputClasses} resize-none`} disabled={status === "loading"} />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={status === "loading"}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {status === "loading" ? "Wird gesendet..." : <><Send className="w-4 h-4 mr-1" /> Nachricht absenden</>}
            </button>

          </form>
        )}
      </div>
    </div>
  );
}