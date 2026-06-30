import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Budget Calculator",
  description:
    "What will your wedding actually cost? Get a real Southern California estimate in 60 seconds — built on real vendor data by Kristina at By Mosaic, not a spreadsheet. Free, no email required.",
  openGraph: {
    title: "What will your wedding actually cost? A real estimate.",
    description:
      "By Mosaic · Built by an LA wedding planner, not a spreadsheet. Free, instant, honest.",
    type: "website",
    url: "https://bymosaic.com/calculator",
  },
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
