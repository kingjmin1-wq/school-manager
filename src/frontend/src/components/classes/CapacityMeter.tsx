/**
 * Capacity usage indicator for a class: enrolled count against capacity.
 *
 * The bar tone shifts as the class fills so a full or over-subscribed class is
 * obvious at a glance in the dense list view.
 */

import { Progress } from "@/components/ui/progress";
import { capacityPercent, formatKhmerNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CapacityMeter({
  enrolled,
  capacity,
  showLabel = true,
  className,
}: {
  enrolled: bigint;
  capacity: bigint;
  showLabel?: boolean;
  className?: string;
}) {
  const percent = capacityPercent(enrolled, capacity);
  const isFull = capacity > 0n && enrolled >= capacity;
  const isNearFull = !isFull && percent >= 85;

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      {showLabel && (
        <div className="flex items-baseline justify-between gap-2">
          <span className="tabular text-xs font-medium text-foreground">
            {formatKhmerNumber(enrolled)}
            <span className="text-muted-foreground">
              {" / "}
              {formatKhmerNumber(capacity)}
            </span>
          </span>
          <span
            className={cn(
              "tabular text-[11px]",
              isFull
                ? "text-destructive"
                : isNearFull
                  ? "text-warning"
                  : "text-muted-foreground",
            )}
          >
            {formatKhmerNumber(percent)}%
          </span>
        </div>
      )}
      <Progress
        value={percent}
        aria-label={`ចំណុះថ្នាក់ ${formatKhmerNumber(enrolled)} ក្នុងចំណោម ${formatKhmerNumber(capacity)}`}
        className={cn(
          "h-1.5 bg-muted",
          isFull
            ? "[&>[data-slot=progress-indicator]]:bg-destructive"
            : isNearFull
              ? "[&>[data-slot=progress-indicator]]:bg-warning"
              : "[&>[data-slot=progress-indicator]]:bg-accent",
        )}
      />
    </div>
  );
}
