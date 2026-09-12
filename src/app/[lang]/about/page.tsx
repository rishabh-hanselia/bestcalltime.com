import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { DICTIONARY } from '@/lib/i18n';
import { pagesDictionary } from '@/lib/i18n-pages';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  const t = DICTIONARY[lang] || DICTIONARY['en'];
  const tPage = pagesDictionary[lang] || pagesDictionary['en'];
  return {
    title: `${t.aboutUs} - Best Call Time`,
    description: 'Learn about Best Call Time, the lightweight timezone overlap calculator.',
  };
}

export default async function About({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  const t = DICTIONARY[lang] || DICTIONARY['en'];
  const tPage = pagesDictionary[lang] || pagesDictionary['en'];
  return (
    <main className="w-full pt-16 pb-24 bg-surface min-h-screen">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <Link href={`/${lang === 'en' ? '' : lang}`} className="inline-flex items-center gap-2 text-primary hover:text-on-surface transition-colors font-label-md mb-8">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          {tPage.backToPlanner}
        </Link>
        <h1 className="font-display-lg text-headline-xl text-on-surface mb-6">{t.aboutUs}</h1>
        <div className="prose prose-slate max-w-none text-on-surface-variant font-body-md space-y-6">
          <p>{tPage.aboutP1}</p>
          <p>{tPage.aboutP2}</p>
          <p>{tPage.aboutP3}</p>
          
          <h2 className="text-headline-md font-semibold text-on-surface mt-8 mb-4">{tPage.aboutCore}</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>{tPage.aboutFree}</li>
            <li>{tPage.aboutPrivacy}</li>
            <li>{tPage.aboutMobile}</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
