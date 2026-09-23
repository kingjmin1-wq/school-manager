/**
 * KPI card: large numeral, Khmer label, and a subtle marigold sparkline.
 *
 * The sparkline is a deterministic decorative trend derived from the value so
 * the card reads as data rather than decoration.
 */

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type KpiTone = "primary" | "accent" | "chart3" | "chart4";

const TONE_CLASSES: Record<KpiTone, { icon: string; stroke: string }> = {
  primary: { icon: "bg-primary/10 text-primary", stroke: "text-primary" },
  accent: {
    icon: "bg-accent/15 text-accent-foreground",
    stroke: "text-accent",
  },
  chart3: { icon: "bg-chart-3/10 text-chart-3", stroke: "text-chart-3" },
  chart4: { icon: "bg-chart-4/10 text-chart-4", stroke: "text-chart-4" },
};

/** Build a smooth-ish sparkline path from a seed value. */
function sparklinePath(seed: number): string {
  const base = seed % 7;
  const points = [0, 1, 2, 3, 4, 5, 6].map((i) => {
    const wave = Math.sin((i + base) * 1.1) * 4;
    const drift = i * 1.6;
    return 22 - (wave + drift);
  });
  return points
    .map((y, i) => `${i === 0 ? "M" : "L"}${i * 16} ${y.toFixed(1)}`)
    .join(" ");
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  tone,
  seed,
  hint,
  ocid,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: KpiTone;
  seed: number;
  hint?: string;
  ocid: string;
}) {
  const tones = TONE_CLASSES[tone];
  return (
    <Card
      data-ocid={ocid}
      className="rounded-lg border-border shadow-none transition-smooth hover:border-accent/50"
    >
      <CardContent className="flex items-start justify-between gap-3 p-4 md:p-5">
        <div className="min-w-0 space-y-1.5">
          <p className="truncate text-xs font-medium text-muted-foreground">
            {label}
          </p>
          <p
            data-numeric
            className="font-display text-3xl font-bold leading-none tracking-tight md:text-4xl"
          >
            {value}
          </p>
          {hint ? (
            <p className="truncate text-[11px] text-muted-foreground">{hint}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-md",
              tones.icon,
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <svg
            viewBox="0 0 96 24"
            className={cn("h-5 w-20", tones.stroke)}
            aria-hidden="true"
            focusable="false"
          >
            <path
              d={sparklinePath(seed)}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
