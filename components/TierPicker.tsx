"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Tier } from "@/config/costModel";

const EASE = [0.22, 1, 0.36, 1] as const;

interface TierCard {
  id: Tier;
  label: string;
  subtitle: string;
  description: string;
  examples: string[];
  color: string;
}

const tiers: TierCard[] = [
  {
    id: "budget",
    label: "Budget",
    subtitle: "Intimate",
    description: "Beautiful without excess. Smart vendor choices, intentional simplicity, full heart.",
    examples: ["DJ over live band", "Seasonal florals", "Micro-menu catering", "Rented tablescapes"],
    color: "var(--olive)",
  },
  {
    id: "moderate",
    label: "Moderate",
    subtitle: "Signature",
    description: "The By Mosaic sweet spot. Every detail considered, nothing gratuitous.",
    examples: ["Full photography + video", "Custom florals", "Plated or stations catering", "DJ with uplighting"],
    color: "var(--clay)",
  },
  {
    id: "luxury",
    label: "Luxury",
    subtitle: "Editorial",
    description: "No compromise. The wedding that sets the standard for everyone who attends.",
    examples: ["Live band", "Floral installations", "Multi-course plated dinner", "Lighting design"],
    color: "var(--terracotta)",
  },
];

interface TierPickerProps {
  value: Tier;
  onChange: (tier: Tier) => void;
}

export default function TierPicker({ value, onChange }: TierPickerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
      role="radiogroup"
      aria-label="Wedding style tier"
    >
      {tiers.map((tier) => {
        const isSelected = value === tier.id;
        return (
          <motion.button
            key={tier.id}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(tier.id)}
            animate={
              shouldReduceMotion
                ? {}
                : { y: isSelected ? -4 : 0 }
            }
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className={`tier-card${isSelected ? " selected" : ""} text-left p-6 flex flex-col gap-4`}
            style={{ minHeight: "280px" }}
          >
            {/* Tier marker */}
            <div
              className="w-8 h-1 rounded-full"
              style={{ background: isSelected ? tier.color : "var(--sand)" }}
            />

            {/* Labels */}
            <div>
              <p
                className="font-body text-xs uppercase tracking-widest mb-1"
                style={{ color: isSelected ? tier.color : "var(--muted)", fontWeight: 500 }}
              >
                {tier.label}
              </p>
              <h3
                className="font-display text-2xl font-medium"
                style={{
                  fontStyle: "italic",
                  fontOpticalSizing: "auto",
                  color: isSelected ? "var(--ink)" : "var(--ink)",
                  opacity: isSelected ? 1 : 0.75,
                }}
              >
                {tier.subtitle}
              </h3>
            </div>

            {/* Description */}
            <p
              className="font-body text-sm leading-relaxed flex-1"
              style={{ color: "var(--muted)" }}
            >
              {tier.description}
            </p>

            {/* Examples */}
            <ul className="space-y-1">
              {tier.examples.map((ex) => (
                <li
                  key={ex}
                  className="font-body text-xs flex items-start gap-2"
                  style={{ color: isSelected ? "var(--olive)" : "var(--muted)" }}
                >
                  <span
                    className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                    style={{ background: isSelected ? tier.color : "var(--sand)" }}
                  />
                  {ex}
                </li>
              ))}
            </ul>

            {/* Selected indicator */}
            {isSelected && (
              <motion.div
                layoutId="tier-selected-ring"
                className="absolute inset-0 rounded-[10px] pointer-events-none"
                style={{
                  border: `1px solid ${tier.color}`,
                  boxShadow: `0 0 0 1px ${tier.color}`,
                }}
                transition={{
                  type: "spring",
                  stiffness: shouldReduceMotion ? 300 : 200,
                  damping: 30,
                }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
