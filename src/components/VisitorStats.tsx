'use client';

import { useEffect, useState, useRef } from 'react';
import CountUp from 'react-countup';
import { MapPin, BarChart3 } from 'lucide-react'; // Added some nice icons!

export default function VisitorStats() {
  const [count, setCount] = useState<number>(0);
  const [location, setLocation] = useState<string>('Detecting location...');
  const [hasLoaded, setHasLoaded] = useState(false);
  
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const fetchStats = async () => {
      try {
        const locRes = await fetch('https://ipapi.co/json/');
        const locData = await locRes.json();
        if (locData.city && locData.country_name) {
          setLocation(`${locData.city}, ${locData.country_name}`);
        } else {
          setLocation('einem unbekannten Ort'); // Changed to German to match your site
        }
      } catch {
        setLocation('einem unbekannten Ort');
      }

      try {
        const hasVisited = sessionStorage.getItem('visited_home');
        const method = hasVisited ? 'GET' : 'POST';
        const res = await fetch('/api/visit', { method });
        const data = await res.json();

        if (data.success) {
          setCount(data.count);
          if (!hasVisited) {
            sessionStorage.setItem('visited_home', 'true');
          }
        }
      } catch (error) {
        console.error("Failed to fetch visitor count", error);
      } finally {
        setHasLoaded(true);
      }
    };

    fetchStats();
  }, []);

  if (!hasLoaded) {
    return (
      <div className="p-6 mt-12 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 text-center animate-pulse text-gray-500 dark:text-gray-400">
        Statistiken werden geladen...
      </div>
    );
  }

  return (
    <div className="p-8 mt-12 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center justify-center space-y-4 transition-colors">
      <div className="flex items-center space-x-2">
        <BarChart3 className="text-blue-600 dark:text-blue-400 w-6 h-6" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Seitenstatistik</h3>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 flex items-center text-center">
        <MapPin className="w-4 h-4 mr-2 text-slate-400" />
        Sie greifen auf diese Seite zu aus:{' '}
        <span className="font-bold text-blue-600 dark:text-blue-400 ml-1">{location}</span>
      </p>
      
      <p className="text-gray-600 dark:text-gray-300 text-lg text-center">
        Diese Startseite wurde{' '}
        <span className="font-extrabold text-blue-700 dark:text-blue-400 text-3xl inline-block w-[70px] text-center">
          <CountUp start={0} end={count} duration={2.5} separator="." />
        </span>{' '}
        Mal besucht.
      </p>
    </div>
  );
}