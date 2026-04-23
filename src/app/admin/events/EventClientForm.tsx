"use client";

import { useRef, useState } from "react";
import { createEvent } from "./actions";

export default function EventClientForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    await createEvent(formData);
    formRef.current?.reset(); // Clear the form after success
    setLoading(false);
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1)] mx-4 sm:mx-0">
      <h2 className="text-[17px] font-bold text-[#050505] mb-4 border-b border-[#CED0D4]/50 pb-3">
        Neuen Termin hinzufügen
      </h2>

      <form ref={formRef} action={handleSubmit} className="space-y-4">
        
        {/* Row 1: Title & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-[#65676B] mb-1">Titel des Termins *</label>
            <input 
              name="title" 
              required 
              type="text" 
              placeholder="z.B. Jahreshauptversammlung"
              className="w-full p-2.5 bg-[#F0F2F5] border border-transparent focus:border-[#0866FF] rounded-md text-[15px] outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#65676B] mb-1">Datum & Uhrzeit *</label>
            <input 
              name="date" 
              required 
              type="datetime-local" 
              className="w-full p-2.5 bg-[#F0F2F5] border border-transparent focus:border-[#0866FF] rounded-md text-[15px] outline-none transition-colors"
            />
          </div>
        </div>

        {/* Row 2: Location */}
        <div>
          <label className="block text-[13px] font-semibold text-[#65676B] mb-1">Ort (Optional)</label>
          <input 
            name="location" 
            type="text" 
            placeholder="z.B. Vereinsheim"
            className="w-full p-2.5 bg-[#F0F2F5] border border-transparent focus:border-[#0866FF] rounded-md text-[15px] outline-none transition-colors"
          />
        </div>

        {/* Row 3: Description */}
        <div>
          <label className="block text-[13px] font-semibold text-[#65676B] mb-1">Beschreibung (Optional)</label>
          <textarea 
            name="description" 
            rows={3}
            placeholder="Weitere Details zum Termin..."
            className="w-full p-2.5 bg-[#F0F2F5] border border-transparent focus:border-[#0866FF] rounded-md text-[15px] outline-none transition-colors resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#0866FF] hover:bg-[#1877F2] text-white font-semibold py-2 px-5 rounded-md transition-colors disabled:opacity-50 text-[15px]"
          >
            {loading ? "Wird gespeichert..." : "Termin erstellen"}
          </button>
        </div>

      </form>
    </div>
  );
}