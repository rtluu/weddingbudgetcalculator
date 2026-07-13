import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { BudgetResult, Tier } from "@/config/costModel";
import { locationLabels } from "@/config/costModel";

const C = {
  bone: "#F6F1E9",
  clay: "#4F6F57", // brand accent — sage-deep (reskinned from warm clay)
  ink: "#2B2622",
  muted: "#8C8275",
  sand: "#E4DAC9",
  alabaster: "#FBF8F3",
  terracotta: "#C4654A", // semantic: seasonal premium (increase) — kept warm vs. olive discount
  olive: "#6E7253",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const tierLabel: Record<Tier, string> = {
  budget: "Conservative",
  moderate: "Signature",
  luxury: "Editorial",
};

const s = StyleSheet.create({
  page: {
    backgroundColor: C.bone,
    paddingTop: 44,
    paddingHorizontal: 48,
    paddingBottom: 44,
    fontFamily: "Helvetica",
  },
  // ── Header ──
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: C.clay,
  },
  eyebrow: {
    fontSize: 7.5,
    letterSpacing: 1.8,
    color: C.muted,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontFamily: "Times-Roman",
    color: C.ink,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: C.muted,
  },
  // ── Summary pills ──
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 22,
  },
  pill: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.sand,
    backgroundColor: C.alabaster,
  },
  pillText: {
    fontSize: 8.5,
    color: C.ink,
  },
  // ── Range box ──
  rangeBox: {
    backgroundColor: C.alabaster,
    borderRadius: 6,
    paddingVertical: 18,
    paddingHorizontal: 22,
    marginBottom: 24,
  },
  rangeLabel: {
    fontSize: 7.5,
    letterSpacing: 1.8,
    color: C.muted,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  rangeRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  rangeValue: {
    fontSize: 30,
    fontFamily: "Times-Roman",
    color: C.clay,
  },
  rangeDash: {
    fontSize: 22,
    fontFamily: "Times-Roman",
    color: C.clay,
    opacity: 0.4,
    marginHorizontal: 6,
  },
  // ── Breakdown table ──
  sectionLabel: {
    fontSize: 7.5,
    letterSpacing: 1.8,
    color: C.muted,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.sand,
  },
  rowLabel: {
    fontSize: 9,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: C.muted,
  },
  rowValue: {
    fontSize: 11,
    fontFamily: "Times-Roman",
    color: C.ink,
  },
  rowValueMuted: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    color: C.muted,
  },
  rowValueAccent: {
    fontSize: 10,
    fontFamily: "Times-Roman",
  },
  // ── Total ──
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingTop: 12,
    paddingBottom: 4,
  },
  totalLabel: {
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    color: C.ink,
  },
  totalValue: {
    fontSize: 24,
    fontFamily: "Times-Roman",
    color: C.clay,
  },
  // ── Note ──
  note: {
    marginTop: 18,
    padding: 14,
    borderLeftWidth: 2,
    borderLeftColor: C.clay,
    backgroundColor: C.alabaster,
  },
  noteText: {
    fontSize: 9.5,
    fontFamily: "Times-Italic",
    color: C.ink,
    lineHeight: 1.65,
  },
  // ── Footer ──
  footer: {
    marginTop: 22,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.sand,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7.5,
    color: C.muted,
  },
});

interface Props {
  name: string;
  result: BudgetResult;
  venueName?: string;
}

export function EstimatePDF({ name, result, venueName }: Props) {
  const firstName = name.split(" ")[0];
  const sorted = [...result.categories].sort((a, b) => b.subtotal - a.subtotal);
  const hasSeasonalAdj = result.month !== null && result.seasonalMult !== 1.0;
  const hasDowAdj = result.dayOfWeek !== null && result.dowAdjustmentAmount !== 0;
  const monthName = result.month !== null
    ? ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][result.month]
    : null;
  const dowName = result.dayOfWeek !== null
    ? ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][result.dayOfWeek]
    : null;

  return (
    <Document title={`By Mosaic Wedding Estimate — ${name}`} author="By Mosaic Events">
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.eyebrow}>By Mosaic Events · Los Angeles</Text>
          <Text style={s.title}>Your wedding estimate, {firstName}.</Text>
          <Text style={s.subtitle}>Built from real LA vendor data. Here&apos;s what your mosaic looks like.</Text>
        </View>

        {/* Summary pills */}
        <View style={s.pillRow}>
          <View style={s.pill}><Text style={s.pillText}>{result.guests} guests</Text></View>
          <View style={s.pill}><Text style={s.pillText}>{locationLabels[result.location]}</Text></View>
          <View style={s.pill}><Text style={s.pillText}>{tierLabel[result.tier]}</Text></View>
          {monthName && <View style={s.pill}><Text style={s.pillText}>{monthName}</Text></View>}
          {dowName && <View style={s.pill}><Text style={s.pillText}>{dowName}</Text></View>}
          {venueName && <View style={s.pill}><Text style={s.pillText}>{venueName}</Text></View>}
        </View>

        {/* Range */}
        <View style={s.rangeBox}>
          <Text style={s.rangeLabel}>Realistic range</Text>
          <View style={s.rangeRow}>
            <Text style={s.rangeValue}>{fmt(result.rangeLow)}</Text>
            <Text style={s.rangeDash}> – </Text>
            <Text style={s.rangeValue}>{fmt(result.rangeHigh)}</Text>
          </View>
        </View>

        {/* Category breakdown */}
        <Text style={s.sectionLabel}>Category breakdown</Text>
        {sorted.map((cat) => (
          <View key={cat.name} style={s.row}>
            <Text style={s.rowLabel}>{cat.name}</Text>
            <Text style={s.rowValue}>{fmt(cat.subtotal)}</Text>
          </View>
        ))}

        <View style={s.row}>
          <Text style={[s.rowLabel, { opacity: 0.7 }]}>F&B service + tax (est. 30%)</Text>
          <Text style={s.rowValueMuted}>{fmt(result.fnbServiceAmount)}</Text>
        </View>

        <View style={s.row}>
          <Text style={s.rowLabel}>Contingency ({Math.round(result.contingencyRate * 100)}%)</Text>
          <Text style={s.rowValue}>{fmt(result.contingencyAmount)}</Text>
        </View>

        {hasSeasonalAdj && (
          <View style={s.row}>
            <Text style={[s.rowLabel, { color: result.seasonalMult > 1 ? C.terracotta : C.olive }]}>
              {monthName} seasonal {result.seasonalMult > 1 ? "premium" : "discount"}
              {"  "}{result.seasonalMult > 1 ? "+" : ""}
              {Math.round((result.seasonalAdjustmentAmount / (result.total - result.seasonalAdjustmentAmount)) * 100)}%
            </Text>
            <Text style={[s.rowValueAccent, { color: result.seasonalMult > 1 ? C.terracotta : C.olive }]}>
              {result.seasonalMult > 1 ? "+" : ""}
              {fmt(result.seasonalAdjustmentAmount)}
            </Text>
          </View>
        )}

        {hasDowAdj && (
          <View style={s.row}>
            <Text style={[s.rowLabel, { color: C.olive }]}>
              {dowName} savings vs. Saturday
            </Text>
            <Text style={[s.rowValueAccent, { color: C.olive }]}>
              {fmt(result.dowAdjustmentAmount)}
            </Text>
          </View>
        )}

        {/* Total */}
        <View style={s.totalRow}>
          <Text style={s.totalLabel}>Estimated total</Text>
          <Text style={s.totalValue}>{fmt(result.total)}</Text>
        </View>

        {/* Kristina's note */}
        <View style={s.note}>
          <Text style={s.noteText}>
            &quot;Reply with any question — I read these myself. If your number surprised you, let&apos;s talk about which lines have the most flexibility. That&apos;s usually where we find room.&quot; — Kristina
          </Text>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>By Mosaic Events · bymosaic.com</Text>
          <Text style={s.footerText}>Numbers reflect current LA market rates. Individual quotes will vary.</Text>
        </View>

      </Page>
    </Document>
  );
}
