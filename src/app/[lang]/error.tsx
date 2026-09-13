"use client";

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-32 px-4">
      <h1 className="font-display-lg text-headline-xl text-on-surface mb-4">500 - Something went wrong!</h1>
      <p className="text-on-surface-variant mb-8">An unexpected error occurred.</p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-label-md font-semibold transition-all hover:bg-primary/90 shadow-sm"
      >
        Try again
      </button>
    </div>
  );
}
