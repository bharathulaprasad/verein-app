import './globals.css';
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle"; // 
import Link from 'next/link';
import Image from 'next/image';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="de" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
        <ThemeProvider>
          <SessionProviderWrapper session={session}>
            
            <nav className="bg-blue-900 dark:bg-slate-900 text-white p-4 shadow-md border-b border-transparent dark:border-slate-800">
              <div className="container mx-auto flex justify-between items-center">
                {/* Brand Logo / Name */}
                <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                  <Image 
                    src="/logo.png" /* <-- Make sure your file in public folder is named logo.png */
                    alt="SVS NBG e.V. Logo" 
                    width={44} 
                    height={44} 
                    className="rounded-full bg-white object-contain p-0.5 shadow-sm"
                    priority
                  />
                  <span className="text-xl font-bold hidden sm:block">SVS NBG e.V.</span>
                </Link>
                {/* ✨ END OF LOGO SECTION */}
                
                {/* Navigation Links */}
                <div className="flex items-center space-x-4 md:space-x-6">
                  
                  <Link href="/" className="hover:text-blue-300 dark:hover:text-blue-400 font-medium transition-colors">Startseite</Link>
                  <Link href="/about" className="hover:text-blue-300 dark:hover:text-blue-400 font-medium transition-colors">Über uns</Link>
                  
                  {/* ONLY SHOW ADMIN LINK IF USER IS VORSTAND OR ADMIN */}
                  {((session?.user as any)?.role === "ADMIN" || (session?.user as any)?.role === "VORSTAND") && (
                    <Link href="/admin" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">
                      Postfach
                    </Link>
                  )}
                  
                  {/* Login / Logout Logic */}
                  {session ? (
                    <>
                      <Link href="/dashboard" className="hover:text-blue-300 dark:hover:text-blue-400 font-medium transition-colors">Dashboard</Link>
                      <Link href="/api/auth/signout" className="bg-red-600 px-4 py-2 rounded text-sm font-semibold hover:bg-red-500 transition-colors text-white">Abmelden</Link>
                    </>
                  ) : (
                    <Link href="/api/auth/signin" className="bg-green-600 px-4 py-2 rounded text-sm font-semibold hover:bg-green-500 transition-colors text-white">Mitglied Login</Link>
                  )}
                  
                  {/* Dark Mode Toggle */}
                  <ThemeToggle />
                </div>
              </div>
            </nav>

            <main className="flex-grow container mx-auto p-4 mt-8">
              {children}
            </main>

            <footer className="bg-slate-900 dark:bg-black text-slate-400 text-center p-6 mt-auto border-t dark:border-slate-800">
              © {new Date().getFullYear()} Siedlervereinigung Siemens Nürnberg e.V.
            </footer>
            
          </SessionProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}