import type { Metadata } from 'next';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { 
  Network as SitemapIcon,
  Home,
  Info,
  CalendarDays,
  Users,
  History,
  Gavel,
  Shield,
  AlertTriangle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sitemap',
  description: 'Eine Übersicht aller Seiten auf der SVS-NBG Webseite.',
};

export default function SitemapPage() {
  const pages: { href: string; title: string; icon: LucideIcon }[] = [
    { href: '/', title: 'Startseite', icon: Home },
    { href: '/about', title: 'Über Uns', icon: Info },
    { href: '/#aktuelles', title: 'Aktuelles & Termine', icon: CalendarDays },
    { href: '/#kontakt', title: 'Kontakt & Vorstand', icon: Users },
    { href: '/changelog', title: 'Änderungsprotokoll (Changelog)', icon: History },
    { href: '/impressum', title: 'Impressum', icon: Gavel },
    { href: '/datenschutz', title: 'Datenschutz', icon: Shield },
    { href: '/disclaimer', title: 'Disclaimer', icon: AlertTriangle },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-3 mb-8">
        <SitemapIcon className="text-blue-600 dark:text-blue-400 w-8 h-8" />
        <h1 className="text-4xl font-extrabold text-blue-900 dark:text-blue-400">
          Sitemap
        </h1>
      </div>
      <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
        Finden Sie hier eine Übersicht aller wichtigen Seiten unserer Webseite.
      </p>
      <ul className="space-y-4">
        {pages.map((page) => {
          
          return (
            <li key={page.href}>
              <Link href={page.href} className="inline-flex items-center gap-3 text-xl text-blue-600 dark:text-blue-400 hover:underline font-medium group">
                <page.icon />
                <span>{page.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
