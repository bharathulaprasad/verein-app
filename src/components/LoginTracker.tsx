'use client';

import { useEffect, useRef } from 'react';

export default function LoginTracker({ isLoggedIn }: { isLoggedIn: boolean }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    if (initialized.current) return;
    
    const hasTracked = sessionStorage.getItem('login_location_tracked');
    if (hasTracked) return;

    initialized.current = true;

    const trackLocation = async () => {
      let city = "Unbekannt";
      let country = "Unbekannt";

      // 1. Try to get location, but don't crash if it fails
      try {
        const locRes = await fetch('https://ipinfo.io/json');
        const locData = await locRes.json();
        if (locData.city) city = locData.city;
        if (locData.country) country = locData.country;
      } catch (e) {
        console.warn("Location API blocked, continuing with Unbekannt...");
      }

      // 2. NOW save to the database no matter what
      try {
        const response = await fetch('/api/log-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city, country })
        });

        const data = await response.json();
        
        // 3. Only set the flag if the database save was actually successful!
        if (data.success) {
          sessionStorage.setItem('login_location_tracked', 'true');
          console.log("Login successfully logged to DB!");
        } else {
          console.error("API Route failed:", data.error || "Unknown error");
        }
      } catch (error) {
        console.error("Failed to reach API route", error);
      }
    };

    trackLocation();
  }, [isLoggedIn]);

  return null;
}