import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'hi', 'ar', 'ru'];
  const routes = [
    { path: '', priority: 1.0, changefreq: 'weekly' as const },
    { path: '/about', priority: 0.7, changefreq: 'monthly' as const },
    { path: '/contact', priority: 0.7, changefreq: 'monthly' as const },
    { path: '/privacy-policy', priority: 0.5, changefreq: 'monthly' as const },
    { path: '/terms-of-service', priority: 0.5, changefreq: 'monthly' as const },
  ];

  const today = new Date().toISOString().split('T')[0];
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      const isDefault = locale === 'en';
      const loc = isDefault 
        ? `https://bestcalltime.com${route.path}` 
        : `https://bestcalltime.com/${locale}${route.path}`;
      
      // Reduce priority slightly for localized versions of the homepage
      const priority = (route.path === '' && !isDefault) ? 0.9 : route.priority;

      sitemapEntries.push({
        url: loc,
        lastModified: today,
        changeFrequency: route.changefreq,
        priority: priority,
      });
    }
  }

  return sitemapEntries;
}
