/**
 * Students-per-class distribution as horizontal bars.
 *
 * Bars are scaled against the largest class so the shape of the distribution
 * stays readable even when counts are small.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCount, formatKhmerNumber } from "@/lib/format";
import type { ClassDistribution } from "@/types";
import { BarChart3 } from "lucide-react";

export function ClassDistributionChart({
  data,
  isLoading,
}: {
  data: ClassDistribution[];
  isLoading: boolean;
}) {
  const max = data.reduce(
    (acc, item) => Math.max(acc, Number(item.studentCount)),
    0,
  );
  const total = data.reduce((acc, item) => acc + Number(item.studentCount), 0);

  return (
    <Card
      data-ocid="dashboard.distribution_card"
      className="rounded-lg border-border shadow-none"
    >
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 border-b border-border px-4 py-3 md:px-5">
        <div className="min-w-0">
          <CardTitle className="font-display text-sm font-bold tracking-tight">
            ការចែកចាយសិស្សតាមថ្នាក់រៀន
          </CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">
            ចំនួនសិស្សក្នុងមួយថ្នាក់
          </p>
        </div>
        {!isLoading && data.length > 0 ? (
          <span
            data-numeric
            className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
          >
            {formatCount(total)} សិស្ស
          </span>
        ) : null}
      </CardHeader>

      <CardContent className="p-4 md:p-5">
        {isLoading ? (
          <div
            className="space-y-4"
            data-ocid="dashboard.distribution.loading_state"
          >
            {Array.from({ length: 5 }, (_, i) => `dist-skeleton-${i}`).map(
              (id) => (
                <div key={id} className="space-y-2">
                  <Skeleton className="h-3.5 w-32 rounded-sm" />
                  <Skeleton className="h-2.5 w-full rounded-full" />
                </div>
              ),
            )}
          </div>
        ) : data.length === 0 ? (
          <div
            data-ocid="dashboard.distribution.empty_state"
            className="flex flex-col items-center gap-2 py-10 text-center"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-muted">
              <BarChart3
                className="size-5 text-muted-foreground"
                aria-hidden="true"
              />
            </span>
            <p className="text-sm font-medium">មិនទាន់មានទិន្នន័យថ្នាក់រៀន</p>
            <p className="max-w-xs text-xs text-muted-foreground">
              នៅពេលអ្នកបន្ថែមថ្នាក់រៀន និងចុះឈ្មោះសិស្ស ការចែកចាយនឹងបង្ហាញនៅទីនេះ។
            </p>
          </div>
        ) : (
          <ul className="space-y-4" data-ocid="dashboard.distribution.list">
            {data.map((item, index) => {
              const count = Number(item.studentCount);
              const width = max > 0 ? Math.max(4, (count / max) * 100) : 0;
              return (
                <li
                  key={item.classId.toString()}
                  data-ocid={`dashboard.distribution.item.${index + 1}`}
                  className="space-y-1.5"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="min-w-0 truncate text-sm font-medium">
                      {item.className}
                    </span>
                    <span
                      data-numeric
                      className="shrink-0 text-xs text-muted-foreground"
                    >
                      {formatKhmerNumber(item.studentCount)} នាក់
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-accent transition-smooth"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
