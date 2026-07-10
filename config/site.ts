// By Mosaic — site-wide constants (nav, social, contact)

export const SITE = {
  name: "By Mosaic",
  tagline: "Los Angeles-based wedding & social event planner",
  established: 2022,
  email: "info@bymosaic.com",
  phone: "240.760.8649",
  phoneHref: "tel:+12407608649",
  calendlyUrl: "https://calendly.com/kristina-bymosaic/15min",
} as const;

// Canonical origin for metadata/OG/JSON-LD. Env-driven so canonical URLs match
// the live host — set NEXT_PUBLIC_SITE_URL per environment (netlify subdomain
// now, bymosaic.com later); no code change needed at the domain switch.
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bymosaic.com";

export const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: "Instagram", href: "https://www.instagram.com/bymosaicevents/" },
  { label: "Facebook", href: "https://www.facebook.com/bymosaicevents" },
  { label: "TikTok", href: "https://www.tiktok.com/@bymosaicevents" },
];
