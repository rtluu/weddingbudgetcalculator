import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Wedding Budget Calculator · By Mosaic Events",
  description:
    "Get a real LA wedding cost estimate in 60 seconds. Built by Kristina at By Mosaic Events — an LA wedding planner who actually knows what things cost.",
  keywords: [
    "LA wedding budget",
    "Los Angeles wedding cost",
    "wedding planning",
    "By Mosaic Events",
    "wedding calculator",
    "Southern California wedding",
  ],
  openGraph: {
    title: "What will your wedding actually cost? A real LA estimate.",
    description:
      "By Mosaic Events · Built by an LA wedding planner, not a spreadsheet. Free, instant, honest.",
    type: "website",
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
      className={`${fraunces.variable} ${hankenGrotesk.variable}`}
      style={
        {
          "--font-display": "var(--font-fraunces)",
          "--font-body": "var(--font-hanken)",
        } as React.CSSProperties
      }
    >
      <body>{children}</body>
    </html>
  );
}
