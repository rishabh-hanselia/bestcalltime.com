import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DICTIONARY } from '@/lib/i18n';

export default function Footer({ lang = 'en' }: { lang?: string }) {
  const prefix = lang === 'en' ? '' : `/${lang}`;
  const t = DICTIONARY[lang] || DICTIONARY.en;
  
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_8px_rgba(0,0,0,0.02)] py-10 mt-auto border-t border-outline-variant/30">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-8 xl:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Best Call Time" width={138} height={32} className="h-8 w-auto" />
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Visual timezone overlap and call planning utility</span>
        </div>
        
        <div className="flex items-center flex-wrap justify-center gap-x-6 gap-y-2 font-label-md text-label-md text-on-surface-variant">
          <Link href={`${prefix}/about`} className="hover:text-primary transition-colors">{t.aboutUs}</Link>
          <Link href={`${prefix}/contact`} className="hover:text-primary transition-colors">{t.contactUs}</Link>
          <Link href={`${prefix}/privacy-policy`} className="hover:text-primary transition-colors">{t.privacyPolicy}</Link>
          <Link href={`${prefix}/terms-of-service`} className="hover:text-primary transition-colors">{t.termsOfService}</Link>
        </div>
      </div>
      
      <div className="max-w-[1920px] mx-auto px-6 lg:px-8 xl:px-12 mt-6 text-center md:text-left text-on-surface-variant/70 font-body-sm text-xs">
        c 2026 Best Call Time. All rights reserved.
      </div>
    </footer>
  );
}
