"use client";

import { useTheme } from "./ThemeProvider"; // <-- Import from our own file!
import { useEffect, useState, type MouseEvent } from "react";
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

  const toggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
    const isAppearanceTransition =
      // @ts-expect-error view-transitions-api is not in all browsers
      document.startViewTransition &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isAppearanceTransition) {
      setTheme(isDark ? "light" : "dark");
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setTheme(isDark ? "light" : "dark");
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        {
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: isDark
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <button
      onClick={toggleTheme}
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