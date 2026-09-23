/**
 * Roster panel for a class detail page: enrolled students with the ability to
 * enroll another student or remove an existing enrollment. Admin-only actions.
 */

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAddEnrollment,
  useEnrollments,
  useRemoveEnrollment,
  useStudents,
} from "@/hooks/useQueries";
import { formatKhmerNumber, initials } from "@/lib/format";
import { GENDER_LABELS, STUDENT_STATUS_LABELS } from "@/lib/labels";
import type { Class, Enrollment, Id, Student } from "@/types";
import { Loader2, Search, UserMinus, UserPlus, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

function EnrollDialog({
  classRecord,
  enrolledStudentIds,
  open,
  onOpenChange,
}: {
  classRecord: Class;
  enrolledStudentIds: Set<string>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: students = [], isLoading } = useStudents();
  const addEnrollment = useAddEnrollment();
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");

  const available = useMemo(() => {
    const term = search.trim().toLowerCase();
    return students
      .filter((student) => !enrolledStudentIds.has(student.id.toString()))
      .filter((student) => !term || student.name.toLowerCase().includes(term));
  }, [students, enrolledStudentIds, search]);

  const isFull =
    classRecord.capacity > 0n &&
    classRecord.enrolledCount >= classRecord.capacity;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedId) {
      toast.error("សូមជ្រើសរើសសិស្សដើម្បីចុះឈ្មោះ។");
      return;
    }
    addEnrollment.mutate(
      { studentId: BigInt(selectedId), classId: classRecord.id },
      {
        onSuccess: () => {
          toast.success("បានចុះឈ្មោះសិស្សចូលថ្នាក់រួចរាល់");
          setSelectedId("");
          setSearch("");
          onOpenChange(false);
        },
        onError: () => toast.error("មិនអាចចុះឈ្មោះសិស្សបានទេ។"),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-lg border-border shadow-overlay sm:max-w-md"
        data-ocid="enrollment.add.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display">ចុះឈ្មោះសិស្សចូលថ្នាក់</DialogTitle>
          <DialogDescription>
            ជ្រើសរើសសិស្សដើម្បីចុះឈ្មោះចូល «{classRecord.name}»។
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="enroll-search">ស្វែងរកសិស្ស</Label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="enroll-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ឈ្មោះសិស្ស…"
                data-ocid="enrollment.add.search_input"
                className="rounded-md pl-8"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="enroll-student">សិស្ស</Label>
            <Select
              value={selectedId}
              onValueChange={setSelectedId}
              disabled={isLoading || available.length === 0}
            >
              <SelectTrigger
                id="enroll-student"
                data-ocid="enrollment.add.student_select"
                className="w-full rounded-md"
              >
                <SelectValue
                  placeholder={
                    isLoading
                      ? "កំពុងផ្ទុក…"
                      : available.length === 0
                        ? "គ្មានសិស្សអាចចុះឈ្មោះ"
                        : "ជ្រើសរើសសិស្ស"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {available.map((student) => (
                  <SelectItem
                    key={student.id.toString()}
                    value={student.id.toString()}
                  >
                    {student.name} · {STUDENT_STATUS_LABELS[student.status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isFull && (
            <p
              data-ocid="enrollment.add.capacity_warning"
              className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            >
              ថ្នាក់នេះពេញចំណុះហើយ។ មិនអាចចុះឈ្មោះសិស្សបន្ថែមបានទេ។
            </p>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-ocid="enrollment.add.cancel_button"
              className="rounded-md"
            >
              បោះបង់
            </Button>
            <Button
              type="submit"
              disabled={addEnrollment.isPending || !selectedId || isFull}
              data-ocid="enrollment.add.submit_button"
              className="rounded-md"
            >
              {addEnrollment.isPending && (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              )}
              ចុះឈ្មោះ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RosterRow({
  enrollment,
  student,
  isAdmin,
  onRemove,
  isRemoving,
}: {
  enrollment: Enrollment;
  student: Student | undefined;
  isAdmin: boolean;
  onRemove: (enrollment: Enrollment) => void;
  isRemoving: boolean;
}) {
  const name = student?.name ?? "សិស្សមិនស្គាល់";
  return (
    <TableRow
      className="row-zebra h-11 border-border"
      data-ocid={`enrollment.item.${enrollment.id.toString()}`}
    >
      <TableCell className="py-0">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-secondary-foreground">
            {initials(name)}
          </span>
          <span className="truncate text-sm font-medium">{name}</span>
        </div>
      </TableCell>
      <TableCell className="py-0 text-sm text-muted-foreground">
        {student ? GENDER_LABELS[student.gender] : "—"}
      </TableCell>
      <TableCell className="py-0 text-sm text-muted-foreground">
        {student ? STUDENT_STATUS_LABELS[student.status] : "—"}
      </TableCell>
      <TableCell className="tabular py-0 text-right text-sm text-muted-foreground">
        {student?.guardianPhone ?? "—"}
      </TableCell>
      {isAdmin && (
        <TableCell className="py-0 text-right">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(enrollment)}
            disabled={isRemoving}
            aria-label={`ដក ${name} ចេញពីថ្នាក់`}
            data-ocid={`enrollment.remove_button.${enrollment.id.toString()}`}
            className="rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <UserMinus className="size-4" aria-hidden="true" />
            ដកចេញ
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
}

export function ClassRosterPanel({
  classRecord,
  isAdmin,
}: {
  classRecord: Class;
  isAdmin: boolean;
}) {
  const {
    data: enrollments = [],
    isLoading,
    isError,
  } = useEnrollments({
    classId: classRecord.id,
  });
  const { data: students = [] } = useStudents();
  const removeEnrollment = useRemoveEnrollment();
  const [enrollOpen, setEnrollOpen] = useState(false);

  const studentsById = useMemo(() => {
    const map = new Map<string, Student>();
    for (const student of students) map.set(student.id.toString(), student);
    return map;
  }, [students]);

  const enrolledStudentIds = useMemo(
    () => new Set(enrollments.map((entry) => entry.studentId.toString())),
    [enrollments],
  );

  const handleRemove = (enrollment: Enrollment) => {
    removeEnrollment.mutate(enrollment.id, {
      onSuccess: () => toast.success("បានដកសិស្សចេញពីថ្នាក់រួចរាល់"),
      onError: () => toast.error("មិនអាចដកសិស្សចេញបានទេ។"),
    });
  };

  return (
    <section
      aria-labelledby="roster-heading"
      data-ocid="class.roster.section"
      className="rounded-lg border border-border bg-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-muted-foreground" aria-hidden="true" />
          <h2
            id="roster-heading"
            className="font-display text-sm font-bold tracking-tight"
          >
            បញ្ជីសិស្សក្នុងថ្នាក់
          </h2>
          <span className="tabular rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
            {formatKhmerNumber(enrollments.length)}
          </span>
        </div>
        {isAdmin && (
          <Button
            type="button"
            size="sm"
            onClick={() => setEnrollOpen(true)}
            data-ocid="enrollment.add.open_modal_button"
            className="rounded-md"
          >
            <UserPlus className="size-4" aria-hidden="true" />
            ចុះឈ្មោះសិស្ស
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2 p-4" data-ocid="class.roster.loading_state">
          {Array.from({ length: 4 }, (_, i) => `roster-skeleton-${i}`).map(
            (id) => (
              <Skeleton key={id} className="h-11 w-full rounded-md" />
            ),
          )}
        </div>
      ) : isError ? (
        <p
          data-ocid="class.roster.error_state"
          className="px-4 py-8 text-center text-sm text-destructive"
        >
          មិនអាចផ្ទុកបញ្ជីសិស្សបានទេ។ សូមព្យាយាមម្តងទៀត។
        </p>
      ) : enrollments.length === 0 ? (
        <div
          data-ocid="class.roster.empty_state"
          className="flex flex-col items-center gap-2 px-4 py-10 text-center"
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-muted">
            <Users
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />
          </span>
          <p className="font-display text-sm font-semibold">
            មិនទាន់មានសិស្សក្នុងថ្នាក់នេះទេ
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {isAdmin
              ? "ចុះឈ្មោះសិស្សដំបូងដើម្បីចាប់ផ្តើមបង្កើតបញ្ជីឈ្មោះថ្នាក់។"
              : "គ្មានសិស្សត្រូវបានចុះឈ្មោះក្នុងថ្នាក់នេះនៅឡើយទេ។"}
          </p>
          {isAdmin && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setEnrollOpen(true)}
              data-ocid="enrollment.add.empty_button"
              className="mt-1 rounded-md"
            >
              <UserPlus className="size-4" aria-hidden="true" />
              ចុះឈ្មោះសិស្ស
            </Button>
          )}
        </div>
      ) : (
        <Table data-ocid="class.roster.table">
          <TableHeader className="sticky top-0 bg-card">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="h-9 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                ឈ្មោះសិស្ស
              </TableHead>
              <TableHead className="h-9 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                ភេទ
              </TableHead>
              <TableHead className="h-9 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                ស្ថានភាព
              </TableHead>
              <TableHead className="h-9 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                ទូរស័ព្ទអ្នកអភិបាល
              </TableHead>
              {isAdmin && <TableHead className="h-9 w-28" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments.map((enrollment) => (
              <RosterRow
                key={enrollment.id.toString()}
                enrollment={enrollment}
                student={studentsById.get(enrollment.studentId.toString())}
                isAdmin={isAdmin}
                onRemove={handleRemove}
                isRemoving={removeEnrollment.isPending}
              />
            ))}
          </TableBody>
        </Table>
      )}

      {isAdmin && (
        <EnrollDialog
          classRecord={classRecord}
          enrolledStudentIds={enrolledStudentIds}
          open={enrollOpen}
          onOpenChange={setEnrollOpen}
        />
      )}
    </section>
  );
}
