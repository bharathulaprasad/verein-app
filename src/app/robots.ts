import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // Hide paths you don't want on Google
    },
    sitemap: 'https://verein-app-pi.vercel.app/sitemap.xml',
  };
}