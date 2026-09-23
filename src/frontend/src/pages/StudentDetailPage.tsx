/**
 * Student profile: full record plus the classes the student is enrolled in.
 *
 * Admins can edit the record, enroll the student into a class, and remove an
 * enrollment; read-only users see the same data without the actions.
 */

import { DeleteStudentDialog } from "@/components/students/DeleteStudentDialog";
import { EnrollStudentDialog } from "@/components/students/EnrollStudentDialog";
import { StatusBadge } from "@/components/students/StatusBadge";
import { StudentFormDialog } from "@/components/students/StudentFormDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminAccess } from "@/hooks/useAuth";
import {
  useClasses,
  useEnrollments,
  useRemoveEnrollment,
  useStudent,
} from "@/hooks/useQueries";
import { formatCount, formatIsoDate, formatTimestamp } from "@/lib/format";
import { GENDER_LABELS } from "@/lib/labels";
import type { Class, Enrollment, Id } from "@/types";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  GraduationCap,
  Pencil,
  Phone,
  Plus,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

function ProfileRow({
  icon: Icon,
  label,
  value,
  numeric,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
  numeric?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd
          className={`truncate text-sm font-medium text-foreground ${numeric ? "tabular" : ""}`}
        >
          {value}
        </dd>
      </div>
    </div>
  );
}

export function StudentDetailPage() {
  const { id } = useParams({ from: "/students/$id" });
  const navigate = useNavigate();
  const { isAdmin } = useAdminAccess();

  const studentId = useMemo<Id | null>(() => {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  }, [id]);

  const studentQuery = useStudent(studentId);
  const enrollmentsQuery = useEnrollments(
    studentId !== null ? { studentId } : {},
  );
  const classesQuery = useClasses();
  const removeEnrollment = useRemoveEnrollment();

  const [formOpen, setFormOpen] = useState(false);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const classesById = useMemo(
    () =>
      new Map(
        (classesQuery.data ?? []).map((item) => [item.id.toString(), item]),
      ),
    [classesQuery.data],
  );

  const student = studentQuery.data ?? null;
  const enrollments = enrollmentsQuery.data ?? [];

  const handleRemove = (enrollment: Enrollment, className: string) => {
    removeEnrollment.mutate(enrollment.id, {
      onSuccess: () => toast.success(`បានដកចេញពី ${className} រួចរាល់`),
      onError: () => toast.error("មិនអាចដកចេញពីថ្នាក់បានទេ"),
    });
  };

  if (studentQuery.isLoading) {
    return (
      <div className="space-y-4" data-ocid="student.detail.loading_state">
        <Skeleton className="h-8 w-40 rounded-md" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-64 rounded-lg lg:col-span-2" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  if (studentQuery.isError || !student) {
    return (
      <Card
        className="mx-auto max-w-md rounded-lg border-border shadow-none"
        data-ocid="student.detail.error_state"
      >
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-muted">
            <UserRound
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />
          </span>
          <h2 className="font-display text-lg font-bold tracking-tight">
            រកមិនឃើញសិស្សនេះទេ
          </h2>
          <p className="text-sm text-muted-foreground">
            សិស្សដែលអ្នកកំពុងស្វែងរកអាចត្រូវបានលុប ឬលេខសម្គាល់មិនត្រឹមត្រូវ។
          </p>
          <Button
            type="button"
            variant="outline"
            asChild
            className="rounded-md"
          >
            <Link
              to="/students"
              search={{}}
              data-ocid="student.detail.back_button"
            >
              ត្រឡប់ទៅបញ្ជីសិស្ស
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4" data-ocid="student.detail.page">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          asChild
          className="-ml-2 rounded-md text-muted-foreground"
        >
          <Link
            to="/students"
            search={{}}
            data-ocid="student.detail.back_button"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            ត្រឡប់ទៅបញ្ជីសិស្ស
          </Link>
        </Button>
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormOpen(true)}
              data-ocid="student.detail.edit_button"
              className="rounded-md"
            >
              <Pencil className="size-4" aria-hidden="true" />
              កែប្រែ
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(true)}
              data-ocid="student.detail.delete_button"
              className="rounded-md text-destructive hover:text-destructive"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              លុប
            </Button>
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-lg border-border shadow-none lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 border-b border-border p-4 md:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground">
                {student.name.trim().slice(0, 1) || "?"}
              </span>
              <div className="min-w-0">
                <CardTitle className="truncate font-display text-lg font-bold tracking-tight">
                  {student.name}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  លេខសម្គាល់{" "}
                  <span className="tabular">{student.id.toString()}</span>
                </p>
              </div>
            </div>
            <StatusBadge status={student.status} />
          </CardHeader>
          <CardContent className="p-4 md:p-5">
            <dl className="divide-y divide-border">
              <ProfileRow
                icon={UserRound}
                label="ភេទ"
                value={GENDER_LABELS[student.gender]}
              />
              <ProfileRow
                icon={CalendarDays}
                label="ថ្ងៃកំណើត"
                value={formatIsoDate(student.dateOfBirth)}
                numeric
              />
              <ProfileRow
                icon={Users}
                label="អាណាព្យាបាល"
                value={student.guardianName || "—"}
              />
              <ProfileRow
                icon={Phone}
                label="ទូរស័ព្ទអាណាព្យាបាល"
                value={student.guardianPhone || "—"}
                numeric
              />
              <ProfileRow
                icon={CalendarDays}
                label="បានចុះឈ្មោះនៅ"
                value={formatTimestamp(student.createdAt)}
                numeric
              />
            </dl>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 border-b border-border p-4">
            <CardTitle className="font-display text-base font-bold tracking-tight">
              ថ្នាក់រៀនដែលបានចុះឈ្មោះ
            </CardTitle>
            <span className="tabular text-xs text-muted-foreground">
              {formatCount(enrollments.length)}
            </span>
          </CardHeader>
          <CardContent className="p-4">
            {isAdmin ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setEnrollOpen(true)}
                data-ocid="student.detail.enroll_button"
                className="mb-3 w-full rounded-md"
              >
                <Plus className="size-4" aria-hidden="true" />
                ចុះឈ្មោះចូលថ្នាក់
              </Button>
            ) : null}

            {enrollmentsQuery.isLoading ? (
              <div className="space-y-2" data-ocid="enrollment.loading_state">
                {Array.from(
                  { length: 3 },
                  (_, i) => `enroll-skeleton-${i}`,
                ).map((key) => (
                  <Skeleton key={key} className="h-12 w-full rounded-md" />
                ))}
              </div>
            ) : enrollments.length === 0 ? (
              <div
                className="flex flex-col items-center gap-2 rounded-md border border-dashed border-border px-4 py-8 text-center"
                data-ocid="enrollment.empty_state"
              >
                <GraduationCap
                  className="size-5 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="text-sm text-muted-foreground">
                  សិស្សនេះមិនទាន់ចុះឈ្មោះចូលថ្នាក់ណាមួយនៅឡើយទេ។
                </p>
              </div>
            ) : (
              <ul className="space-y-2" data-ocid="enrollment.list">
                {enrollments.map((enrollment, index) => {
                  const klass: Class | undefined = classesById.get(
                    enrollment.classId.toString(),
                  );
                  const className = klass?.name ?? "ថ្នាក់ដែលបានលុប";
                  return (
                    <li
                      key={enrollment.id.toString()}
                      data-ocid={`enrollment.item.${index + 1}`}
                      className="flex items-center justify-between gap-2 rounded-md border border-border bg-card px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {className}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {klass
                            ? `${klass.gradeLevel} · ${formatCount(klass.enrolledCount)}/${formatCount(klass.capacity)} សិស្ស`
                            : "ព័ត៌មានថ្នាក់មិនអាចរកបាន"}
                        </p>
                      </div>
                      {isAdmin ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`ដកចេញពី ${className}`}
                          onClick={() => handleRemove(enrollment, className)}
                          disabled={removeEnrollment.isPending}
                          data-ocid={`enrollment.remove_button.${index + 1}`}
                          className="size-8 shrink-0 rounded-md text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </Button>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <StudentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        student={student}
      />
      <EnrollStudentDialog
        open={enrollOpen}
        onOpenChange={setEnrollOpen}
        student={student}
      />
      <DeleteStudentDialog
        student={deleteOpen ? student : null}
        onOpenChange={(open) => {
          if (!open) setDeleteOpen(false);
        }}
        onDeleted={() => void navigate({ to: "/students", search: {} })}
      />
    </div>
  );
}
