import type { Metadata } from 'next';
import Link from 'next/link';
import { Network as SitemapIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sitemap',
  description: 'Eine Übersicht aller Seiten auf der SVS-NBG Webseite.',
};

export default function SitemapPage() {
  const pages = [
    { href: '/', title: 'Startseite' },
    { href: '/about', title: 'Über Uns' },
    { href: '/#aktuelles', title: 'Aktuelles & Termine' },
    { href: '/#kontakt', title: 'Kontakt & Vorstand' },
    { href: '/changelog', title: 'Änderungsprotokoll (Changelog)' },
    { href: '/impressum', title: 'Impressum' },
    { href: '/datenschutz', title: 'Datenschutz' },
    { href: '/disclaimer', title: 'Disclaimer' },
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
        {pages.map((page) => (
          <li key={page.href}>
            <Link href={page.href} className="text-xl text-blue-600 dark:text-blue-400 hover:underline font-medium">
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
