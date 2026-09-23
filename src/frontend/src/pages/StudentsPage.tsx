/**
 * Student directory: dense table on desktop, stacked cards on mobile.
 *
 * Search text, class filter, and status filter live in the URL query string so
 * the view survives a reload and can be shared.
 */

import { DeleteStudentDialog } from "@/components/students/DeleteStudentDialog";
import { StudentCardList } from "@/components/students/StudentCardList";
import { StudentFormDialog } from "@/components/students/StudentFormDialog";
import { StudentsTable } from "@/components/students/StudentsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminAccess } from "@/hooks/useAuth";
import { useClasses, useStudents } from "@/hooks/useQueries";
import { formatCount } from "@/lib/format";
import { STUDENT_STATUS_OPTIONS } from "@/lib/labels";
import type { Id, Student, StudentFilter, StudentStatus } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { GraduationCap, Plus, Search, UserPlus, X } from "lucide-react";
import { useMemo, useState } from "react";

const ALL = "all";

export function StudentsPage() {
  const search = useSearch({ from: "/students" });
  const navigate = useNavigate({ from: "/students" });
  const { isAdmin } = useAdminAccess();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState<Student | null>(null);

  const classId = search.classId;
  const status = search.status;

  const parsedClassId = useMemo<Id | undefined>(() => {
    if (!classId) return undefined;
    try {
      return BigInt(classId);
    } catch {
      return undefined;
    }
  }, [classId]);

  const filter = useMemo<StudentFilter>(
    () => ({
      search: search.q,
      classId: parsedClassId,
      status: status as StudentStatus | undefined,
    }),
    [search.q, parsedClassId, status],
  );

  const studentsQuery = useStudents(filter);
  const classesQuery = useClasses();

  const classesById = useMemo(
    () =>
      new Map(
        (classesQuery.data ?? []).map((item) => [item.id.toString(), item]),
      ),
    [classesQuery.data],
  );

  const students = studentsQuery.data ?? [];
  const hasActiveFilters = Boolean(search.q || classId || status);

  const updateSearch = (patch: {
    q?: string | undefined;
    classId?: string | undefined;
    status?: string | undefined;
  }) => {
    void navigate({
      search: (prev) => ({ ...prev, ...patch }),
      replace: true,
    });
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (student: Student) => {
    setEditing(student);
    setFormOpen(true);
  };

  return (
    <div className="space-y-4" data-ocid="student.page">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">
            បញ្ជីសិស្ស
          </h2>
          <p className="text-sm text-muted-foreground">
            {studentsQuery.isLoading
              ? "កំពុងផ្ទុក…"
              : `រកឃើញ ${formatCount(students.length)} នាក់`}
          </p>
        </div>
        {isAdmin ? (
          <Button
            type="button"
            onClick={openCreate}
            data-ocid="student.add_button"
            className="rounded-md"
          >
            <Plus className="size-4" aria-hidden="true" />
            បន្ថែមសិស្ស
          </Button>
        ) : null}
      </div>

      <Card className="rounded-lg border-border shadow-none">
        <CardContent className="flex flex-col gap-3 p-3 md:flex-row md:items-center md:p-4">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={search.q ?? ""}
              onChange={(event) =>
                updateSearch({ q: event.target.value || undefined })
              }
              placeholder="ស្វែងរកតាមឈ្មោះ ឬលេខទូរស័ព្ទ…"
              aria-label="ស្វែងរកសិស្ស"
              data-ocid="student.search_input"
              className="h-10 rounded-md pl-8"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Select
              value={classId ?? ALL}
              onValueChange={(value) =>
                updateSearch({ classId: value === ALL ? undefined : value })
              }
            >
              <SelectTrigger
                aria-label="តម្រងតាមថ្នាក់រៀន"
                data-ocid="student.class_filter"
                className="h-10 rounded-md sm:w-48"
              >
                <SelectValue placeholder="ថ្នាក់រៀនទាំងអស់" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>ថ្នាក់រៀនទាំងអស់</SelectItem>
                {(classesQuery.data ?? []).map((item) => (
                  <SelectItem
                    key={item.id.toString()}
                    value={item.id.toString()}
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={status ?? ALL}
              onValueChange={(value) =>
                updateSearch({ status: value === ALL ? undefined : value })
              }
            >
              <SelectTrigger
                aria-label="តម្រងតាមស្ថានភាព"
                data-ocid="student.status_filter"
                className="h-10 rounded-md sm:w-44"
              >
                <SelectValue placeholder="ស្ថានភាពទាំងអស់" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>ស្ថានភាពទាំងអស់</SelectItem>
                {STUDENT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  updateSearch({
                    q: undefined,
                    classId: undefined,
                    status: undefined,
                  })
                }
                data-ocid="student.clear_filters_button"
                className="h-10 rounded-md text-muted-foreground"
              >
                <X className="size-4" aria-hidden="true" />
                សម្អាតតម្រង
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {studentsQuery.isLoading ? (
        <div className="space-y-2" data-ocid="student.loading_state">
          {Array.from({ length: 6 }, (_, i) => `student-skeleton-${i}`).map(
            (id) => (
              <Skeleton key={id} className="h-11 w-full rounded-md" />
            ),
          )}
        </div>
      ) : studentsQuery.isError ? (
        <Card
          className="rounded-lg border-destructive/30 shadow-none"
          data-ocid="student.error_state"
        >
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <h3 className="font-display text-base font-bold">
              មិនអាចផ្ទុកបញ្ជីសិស្សបានទេ
            </h3>
            <p className="text-sm text-muted-foreground">
              មានបញ្ហាក្នុងការទាញយកទិន្នន័យ។ សូមព្យាយាមម្តងទៀត។
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => void studentsQuery.refetch()}
              data-ocid="student.retry_button"
              className="rounded-md"
            >
              ព្យាយាមម្តងទៀត
            </Button>
          </CardContent>
        </Card>
      ) : students.length === 0 ? (
        <Card
          className="rounded-lg border-border shadow-none"
          data-ocid="student.empty_state"
        >
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted">
              {hasActiveFilters ? (
                <Search
                  className="size-5 text-muted-foreground"
                  aria-hidden="true"
                />
              ) : (
                <GraduationCap
                  className="size-5 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
            </span>
            <h3 className="font-display text-base font-bold tracking-tight">
              {hasActiveFilters ? "រកមិនឃើញសិស្សតាមលក្ខខណ្ឌ" : "មិនទាន់មានសិស្សនៅឡើយ"}
            </h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              {hasActiveFilters
                ? "សូមសាកល្បងផ្លាស់ប្តូរពាក្យស្វែងរក ឬសម្អាតតម្រងដើម្បីមើលសិស្សទាំងអស់។"
                : "ចាប់ផ្តើមដោយបន្ថែមសិស្សដំបូងចូលបញ្ជីឈ្មោះសាលារៀន។"}
            </p>
            {hasActiveFilters ? (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  updateSearch({
                    q: undefined,
                    classId: undefined,
                    status: undefined,
                  })
                }
                data-ocid="student.empty.clear_button"
                className="rounded-md"
              >
                សម្អាតតម្រង
              </Button>
            ) : isAdmin ? (
              <Button
                type="button"
                onClick={openCreate}
                data-ocid="student.empty.add_button"
                className="rounded-md"
              >
                <UserPlus className="size-4" aria-hidden="true" />
                បន្ថែមសិស្ស
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <>
          <StudentsTable
            students={students}
            classesById={classesById}
            isAdmin={isAdmin}
            onEdit={openEdit}
            onDelete={setDeleting}
          />
          <StudentCardList
            students={students}
            classesById={classesById}
            isAdmin={isAdmin}
            onEdit={openEdit}
            onDelete={setDeleting}
          />
        </>
      )}

      <StudentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        student={editing}
      />
      <DeleteStudentDialog
        student={deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      />
    </div>
  );
}
