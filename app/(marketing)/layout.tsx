import SiteNav from "@/components/marketing/SiteNav";
import SiteFooterFull from "@/components/marketing/SiteFooterFull";
import ScrollToTop from "@/components/marketing/ScrollToTop";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ScrollToTop />
      <SiteNav />
      <main style={{ flex: 1 }}>{children}</main>
      <SiteFooterFull />
    </div>
  );
}
