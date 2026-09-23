/**
 * Status pill for a student record.
 *
 * Tones come from `STUDENT_STATUS_TONES` so every surface renders the same
 * colour for the same backend status.
 */

import { Badge } from "@/components/ui/badge";
import { STUDENT_STATUS_LABELS, STUDENT_STATUS_TONES } from "@/lib/labels";
import { cn } from "@/lib/utils";
import type { StudentStatus } from "@/types";

const TONE_CLASSES: Record<string, string> = {
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/40 bg-warning/15 text-warning-foreground",
  muted: "border-border bg-muted text-muted-foreground",
  destructive: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function StatusBadge({
  status,
  className,
}: {
  status: StudentStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md px-2 py-0.5 text-[11px] font-semibold",
        TONE_CLASSES[STUDENT_STATUS_TONES[status]],
        className,
      )}
    >
      {STUDENT_STATUS_LABELS[status]}
    </Badge>
  );
}
