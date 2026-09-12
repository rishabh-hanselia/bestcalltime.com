import React from 'react';
import { SEO_DICTIONARY } from '@/lib/i18n-seo';

export default function SeoContent({ lang }: { lang: string }) {
  const seoData = SEO_DICTIONARY[lang] || SEO_DICTIONARY['en'];

  return (
    <div className="w-full max-w-[1200px] mx-auto mt-24 mb-12 flex flex-col gap-20">
      
      {/* Section 1: How to Use */}
      <section className="flex flex-col gap-8">
        <div className="text-center space-y-4">
          <h2 className="font-display-lg text-headline-lg md:text-display-sm font-bold text-on-surface">How to Use Best Call Time</h2>
          <p className="text-on-surface-variant font-body-lg max-w-2xl mx-auto">
            Find the perfect time to meet without doing complex timezone math.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-title-lg">1</div>
            <h3 className="font-headline-sm text-title-lg font-semibold text-on-surface">Add Your Locations & Time Zones</h3>
            <p className="text-on-surface-variant text-body-md leading-relaxed">
              Select your local city or timezone and add one or more target participants across the globe.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-title-lg">2</div>
            <h3 className="font-headline-sm text-title-lg font-semibold text-on-surface">Define Reasonable Hours</h3>
            <p className="text-on-surface-variant text-body-md leading-relaxed">
              The tool highlights standard waking and working windows (e.g., 8:00 AM to 9:00 PM) to ensure no one receives midnight pings or predawn alarms.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-title-lg">3</div>
            <h3 className="font-headline-sm text-title-lg font-semibold text-on-surface">Identify the Overlap Window</h3>
            <p className="text-on-surface-variant text-body-md leading-relaxed">
              Instantly view the mutual green overlap slot. Click or hover on any slot to see the exact corresponding local time in all participants' zones simultaneously.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Corridors */}
      <section className="flex flex-col gap-8">
        <h2 className="font-display-lg text-headline-lg font-bold text-on-surface border-b border-outline-variant/30 pb-4">Popular International Calling Corridors</h2>
        <div className="overflow-x-auto rounded-2xl border border-outline-variant/40 shadow-sm">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-low text-on-surface font-semibold text-label-lg uppercase tracking-wider">
                <th className="p-4 border-b border-outline-variant/40">Corridor / Pair</th>
                <th className="p-4 border-b border-outline-variant/40">Typical Time Difference</th>
                <th className="p-4 border-b border-outline-variant/40">Best Mutual Call Window</th>
                <th className="p-4 border-b border-outline-variant/40">Best For</th>
              </tr>
            </thead>
            <tbody className="bg-surface-container-lowest text-on-surface-variant text-body-md divide-y divide-outline-variant/20">
              <tr className="hover:bg-surface-container/50 transition-colors">
                <td className="p-4 font-semibold text-on-surface">US Pacific (PST) ↔ India (IST)</td>
                <td className="p-4">12.5–13.5 hours</td>
                <td className="p-4">7:30 AM – 9:30 AM PST<br/>9:00 PM – 11:00 PM IST</td>
                <td className="p-4">Offshore standups, async handoffs</td>
              </tr>
              <tr className="hover:bg-surface-container/50 transition-colors">
                <td className="p-4 font-semibold text-on-surface">US Eastern (EST) ↔ UK (GMT/BST)</td>
                <td className="p-4">5 hours</td>
                <td className="p-4">8:00 AM – 12:00 PM EST<br/>1:00 PM – 5:00 PM GMT</td>
                <td className="p-4">Executive reviews, deep collaboration</td>
              </tr>
              <tr className="hover:bg-surface-container/50 transition-colors">
                <td className="p-4 font-semibold text-on-surface">UK (GMT) ↔ Australia (AEST)</td>
                <td className="p-4">9–11 hours</td>
                <td className="p-4">8:00 AM – 10:00 AM GMT<br/>6:00 PM – 8:00 PM AEST</td>
                <td className="p-4">Async sync-ups, status updates</td>
              </tr>
              <tr className="hover:bg-surface-container/50 transition-colors">
                <td className="p-4 font-semibold text-on-surface">Central Europe (CET) ↔ US Eastern (EST)</td>
                <td className="p-4">6 hours</td>
                <td className="p-4">3:00 PM – 6:00 PM CET<br/>9:00 AM – 12:00 PM EST</td>
                <td className="p-4">Morning check-ins, daily syncing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3: DST */}
      <section className="flex flex-col gap-6 p-8 rounded-3xl bg-primary-container/10 border border-primary/20">
        <h2 className="font-display-lg text-headline-lg font-bold text-on-surface">Daylight Saving Time (DST) & The Risk of Timezone Drift</h2>
        <div className="prose prose-slate max-w-none text-on-surface-variant font-body-lg leading-relaxed space-y-4">
          <p>
            When scheduling international meetings, mental math is dangerous. Countries do not switch to Daylight Saving Time simultaneously. For example, the United States typically springs forward in early March, while the UK and Europe shift weeks later in late March. Meanwhile, major economic hubs like India, Japan, and Singapore do not observe DST at all.
          </p>
          <p>
            This mismatch causes a phenomenon known as <strong>Timezone Drift</strong>. For 2–3 weeks every spring and autumn, standard time gaps between regions unexpectedly expand or contract by a full hour. This invisible shift is one of the leading causes of missed client meetings, misaligned standups, and accidental early wake-up calls.
          </p>
          <p>
            Best Call Time eliminates this risk entirely. Our calculator automatically fetches dynamic IANA timezone database offsets behind the scenes, ensuring that every calculation and mutual overlap remains perfectly accurate year-round without any manual arithmetic.
          </p>
        </div>
      </section>

      {/* Section 4: FAQ */}
      <section className="flex flex-col gap-8">
        <h2 className="font-display-lg text-headline-lg font-bold text-on-surface border-b border-outline-variant/30 pb-4">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm flex flex-col gap-3">
            <h3 className="font-headline-sm text-title-lg font-semibold text-on-surface">{seoData.faq1Q}</h3>
            <p className="text-on-surface-variant text-body-md leading-relaxed">{seoData.faq1A}</p>
          </div>
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm flex flex-col gap-3">
            <h3 className="font-headline-sm text-title-lg font-semibold text-on-surface">{seoData.faq2Q}</h3>
            <p className="text-on-surface-variant text-body-md leading-relaxed">{seoData.faq2A}</p>
          </div>
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm flex flex-col gap-3">
            <h3 className="font-headline-sm text-title-lg font-semibold text-on-surface">{seoData.faq3Q}</h3>
            <p className="text-on-surface-variant text-body-md leading-relaxed">{seoData.faq3A}</p>
          </div>
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm flex flex-col gap-3">
            <h3 className="font-headline-sm text-title-lg font-semibold text-on-surface">{seoData.faq4Q}</h3>
            <p className="text-on-surface-variant text-body-md leading-relaxed">{seoData.faq4A}</p>
          </div>
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm flex flex-col gap-3">
            <h3 className="font-headline-sm text-title-lg font-semibold text-on-surface">{seoData.faq5Q}</h3>
            <p className="text-on-surface-variant text-body-md leading-relaxed">{seoData.faq5A}</p>
          </div>
        </div>
      </section>

    </div>
  );
}
