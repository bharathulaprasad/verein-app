"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if the user already accepted cookies
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 dark:bg-black text-slate-300 p-4 z-50 border-t border-slate-700 shadow-2xl">
      <div className="container mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-center sm:text-left">
          Wir verwenden Cookies, um Ihnen das beste Erlebnis auf unserer Website zu bieten. Wenn Sie diese Seite weiterhin nutzen, stimmen Sie unserer Nutzung von Cookies und unseren Datenschutzrichtlinien zu.
          <br className="hidden sm:block" />
          <Link href="/datenschutz" className="text-blue-400 hover:text-blue-300 underline mt-1 inline-block">
            Mehr über Datenschutz erfahren
          </Link>
        </div>
        <div className="flex-shrink-0">
          <button 
            onClick={acceptCookies}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors whitespace-nowrap"
          >
            Verstanden
          </button>
        </div>
      </div>
    </div>
  );
}