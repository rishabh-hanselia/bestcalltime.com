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
    title: `${t.privacyPolicy} - Best Call Time`,
    description: 'Privacy Policy for Best Call Time.',
  };
}

export default async function PrivacyPolicy({ params }: { params: Promise<{ lang: string }> }) {
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
        <h1 className="font-display-lg text-headline-xl text-on-surface mb-6">{t.privacyPolicy}</h1>
        <div className="prose prose-slate max-w-none text-on-surface-variant font-body-md space-y-6">
          <p>{tPage.privacyUpdated}</p>
          <p>{tPage.privacyP1}</p>
          
          <h2 className="text-headline-md font-semibold text-on-surface mt-8 mb-4">{tPage.privacyH1}</h2>
          <p>{tPage.privacyP2}</p>
          
          <h2 className="text-headline-md font-semibold text-on-surface mt-8 mb-4">{tPage.privacyH2}</h2>
          <p>{tPage.privacyP3}</p>
          
          <h2 className="text-headline-md font-semibold text-on-surface mt-8 mb-4">{tPage.privacyH3}</h2>
          <p>{tPage.privacyP4}</p>
          
          <h2 className="text-headline-md font-semibold text-on-surface mt-8 mb-4">{tPage.privacyH4}</h2>
          <p>{tPage.privacyP5} <a href="https://myadcenter.google.com/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{tPage.privacyOptOutLink}</a>.</p>
        </div>
      </div>
    </main>
  );
}
