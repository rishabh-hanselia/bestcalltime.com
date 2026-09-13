'use client';
import React, { useState } from 'react';
import { DICTIONARY } from '@/lib/i18n';
import { pagesDictionary } from '@/lib/i18n-pages';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Contact() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  const t = DICTIONARY[lang] || DICTIONARY['en'];
  const tPage = pagesDictionary[lang] || pagesDictionary['en'];
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "843970a3-2509-47e2-a222-83454009b5bc");
    formData.append("subject", "New Contact Form Submission from bestcalltime.com");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      });
      const result = await response.json();
      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <main className="w-full pt-16 pb-24 bg-surface min-h-screen">
      <div className="max-w-2xl mx-auto px-6 lg:px-8">
        <Link href={`/${lang === 'en' ? '' : lang}`} className="inline-flex items-center gap-2 text-primary hover:text-on-surface transition-colors font-label-md mb-8">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          {tPage.backToPlanner}
        </Link>
        <h1 className="font-display-lg text-headline-xl text-on-surface mb-6">{t.contactUs}</h1>
        <div className="prose prose-slate max-w-none text-on-surface-variant font-body-md space-y-6 mb-10">
          <p>{tPage.contactP1}</p>
          <p>
            {tPage.contactP2} <a href="mailto:contact@bestcalltime.com" className="text-primary hover:underline font-semibold">contact@bestcalltime.com</a>{tPage.contactP3}
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-6 md:p-8 shadow-sm">
          {status === 'success' ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-[48px] text-primary mb-4">check_circle</span>
              <h2 className="text-headline-sm font-semibold text-on-surface mb-2">{tPage.contactSent}</h2>
              <p className="text-on-surface-variant">{tPage.contactThanks}</p>
              <button 
                onClick={() => setStatus('idle')} 
                className="mt-6 px-4 py-2 bg-primary-container text-on-primary-container rounded-lg font-semibold hover:bg-primary hover:text-on-primary transition-colors"
              >
                {tPage.contactAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {status === 'error' && (
                <div className="p-4 bg-error/10 text-error rounded-xl font-label-md">
                  There was an error sending your message. Please try again or email us directly.
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">{tPage.contactName}</label>
                <input required type="text" id="name" name="name" disabled={status === 'submitting'} className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all disabled:opacity-50" placeholder={tPage.contactNamePlaceholder} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">{tPage.contactEmail}</label>
                <input required type="email" id="email" name="email" disabled={status === 'submitting'} className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all disabled:opacity-50" placeholder={tPage.contactEmailPlaceholder} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">{tPage.contactMessage}</label>
                <textarea required id="message" name="message" rows={5} disabled={status === 'submitting'} className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all resize-none disabled:opacity-50" placeholder={tPage.contactMessagePlaceholder}></textarea>
              </div>
              <button type="submit" disabled={status === 'submitting'} className="mt-2 w-full md:w-auto self-end flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:shadow-md hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {status === 'submitting' ? (
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">send</span>
                )}
                {status === 'submitting' ? 'Sending...' : tPage.contactSend}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
