"use client";
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter, useParams } from 'next/navigation';

import Link from 'next/link';
import Image from 'next/image';

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  
  // In Next.js, pathname inside a rewritten route (like /) might just be /
  // but if the URL is /es, it will be /es.
  // We can determine current language from params.lang, falling back to 'en'.
  const currentLang = (params?.lang as string) || 'en';

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bct-dark');
      if (saved === 'true') { setIsDarkMode(true); document.documentElement.classList.add('dark'); }
    } catch {}
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      try { localStorage.setItem('bct-dark', 'true'); } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try { localStorage.setItem('bct-dark', 'false'); } catch {}
    }
  }, [isDarkMode]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    
    // Determine current path without the lang prefix
    let pathWithoutLang = pathname;
    if (pathname.startsWith(`/${currentLang}/`)) {
      pathWithoutLang = pathname.substring(currentLang.length + 1);
    } else if (pathname === `/${currentLang}`) {
      pathWithoutLang = '/';
    }
    
    // Construct new path
    const newPath = newLang === 'en' ? pathWithoutLang : `/${newLang}${pathWithoutLang !== '/' ? pathWithoutLang : ''}`;
    
    // Navigate
    router.push(newPath || '/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 w-full px-space-lg flex items-center justify-between gap-space-md">
        <Link href="/" className="flex items-center shrink-0">
          <Image src="/logo.svg" alt="Best Call Time" width={173} height={40} className="h-10 w-auto" priority />
        </Link>
        <div className="flex items-center gap-space-sm shrink-0">
          <button
            aria-label="Toggle Theme"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">{isDarkMode ? 'dark_mode' : 'light_mode'}</span>
          </button>
          <div className="hidden sm:flex relative">
            <select
              value={currentLang}
              onChange={handleLanguageChange}
              className="bg-surface-container text-on-surface border border-outline-variant hover:bg-surface-container-high hover:border-outline transition-colors font-label-md text-label-md px-3 py-1.5 rounded-lg appearance-none cursor-pointer pr-8 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="en">EN (US)</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="de">DE</option>
              <option value="it">IT</option>
              <option value="pt">PT (BR)</option>
              <option value="zh">ZH (CN)</option>
              <option value="ja">JA</option>
              <option value="hi">HI</option>
              <option value="ar">AR</option>
              <option value="ru">RU</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[16px] text-on-surface">expand_more</span>
          </div>
        </div>
      </div>
    </header>
  );
}
