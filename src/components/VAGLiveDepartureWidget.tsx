"use client"; // Required if you are using Next.js App Router

import { useEffect, useState, useRef } from 'react'; // Import useRef
import { XCircle } from 'lucide-react'; // Import XCircle icon

interface Departure {
  Linienname: string;
  Richtungstext: string;
  AbfahrtszeitIst: string; // Real-time departure
  AbfahrtszeitSoll: string; // Scheduled departure
}

interface Stop {
  Haltestellenname: string;
  VAGKennung: string; // Corrected: This is a string like "ALMOSH"
  VGNKennung: number;
  Latitude: number;
  Longitude: number;
  Produkte?: string; // Added optional property from API
}

export default function VAGLiveDepartureWidget() {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [availableStops, setAvailableStops] = useState<Stop[]>([]);
  const [selectedStopId, setSelectedStopId] = useState<number | null>(null);
  const [stopSearch, setStopSearch] = useState('');
  const [loadingStops, setLoadingStops] = useState(true);
  const [specialInfo, setSpecialInfo] = useState<string[]>([]); // New state for special information
  const inputRef = useRef<HTMLInputElement>(null); // Ref for the input element
  const [loadingDepartures, setLoadingDepartures] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch all available stops once on component mount
  useEffect(() => {
    async function fetchAvailableStops() {
      try {
        const res = await fetch(`https://start.vag.de/dm/api/haltestellen.json/vgn`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (data && Array.isArray(data.Haltestellen)) {
          // Filter out stops that do not have the 'Produkte' property
          const filteredStops = data.Haltestellen.filter((stop: Stop) => stop.Produkte);

          const sortedStops = filteredStops.sort((a: Stop, b: Stop) =>
            a.Haltestellenname.localeCompare(b.Haltestellenname)
          );
          setAvailableStops(sortedStops);
          console.log("fetchAvailableStops: Sorted stops loaded. Example VGNKennung:", sortedStops[0]?.VGNKennung);

          // Set the default stop after the list has been loaded, explicitly typing 's'
          const defaultStop = sortedStops.find((s: Stop) => s.VGNKennung === 1731);
          if (defaultStop) {
            console.log("fetchAvailableStops: Setting default selectedStopId to", defaultStop.VGNKennung);
            setSelectedStopId(defaultStop.VGNKennung);
            setStopSearch(defaultStop.Haltestellenname);
          }
        } else {
          throw new Error("Invalid data format for stops.");
        }
      } catch (err) {
        console.error("Error fetching available VAG stops:", err);
        setError("Haltestellen konnten nicht geladen werden.");
      } finally {
        setLoadingStops(false);
      }
    }
    fetchAvailableStops();
  }, []);

  // 2. Fetch departures whenever selectedStopId changes
  useEffect(() => {
    const fetchDepartures = async () => {
      // This guard is crucial. It prevents fetching if the ID is null.
      console.log("useEffect[selectedStopId]: Fetching departures for ID:", selectedStopId);
      if (selectedStopId === null) {
        setDepartures([]);
        setLoadingDepartures(false); // Stop loading if there's no ID
        return;
      }

      setLoadingDepartures(true);
      setError(null);
      try {
        // Log the exact URL being constructed
        console.log("useEffect[selectedStopId]: Fetch URL:", `https://start.vag.de/dm/api/abfahrten.json/vgn/${selectedStopId}`);
        const res = await fetch(`https://start.vag.de/dm/api/abfahrten.json/vgn/${selectedStopId}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setDepartures(data?.Abfahrten?.slice(0, 5) || []);
        // New: Extract and set Sonderinformationen
        setSpecialInfo(data?.Sonderinformationen || []);
      } catch (err) {
        // Also clear special info on error
        setSpecialInfo([]);
        console.error("Error fetching VAG data:", err);
        setError("Abfahrtsdaten konnten nicht geladen werden.");
        setDepartures([]);
      } finally {
        setLoadingDepartures(false);
      }
    };

    fetchDepartures(); // Fetch immediately
    const intervalId = setInterval(fetchDepartures, 30000); // Set up the refresh interval
    return () => clearInterval(intervalId); // Cleanup interval on re-run or unmount
  }, [selectedStopId]);

  // 3. Handle user input for the searchable list
  const handleStopInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const inputStopName = event.currentTarget.value;
    setStopSearch(inputStopName);

    const foundStop = availableStops.find(
      (s) => s.Haltestellenname === inputStopName
    );

    // Only update the ID if there's an exact match or the input is empty.
    // This prevents API calls with partial/invalid names.
    if (foundStop) {
      setSelectedStopId(foundStop.VGNKennung);
    } else {
      setSelectedStopId(null);
    }
  };

  const handleClearSearch = () => {
    setStopSearch('');
    setSelectedStopId(null);
    setDepartures([]); // Clear departures immediately
    if (inputRef.current) inputRef.current.focus(); // Focus back on input
  };

  // Find the full object for the currently selected stop to display its products
  const selectedStop = availableStops.find(stop => stop.VGNKennung === selectedStopId);

  return (
    <div className="p-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 transition-colors">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
        Live Abfahrten
      </h3>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="mb-4">
        <label htmlFor="stop-select-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Haltestelle auswählen:
        </label>
        {loadingStops ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Lade Haltestellen...</p>
        ) : (
          <>
            <div className="relative">
              <input
                ref={inputRef} // Assign ref to the input
                list="stops-datalist"
                id="stop-select-input"
                value={stopSearch}
                onInput={handleStopInputChange}
                placeholder="Haltestelle suchen..."
                className="block w-full p-2 pr-8 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white sm:text-sm"
              />
              {stopSearch && ( // Only show clear button if there's text
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Suchfeld leeren"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>
            <datalist id="stops-datalist">
              {availableStops.map((stop, index) => <option key={`${stop.VGNKennung}-${index}`} value={stop.Haltestellenname} />)}
            </datalist>
            {/* New: Show available products for the selected stop */}
            {selectedStop?.Produkte && (
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                <span>Verfügbar: {selectedStop.Produkte}</span>
              </div>
            )}
          </>
        )}
      </div>

      

      {/* Departure List */}
      {loadingDepartures ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">Lade Live-Daten...</p>
      ) : departures.length > 0 ? (
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
                  {new Date(dep.AbfahrtszeitIst || dep.AbfahrtszeitSoll).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                {dep.AbfahrtszeitIst !== dep.AbfahrtszeitSoll && (
                  <div className="text-xs text-red-500">
                    Plan: {new Date(dep.AbfahrtszeitSoll).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        stopSearch && <p className="text-gray-500 dark:text-gray-400 text-sm">Keine Abfahrten für diese Haltestelle gefunden.</p>
      )}
      {/* New: Display Sonderinformationen */}
      {specialInfo.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
          <h4 className="font-bold mb-1">Sonderinformationen:</h4>
          <ul className="list-disc list-inside space-y-1">
            {specialInfo.map((info, idx) => (
              <li key={idx}>{info}</li>
            ))}
          </ul>
        </div>
      )}
    </div >
  );
}