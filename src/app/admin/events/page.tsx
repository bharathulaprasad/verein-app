"use client";

import { useState, useEffect } from "react";
import { Event } from "@prisma/client";
import EventClientForm from "./EventClientForm";
import EventEditForm from "./EventEditForm";
import { Calendar, MapPin, Trash2, Edit } from "lucide-react";
import { deleteEvent } from "./actions";

async function getEvents(): Promise<Event[]> {
  const res = await fetch('/api/events'); 
  if (!res.ok) {
    console.error("Failed to fetch events");
    return [];
  }
  return res.json();
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  // NOTE: Authorization should be handled in a middleware or the API route for a real app.

  return (
    <div className="py-8 px-0 sm:px-4 font-sans transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="px-4 sm:px-0">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Termine Verwalten</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Neue Vereins-Termine anlegen oder löschen
          </p>
        </div>

        <EventClientForm />

        <div className="px-4 sm:px-0 mt-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Anstehende Termine</h2>
          
          {events.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center text-slate-500 dark:text-slate-400">
              Keine anstehenden Termine gefunden.
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-[16px]">{event.title}</h3>
                      <h3 className="block text-[13px] font-semibold text-slate-600 dark:text-slate-400 mb-1">{event.description}</h3>
                      
                      <div className="flex items-center text-slate-500 dark:text-slate-400 text-[13px] mt-1 space-x-3">
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          {new Date(event.date).toLocaleDateString("de-DE", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} Uhr
                        </span>
                        {event.location && (
                          <span className="flex items-center">
                            <MapPin className="w-3.5 h-3.5 mr-1" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button onClick={() => setEditingEventId(event.id)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Bearbeiten">
                        <Edit className="w-5 h-5" />
                      </button>
                      <form action={async () => {
                        await deleteEvent(event.id);
                        setEvents(events.filter(e => e.id !== event.id));
                      }}>
                        <button type="submit" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Löschen">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </form>
                    </div>
                  </div>
                  {editingEventId === event.id && (
                    <EventEditForm 
                      event={event} 
                      onCancel={() => setEditingEventId(null)}
                      onSave={() => {
                        setEditingEventId(null);
                        getEvents().then(setEvents); // Refresh list
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}