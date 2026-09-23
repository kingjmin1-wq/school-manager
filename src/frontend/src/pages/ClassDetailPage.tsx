/**
 * Class detail page: class information, homeroom teacher, capacity usage, and
 * the enrolled-student roster with admin-only enroll/remove actions.
 */

import { CapacityMeter } from "@/components/classes/CapacityMeter";
import { ClassFormDialog } from "@/components/classes/ClassFormDialog";
import { ClassRosterPanel } from "@/components/classes/ClassRosterPanel";
import { DeleteClassDialog } from "@/components/classes/DeleteClassDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useClass, useIsAdmin, useTeacher } from "@/hooks/useQueries";
import { formatKhmerNumber } from "@/lib/format";
import type { Class, Id } from "@/types";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  Layers,
  Mail,
  Pencil,
  Phone,
  School,
  Trash2,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof School;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-md border border-border bg-background px-3 py-2.5">
      <Icon
        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-4" data-ocid="class.detail.loading_state">
      <Skeleton className="h-8 w-64 rounded-md" />
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}

export function ClassDetailPage() {
  const { id } = useParams({ from: "/classes/$id" });
  const navigate = useNavigate();
  const classId = useMemo<Id | null>(() => {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  }, [id]);

  const { data: classRecord, isLoading, isError, refetch } = useClass(classId);
  const { data: isAdmin = false } = useIsAdmin();
  const { data: teacher } = useTeacher(classRecord?.homeroomTeacherId ?? null);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) return <DetailSkeleton />;

  if (isError) {
    return (
      <Card className="rounded-lg border-border shadow-none">
        <CardContent
          className="flex flex-col items-center gap-3 p-8 text-center"
          data-ocid="class.detail.error_state"
        >
          <p className="font-display text-sm font-semibold">
            មិនអាចផ្ទុកព័ត៌មានថ្នាក់រៀនបានទេ
          </p>
          <p className="text-sm text-muted-foreground">
            មានបញ្ហាក្នុងការទាញទិន្នន័យពីប្រព័ន្ធ។ សូមព្យាយាមម្តងទៀត។
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => void refetch()}
            data-ocid="class.detail.retry_button"
            className="rounded-md"
          >
            ព្យាយាមម្តងទៀត
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!classRecord) {
    return (
      <Card className="rounded-lg border-border shadow-none">
        <CardContent
          className="flex flex-col items-center gap-3 p-10 text-center"
          data-ocid="class.detail.not_found_state"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-muted">
            <School
              className="size-6 text-muted-foreground"
              aria-hidden="true"
            />
          </span>
          <p className="font-display text-base font-bold tracking-tight">
            រកមិនឃើញថ្នាក់រៀននេះទេ
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            ថ្នាក់រៀននេះអាចត្រូវបានលុប ឬលេខសម្គាល់មិនត្រឹមត្រូវ។
          </p>
          <Button
            type="button"
            variant="outline"
            asChild
            className="mt-1 rounded-md"
          >
            <Link to="/classes" data-ocid="class.detail.back_button">
              ត្រឡប់ទៅបញ្ជីថ្នាក់រៀន
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const teacherLabel = teacher
    ? teacher.name
    : classRecord.homeroomTeacherId !== undefined
      ? "មិនស្គាល់"
      : "មិនទាន់កំណត់";

  return (
    <div className="space-y-4" data-ocid="class.detail.page">
      <nav
        aria-label="ផ្លូវរុករក"
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link
          to="/classes"
          className="transition-smooth hover:text-foreground"
          data-ocid="class.detail.breadcrumb_link"
        >
          ថ្នាក់រៀន
        </Link>
        <ArrowRight className="size-3" aria-hidden="true" />
        <span className="truncate text-foreground">{classRecord.name}</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <School className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-display text-xl font-bold tracking-tight md:text-2xl">
              {classRecord.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {classRecord.gradeLevel}
            </p>
          </div>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormOpen(true)}
              data-ocid="class.detail.edit_button"
              className="rounded-md"
            >
              <Pencil className="size-4" aria-hidden="true" />
              កែប្រែ
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(true)}
              data-ocid="class.detail.delete_button"
              className="rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              លុប
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-lg border-border shadow-none lg:col-span-2">
          <CardContent className="space-y-4 p-4">
            <h3 className="font-display text-sm font-bold tracking-tight">
              ព័ត៌មានថ្នាក់រៀន
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoTile
                icon={Layers}
                label="កម្រិតថ្នាក់"
                value={classRecord.gradeLevel}
              />
              <InfoTile
                icon={UserRound}
                label="គ្រូបន្ទុកថ្នាក់"
                value={teacherLabel}
              />
              <InfoTile
                icon={CalendarDays}
                label="ចំនួនសិស្សបានចុះឈ្មោះ"
                value={`${formatKhmerNumber(classRecord.enrolledCount)} នាក់`}
              />
              <InfoTile
                icon={School}
                label="ចំណុះថ្នាក់"
                value={`${formatKhmerNumber(classRecord.capacity)} នាក់`}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-border shadow-none">
          <CardContent className="space-y-4 p-4">
            <h3 className="font-display text-sm font-bold tracking-tight">
              ការប្រើប្រាស់ចំណុះ
            </h3>
            <CapacityMeter
              enrolled={classRecord.enrolledCount}
              capacity={classRecord.capacity}
            />
            {teacher ? (
              <div className="space-y-2 border-t border-border pt-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  ទំនាក់ទំនងគ្រូបន្ទុក
                </p>
                <p className="flex min-w-0 items-center gap-1.5 text-sm">
                  <UserRound
                    className="size-3.5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="truncate">{teacher.name}</span>
                </p>
                <p className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{teacher.email || "—"}</span>
                </p>
                <p className="tabular flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
                  <Phone className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{teacher.phone || "—"}</span>
                </p>
              </div>
            ) : (
              <p className="border-t border-border pt-3 text-sm text-muted-foreground">
                មិនទាន់មានគ្រូបន្ទុកថ្នាក់ត្រូវបានចាត់តាំងទេ។
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <ClassRosterPanel classRecord={classRecord} isAdmin={isAdmin} />

      {isAdmin && (
        <>
          <ClassFormDialog
            open={formOpen}
            onOpenChange={setFormOpen}
            classRecord={classRecord}
          />
          <DeleteClassDialog
            classRecord={deleteOpen ? classRecord : null}
            onOpenChange={setDeleteOpen}
            onDeleted={() => void navigate({ to: "/classes" })}
          />
        </>
      )}
    </div>
  );
}
