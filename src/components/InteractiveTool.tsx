"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { User, AppState, encodeState, decodeState } from '@/lib/StateEncoder';
import { calculateOverlap } from '@/lib/overlap';
import { UserCard } from '@/components/UserCard';
import { TimelineGraph } from '@/components/TimelineGraph';
import { OverlapResult } from '@/components/OverlapResult';
import { DICTIONARY } from '@/lib/i18n';

export function InteractiveTool() {
  
  const params = useParams();
  const language = (params?.lang as string) || 'en';
  const [mounted, setMounted] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [duration, setDuration] = useState({ hours: 0, minutes: 45, seconds: 0 });

  const t = DICTIONARY[language] || DICTIONARY.en;

  useEffect(() => {
    setMounted(true);
    const hash = window.location.hash.slice(1);
    if (hash) {
      const decoded = decodeState(hash);
      if (decoded) {
        setUsers(decoded.users);
        setDuration({
          hours: Math.floor(decoded.durationRequiredSeconds / 3600),
          minutes: Math.floor((decoded.durationRequiredSeconds % 3600) / 60),
          seconds: decoded.durationRequiredSeconds % 60
        });
        return;
      }
    }
    setUsers([
      { id: 'u1', name: 'Alex Rivera', timezone: 'America/Los_Angeles', isBusyMode: false, slots: [] },
      { id: 'u2', name: 'Jordan Lee', timezone: 'Europe/London', isBusyMode: false, slots: [] }
    ]);
  }, []);

  const [copied, setCopied] = useState(false);

  const minDurationSeconds = duration.hours * 3600 + duration.minutes * 60 + duration.seconds;
  const mutualOverlaps = useMemo(() => calculateOverlap(users, minDurationSeconds), [users, minDurationSeconds]);

  const handleReset = () => {
    window.location.hash = '';
    window.location.reload();
  };

  const handleShare = () => {
    const state: AppState = {
      users,
      durationRequiredSeconds: minDurationSeconds
    };
    const hash = encodeState(state);
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addUser = () => {
    setUsers([
      ...users,
      {
        id: Math.random().toString(36).substring(7),
        name: `User ${users.length + 1}`,
        timezone: 'UTC',
        isBusyMode: false,
        slots: []
      }
    ]);
  };

  const updateUser = (updated: User) => {
    setUsers(users.map(u => u.id === updated.id ? updated : u));
  };

  const removeUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleCopyTo = (sourceUserId: string, targetUserId: string) => {
    const sourceUser = users.find(u => u.id === sourceUserId);
    if (!sourceUser) return;
    setUsers(users.map(u => {
      if (u.id === targetUserId) {
        return { ...u, slots: JSON.parse(JSON.stringify(sourceUser.slots)) };
      }
      return u;
    }));
  };

  const handleCopyFrom = (targetUserId: string, sourceUserId: string) => {
    const sourceUser = users.find(u => u.id === sourceUserId);
    if (!sourceUser) return;
    setUsers(users.map(u => {
      if (u.id === targetUserId) {
        return { ...u, slots: JSON.parse(JSON.stringify(sourceUser.slots)) };
      }
      return u;
    }));
  };

  return (
    <>
      

      <main className="w-full pt-16 bg-surface">
        <div className="flex flex-col w-full">
          <div className="relative w-full max-w-[1920px] mx-auto px-space-md md:px-space-lg lg:px-8 xl:px-12 pb-space-xl">
            <div className="absolute -top-12 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
            <div className="absolute top-48 right-10 w-80 h-80 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

            <section className="w-full pt-space-lg pb-space-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h1 className="font-display-lg text-headline-xl text-on-surface tracking-tight">{t.subtitle}</h1>
                  <span className="font-mono-time text-label-md px-2.5 py-0.5 rounded-full bg-primary/15 text-primary font-medium border border-primary/30">{t.badge}</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">{t.description}</p>
              </div>
                <div className="flex flex-wrap items-center gap-space-sm w-full lg:w-auto justify-between lg:justify-end">
                  <div className="flex items-center gap-2">
                    <button onClick={handleShare} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-label-md text-label-md shadow-sm transition-all" type="button">
                      <span className="material-symbols-outlined text-[18px]">{copied ? 'check' : 'share'}</span>
                      <span>{copied ? (t.copied || 'Copied!') : (t.share || 'Share')}</span>
                    </button>
                    <button onClick={handleReset} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-on-surface rounded-xl font-label-md text-label-md shadow-sm transition-all" type="button">
                      <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                      <span>{t.reset}</span>
                    </button>
                  </div>
                </div>
            </section>

            {mounted && (
              <>
                <OverlapResult overlaps={mutualOverlaps} users={users} duration={duration} setDuration={setDuration} language={language} />

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-space-lg my-space-md items-stretch justify-items-center sm:justify-items-start">
                  {users.map(user => (
                    <UserCard
                      key={user.id}
                      user={user}
                      allUsers={users}
                      onChange={updateUser}
                      onRemove={() => removeUser(user.id)}
                      onCopyTo={(targetId) => handleCopyTo(user.id, targetId)}
                      onCopyFrom={(sourceId) => handleCopyFrom(user.id, sourceId)}
                      language={language}
                    />
                  ))}

                  <div onClick={addUser} className="flex flex-col items-center justify-center p-space-lg rounded-2xl bg-surface-container-lowest border-2 border-dashed border-outline-variant hover:border-primary/60 hover:bg-surface-container-low/50 transition-all cursor-pointer min-h-[360px] group text-center">
                    <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary-container/20 group-hover:text-primary transition-colors shadow-inner mb-space-sm">
                      <span className="material-symbols-outlined text-[28px]">person_add</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors">{t.addAnotherTitle}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[220px] mt-1">{t.addAnotherDesc}</p>
                    <button type="button" className="mt-space-md inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface font-label-md text-label-md font-semibold transition-all shadow-xs">
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      <span>{t.addPerson}</span>
                    </button>
                  </div>
                </section>

                <TimelineGraph users={users} mutualOverlaps={mutualOverlaps} language={language} />
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}


