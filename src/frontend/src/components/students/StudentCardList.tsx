/**
 * Mobile student list: the table collapses into stacked cards.
 */

import { StatusBadge } from "@/components/students/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatIsoDate } from "@/lib/format";
import { GENDER_LABELS } from "@/lib/labels";
import type { Class, Student } from "@/types";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Pencil, Trash2 } from "lucide-react";

export function StudentCardList({
  students,
  classesById,
  isAdmin,
  onEdit,
  onDelete,
}: {
  students: Student[];
  classesById: Map<string, Class>;
  isAdmin: boolean;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}) {
  return (
    <ul className="space-y-2 md:hidden" data-ocid="student.list">
      {students.map((student, index) => {
        const classNames = student.classIds
          .map((id) => classesById.get(id.toString())?.name)
          .filter((name): name is string => Boolean(name));
        return (
          <li
            key={student.id.toString()}
            data-ocid={`student.item.${index + 1}`}
            className="rounded-lg border border-border bg-card p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <Link
                to="/students/$id"
                params={{ id: student.id.toString() }}
                data-ocid={`student.link.${index + 1}`}
                className="min-w-0 flex-1"
              >
                <span className="flex items-center gap-1.5">
                  <span className="truncate font-medium text-foreground">
                    {student.name}
                  </span>
                  <ChevronRight
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-1 block truncate text-xs text-muted-foreground">
                  {GENDER_LABELS[student.gender]} ·{" "}
                  {classNames.length > 0
                    ? classNames.join(" · ")
                    : "មិនទាន់ចុះឈ្មោះ"}
                </span>
              </Link>
              <StatusBadge status={student.status} />
            </div>

            <dl className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1 border-t border-border pt-2.5 text-xs">
              <div className="min-w-0">
                <dt className="text-muted-foreground">ទូរស័ព្ទអាណាព្យាបាល</dt>
                <dd className="tabular truncate text-foreground">
                  {student.guardianPhone || "—"}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-muted-foreground">ថ្ងៃកំណើត</dt>
                <dd className="tabular truncate text-foreground">
                  {formatIsoDate(student.dateOfBirth)}
                </dd>
              </div>
            </dl>

            {isAdmin ? (
              <div className="mt-2.5 flex items-center justify-end gap-2 border-t border-border pt-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(student)}
                  data-ocid={`student.edit_button.${index + 1}`}
                  className="rounded-md"
                >
                  <Pencil className="size-3.5" aria-hidden="true" />
                  កែប្រែ
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(student)}
                  data-ocid={`student.delete_button.${index + 1}`}
                  className="rounded-md text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                  លុប
                </Button>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
