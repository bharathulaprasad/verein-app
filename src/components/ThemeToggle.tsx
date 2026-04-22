"use client";

import { useTheme } from "./ThemeProvider"; // <-- Import from our own file!
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-10 h-10"></div>;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full bg-blue-800 dark:bg-slate-800 text-white hover:bg-blue-700 dark:hover:bg-slate-700 transition-all border border-blue-700 dark:border-slate-600 shadow-sm flex items-center justify-center"
      aria-label="Dark Mode umschalten"
    >
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}