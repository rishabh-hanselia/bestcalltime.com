import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "@/app/globals.css";
import Footer from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { SEO_DICTIONARY } from "@/lib/i18n-seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const SITE_URL = "https://bestcalltime.com";
const OG_IMAGE = `${SITE_URL}/og-image.png`;

// Site verification tokens
const GOOGLE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "YOUR_GOOGLE_VERIFICATION_TOKEN";
const BING_VERIFICATION =
  process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? "YOUR_BING_VERIFICATION_TOKEN";

const locales = ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'hi', 'ar', 'ru'];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  const seoData = SEO_DICTIONARY[lang] || SEO_DICTIONARY['en'];
  const title = seoData.seoTitle;
  const description = seoData.seoDescription;
  
  const canonicalUrl = lang === 'en' ? `${SITE_URL}/` : `${SITE_URL}/${lang}/`;
  
  const languages: Record<string, string> = {
    'en': `${SITE_URL}/`,
    'x-default': `${SITE_URL}/`
  };
  
  for (const l of locales) {
    if (l !== 'en') {
      languages[l] = `${SITE_URL}/${l}/`;
    }
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: title,
    description: description,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: languages
    },
    verification: {
      google: GOOGLE_VERIFICATION,
    },
    other: {
      "msvalidate.01": BING_VERIFICATION,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: title,
      description: description,
      siteName: "Best Call Time",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [OG_IMAGE],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  const seoData = SEO_DICTIONARY[lang] || SEO_DICTIONARY['en'];

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Best Call Time",
    url: lang === 'en' ? `${SITE_URL}/` : `${SITE_URL}/${lang}/`,
    description: seoData.seoDescription,
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: seoData.faq1Q,
        acceptedAnswer: {
          "@type": "Answer",
          text: seoData.faq1A,
        },
      },
      {
        "@type": "Question",
        name: seoData.faq2Q,
        acceptedAnswer: {
          "@type": "Answer",
          text: seoData.faq2A,
        },
      },
      {
        "@type": "Question",
        name: seoData.faq3Q,
        acceptedAnswer: {
          "@type": "Answer",
          text: seoData.faq3A,
        },
      },
      {
        "@type": "Question",
        name: seoData.faq4Q,
        acceptedAnswer: {
          "@type": "Answer",
          text: seoData.faq4A,
        },
      },
      {
        "@type": "Question",
        name: seoData.faq5Q,
        acceptedAnswer: {
          "@type": "Answer",
          text: seoData.faq5A,
        },
      },
    ],
  };

  return (
    <html lang={lang}>
      <head>
        {/* Google Material Icons */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD: WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webApplicationSchema),
          }}
        />
        {/* JSON-LD: FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jakarta.variable} antialiased bg-surface font-body-md text-body-md text-on-surface flex flex-col min-h-screen`}
      >
        <SiteHeader />
        <div className="flex-1 mt-16">{children}</div>
        <Footer lang={lang} />
      </body>
    </html>
  );
}
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}
