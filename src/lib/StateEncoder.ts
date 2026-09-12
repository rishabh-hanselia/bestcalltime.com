import LZString from "lz-string";

export interface TimeSlot {
  id: string;
  start: string; // "HH:mm"
  end: string; // "HH:mm"
}

export interface User {
  id: string;
  name: string;
  timezone: string;
  locationLabel?: string;
  isBusyMode: boolean;
  slots: TimeSlot[];
}

export interface AppState {
  users: User[];
  durationRequiredSeconds: number;
}

export const encodeState = (state: AppState): string => {
  const jsonString = JSON.stringify(state);
  return LZString.compressToEncodedURIComponent(jsonString);
};

export const decodeState = (encoded: string): AppState | null => {
  try {
    const jsonString = LZString.decompressFromEncodedURIComponent(encoded);
    if (!jsonString) return null;
    return JSON.parse(jsonString) as AppState;
  } catch (e) {
    console.error("Failed to decode state from URL", e);
    return null;
  }
};
