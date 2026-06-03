import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { BudgetResult, Tier, Location, locationLabels } from "@/config/costModel";

// ─── Fonts ─────────────────────────────────────────────────────────────────────
// Note: @react-pdf/renderer requires embedded fonts or system fonts
// Using built-in Helvetica and Times for maximum compatibility

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#F6F1E9",
    padding: 48,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    borderBottomColor: "#B07A57",
    paddingBottom: 16,
    marginBottom: 28,
  },
  brandName: {
    fontFamily: "Times-Roman",
    fontSize: 22,
    color: "#2B2622",
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#8C8275",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 3,
  },
  headerRight: {
    textAlign: "right",
  },
  headerDate: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#8C8275",
    letterSpacing: 0.5,
  },
  sectionLabel: {
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#8C8275",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  summaryBlock: {
    backgroundColor: "#FBF8F3",
    borderWidth: 1,
    borderColor: "#E4DAC9",
    borderRadius: 6,
    padding: 20,
    marginBottom: 24,
  },
  summaryMeta: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#8C8275",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  totalAmount: {
    fontFamily: "Times-BoldItalic",
    fontSize: 36,
    color: "#B07A57",
    marginBottom: 4,
  },
  rangeText: {
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#8C8275",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E4DAC9",
    marginBottom: 4,
  },
  tableHeaderLabel: {
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#8C8275",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  lineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#E4DAC9",
  },
  lineItemLabel: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#8C8275",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    flex: 1,
  },
  lineItemValue: {
    fontFamily: "Times-Roman",
    fontSize: 11,
    color: "#2B2622",
    textAlign: "right",
  },
  fnbLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E4DAC9",
  },
  fnbLabel: {
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#B07A57",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    flex: 1,
    fontStyle: "italic",
  },
  contingencyNote: {
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#8C8275",
    marginTop: 2,
    fontStyle: "italic",
  },
  totalLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingTop: 12,
    paddingBottom: 8,
    marginTop: 4,
    borderTopWidth: 2,
    borderTopColor: "#B07A57",
  },
  totalLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#2B2622",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  totalValue: {
    fontFamily: "Times-Bold",
    fontSize: 20,
    color: "#B07A57",
  },
  rangeBlock: {
    backgroundColor: "#FBF8F3",
    borderWidth: 1,
    borderColor: "#E4DAC9",
    borderRadius: 4,
    padding: 12,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rangeBlockLabel: {
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#8C8275",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  rangeBlockValue: {
    fontFamily: "Times-Roman",
    fontSize: 13,
    color: "#2B2622",
  },
  signatureBlock: {
    marginTop: 32,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E4DAC9",
  },
  signatureText: {
    fontFamily: "Times-Italic",
    fontSize: 12,
    color: "#8C8275",
    lineHeight: 1.6,
    marginBottom: 12,
  },
  signatureName: {
    fontFamily: "Times-BoldItalic",
    fontSize: 16,
    color: "#B07A57",
  },
  signatureTitle: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#8C8275",
    letterSpacing: 0.5,
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E4DAC9",
    paddingTop: 10,
  },
  footerText: {
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#8C8275",
  },
  decorLine: {
    width: 40,
    height: 2,
    backgroundColor: "#B07A57",
    borderRadius: 1,
    marginBottom: 12,
  },
});

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const tierLabel: Record<Tier, string> = {
  budget: "Budget / Intimate",
  moderate: "Moderate / Signature",
  luxury: "Luxury / Editorial",
};

interface BudgetPDFProps {
  result: BudgetResult;
  coupleNames?: string;
  generatedDate?: string;
}

export function BudgetPDF({ result, coupleNames, generatedDate }: BudgetPDFProps) {
  const date = generatedDate ?? new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document
      title="By Mosaic Wedding Budget Estimate"
      author="By Mosaic Events"
      subject="Wedding Budget Estimate"
    >
      <Page size="LETTER" style={styles.page}>
        {/* ─── Header ──────────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>By Mosaic Events</Text>
            <Text style={styles.brandTagline}>Est. 2022 · Los Angeles · bymosaic.com</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>Wedding Budget Estimate</Text>
            <Text style={styles.headerDate}>{date}</Text>
            {coupleNames && (
              <Text style={[styles.headerDate, { marginTop: 4, color: "#2B2622" }]}>
                {coupleNames}
              </Text>
            )}
          </View>
        </View>

        {/* ─── Summary Block ────────────────────────────────────────────────────── */}
        <View style={styles.summaryBlock}>
          <Text style={styles.summaryMeta}>
            {result.guests} guests · {locationLabels[result.location]} · {tierLabel[result.tier]}
          </Text>
          <View style={styles.decorLine} />
          <Text style={styles.totalAmount}>{fmt(result.total)}</Text>
          <Text style={styles.rangeText}>
            Realistic range: {fmt(result.rangeLow)} – {fmt(result.rangeHigh)}
          </Text>
        </View>

        {/* ─── Line Items ──────────────────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>Category Breakdown</Text>

        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderLabel}>Category</Text>
          <Text style={styles.tableHeaderLabel}>Estimate</Text>
        </View>

        {result.categories.map((cat) => (
          <View key={cat.name} style={styles.lineItem}>
            <Text style={styles.lineItemLabel}>{cat.name}</Text>
            <Text style={styles.lineItemValue}>{fmt(cat.subtotal)}</Text>
          </View>
        ))}

        {/* F&B service fee */}
        <View style={styles.fnbLine}>
          <Text style={styles.fnbLabel}>F&B service + tax (est. 30%)</Text>
          <Text style={[styles.lineItemValue, { fontSize: 10, color: "#8C8275" }]}>
            {fmt(result.fnbServiceAmount)}
          </Text>
        </View>

        {/* Contingency */}
        <View style={styles.lineItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.lineItemLabel}>Contingency (8%)</Text>
            <Text style={styles.contingencyNote}>Budget buffer for unexpected costs</Text>
          </View>
          <Text style={styles.lineItemValue}>{fmt(result.contingencyAmount)}</Text>
        </View>

        {/* Total */}
        <View style={styles.totalLine}>
          <Text style={styles.totalLabel}>Estimated Total</Text>
          <Text style={styles.totalValue}>{fmt(result.total)}</Text>
        </View>

        {/* Range */}
        <View style={styles.rangeBlock}>
          <Text style={styles.rangeBlockLabel}>Realistic range</Text>
          <Text style={styles.rangeBlockValue}>
            {fmt(result.rangeLow)} – {fmt(result.rangeHigh)}
          </Text>
        </View>

        {/* ─── Signature ────────────────────────────────────────────────────────── */}
        <View style={styles.signatureBlock}>
          <Text style={styles.signatureText}>
            "Reply with any question — I read these myself. These numbers are built from
            real LA vendor data I see every season. If your total surprised you, let&apos;s
            talk about where there&apos;s flexibility and where there isn&apos;t."
          </Text>
          <Text style={styles.signatureName}>Kristina</Text>
          <Text style={styles.signatureTitle}>
            Founder, By Mosaic Events · kristina@bymosaic.com
          </Text>
        </View>

        {/* ─── Footer ──────────────────────────────────────────────────────────── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            By Mosaic Events · bymosaic.com · Est. 2022
          </Text>
          <Text style={styles.footerText}>
            Estimates based on current LA market data. Individual vendor quotes will vary.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export default BudgetPDF;
