import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

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
  metadataBase: new URL("https://bymosaic.com"),
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
    url: "https://bymosaic.com",
    siteName: "By Mosaic",
  },
  twitter: {
    card: "summary_large_image",
    title: "By Mosaic — LA Wedding & Social Event Planner",
    description: "Crafting events as unique as mosaics. Let's create your masterpiece.",
  },
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
      <body>{children}</body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
