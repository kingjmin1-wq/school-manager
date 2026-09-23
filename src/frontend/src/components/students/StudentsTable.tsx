/**
 * Dense student data table for desktop.
 *
 * Rows are hairline-separated with a marigold hover tint; the name cell links
 * to the student detail route.
 */

import { StatusBadge } from "@/components/students/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatIsoDate } from "@/lib/format";
import { GENDER_LABELS } from "@/lib/labels";
import type { Class, Student } from "@/types";
import { Link } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";

export function StudentsTable({
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
    <div className="hidden overflow-hidden rounded-lg border border-border bg-card md:block">
      <Table data-ocid="student.table">
        <TableHeader className="sticky top-0 z-10 bg-muted/60">
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-10 pl-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              ឈ្មោះសិស្ស
            </TableHead>
            <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              ភេទ
            </TableHead>
            <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              ថ្នាក់រៀន
            </TableHead>
            <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              ទូរស័ព្ទអាណាព្យាបាល
            </TableHead>
            <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              ថ្ងៃកំណើត
            </TableHead>
            <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              ស្ថានភាព
            </TableHead>
            {isAdmin ? (
              <TableHead className="h-10 pr-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                សកម្មភាព
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, index) => {
            const classNames = student.classIds
              .map((id) => classesById.get(id.toString())?.name)
              .filter((name): name is string => Boolean(name));
            return (
              <TableRow
                key={student.id.toString()}
                data-ocid={`student.row.${index + 1}`}
                className="row-zebra h-11 border-border"
              >
                <TableCell className="max-w-[16rem] pl-4">
                  <Link
                    to="/students/$id"
                    params={{ id: student.id.toString() }}
                    data-ocid={`student.link.${index + 1}`}
                    className="block truncate font-medium text-foreground transition-smooth hover:text-primary hover:underline"
                  >
                    {student.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {GENDER_LABELS[student.gender]}
                </TableCell>
                <TableCell className="max-w-[14rem]">
                  {classNames.length > 0 ? (
                    <span className="block truncate text-muted-foreground">
                      {classNames.join(" · ")}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/70">
                      មិនទាន់ចុះឈ្មោះ
                    </span>
                  )}
                </TableCell>
                <TableCell className="tabular text-muted-foreground">
                  {student.guardianPhone || "—"}
                </TableCell>
                <TableCell className="tabular text-muted-foreground">
                  {formatIsoDate(student.dateOfBirth)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={student.status} />
                </TableCell>
                {isAdmin ? (
                  <TableCell className="pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`កែប្រែ ${student.name}`}
                        onClick={() => onEdit(student)}
                        data-ocid={`student.edit_button.${index + 1}`}
                        className="size-8 rounded-md text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`លុប ${student.name}`}
                        onClick={() => onDelete(student)}
                        data-ocid={`student.delete_button.${index + 1}`}
                        className="size-8 rounded-md text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell>
                ) : null}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
