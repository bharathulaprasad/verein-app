"use client"; // Required if you are using Next.js App Router

import { useEffect, useState } from "react";

interface Departure {
  Linienname: string;
  Richtungstext: string;
  AbfahrtszeitIst: string; // Real-time departure
  AbfahrtszeitSoll: string; // Scheduled departure
}

export default function VAGLiveDepartureWidget() {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);

  // Worzeldorfer Str. ID is 1731 according to VAG API documentation
  const stopId = 1731;

  useEffect(() => {
    async function fetchDepartures() {
      try {
        const res = await fetch(`https://start.vag.de/dm/api/abfahrten.json/vgn/${stopId}`);
        const data = await res.json();
        // Keep only the next 10 departures
        setDepartures(data.Abfahrten.slice(0, 10));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching VAG data:", error);
        setLoading(false);
      }
    }

    fetchDepartures();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDepartures, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 transition-colors">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
        Worzeldorfer Str. - Live Abfahrten
      </h3>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Lade Live-Daten...</p>
      ) : (
        <ul className="space-y-3">
          {departures.map((dep, index) => (
            <li key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="bg-red-500 text-white font-bold px-2 py-1 rounded text-sm">
                  {dep.Linienname}
                </span>
                <span className="text-gray-700 dark:text-gray-200 font-medium truncate w-32">
                  {dep.Richtungstext}
                </span>
              </div>
              <div className="text-right">
                <div className="text-gray-900 dark:text-white font-bold">
                  {/* Format the time to be human-readable (HH:MM) */}
                  {new Date(dep.AbfahrtszeitIst || dep.AbfahrtszeitSoll).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                {dep.AbfahrtszeitIst !== dep.AbfahrtszeitSoll && (
                  <div className="text-xs text-red-500">
                    {/* Also format the planned time if there is a delay */}
                    Plan: {new Date(dep.AbfahrtszeitSoll).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul >
      )}
    </div >
  );
}