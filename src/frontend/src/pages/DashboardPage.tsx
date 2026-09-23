/**
 * Dashboard: KPI row, students-per-class distribution, and recent activity.
 *
 * Data comes from `useDashboardStats` and `useRecentActivity`; every surface
 * has a layout-matched loading skeleton and a Khmer empty state.
 */

import { ClassDistributionChart } from "@/components/dashboard/ClassDistributionChart";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RecentActivityPanel } from "@/components/dashboard/RecentActivityPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats, useRecentActivity } from "@/hooks/useQueries";
import { formatCount, formatKhmerNumber } from "@/lib/format";
import {
  AlertTriangle,
  GraduationCap,
  School,
  UserSquare2,
  Users,
} from "lucide-react";

const ACTIVITY_LIMIT = 8;

export function DashboardPage() {
  const statsQuery = useDashboardStats();
  const activityQuery = useRecentActivity(ACTIVITY_LIMIT);

  const stats = statsQuery.data ?? null;
  const activity = activityQuery.data ?? [];
  const isLoading = statsQuery.isLoading || activityQuery.isLoading;
  const isError = statsQuery.isError || activityQuery.isError;

  const kpis = [
    {
      key: "students",
      label: "សិស្សសរុប",
      value: stats ? formatKhmerNumber(stats.studentCount) : "—",
      hint: stats ? `${formatCount(stats.studentCount)} នាក់` : undefined,
      icon: GraduationCap,
      tone: "primary" as const,
      seed: Number(stats?.studentCount ?? 0),
      ocid: "dashboard.kpi.students",
    },
    {
      key: "teachers",
      label: "គ្រូបង្រៀនសរុប",
      value: stats ? formatKhmerNumber(stats.teacherCount) : "—",
      hint: stats ? `${formatCount(stats.teacherCount)} នាក់` : undefined,
      icon: UserSquare2,
      tone: "accent" as const,
      seed: Number(stats?.teacherCount ?? 0),
      ocid: "dashboard.kpi.teachers",
    },
    {
      key: "classes",
      label: "ថ្នាក់រៀនសរុប",
      value: stats ? formatKhmerNumber(stats.classCount) : "—",
      hint: stats ? `${formatCount(stats.classCount)} ថ្នាក់` : undefined,
      icon: School,
      tone: "chart3" as const,
      seed: Number(stats?.classCount ?? 0),
      ocid: "dashboard.kpi.classes",
    },
    {
      key: "enrollments",
      label: "ការចុះឈ្មោះសរុប",
      value: stats ? formatKhmerNumber(stats.enrollmentCount) : "—",
      hint: stats ? `${formatCount(stats.enrollmentCount)} កំណត់ត្រា` : undefined,
      icon: Users,
      tone: "chart4" as const,
      seed: Number(stats?.enrollmentCount ?? 0),
      ocid: "dashboard.kpi.enrollments",
    },
  ];

  return (
    <div className="space-y-5" data-ocid="dashboard.page">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">
          ផ្ទាំងគ្រប់គ្រងសាលា
        </h2>
        <p className="text-sm text-muted-foreground">
          ទិដ្ឋភាពរួមនៃសិស្ស គ្រូ ថ្នាក់រៀន និងការចុះឈ្មោះ
        </p>
      </div>

      {isError ? (
        <Card
          data-ocid="dashboard.error_state"
          className="rounded-lg border-destructive/40 shadow-none"
        >
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle
              className="size-5 shrink-0 text-destructive"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium">មិនអាចទាញទិន្នន័យបានទេ</p>
              <p className="text-xs text-muted-foreground">
                សូមព្យាយាមម្តងទៀត ឬផ្ទុកទំព័រឡើងវិញ។
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <section
        aria-label="ស្ថិតិសរុប"
        data-ocid="dashboard.kpi.section"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => `kpi-skeleton-${i}`).map(
              (id) => (
                <Card
                  key={id}
                  className="rounded-lg border-border shadow-none"
                  data-ocid="dashboard.kpi.loading_state"
                >
                  <CardContent className="space-y-3 p-4 md:p-5">
                    <Skeleton className="h-3.5 w-24 rounded-sm" />
                    <Skeleton className="h-9 w-20 rounded-md" />
                    <Skeleton className="h-3 w-16 rounded-sm" />
                  </CardContent>
                </Card>
              ),
            )
          : kpis.map((kpi) => (
              <KpiCard
                key={kpi.key}
                label={kpi.label}
                value={kpi.value}
                hint={kpi.hint}
                icon={kpi.icon}
                tone={kpi.tone}
                seed={kpi.seed}
                ocid={kpi.ocid}
              />
            ))}
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ClassDistributionChart
            data={stats?.studentsPerClass ?? []}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-1">
          <RecentActivityPanel entries={activity} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
