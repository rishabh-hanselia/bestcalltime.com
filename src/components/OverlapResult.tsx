import React, { useState } from 'react';
import { OverlapWindow, formatTimeInTz } from '@/lib/overlap';
import { User } from '@/lib/StateEncoder';
import { differenceInSeconds } from 'date-fns';
import { cn } from '@/lib/utils';
import { DICTIONARY } from '@/lib/i18n';
import { formatTimezoneName } from '@/components/TimezoneSelect';

interface OverlapResultProps {
  overlaps: OverlapWindow[];
  users: User[];
  duration: { hours: number, minutes: number, seconds: number };
  setDuration: React.Dispatch<React.SetStateAction<{ hours: number, minutes: number, seconds: number }>>;
  language?: string;
}

export const OverlapResult: React.FC<OverlapResultProps> = ({ overlaps, users, duration, setDuration, language = 'en' }) => {
  const [showFailurePreview, setShowFailurePreview] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const t = DICTIONARY[language] || DICTIONARY.en;

  if (users.length === 0) {
    return null;
  }

  const hasOverlap = overlaps.length > 0;



  const bestOverlap = overlaps[selectedIndex] || overlaps[0];
  const u1 = users[0];
  const hrs = duration.hours;
  const mins = duration.minutes;

  const namesList = users.map(u => u.name).join(' & ');

  const handleDurationChange = (field: 'hours' | 'minutes' | 'seconds', delta: number) => {
    setDuration(prev => {
      let newVal = prev[field] + delta;
      if (field === 'hours') {
        if (newVal < 0) newVal = 23;
        if (newVal > 23) newVal = 0;
      } else {
        if (newVal < 0) newVal = 59;
        if (newVal > 59) newVal = 0;
      }
      return { ...prev, [field]: newVal };
    });
  };

  return (
    <section className="w-full my-space-md">
      <div className="w-full rounded-2xl bg-gradient-to-r from-surface-container-lowest via-surface-container-low to-surface-container-lowest shadow-md overflow-hidden transition-all duration-300">
        <div className="p-space-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg">
          {overlaps.length === 0 || showFailurePreview ? (
            <div className="flex flex-col items-start gap-3 flex-1 p-6 rounded-2xl bg-error-container/20 border-2 border-dashed border-error/30">
              <div className="flex items-center gap-2 text-error">
                <span className="material-symbols-outlined text-[28px]">schedule_block</span>
                <h2 className="font-headline-md text-headline-md font-semibold">{t.noOverlap}</h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                {t.conflict}<br/>
                {t.tryReducing}
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-primary-container/20 flex items-center justify-center shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-primary text-[28px]">verified</span>
              </div>
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary-container font-label-sm text-label-sm text-on-primary-container font-semibold tracking-wide">
                    <span className="material-symbols-outlined text-[15px]">celebration</span>
                    {t.zestMatch}
                  </span>
                  <span className="font-label-sm text-label-sm text-primary font-semibold bg-surface-container-lowest px-2.5 py-0.5 rounded-full shadow-sm">
                    {hrs > 0 ? `${hrs} hr ` : ''}{mins} min {t.mutualWindow}
                  </span>
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">
                  {namesList} {t.canCallFrom}{' '}
                  {users.map((u, i) => (
                    <React.Fragment key={u.id}>
                      {i > 0 && " / "}
                      <span className="text-primary font-bold whitespace-nowrap">{formatTimeInTz(bestOverlap.startUtc, u.timezone)} – {formatTimeInTz(bestOverlap.endUtc, u.timezone)}</span> ({u.locationLabel ? u.locationLabel.split(',')[0] : formatTimezoneName(u.timezone).split(',')[0]})
                    </React.Fragment>
                  ))}
                </h2>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 w-full lg:w-80 shrink-0 pt-2 lg:pt-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-primary">touch_app</span>
                {t.selectWindow}
              </span>
            </div>
            <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1 hide-scrollbar">
              {overlaps.map((overlap, idx) => {
                const sU1 = formatTimeInTz(overlap.startUtc, u1.timezone);
                const eU1 = formatTimeInTz(overlap.endUtc, u1.timezone);
                const isSelected = idx === selectedIndex;
                return (
                  <button key={idx} type="button" onClick={() => setSelectedIndex(idx)} className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer shadow-xs ${isSelected ? 'bg-primary/10 border-2 border-primary' : 'bg-surface-container-lowest border border-outline-variant/60 hover:bg-surface-container-low'}`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`material-symbols-outlined text-[20px] ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono-time text-label-md font-bold truncate ${isSelected ? 'text-on-surface' : 'text-on-surface-variant'}`}>{sU1} – {eU1}</span>
                          {idx === 0 && <span className="font-label-sm text-[10px] px-1.5 py-0.2 rounded bg-primary-container text-on-primary-container font-semibold">{t.bestMatch}</span>}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
              {overlaps.length === 0 && (
                <div className="flex items-center justify-center py-4 text-sm text-on-surface-variant italic">
                  {t.noOverlapsFound}
                </div>
              )}
            </div>
            
            <div className="mt-1 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-primary">timer</span>
                  {t.customDuration}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {([['hours', duration.hours, t.hours], ['minutes', duration.minutes, t.minutes], ['seconds', duration.seconds, t.seconds]] as const).map(([field, val, label]) => (
                  <div key={field} className="flex flex-col items-center bg-surface-container-low p-2 rounded-lg border border-transparent focus-within:border-primary focus-within:bg-surface-container-lowest transition-all">
                    <span className="font-label-sm text-[9px] uppercase tracking-wider font-bold mb-1 text-on-surface-variant">{label}</span>
                    <input type="number" min="0" max={field === 'hours' ? 23 : 59} value={val} onChange={(e) => setDuration({ ...duration, [field]: parseInt(e.target.value) || 0 })} className="w-14 text-center font-mono-time font-bold text-label-lg bg-transparent focus:outline-none text-on-surface" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
