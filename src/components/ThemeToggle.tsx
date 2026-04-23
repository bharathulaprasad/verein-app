"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react"; // Make sure lucide-react is installed

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent Next.js hydration mismatch on first load
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return an empty placeholder of the same size while loading
    return <div className="w-9 h-9 sm:w-24 sm:h-9"></div>; 
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 sm:px-3 sm:py-2 rounded-lg bg-blue-800 dark:bg-slate-800 text-blue-100 dark:text-slate-300 hover:bg-blue-700 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
      
      // ✨ 1. THE HOVER HINT (NATIVE TOOLTIP)
      title={isDark ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln"}
      aria-label="Theme umschalten"
    >
      {/* Show Sun if Dark Mode is active, Moon if Light Mode is active */}
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400" />
      ) : (
        <Moon className="w-5 h-5 text-blue-200" />
      )}
      
      {/* ✨ 2. THE VISIBLE TEXT HINT (Hidden on mobile, visible on desktop) */}
      <span className="hidden sm:block text-sm font-medium">
        {isDark ? "Hell" : "Dunkel"}
      </span>
    </button>
  );
}