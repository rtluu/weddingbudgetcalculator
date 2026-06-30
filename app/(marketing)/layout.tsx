import SiteNav from "@/components/marketing/SiteNav";
import SiteFooterFull from "@/components/marketing/SiteFooterFull";
import StickyCTA from "@/components/marketing/StickyCTA";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteNav />
      <main style={{ flex: 1 }}>{children}</main>
      <SiteFooterFull />
      <StickyCTA />
    </div>
  );
}
