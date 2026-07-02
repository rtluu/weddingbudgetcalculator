import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { SITE, SOCIAL_LINKS, siteUrl } from "@/config/site";
import JsonLd from "@/components/JsonLd";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "By Mosaic — Los Angeles Wedding & Social Event Planner",
    template: "%s · By Mosaic",
  },
  description:
    "Los Angeles-based wedding & social event planner. Just like a mosaic, every detail — big or small — comes together to create something truly special. Crafting events as unique as mosaics.",
  keywords: [
    "Los Angeles wedding planner",
    "LA event planner",
    "wedding planning",
    "By Mosaic",
    "By Mosaic Events",
    "Southern California wedding",
    "social event planning",
  ],
  openGraph: {
    title: "By Mosaic — Los Angeles Wedding & Social Event Planner",
    description:
      "Crafting events as unique as mosaics. Let's create your masterpiece.",
    type: "website",
    url: siteUrl,
    siteName: "By Mosaic",
  },
  twitter: {
    card: "summary_large_image",
    title: "By Mosaic — LA Wedding & Social Event Planner",
    description: "Crafting events as unique as mosaics. Let's create your masterpiece.",
  },
};

// Site-wide LocalBusiness structured data for local SEO / rich results.
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteUrl}/#business`,
  name: SITE.name,
  alternateName: "By Mosaic Events",
  description: SITE.tagline,
  url: siteUrl,
  image: `${siteUrl}/logos/bymosaic-mark.svg`,
  logo: `${siteUrl}/logos/bymosaic-mark.svg`,
  email: SITE.email,
  telephone: SITE.phoneHref.replace("tel:", ""),
  foundingDate: String(SITE.established),
  priceRange: "$$$",
  areaServed: [
    { "@type": "City", name: "Los Angeles" },
    { "@type": "AdministrativeArea", name: "Southern California" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Los Angeles",
    addressRegion: "CA",
    addressCountry: "US",
  },
  sameAs: SOCIAL_LINKS.map((s) => s.href),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${hankenGrotesk.variable} ${instrumentSerif.variable}`}
      style={
        {
          "--font-display": "var(--font-fraunces)",
          "--font-body": "var(--font-hanken)",
          "--font-accent": "var(--font-instrument)",
        } as React.CSSProperties
      }
    >
      <body>
        <JsonLd data={localBusinessJsonLd} />
        {children}
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
