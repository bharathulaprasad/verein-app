'use client';

import { useEffect, useRef } from 'react';

// We pass isLoggedIn as a prop from the server
export default function LoginTracker({ isLoggedIn }: { isLoggedIn: boolean }) {
  const initialized = useRef(false);

  useEffect(() => {
    // 1. If not logged in, do nothing.
    if (!isLoggedIn) return;
    
    // 2. Prevent double-firing in development mode
    if (initialized.current) return;
    
    // 3. Check if we ALREADY tracked them this session (so we don't spam the database on every page click)
    const hasTracked = sessionStorage.getItem('login_location_tracked');
    if (hasTracked) return;

    initialized.current = true;

    const trackLocation = async () => {
      try {
        // Fetch location
        const locRes = await fetch('https://ipinfo.io/json');
        const locData = await locRes.json();
        
        // Send it to our API
        await fetch('/api/log-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            city: locData.city,
            country: locData.country
          })
        });

        // Mark as tracked so it doesn't run again until they close the browser
        sessionStorage.setItem('login_location_tracked', 'true');
      } catch (error) {
        console.error("Failed to track login location", error);
      }
    };

    trackLocation();
  }, [isLoggedIn]);

  return null; // This component is invisible!
}