/**
 * Teacher detail: full contact information, subject, and the classes where
 * this teacher is the homeroom teacher.
 */

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useClasses, useTeacher } from "@/hooks/useQueries";
import { formatCount, initials } from "@/lib/format";
import type { Id } from "@/types";
import { Link, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Mail,
  Phone,
  School,
} from "lucide-react";
import { useMemo } from "react";

const DETAIL_SKELETON_IDS = Array.from(
  { length: 4 },
  (_, i) => `teacher-detail-skeleton-${i}`,
);

function InfoRow({
  icon: Icon,
  label,
  value,
  numeric,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  numeric?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-border py-3 last:border-b-0">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className={`mt-0.5 break-words text-sm ${numeric ? "tabular" : ""}`}>
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export function TeacherDetailPage() {
  const { id } = useParams({ from: "/teachers/$id" });
  const teacherId = useMemo<Id | null>(() => {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  }, [id]);

  const teacherQuery = useTeacher(teacherId);
  const classesQuery = useClasses(
    teacherId !== null ? { homeroomTeacherId: teacherId } : {},
  );

  const teacher = teacherQuery.data ?? null;
  const homeroomClasses = classesQuery.data ?? [];

  if (teacherQuery.isLoading) {
    return (
      <div className="space-y-4" data-ocid="teacher.detail.loading_state">
        <Skeleton className="h-8 w-40 rounded-md" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-64 rounded-lg lg:col-span-2" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  if (teacherQuery.isError) {
    return (
      <Card
        className="mx-auto max-w-md rounded-lg border-border shadow-none"
        data-ocid="teacher.detail.error_state"
      >
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle
              className="size-5 text-destructive"
              aria-hidden="true"
            />
          </span>
          <h2 className="font-display text-lg font-bold tracking-tight">
            មិនអាចទាញយកព័ត៌មានគ្រូបានទេ
          </h2>
          <p className="text-sm text-muted-foreground">
            មានបញ្ហាក្នុងការភ្ជាប់ទៅប្រព័ន្ធ។ សូមព្យាយាមម្តងទៀត។
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => void teacherQuery.refetch()}
            data-ocid="teacher.detail.retry_button"
            className="rounded-md"
          >
            ព្យាយាមម្តងទៀត
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!teacher) {
    return (
      <Card
        className="mx-auto max-w-md rounded-lg border-border shadow-none"
        data-ocid="teacher.detail.empty_state"
      >
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-muted">
            <AlertCircle
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />
          </span>
          <h2 className="font-display text-lg font-bold tracking-tight">
            រកមិនឃើញគ្រូនេះទេ
          </h2>
          <p className="text-sm text-muted-foreground">
            គ្រូនេះអាចត្រូវបានលុប ឬលេខសម្គាល់មិនត្រឹមត្រូវ។
          </p>
          <Button
            type="button"
            variant="outline"
            asChild
            className="rounded-md"
          >
            <Link to="/teachers" data-ocid="teacher.detail.back_button">
              ត្រឡប់ទៅបញ្ជីគ្រូ
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4" data-ocid="teacher.detail.page">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        asChild
        className="-ml-2 rounded-md text-muted-foreground"
      >
        <Link to="/teachers" data-ocid="teacher.detail.back_button">
          <ArrowLeft className="size-4" aria-hidden="true" />
          ត្រឡប់ទៅបញ្ជីគ្រូ
        </Link>
      </Button>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-lg border-border shadow-none lg:col-span-2">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center gap-4">
              <Avatar className="size-14 shrink-0">
                <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
                  {initials(teacher.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <CardTitle className="truncate font-display text-xl font-bold tracking-tight">
                  {teacher.name}
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="mt-1.5 rounded-md font-normal text-secondary-foreground"
                >
                  <BookOpen className="size-3.5" aria-hidden="true" />
                  {teacher.subject}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <InfoRow icon={Mail} label="អ៊ីមែល" value={teacher.email} />
            <InfoRow
              icon={Phone}
              label="លេខទូរស័ព្ទ"
              value={teacher.phone}
              numeric
            />
            <InfoRow
              icon={BookOpen}
              label="មុខវិជ្ជាបង្រៀន"
              value={teacher.subject}
            />
          </CardContent>
        </Card>

        <Card className="rounded-lg border-border shadow-none">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2 font-display text-base font-bold tracking-tight">
              <School
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              ថ្នាក់រៀនដែលជាគ្រូបន្ទុក
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {classesQuery.isLoading ? (
              <div
                className="space-y-2"
                data-ocid="teacher.detail.classes_loading"
              >
                {DETAIL_SKELETON_IDS.map((id) => (
                  <Skeleton key={id} className="h-10 w-full rounded-md" />
                ))}
              </div>
            ) : homeroomClasses.length === 0 ? (
              <p
                className="py-6 text-center text-sm text-muted-foreground"
                data-ocid="teacher.detail.classes_empty_state"
              >
                គ្រូនេះមិនទាន់ទទួលបន្ទុកថ្នាក់រៀនណាមួយនៅឡើយទេ។
              </p>
            ) : (
              <ul className="space-y-2" data-ocid="teacher.detail.classes_list">
                {homeroomClasses.map((klass, index) => (
                  <li key={klass.id.toString()}>
                    <Link
                      to="/classes/$id"
                      params={{ id: klass.id.toString() }}
                      data-ocid={`teacher.detail.class_link.${index + 1}`}
                      className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 transition-smooth hover:border-accent hover:bg-accent/10"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {klass.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          កម្រិត {klass.gradeLevel}
                        </span>
                      </span>
                      <span className="tabular shrink-0 text-xs text-muted-foreground">
                        {formatCount(klass.enrolledCount)}/
                        {formatCount(klass.capacity)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
