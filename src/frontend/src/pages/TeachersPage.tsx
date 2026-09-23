/**
 * Teacher directory: dense searchable table with admin-only create, edit and
 * delete actions. Read-only users see the same data without row actions.
 */

import { TeacherDeleteDialog } from "@/components/teachers/TeacherDeleteDialog";
import { TeacherFormDialog } from "@/components/teachers/TeacherFormDialog";
import {
  TeacherCardList,
  TeacherTable,
} from "@/components/teachers/TeacherTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsAdmin, useTeachers } from "@/hooks/useQueries";
import { formatCount } from "@/lib/format";
import type { Teacher } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { AlertCircle, Plus, Search, Users } from "lucide-react";
import { useState } from "react";

const SKELETON_IDS = Array.from(
  { length: 6 },
  (_, i) => `teacher-skeleton-${i}`,
);

export function TeachersPage() {
  const search = useSearch({ from: "/teachers" });
  const navigate = useNavigate({ from: "/teachers" });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [deleting, setDeleting] = useState<Teacher | null>(null);

  const setSearch = (value: string) => {
    void navigate({
      search: (prev) => ({ ...prev, q: value || undefined }),
      replace: true,
    });
  };

  const trimmed = (search.q ?? "").trim();
  const teachersQuery = useTeachers(trimmed ? { search: trimmed } : {});
  const adminQuery = useIsAdmin();
  const canManage = adminQuery.data === true;

  const teachers = teachersQuery.data ?? [];

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (teacher: Teacher) => {
    setEditing(teacher);
    setFormOpen(true);
  };

  return (
    <div className="space-y-4" data-ocid="teacher.page">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">
            គ្រូបង្រៀន
          </h2>
          <p className="text-sm text-muted-foreground">
            បញ្ជីគ្រូទាំងអស់ ព្រមទាំងមុខវិជ្ជា និងព័ត៌មានទំនាក់ទំនង។
          </p>
        </div>
        {canManage && (
          <Button
            type="button"
            onClick={openCreate}
            data-ocid="teacher.add_button"
            className="rounded-md"
          >
            <Plus className="size-4" aria-hidden="true" />
            បន្ថែមគ្រូថ្មី
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={search.q ?? ""}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ស្វែងរកតាមឈ្មោះ មុខវិជ្ជា ឬអ៊ីមែល…"
            aria-label="ស្វែងរកគ្រូ"
            data-ocid="teacher.search_input"
            className="h-9 rounded-md pl-8"
          />
        </div>
        {!teachersQuery.isLoading && !teachersQuery.isError && (
          <p
            className="text-xs text-muted-foreground"
            data-ocid="teacher.count"
          >
            សរុប {formatCount(teachers.length)} នាក់
          </p>
        )}
      </div>

      {teachersQuery.isLoading ? (
        <Card
          className="rounded-lg border-border shadow-none"
          data-ocid="teacher.loading_state"
        >
          <CardContent className="space-y-2 p-3">
            {SKELETON_IDS.map((id) => (
              <Skeleton key={id} className="h-11 w-full rounded-md" />
            ))}
          </CardContent>
        </Card>
      ) : teachersQuery.isError ? (
        <Card
          className="rounded-lg border-border shadow-none"
          data-ocid="teacher.error_state"
        >
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle
                className="size-5 text-destructive"
                aria-hidden="true"
              />
            </span>
            <h3 className="font-display text-base font-bold tracking-tight">
              មិនអាចទាញយកបញ្ជីគ្រូបានទេ
            </h3>
            <p className="text-sm text-muted-foreground">
              មានបញ្ហាក្នុងការភ្ជាប់ទៅប្រព័ន្ធ។ សូមព្យាយាមម្តងទៀត។
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => void teachersQuery.refetch()}
              data-ocid="teacher.retry_button"
              className="rounded-md"
            >
              ព្យាយាមម្តងទៀត
            </Button>
          </CardContent>
        </Card>
      ) : teachers.length === 0 ? (
        <Card
          className="rounded-lg border-border shadow-none"
          data-ocid="teacher.empty_state"
        >
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Users
                className="size-5 text-muted-foreground"
                aria-hidden="true"
              />
            </span>
            <h3 className="font-display text-base font-bold tracking-tight">
              {trimmed ? "រកមិនឃើញគ្រូដែលត្រូវនឹងការស្វែងរក" : "មិនទាន់មានគ្រូនៅឡើយ"}
            </h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              {trimmed
                ? "សូមព្យាយាមស្វែងរកដោយពាក្យគន្លឹះផ្សេង ឬសម្អាតប្រអប់ស្វែងរក។"
                : "ចាប់ផ្តើមដោយបន្ថែមគ្រូដំបូងចូលក្នុងប្រព័ន្ធ។"}
            </p>
            {trimmed ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setSearch("")}
                data-ocid="teacher.clear_search_button"
                className="rounded-md"
              >
                សម្អាតការស្វែងរក
              </Button>
            ) : (
              canManage && (
                <Button
                  type="button"
                  onClick={openCreate}
                  data-ocid="teacher.empty_add_button"
                  className="rounded-md"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  បន្ថែមគ្រូថ្មី
                </Button>
              )
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <TeacherTable
            teachers={teachers}
            canManage={canManage}
            onEdit={openEdit}
            onDelete={setDeleting}
          />
          <TeacherCardList
            teachers={teachers}
            canManage={canManage}
            onEdit={openEdit}
            onDelete={setDeleting}
          />
        </>
      )}

      {canManage && (
        <>
          <TeacherFormDialog
            open={formOpen}
            onOpenChange={setFormOpen}
            teacher={editing}
          />
          <TeacherDeleteDialog
            teacher={deleting}
            onOpenChange={(open) => {
              if (!open) setDeleting(null);
            }}
          />
        </>
      )}
    </div>
  );
}
