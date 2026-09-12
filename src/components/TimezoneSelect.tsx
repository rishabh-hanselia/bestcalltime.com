import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import locationsData from '@/lib/locations.json';

export interface LocationData {
  city: string;
  country: string;
  continent: string;
  timezone: string;
}

const LOCATIONS = locationsData as LocationData[];

const tzOffsetCache = new Map<string, string>();

const getOffsetStr = (tz: string) => {
  if (!tz) return '';
  if (tzOffsetCache.has(tz)) return tzOffsetCache.get(tz)!;
  try {
    const format = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' });
    const parts = format.formatToParts(new Date());
    const tzPart = parts.find(p => p.type === 'timeZoneName')?.value;
    if (tzPart) {
      const formatted = tzPart.replace('GMT', 'GMT ').replace('+0', '+').replace('-0', '-');
      tzOffsetCache.set(tz, formatted);
      return formatted;
    }
  } catch (e) {}
  tzOffsetCache.set(tz, '');
  return '';
};

export const formatLocationLabel = (location: LocationData): string => {
  const offset = getOffsetStr(location.timezone);
  return `${location.city}, ${location.country}, ${location.continent} (${offset})`;
};

export const formatTimezoneName = (tz: string) => {
  const parts = tz.split('/');
  const canonicalCity = parts[parts.length - 1]?.replace(/_/g, ' ');

  // Try to find the exact canonical city match first
  let loc = LOCATIONS.find(l => l.timezone === tz && l.city === canonicalCity);
  
  // If not found, fall back to the first available city in that timezone
  if (!loc) {
    loc = LOCATIONS.find(l => l.timezone === tz);
  }

  if (loc) return formatLocationLabel(loc);
  
  // Fallback for custom timezones not in dataset
  return `${canonicalCity || tz}, Unknown, Unknown (${getOffsetStr(tz)})`;
};

interface TimezoneSelectProps {
  value: string;
  label?: string;
  onChange: (tz: string, label: string) => void;
}

export const TimezoneSelect: React.FC<TimezoneSelectProps> = ({ value, label: customLabel, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    if (!search) return LOCATIONS.slice(0, 100);
    const s = search.toLowerCase();
    const results = [];
    for (const loc of LOCATIONS) {
      if (loc.city.toLowerCase().includes(s) || loc.country.toLowerCase().includes(s)) {
        results.push(loc);
      }
      if (results.length > 100) break; // Limit for rendering performance
    }
    return results;
  }, [search]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-md text-body-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
      >
        <span className="truncate pr-2">{customLabel || formatTimezoneName(value)}</span>
        <span className="material-symbols-outlined text-on-surface-variant text-[18px] shrink-0">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-lg overflow-hidden flex flex-col max-h-64">
          <div className="p-2 border-b border-outline-variant/20 bg-surface-container-low/50 sticky top-0">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant">search</span>
              <input
                type="text"
                autoFocus
                placeholder="Search location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-surface-container-lowest border border-outline-variant/50 rounded-lg text-body-sm focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
              />
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1 p-1 scrollbar-thin">
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-center text-on-surface-variant font-body-sm text-sm">No locations found.</div>
            ) : (
              filtered.map(loc => {
                const label = formatLocationLabel(loc);
                return (
                  <button
                    key={`${loc.city}-${loc.country}-${loc.timezone}`}
                    type="button"
                    onClick={() => { onChange(loc.timezone, label); setIsOpen(false); setSearch(''); }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-body-sm transition-colors mb-0.5",
                      loc.timezone === value && (!customLabel || customLabel === label) ? "bg-primary-container/30 text-primary font-medium" : "hover:bg-surface-container text-on-surface"
                    )}
                  >
                    {label}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
