"use client";

import { useRef, useState } from "react";
import { createEvent } from "./actions";

export default function EventClientForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    await createEvent(formData);
    formRef.current?.reset(); 
    setLoading(false);
  };

  // Shared input styling so we don't repeat classes
  const inputStyles = "w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 rounded-lg text-[15px] text-slate-900 dark:text-white outline-none transition-colors";

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mx-4 sm:mx-0">
      <h2 className="text-[17px] font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        Neuen Termin hinzufügen
      </h2>

      <form ref={formRef} action={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Titel des Termins *</label>
            <input 
              name="title" 
              required 
              type="text" 
              placeholder="z.B. Jahreshauptversammlung"
              className={inputStyles}
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Datum & Uhrzeit *</label>
            <input 
              name="date" 
              required 
              type="datetime-local" 
              className={inputStyles}
            />
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Ort (Optional)</label>
          <input 
            name="location" 
            type="text" 
            placeholder="z.B. Vereinsheim"
            className={inputStyles}
          />
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Beschreibung (Optional)</label>
          <textarea 
            name="description" 
            rows={3}
            placeholder="Weitere Details zum Termin..."
            className={`${inputStyles} resize-none`}
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg transition-colors disabled:opacity-50 text-[15px]"
          >
            {loading ? "Wird gespeichert..." : "Termin erstellen"}
          </button>
        </div>

      </form>
    </div>
  );
}