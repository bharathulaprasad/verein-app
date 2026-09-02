"use client"; // Required if you are using Next.js App Router

import { useEffect, useState, useRef, useMemo } from 'react'; // Import useMemo
import { XCircle, MapPin, PersonStanding } from 'lucide-react'; // Import PersonStanding icon

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
  distance?: number; // New: Optional property for nearest stops
}



// New: Function to determine the transport line icon
const getLineIcon = (lineName: string) => {
  const trimmedLineName = lineName.trim();
  if (trimmedLineName.startsWith('U')) {
    return { src: 'https://start.vag.de/desktop/img/vehicle_ubahn_black_66x32.png', alt: 'U-Bahn' };
  }
  if (trimmedLineName.startsWith('N')) {
    // Nightliners are buses
    return { src: 'https://start.vag.de/desktop/img/vehicle_bus_black_66x32.png', alt: 'Bus' };
  }
  if (trimmedLineName.startsWith('S') || trimmedLineName.startsWith('R')) {
    // S-Bahn and Regional trains
    return { src: 'https://start.vag.de/desktop/img/vehicle_tram_black_66x32.png', alt: 'S-Bahn' };
  }
  // Assuming trams are lines with numbers < 20
  if (/^\d{1,2}$/.test(trimmedLineName) && parseInt(trimmedLineName, 10) < 20) {
    return { src: 'https://start.vag.de/desktop/img/vehicle_tram_black_66x32.png', alt: 'Tram' };
  }
  // Default to bus for all other numbered lines
  if (/^\d+$/.test(trimmedLineName)) {
    return { src: 'https://start.vag.de/desktop/img/vehicle_bus_black_66x32.png', alt: 'Bus' };
  }
  return null; // No icon for unknown types
};

// New: Helper function to format departure times based on your logic
const formatDepartureTime = (departureTime: string, now: Date) => {
  const departureDate = new Date(departureTime);
  const diffMs = departureDate.getTime() - now.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const isBlinking = diffSeconds > 0 && diffSeconds <= 30;
  const isImminent = diffSeconds <= 60; // New: True if within the next minute or now

  if (diffSeconds <= 0) {
    return { relative: true, isNow: true, isBlinking: true, isImminent: true };
  }

  if (diffSeconds <= 20 * 60) { // 20 minutes
    const minutes = Math.floor(diffSeconds / 60);
    const seconds = diffSeconds % 60;
    // If under a minute, show seconds. Otherwise, show minutes.
    if (minutes > 0) {
      return { relative: true, display: `in ${minutes}m`, isBlinking, isImminent }; // Shorter: remove seconds
    }
    return { relative: true, display: `in ${seconds}s`, isBlinking, isImminent }; // Keep seconds if under a minute
  }

  // If more than 20 minutes, show absolute time in 12h format
  return {
    relative: false,
    display: departureDate.toLocaleTimeString('de-DE', {
      hour: '2-digit', minute: '2-digit', hour12: true // Shorter: remove seconds
    }),
    isBlinking: false,
    isImminent: false
  };
};

export default function VAGLiveDepartureWidget() {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [availableStops, setAvailableStops] = useState<Stop[]>([]);
  const [selectedStopId, setSelectedStopId] = useState<number | null>(null);
  const [stopSearch, setStopSearch] = useState('');
  const [loadingStops, setLoadingStops] = useState(true);
  const [nearestStops, setNearestStops] = useState<(Stop & { distance: number })[]>([]);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [specialInfo, setSpecialInfo] = useState<string[]>([]); // New state for special information
  const inputRef = useRef<HTMLInputElement>(null); // Ref for the input element
  const [loadingDepartures, setLoadingDepartures] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(new Date()); // New: State for current time
  const notifiedDeparturesRef = useRef(new Set<string>()); // New: Track sent notifications
  const [isDesktop, setIsDesktop] = useState(false); // New: State to check for desktop environment

  // New: Effect to update the current time every second for the countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // New: Check for desktop and request notification permission on mount
  useEffect(() => {
    // This check runs only on the client
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const desktopCheck = !isMobile;
    setIsDesktop(desktopCheck);

    // Only request permission on desktop devices
    if (desktopCheck && 'Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // 1. Fetch all available stops once on component mount
  useEffect(() => {
    async function fetchAvailableStops() {
      try {
        const res = await fetch(`https://start.vag.de/dm/api/v1/haltestellen/VGN/`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (data && Array.isArray(data.Haltestellen)) {
          // Filter out stops that do not have the 'Produkte' property, as requested.
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

  // New: Find nearest stop based on user's location
  useEffect(() => {
    if (availableStops.length === 0) return;

    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371e3; // metres
      const φ1 = lat1 * Math.PI / 180;
      const φ2 = lat2 * Math.PI / 180;
      const Δφ = (lat2 - lat1) * Math.PI / 180;
      const Δλ = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // in metres
    };

    const findNearest = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      const nearbyStops: (Stop & { distance: number })[] = []; // This type is correct
      const maxDistance = 900; // Max distance in meters

      for (const stop of availableStops) {
        if (stop.Latitude && stop.Longitude) {
          const distance = getDistance(latitude, longitude, stop.Latitude, stop.Longitude); // Calculate distance
          if (distance <= maxDistance) {
            nearbyStops.push({ ...stop, distance });
          }
        }
      }

      // Sort by distance (closest first) and set the state
      setNearestStops(nearbyStops.sort((a, b) => a.distance - b.distance)); // Now this matches the state type

      if (nearbyStops.length === 0) {
        setLocationError("Keine Haltestelle in 1000m gefunden.");
      }
    };

    navigator.geolocation.getCurrentPosition(
      findNearest,
      (error) => {
        console.warn(`Geolocation error: ${error.message}`);
        setLocationError("Standortzugriff verweigert.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [availableStops]); // Rerun when stops are loaded

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
        if (process.env.NEXT_PUBLIC_DEBUG) {
          console.log("useEffect[selectedStopId]: Fetch URL:", `https://start.vag.de/dm/api/abfahrten.json/vgn/${selectedStopId}`);
        }
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
    const intervalId = setInterval(fetchDepartures, 10000); // Set up the refresh interval
    return () => clearInterval(intervalId); // Cleanup interval on re-run or unmount
  }, [selectedStopId]);

  // New: Effect to handle desktop notifications
  useEffect(() => {
    // Guard to ensure this only runs on desktop with permission
    if (!isDesktop || Notification.permission !== 'granted' || departures.length === 0) return;

    departures.forEach(dep => {
      const departureDate = new Date(dep.AbfahrtszeitIst || dep.AbfahrtszeitSoll);
      const diffMs = departureDate.getTime() - now.getTime();
      const diffSeconds = Math.round(diffMs / 1000);

      // Unique key for this specific departure instance
      const departureKey = `${dep.Linienname}-${dep.Richtungstext}-${dep.AbfahrtszeitSoll}`;

      // Trigger notification at exactly 30 seconds
      if (diffSeconds === 30 && !notifiedDeparturesRef.current.has(departureKey)) {
        const lineIcon = getLineIcon(dep.Linienname);

        new Notification(`Abfahrt in 30 Sekunden!`, {
          body: `Linie ${dep.Linienname} in Richtung ${dep.Richtungstext} fährt gleich ab.`,
          icon: lineIcon?.src, // Use the line icon if available
          silent: false,
        });

        notifiedDeparturesRef.current.add(departureKey);
      }

      // Clean up old notified departures to prevent the set from growing indefinitely
      if (diffSeconds < 0 && notifiedDeparturesRef.current.has(departureKey)) {
        notifiedDeparturesRef.current.delete(departureKey);
      }
    });
  }, [now, departures, isDesktop]); // This effect runs every second, now aware of device type

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
    setSpecialInfo([]); // Also clear special info
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

      {/* New: Nearest Stop Hint */}
      {nearestStops.length > 0 && (
        <div className="mb-4 p-2.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span className="font-medium text-blue-800 dark:text-blue-300">In Ihrer Nähe:</span>
          </div>
          <ul className="space-y-1">
            {nearestStops.map(stop => (
              <li key={stop.VGNKennung} className="flex items-center justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-blue-900 dark:text-blue-200">{stop.Haltestellenname}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">ca. {Math.round(stop.distance)}m</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedStopId(stop.VGNKennung);
                    setStopSearch(stop.Haltestellenname);
                  }}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Auswählen
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {locationError && nearestStops.length === 0 && (
        <div className="mb-4 text-xs text-slate-500 dark:text-slate-400">
          <MapPin className="w-3 h-3 inline mr-1" />
          {locationError}
        </div>
      )}

      

      {/* Departure List */}
      {loadingDepartures ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">Lade Live-Daten...</p>
      ) : departures.length > 0 ? (
        <ul className="space-y-3">
          {departures.map((dep, index) => {
            const lineIcon = getLineIcon(dep.Linienname);
            const departureTime = formatDepartureTime(dep.AbfahrtszeitIst || dep.AbfahrtszeitSoll, now);
            const isDelayed = dep.AbfahrtszeitIst !== dep.AbfahrtszeitSoll && !departureTime.relative;

            // New: Define time format options. Show seconds if delayed.
            const timeFormatOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true, ...(isDelayed && { second: '2-digit' }) };

            return (
              <li key={`${dep.Linienname}-${dep.Richtungstext}-${dep.AbfahrtszeitSoll}-${index}`} className={`flex justify-between items-start gap-2 p-2 rounded-lg ${departureTime.isBlinking ? 'animate-pulse bg-blue-50 dark:bg-slate-800' : ''}`}>
                <div className="flex items-center gap-3 min-w-0">
                  {/* Line Number: Always visible */}
                  <span className="font-bold text-left w-7 shrink-0 text-blue-700 dark:text-blue-400">{dep.Linienname}</span>
                  {/* Direction */}
                  <span className="text-gray-700 dark:text-gray-200">
                    {dep.Richtungstext}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2 text-right tabular-nums shrink-0">
                  {/* Icon: Only visible if departure is imminent */}
                  <div className="w-8 h-4 shrink-0">
                    {lineIcon && departureTime.isImminent && (
                      <img
                        src={lineIcon.src}
                        alt={lineIcon.alt}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  {/* New: Vertical group for departure times */}
                  <div className="flex flex-col items-end">
                    <div className={`font-bold ${
                      isDelayed ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-500'
                    }`}>
                      {departureTime.isNow ? (
                        <PersonStanding className="w-5 h-5" />
                      ) : (
                        <>{departureTime.relative ? departureTime.display : new Date(dep.AbfahrtszeitIst).toLocaleTimeString('de-DE', timeFormatOptions)}</>
                      )}
                    </div>
                    {isDelayed && (
                      <div className="text-xs text-red-500 line-through">
                        {new Date(dep.AbfahrtszeitSoll).toLocaleTimeString('de-DE', timeFormatOptions)}
                      </div>
                    )}
                  </div>
                </div> 
              </li>
            );
          })}
        </ul>
      ) : (
        stopSearch && !loadingDepartures && <p className="text-gray-500 dark:text-gray-400 text-sm">Keine Abfahrten für diese Haltestelle gefunden.</p>
      )}
      {/* New: Display Sonderinformationen */}
      {specialInfo.length > 0 &&
        <div className="mt-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-800 dark:text-yellow-200 overflow-hidden">
          <div className="flex items-center">
            <span className="font-bold shrink-0 mr-3">Info:</span>
            <div className="relative flex-auto overflow-hidden h-5">
              <p
                className="absolute whitespace-nowrap animate-marquee"
                style={{
                  animationDuration: `${specialInfo.join(' ').length / 10}s`, // Adjust speed based on text length
                }}
              >
                {specialInfo.join(' • ')}
              </p>
            </div>
          </div>
        </div>
      }
    </div >
  );
}