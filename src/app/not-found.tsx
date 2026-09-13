import React from 'react';
import Link from 'next/link';
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export default function NotFound() {
  return (
    <div className={`${inter.variable} ${jakarta.variable} antialiased bg-surface font-body-md text-body-md text-on-surface flex flex-col min-h-screen items-center justify-center`}>
      <div className="text-center px-4">
        <h1 className="font-display-lg text-headline-xl text-on-surface mb-4">404 - Page Not Found</h1>
        <p className="text-on-surface-variant mb-8">The page you are looking for does not exist.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-label-md font-semibold transition-all hover:bg-primary/90 shadow-sm">
          Return Home
        </Link>
      </div>
    </div>
  );
}
