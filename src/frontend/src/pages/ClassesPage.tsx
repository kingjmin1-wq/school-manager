/**
 * Class list page: dense table on desktop, stacked cards on mobile.
 *
 * Admin users can create, edit, and delete classes; read-only users see the
 * same data without the mutation affordances.
 */

import { CapacityMeter } from "@/components/classes/CapacityMeter";
import { ClassFormDialog } from "@/components/classes/ClassFormDialog";
import { DeleteClassDialog } from "@/components/classes/DeleteClassDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClasses, useIsAdmin, useTeachers } from "@/hooks/useQueries";
import { formatKhmerNumber } from "@/lib/format";
import type { Class, Id } from "@/types";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  ChevronRight,
  Pencil,
  Plus,
  School,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";

function teacherName(
  teacherId: Id | undefined,
  teachersById: Map<string, string>,
): string {
  if (teacherId === undefined) return "មិនទាន់កំណត់";
  return teachersById.get(teacherId.toString()) ?? "មិនស្គាល់";
}

function ClassRow({
  classRecord,
  teacherLabel,
  isAdmin,
  onEdit,
  onDelete,
}: {
  classRecord: Class;
  teacherLabel: string;
  isAdmin: boolean;
  onEdit: (classRecord: Class) => void;
  onDelete: (classRecord: Class) => void;
}) {
  return (
    <TableRow
      className="row-zebra h-11 border-border"
      data-ocid={`class.row.${classRecord.id.toString()}`}
    >
      <TableCell className="py-0">
        <Link
          to="/classes/$id"
          params={{ id: classRecord.id.toString() }}
          data-ocid={`class.link.${classRecord.id.toString()}`}
          className="group flex min-w-0 items-center gap-2"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <School className="size-3.5" aria-hidden="true" />
          </span>
          <span className="truncate text-sm font-medium group-hover:text-primary">
            {classRecord.name}
          </span>
        </Link>
      </TableCell>
      <TableCell className="py-0 text-sm text-muted-foreground">
        {classRecord.gradeLevel}
      </TableCell>
      <TableCell className="py-0">
        <span className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
          <UserRound className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{teacherLabel}</span>
        </span>
      </TableCell>
      <TableCell className="w-48 py-0">
        <CapacityMeter
          enrolled={classRecord.enrolledCount}
          capacity={classRecord.capacity}
        />
      </TableCell>
      <TableCell className="py-0 text-right">
        <div className="flex items-center justify-end gap-1">
          {isAdmin && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onEdit(classRecord)}
                aria-label={`កែប្រែ ${classRecord.name}`}
                data-ocid={`class.edit_button.${classRecord.id.toString()}`}
                className="size-8 rounded-md"
              >
                <Pencil className="size-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onDelete(classRecord)}
                aria-label={`លុប ${classRecord.name}`}
                data-ocid={`class.delete_button.${classRecord.id.toString()}`}
                className="size-8 rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </Button>
            </>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            asChild
            className="size-8 rounded-md"
          >
            <Link
              to="/classes/$id"
              params={{ id: classRecord.id.toString() }}
              aria-label={`មើលព័ត៌មានលម្អិត ${classRecord.name}`}
              data-ocid={`class.detail_button.${classRecord.id.toString()}`}
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function ClassCard({
  classRecord,
  teacherLabel,
  isAdmin,
  onEdit,
  onDelete,
}: {
  classRecord: Class;
  teacherLabel: string;
  isAdmin: boolean;
  onEdit: (classRecord: Class) => void;
  onDelete: (classRecord: Class) => void;
}) {
  return (
    <Card
      className="rounded-lg border-border shadow-none"
      data-ocid={`class.card.${classRecord.id.toString()}`}
    >
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to="/classes/$id"
              params={{ id: classRecord.id.toString() }}
              className="block truncate font-display text-sm font-bold tracking-tight hover:text-primary"
            >
              {classRecord.name}
            </Link>
            <p className="text-xs text-muted-foreground">
              {classRecord.gradeLevel}
            </p>
          </div>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <School className="size-4" aria-hidden="true" />
          </span>
        </div>

        <p className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          <UserRound className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{teacherLabel}</span>
        </p>

        <CapacityMeter
          enrolled={classRecord.enrolledCount}
          capacity={classRecord.capacity}
        />

        <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            asChild
            className="rounded-md"
          >
            <Link
              to="/classes/$id"
              params={{ id: classRecord.id.toString() }}
              data-ocid={`class.detail_button.${classRecord.id.toString()}`}
            >
              មើលលម្អិត
            </Link>
          </Button>
          {isAdmin && (
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onEdit(classRecord)}
                aria-label={`កែប្រែ ${classRecord.name}`}
                data-ocid={`class.edit_button.${classRecord.id.toString()}`}
                className="size-9 rounded-md"
              >
                <Pencil className="size-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onDelete(classRecord)}
                aria-label={`លុប ${classRecord.name}`}
                data-ocid={`class.delete_button.${classRecord.id.toString()}`}
                className="size-9 rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ClassesPage() {
  const search = useSearch({ from: "/classes" });
  const navigate = useNavigate({ from: "/classes" });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Class | null>(null);
  const [deleting, setDeleting] = useState<Class | null>(null);

  const setSearch = (value: string) => {
    void navigate({
      search: (prev) => ({ ...prev, q: value || undefined }),
      replace: true,
    });
  };

  const term = (search.q ?? "").trim().toLowerCase();

  const { data: classes = [], isLoading, isError, refetch } = useClasses();
  const { data: teachers = [] } = useTeachers();
  const { data: isAdmin = false } = useIsAdmin();

  const teachersById = useMemo(() => {
    const map = new Map<string, string>();
    for (const teacher of teachers)
      map.set(teacher.id.toString(), teacher.name);
    return map;
  }, [teachers]);

  const filtered = useMemo(() => {
    if (!term) return classes;
    return classes.filter(
      (classRecord) =>
        classRecord.name.toLowerCase().includes(term) ||
        classRecord.gradeLevel.toLowerCase().includes(term),
    );
  }, [classes, term]);

  const totalEnrolled = useMemo(
    () => classes.reduce((sum, item) => sum + item.enrolledCount, 0n),
    [classes],
  );

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (classRecord: Class) => {
    setEditing(classRecord);
    setFormOpen(true);
  };

  return (
    <div className="space-y-4" data-ocid="classes.page">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">
            ថ្នាក់រៀន
          </h2>
          <p className="text-sm text-muted-foreground">
            គ្រប់គ្រងថ្នាក់រៀន គ្រូបន្ទុក និងចំណុះថ្នាក់។
          </p>
        </div>
        {isAdmin && (
          <Button
            type="button"
            onClick={openCreate}
            data-ocid="class.add_button"
            className="rounded-md"
          >
            <Plus className="size-4" aria-hidden="true" />
            បន្ថែមថ្នាក់រៀន
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={search.q ?? ""}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ស្វែងរកថ្នាក់រៀន…"
            aria-label="ស្វែងរកថ្នាក់រៀន"
            data-ocid="class.search_input"
            className="rounded-md pl-8"
          />
        </div>
        <p className="tabular text-xs text-muted-foreground">
          {formatKhmerNumber(classes.length)} ថ្នាក់ ·{" "}
          {formatKhmerNumber(totalEnrolled)} ការចុះឈ្មោះ
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2" data-ocid="classes.loading_state">
          {Array.from({ length: 6 }, (_, i) => `class-skeleton-${i}`).map(
            (id) => (
              <Skeleton key={id} className="h-11 w-full rounded-md" />
            ),
          )}
        </div>
      ) : isError ? (
        <Card className="rounded-lg border-border shadow-none">
          <CardContent
            className="flex flex-col items-center gap-3 p-8 text-center"
            data-ocid="classes.error_state"
          >
            <p className="font-display text-sm font-semibold">
              មិនអាចផ្ទុកបញ្ជីថ្នាក់រៀនបានទេ
            </p>
            <p className="text-sm text-muted-foreground">
              មានបញ្ហាក្នុងការទាញទិន្នន័យពីប្រព័ន្ធ។ សូមព្យាយាមម្តងទៀត។
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => void refetch()}
              data-ocid="classes.retry_button"
              className="rounded-md"
            >
              ព្យាយាមម្តងទៀត
            </Button>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="rounded-lg border-border shadow-none">
          <CardContent
            className="flex flex-col items-center gap-3 p-10 text-center"
            data-ocid="classes.empty_state"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-muted">
              <School
                className="size-6 text-muted-foreground"
                aria-hidden="true"
              />
            </span>
            <p className="font-display text-base font-bold tracking-tight">
              {classes.length === 0
                ? "មិនទាន់មានថ្នាក់រៀនទេ"
                : "រកមិនឃើញថ្នាក់រៀនដែលត្រូវនឹងការស្វែងរក"}
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              {classes.length === 0
                ? isAdmin
                  ? "បង្កើតថ្នាក់រៀនដំបូងដើម្បីចាប់ផ្តើមចាត់តាំងគ្រូបន្ទុក និងចុះឈ្មោះសិស្ស។"
                  : "គ្មានថ្នាក់រៀនត្រូវបានបង្កើតនៅឡើយទេ។"
                : "សូមសាកល្បងពាក្យស្វែងរកផ្សេងទៀត។"}
            </p>
            {classes.length === 0 && isAdmin && (
              <Button
                type="button"
                onClick={openCreate}
                data-ocid="class.add.empty_button"
                className="mt-1 rounded-md"
              >
                <Plus className="size-4" aria-hidden="true" />
                បន្ថែមថ្នាក់រៀន
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="hidden rounded-lg border border-border bg-card md:block">
            <Table data-ocid="classes.table">
              <TableHeader className="sticky top-0 bg-card">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="h-9 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    ឈ្មោះថ្នាក់រៀន
                  </TableHead>
                  <TableHead className="h-9 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    កម្រិតថ្នាក់
                  </TableHead>
                  <TableHead className="h-9 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    គ្រូបន្ទុកថ្នាក់
                  </TableHead>
                  <TableHead className="h-9 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    ចំណុះថ្នាក់
                  </TableHead>
                  <TableHead className="h-9 w-32" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((classRecord) => (
                  <ClassRow
                    key={classRecord.id.toString()}
                    classRecord={classRecord}
                    teacherLabel={teacherName(
                      classRecord.homeroomTeacherId,
                      teachersById,
                    )}
                    isAdmin={isAdmin}
                    onEdit={openEdit}
                    onDelete={setDeleting}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-3 md:hidden" data-ocid="classes.list">
            {filtered.map((classRecord) => (
              <ClassCard
                key={classRecord.id.toString()}
                classRecord={classRecord}
                teacherLabel={teacherName(
                  classRecord.homeroomTeacherId,
                  teachersById,
                )}
                isAdmin={isAdmin}
                onEdit={openEdit}
                onDelete={setDeleting}
              />
            ))}
          </div>
        </>
      )}

      {isAdmin && (
        <>
          <ClassFormDialog
            open={formOpen}
            onOpenChange={setFormOpen}
            classRecord={editing}
          />
          <DeleteClassDialog
            classRecord={deleting}
            onOpenChange={(open) => {
              if (!open) setDeleting(null);
            }}
          />
        </>
      )}
    </div>
  );
}
