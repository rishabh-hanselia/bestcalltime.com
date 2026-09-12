import React from 'react';
import { User } from '@/lib/StateEncoder';
import { TimezoneSelect, formatTimezoneName } from '@/components/TimezoneSelect';
import { cn } from '@/lib/utils';
import { DICTIONARY } from '@/lib/i18n';

interface UserCardProps {
  user: User;
  allUsers: User[];
  onChange: (user: User) => void;
  onRemove: () => void;
  onCopyTo: (targetUserId: string) => void;
  onCopyFrom: (sourceUserId: string) => void;
  language?: string;
}

const SplitTimeInput = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const [hStr, mStr] = (value || "00:00").split(':');
  
  const updateH = (delta: number) => {
    let h = parseInt(hStr, 10) || 0;
    h = (h + delta + 24) % 24;
    onChange(`${h.toString().padStart(2, '0')}:${mStr}`);
  };

  const updateM = (delta: number) => {
    let m = parseInt(mStr, 10) || 0;
    m = (m + delta + 60) % 60;
    onChange(`${hStr}:${m.toString().padStart(2, '0')}`);
  };

  const setH = (val: string) => {
    const numericVal = val.replace(/\D/g, '');
    if (!numericVal) { onChange(`00:${mStr}`); return; }
    let h = parseInt(numericVal, 10);
    if (h > 23) h = 23;
    onChange(`${h.toString().padStart(2, '0')}:${mStr}`);
  };

  const setM = (val: string) => {
    const numericVal = val.replace(/\D/g, '');
    if (!numericVal) { onChange(`${hStr}:00`); return; }
    let m = parseInt(numericVal, 10);
    if (m > 59) m = 59;
    onChange(`${hStr}:${m.toString().padStart(2, '0')}`);
  };

  return (
    <div className="flex items-center bg-surface-container-low rounded-lg focus-within:ring-1 focus-within:ring-primary overflow-hidden group/input border border-outline-variant/20 shadow-xs h-[30px]">
      {/* Hours */}
      <div className="flex items-center h-full">
        <input 
          className="font-mono-time text-label-md bg-transparent pl-3 pr-2 py-1 w-[36px] text-center text-on-surface focus:outline-none hide-scrollbar selection:bg-primary/20"
          type="text" 
          value={hStr}
          onChange={(e) => setH(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') { e.preventDefault(); updateH(1); }
            if (e.key === 'ArrowDown') { e.preventDefault(); updateH(-1); }
          }}
        />
        <div className="flex flex-col justify-center bg-surface-container-lowest/50 border-l border-outline-variant/10 h-full w-[20px]">
          <button type="button" tabIndex={-1} onClick={() => updateH(1)} className="h-1/2 flex items-center justify-center hover:bg-surface-container hover:text-primary transition-colors text-on-surface-variant"><span className="material-symbols-outlined text-[10px] scale-75 opacity-80">keyboard_arrow_up</span></button>
          <button type="button" tabIndex={-1} onClick={() => updateH(-1)} className="h-1/2 flex items-center justify-center hover:bg-surface-container hover:text-primary transition-colors text-on-surface-variant"><span className="material-symbols-outlined text-[10px] scale-75 opacity-80">keyboard_arrow_down</span></button>
        </div>
      </div>
      
      <span className="text-on-surface-variant/80 font-bold px-1 pb-0.5">:</span>

      {/* Minutes */}
      <div className="flex items-center h-full">
        <input 
          className="font-mono-time text-label-md bg-transparent pl-1.5 pr-2 py-1 w-[34px] text-center text-on-surface focus:outline-none hide-scrollbar selection:bg-primary/20"
          type="text" 
          value={mStr}
          onChange={(e) => setM(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') { e.preventDefault(); updateM(1); }
            if (e.key === 'ArrowDown') { e.preventDefault(); updateM(-1); }
          }}
        />
        <div className="flex flex-col justify-center bg-surface-container-lowest/50 border-l border-outline-variant/10 h-full w-[20px]">
          <button type="button" tabIndex={-1} onClick={() => updateM(1)} className="h-1/2 flex items-center justify-center hover:bg-surface-container hover:text-primary transition-colors text-on-surface-variant"><span className="material-symbols-outlined text-[10px] scale-75 opacity-80">keyboard_arrow_up</span></button>
          <button type="button" tabIndex={-1} onClick={() => updateM(-1)} className="h-1/2 flex items-center justify-center hover:bg-surface-container hover:text-primary transition-colors text-on-surface-variant"><span className="material-symbols-outlined text-[10px] scale-75 opacity-80">keyboard_arrow_down</span></button>
        </div>
      </div>
    </div>
  );
};

export const UserCard: React.FC<UserCardProps> = ({ user, allUsers, onChange, onRemove, onCopyTo, onCopyFrom, language = 'en' }) => {
  const t = DICTIONARY[language] || DICTIONARY.en;
  
  const updateName = (name: string) => onChange({ ...user, name });
  const updateTimezone = (timezone: string) => onChange({ ...user, timezone });
  const updateIsBusyMode = (isBusyMode: boolean) => onChange({ ...user, isBusyMode });

  const addSlot = () => {
    onChange({
      ...user,
      slots: [...user.slots, { id: Math.random().toString(36).substring(7), start: '09:00', end: '17:00' }]
    });
  };

  const updateSlot = (id: string, field: 'start' | 'end', value: string) => {
    onChange({
      ...user,
      slots: user.slots.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };



  const removeSlot = (id: string) => {
    onChange({
      ...user,
      slots: user.slots.filter(s => s.id !== id)
    });
  };

  const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?';

  return (
    <div className="flex flex-col justify-between bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-shadow p-space-lg relative overflow-hidden w-full min-w-[320px] max-w-[400px]">
      <div className="flex flex-col gap-space-md">
        
        {/* Participant Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-display-lg text-primary text-headline-sm font-bold shadow-inner">
                {initials}
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-primary-container rounded-full ring-2 ring-surface-container-lowest"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <input 
                  className="font-headline-sm text-headline-sm text-on-surface font-semibold bg-transparent hover:bg-surface-container-low focus:bg-surface-container-lowest px-1 rounded transition-colors truncate focus:outline-none focus:ring-1 focus:ring-primary w-full max-w-[150px]" 
                  type="text" 
                  value={user.name}
                  onChange={(e) => updateName(e.target.value)}
                />
                <button onClick={onRemove} className="text-on-surface-variant/70 hover:text-error transition-colors" title="Remove User">
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-medium truncate max-w-[200px]">
                  {user.locationLabel ? user.locationLabel.split(',')[0] : formatTimezoneName(user.timezone).split(',')[0]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Timezone & Location Select Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">{t.locationOffset}</label>
          <TimezoneSelect 
            value={user.timezone} 
            label={user.locationLabel}
            onChange={(tz, label) => onChange({ ...user, timezone: tz, locationLabel: label })} 
          />
        </div>

        {/* Free vs. Busy Mode Switch */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">{t.slotMode}</span>
          </div>
          <div className="flex items-stretch p-1 bg-surface-container-lowest rounded-lg shadow-inner text-label-sm font-label-sm h-8">
            <button 
              onClick={() => updateIsBusyMode(false)}
              className={cn(
                "flex items-center px-3 rounded-md transition-colors",
                !user.isBusyMode ? "bg-primary-container text-on-primary-container font-semibold shadow-xs" : "text-on-surface-variant hover:text-on-surface"
              )} 
              type="button"
            >
              {t.freeSlots}
            </button>
            <button 
              onClick={() => updateIsBusyMode(true)}
              className={cn(
                "flex items-center px-3 rounded-md transition-colors",
                user.isBusyMode ? "bg-error-container text-on-error-container font-semibold shadow-xs" : "text-on-surface-variant hover:text-on-surface"
              )} 
              type="button"
            >
              {t.busySlots}
            </button>
          </div>
        </div>

        {/* Defined Time Slots Container */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">{t.customTimeSlots} ({user.slots.length})</span>
          </div>
          <div className="flex flex-col gap-2">
            {user.slots.map(slot => (
              <div key={slot.id} className="flex items-center gap-2 p-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-colors shadow-xs group border border-outline-variant/30">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <SplitTimeInput value={slot.start} onChange={(val) => updateSlot(slot.id, 'start', val)} />
                  <span className="font-body-sm text-body-sm text-on-surface-variant px-1">to</span>
                  <SplitTimeInput value={slot.end} onChange={(val) => updateSlot(slot.id, 'end', val)} />
                </div>
                <button 
                  onClick={() => removeSlot(slot.id)}
                  aria-label="Remove slot" 
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">remove_circle_outline</span>
                </button>
              </div>
            ))}
            {user.slots.length === 0 && (
              <div className="text-center py-4 text-sm text-on-surface-variant italic">{t.noIntervals}</div>
            )}
          </div>
          {/* Add Slot Action */}
          <button onClick={addSlot} className="w-full py-2 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 transition-colors mt-1" type="button">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>{t.addTimeSlot}</span>
          </button>
          
          {/* Copy Slots Actions */}
          {allUsers.filter(u => u.id !== user.id).length > 0 && (
            <div className="flex items-center gap-2 mt-1 border-t border-outline-variant/20 pt-2.5">
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant" title="Copy slots">content_copy</span>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <select 
                  className="font-label-sm text-[11px] bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant rounded-md px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-primary truncate cursor-pointer hover:bg-surface-container-low transition-colors"
                  onChange={(e) => {
                    if (e.target.value) {
                      onCopyFrom(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  value=""
                >
                  <option value="" disabled>Copy time slots from...</option>
                  {allUsers.filter(u => u.id !== user.id).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                
                <select 
                  className="font-label-sm text-[11px] bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant rounded-md px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-primary truncate cursor-pointer hover:bg-surface-container-low transition-colors"
                  onChange={(e) => {
                    if (e.target.value) {
                      onCopyTo(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  value=""
                >
                  <option value="" disabled>Copy time slots to...</option>
                  <option value="ALL">All Users</option>
                  {allUsers.filter(u => u.id !== user.id).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
