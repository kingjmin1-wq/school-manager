/**
 * Recent activity panel: colored dot markers, Khmer activity labels, and
 * relative timestamps for the newest backend activity entries.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/lib/format";
import { ACTIVITY_KIND_LABELS } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { type ActivityEntry, ActivityKind } from "@/types";
import { History } from "lucide-react";

/** Dot color per activity family: create / update / delete / enrollment. */
function dotClass(kind: ActivityKind): string {
  switch (kind) {
    case ActivityKind.studentCreated:
    case ActivityKind.teacherCreated:
    case ActivityKind.classCreated:
      return "bg-success";
    case ActivityKind.studentUpdated:
    case ActivityKind.teacherUpdated:
    case ActivityKind.classUpdated:
      return "bg-accent";
    case ActivityKind.enrollmentAdded:
      return "bg-chart-3";
    case ActivityKind.enrollmentRemoved:
      return "bg-warning";
    default:
      return "bg-destructive";
  }
}

export function RecentActivityPanel({
  entries,
  isLoading,
}: {
  entries: ActivityEntry[];
  isLoading: boolean;
}) {
  return (
    <Card
      data-ocid="dashboard.activity_card"
      className="rounded-lg border-border shadow-none"
    >
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 border-b border-border px-4 py-3">
        <History className="size-4 text-muted-foreground" aria-hidden="true" />
        <CardTitle className="font-display text-sm font-bold tracking-tight">
          សកម្មភាពថ្មីៗ
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div
            className="space-y-4 p-4"
            data-ocid="dashboard.activity.loading_state"
          >
            {Array.from({ length: 6 }, (_, i) => `activity-skeleton-${i}`).map(
              (id) => (
                <div key={id} className="flex items-start gap-3">
                  <Skeleton className="mt-1 size-2.5 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-28 rounded-sm" />
                    <Skeleton className="h-3 w-40 rounded-sm" />
                  </div>
                </div>
              ),
            )}
          </div>
        ) : entries.length === 0 ? (
          <div
            data-ocid="dashboard.activity.empty_state"
            className="flex flex-col items-center gap-2 px-4 py-10 text-center"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-muted">
              <History
                className="size-5 text-muted-foreground"
                aria-hidden="true"
              />
            </span>
            <p className="text-sm font-medium">មិនទាន់មានសកម្មភាព</p>
            <p className="max-w-[15rem] text-xs text-muted-foreground">
              សកម្មភាពបន្ថែម កែប្រែ និងលុបទិន្នន័យនឹងបង្ហាញនៅទីនេះ។
            </p>
          </div>
        ) : (
          <ul
            className="divide-y divide-border"
            data-ocid="dashboard.activity.list"
          >
            {entries.map((entry, index) => (
              <li
                key={entry.id.toString()}
                data-ocid={`dashboard.activity.item.${index + 1}`}
                className="flex items-start gap-3 px-4 py-3 transition-smooth hover:bg-accent/[0.06]"
              >
                <span
                  className={cn(
                    "mt-1.5 size-2.5 shrink-0 rounded-full",
                    dotClass(entry.kind),
                  )}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {ACTIVITY_KIND_LABELS[entry.kind]}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {entry.message}
                  </p>
                </div>
                <time
                  className="shrink-0 whitespace-nowrap text-[11px] text-muted-foreground"
                  dateTime={new Date(
                    Number(entry.at / 1_000_000n),
                  ).toISOString()}
                >
                  {formatRelativeTime(entry.at)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
