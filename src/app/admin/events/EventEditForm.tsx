"use client";

import { Event } from "@prisma/client";
import { useRef, useState }from "react";
import { editEvent } from "./actions";

interface EventEditFormProps {
  event: Event;
  onCancel: () => void;
  onSave: () => void;
}

export default function EventEditForm({ event, onCancel, onSave }: EventEditFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    const result = await editEvent(event.id, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      onSave();
    }
    setLoading(false);
  };

  const inputStyles = "w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 rounded-lg text-sm text-slate-900 dark:text-white outline-none transition-colors";
  
  // Format date for datetime-local input: YYYY-MM-DDTHH:mm
  const formatDateForInput = (date: Date) => {
    const d = new Date(date);
    const pad = (num: number) => (num < 10 ? '0' : '') + num;
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-b-xl border-t border-slate-200 dark:border-slate-800">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          name="title"
          required
          type="text"
          defaultValue={event.title}
          className={inputStyles}
        />
        <input
          name="date"
          required
          type="datetime-local"
          defaultValue={formatDateForInput(event.date)}
          className={inputStyles}
        />
      </div>
      <input
        name="location"
        type="text"
        defaultValue={event.location || ""}
        placeholder="Ort (Optional)"
        className={inputStyles}
      />
      <textarea
        name="description"
        rows={2}
        defaultValue={event.description || ""}
        placeholder="Beschreibung (Optional)"
        className={`${inputStyles} resize-none`}
      />
      <div className="pt-1 flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-medium py-1.5 px-4 rounded-lg transition-colors text-sm">Abbrechen</button>
        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-lg transition-colors disabled:opacity-50 text-sm">
          {loading ? "Speichern..." : "Speichern"}
        </button>
      </div>
    </form>
  );
}