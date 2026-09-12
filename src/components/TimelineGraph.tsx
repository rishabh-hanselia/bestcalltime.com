import React from 'react';
import { User } from '@/lib/StateEncoder';
import { OverlapWindow, getUtcIntervalsForUser, getRawUtcIntervalsForUser, formatTimeInTz, START_OF_DAY } from '@/lib/overlap';
import { addMinutes, differenceInMinutes, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { DICTIONARY } from '@/lib/i18n';
import { formatTimezoneName } from '@/components/TimezoneSelect';

interface TimelineGraphProps {
  users: User[];
  mutualOverlaps: OverlapWindow[];
  language?: string;
}

export const TimelineGraph: React.FC<TimelineGraphProps> = ({ users, mutualOverlaps, language = 'en' }) => {
  if (users.length === 0) return null;

  const t = DICTIONARY[language] || DICTIONARY.en;
  const totalMinutes = 24 * 60; // 24 hours

  const getPositionPercent = (dateStr: string | Date) => {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    const mins = differenceInMinutes(date, START_OF_DAY);
    return (mins / totalMinutes) * 100;
  };

  return (
    <section className="w-full mt-space-lg">
      <div className="w-full rounded-2xl bg-surface-container-lowest shadow-md p-space-lg flex flex-col gap-space-md overflow-hidden">
        {/* Timeline Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">view_timeline</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{t.canvasTitle}</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
              {t.globalEngine}
            </span>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-label-sm font-label-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-primary-container"></span>
              <span className="text-on-surface-variant">{t.availableFree}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-error-container"></span>
              <span className="text-on-surface-variant">{t.busyMode}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-gradient-to-r from-tertiary via-tertiary-container to-tertiary"></span>
              <span className="text-tertiary font-bold">✨ {t.mutualOverlap}</span>
            </div>
          </div>
        </div>

        {/* Master Horizontal Timeline Track Viewport */}
        <div className="relative w-full overflow-x-auto pb-4 pt-2 select-none hide-scrollbar" id="timeline-scroll-container">
          <div className="min-w-[960px] flex flex-col gap-3 relative">
            
            {/* Hour Markers */}
            <div className="flex items-center w-full relative h-6 mb-2">
              <div className="w-28 shrink-0 pr-2"></div>
              <div className="flex-1 relative border-b border-outline-variant/30">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className="absolute top-0 flex flex-col items-center -translate-x-1/2" style={{ left: `${(i / 24) * 100}%` }}>
                    <div className="h-2 w-px bg-outline-variant"></div>
                    <span className="text-[10px] text-on-surface-variant mt-1 font-mono-time">{i.toString().padStart(2, '0')}:00</span>
                  </div>
                ))}
              </div>
            </div>

            {users.map(user => {
              // We need to render the blocks
              // We calculate the actual intervals based on the overlap engine for visualization
              return (
                <div key={user.id} className="flex items-center w-full group">
                  <div className="w-28 shrink-0 flex flex-col pr-2">
                    <span className="font-label-md text-label-md text-on-surface font-semibold truncate" title={user.name}>{user.name}</span>
                    <span className="font-mono-time text-[11px] text-primary truncate" title={user.locationLabel || user.timezone}>{user.locationLabel ? user.locationLabel.split(',')[0] : formatTimezoneName(user.timezone).split(',')[0]}</span>
                  </div>
                  <div className="flex-1 h-9 rounded-xl bg-surface-container-low overflow-hidden relative flex">
                    {/* Render local hours overlay to show midnight bounds conceptually */}
                    {Array.from({ length: 48 }).map((_, i) => {
                      const timeAtHour = addMinutes(START_OF_DAY, (i - 12) * 60);
                      const localTimeStr = formatTimeInTz(timeAtHour, user.timezone);
                      const isLocalMidnight = localTimeStr.startsWith('00:');
                      if (isLocalMidnight) {
                         return (
                           <div key={i} className="absolute h-full w-px bg-error/50 z-20" style={{ left: `${((i - 12) / 24) * 100}%` }}></div>
                         );
                      }
                      return null;
                    })}

                    {/* Actual active slots rendering */}
                    {(() => {
                      const userIntervals = getRawUtcIntervalsForUser(user);
                      if (userIntervals.length === 0) {
                        return <div className="absolute inset-0 flex items-center justify-center text-[10px] text-on-surface-variant/50">
                          {t.selectValidSlots}
                        </div>;
                      }
                      return userIntervals.map((interval, idx) => {
                        const left = getPositionPercent(interval.startUtc);
                        const right = getPositionPercent(interval.endUtc);
                        const width = right - left;
                        return (
                          <div 
                            key={idx}
                            className={cn(
                              "absolute h-full rounded flex items-center justify-center text-[10px] font-mono-time shadow-xs z-10",
                              user.isBusyMode ? "bg-error-container text-on-error-container" : "bg-primary-container text-on-primary-container"
                            )}
                            style={{ left: `${left}%`, width: `${width}%` }}
                          >
                            {width > 3 && (user.isBusyMode ? t.busyMode : t.freeSlots)}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              );
            })}

            {/* Overlap Intersect Highlight Ribbon */}
            <div className="flex items-center w-full pt-1 mt-2">
              <div className="w-28 shrink-0 flex flex-col pr-2">
                <span className="font-label-md text-label-md text-tertiary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">bolt</span>Mutual
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{t.selectBlock}</span>
              </div>
              <div className="flex-1 h-11 rounded-xl bg-surface-container-low relative overflow-hidden flex items-center shadow-inner">
                {mutualOverlaps.length === 0 && (
                  <div className="w-full text-center font-label-sm text-label-sm text-on-surface-variant/60 pointer-events-none">
                     {t.noOverlapsFound}
                  </div>
                )}
                {mutualOverlaps.map((overlap, i) => {
                  const left = getPositionPercent(overlap.startUtc);
                  const right = getPositionPercent(overlap.endUtc);
                  const width = right - left;
                  
                  return (
                    <div 
                      key={i} 
                      className="absolute h-full bg-gradient-to-r from-tertiary via-tertiary-container to-tertiary rounded-lg flex items-center justify-center text-on-tertiary font-mono-time text-label-sm font-bold shadow-md ring-2 ring-tertiary ring-offset-1 z-10"
                      style={{ left: `${left}%`, width: `${width}%` }}
                    >
                      {width > 2 && <span className="material-symbols-outlined text-[14px]">check_circle</span>}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
