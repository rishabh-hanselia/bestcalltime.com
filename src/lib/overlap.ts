import { User, TimeSlot } from './StateEncoder';
import { parse, addMinutes, isBefore, isEqual, differenceInSeconds, format } from 'date-fns';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';

export interface OverlapWindow {
  startUtc: Date;
  endUtc: Date;
}

// Helper to convert "HH:mm" in a specific timezone to UTC Date on a reference day
// We will use a reference day, e.g., today, to calculate the continuous 24h window
const REFERENCE_DATE_STR = "2024-01-01"; // arbitrary date for relative math
export const START_OF_DAY = new Date("2024-01-02T00:00:00Z");

export function getRawUtcIntervalsForUser(user: User): OverlapWindow[] {
  const intervals: OverlapWindow[] = [];
  
  user.slots.forEach(slot => {
    for (let dayOffset = -1; dayOffset <= 1; dayOffset++) {
      const dateStr = `2024-01-0${2 + dayOffset}`; // 1, 2, 3
      
      const startDateTimeStr = `${dateStr} ${slot.start}:00`;
      const endDateTimeStr = `${dateStr} ${slot.end}:00`;
      
      let startUtc = fromZonedTime(startDateTimeStr, user.timezone);
      let endUtc = fromZonedTime(endDateTimeStr, user.timezone);
      
      if (isBefore(endUtc, startUtc)) {
        endUtc = addMinutes(endUtc, 24 * 60);
      }
      
      intervals.push({ startUtc, endUtc });
    }
  });
  
  return intervals;
}

export function getUtcIntervalsForUser(user: User): OverlapWindow[] {
  const intervals = getRawUtcIntervalsForUser(user);
  
  if (user.isBusyMode) {
    const freeIntervals: OverlapWindow[] = [];
    let currentStart = new Date("2024-01-01T00:00:00Z");
    const absoluteEnd = new Date("2024-01-04T00:00:00Z");
    
    intervals.sort((a, b) => a.startUtc.getTime() - b.startUtc.getTime());
    
    intervals.forEach(busy => {
      if (isBefore(currentStart, busy.startUtc)) {
        freeIntervals.push({ startUtc: currentStart, endUtc: busy.startUtc });
      }
      if (isBefore(currentStart, busy.endUtc)) {
        currentStart = busy.endUtc;
      }
    });
    
    if (isBefore(currentStart, absoluteEnd)) {
      freeIntervals.push({ startUtc: currentStart, endUtc: absoluteEnd });
    }
    
    return freeIntervals;
  }
  
  return intervals;
}

export function calculateOverlap(users: User[], minDurationSeconds: number): OverlapWindow[] {
  if (users.length === 0) return [];
  
  let mutualOverlaps = getUtcIntervalsForUser(users[0]);
  
  for (let i = 1; i < users.length; i++) {
    const userIntervals = getUtcIntervalsForUser(users[i]);
    const nextOverlaps: OverlapWindow[] = [];
    
    mutualOverlaps.forEach(mutual => {
      userIntervals.forEach(userInt => {
        const latestStart = mutual.startUtc > userInt.startUtc ? mutual.startUtc : userInt.startUtc;
        const earliestEnd = mutual.endUtc < userInt.endUtc ? mutual.endUtc : userInt.endUtc;
        
        if (isBefore(latestStart, earliestEnd)) {
          const dur = differenceInSeconds(earliestEnd, latestStart);
          if (dur >= minDurationSeconds) {
            nextOverlaps.push({ startUtc: latestStart, endUtc: earliestEnd });
          }
        }
      });
    });
    
    mutualOverlaps = nextOverlaps;
  }
  
  const windowStart = new Date("2024-01-02T00:00:00Z");
  const windowEnd = new Date("2024-01-03T00:00:00Z");
  
  const finalOverlaps: OverlapWindow[] = [];
  
  mutualOverlaps.forEach(overlap => {
    const latestStart = overlap.startUtc > windowStart ? overlap.startUtc : windowStart;
    const earliestEnd = overlap.endUtc < windowEnd ? overlap.endUtc : windowEnd;
    
    if (isBefore(latestStart, earliestEnd)) {
      const dur = differenceInSeconds(earliestEnd, latestStart);
      if (dur >= minDurationSeconds) {
        finalOverlaps.push({ startUtc: latestStart, endUtc: earliestEnd });
      }
    }
  });
  
  return finalOverlaps;
}

export function formatTimeInTz(dateUtc: Date, timeZone: string) {
  return formatInTimeZone(dateUtc, timeZone, 'hh:mm a');
}
