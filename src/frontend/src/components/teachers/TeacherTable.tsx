/**
 * Dense teacher data table (desktop) with a card list fallback on mobile.
 *
 * Rows link to the teacher detail route; admin-only row actions are rendered
 * only when `canManage` is true.
 */

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { initials } from "@/lib/format";
import type { Teacher } from "@/types";
import { Link } from "@tanstack/react-router";
import { Mail, Pencil, Phone, Trash2 } from "lucide-react";

export function TeacherTable({
  teachers,
  canManage,
  onEdit,
  onDelete,
}: {
  teachers: Teacher[];
  canManage: boolean;
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;
}) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-border bg-card md:block">
      <Table data-ocid="teacher.table">
        <TableHeader className="sticky top-0 z-10 bg-muted/60">
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              ឈ្មោះគ្រូ
            </TableHead>
            <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              មុខវិជ្ជា
            </TableHead>
            <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              អ៊ីមែល
            </TableHead>
            <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              លេខទូរស័ព្ទ
            </TableHead>
            <TableHead className="h-10 w-28 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              សកម្មភាព
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher, index) => (
            <TableRow
              key={teacher.id.toString()}
              data-ocid={`teacher.row.${index + 1}`}
              className="row-zebra h-11 border-border"
            >
              <TableCell className="py-1.5">
                <Link
                  to="/teachers/$id"
                  params={{ id: teacher.id.toString() }}
                  data-ocid={`teacher.link.${index + 1}`}
                  className="group flex min-w-0 items-center gap-2.5"
                >
                  <Avatar className="size-7 shrink-0">
                    <AvatarFallback className="bg-secondary text-[11px] font-semibold text-secondary-foreground">
                      {initials(teacher.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate font-medium group-hover:text-primary group-hover:underline">
                    {teacher.name}
                  </span>
                </Link>
              </TableCell>
              <TableCell className="py-1.5">
                <Badge
                  variant="secondary"
                  className="rounded-md font-normal text-secondary-foreground"
                >
                  {teacher.subject}
                </Badge>
              </TableCell>
              <TableCell className="py-1.5">
                <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
                  <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{teacher.email}</span>
                </span>
              </TableCell>
              <TableCell className="py-1.5">
                <span className="tabular text-muted-foreground">
                  {teacher.phone}
                </span>
              </TableCell>
              <TableCell className="py-1.5 text-right">
                {canManage ? (
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`កែប្រែ ${teacher.name}`}
                      onClick={() => onEdit(teacher)}
                      data-ocid={`teacher.edit_button.${index + 1}`}
                      className="size-8 rounded-md"
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`លុប ${teacher.name}`}
                      onClick={() => onDelete(teacher)}
                      data-ocid={`teacher.delete_button.${index + 1}`}
                      className="size-8 rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function TeacherCardList({
  teachers,
  canManage,
  onEdit,
  onDelete,
}: {
  teachers: Teacher[];
  canManage: boolean;
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;
}) {
  return (
    <ul className="space-y-2 md:hidden" data-ocid="teacher.list">
      {teachers.map((teacher, index) => (
        <li
          key={teacher.id.toString()}
          data-ocid={`teacher.item.${index + 1}`}
          className="rounded-lg border border-border bg-card p-3"
        >
          <div className="flex items-start gap-3">
            <Avatar className="size-9 shrink-0">
              <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">
                {initials(teacher.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <Link
                to="/teachers/$id"
                params={{ id: teacher.id.toString() }}
                data-ocid={`teacher.link.${index + 1}`}
                className="block truncate font-medium hover:text-primary hover:underline"
              >
                {teacher.name}
              </Link>
              <Badge
                variant="secondary"
                className="mt-1 rounded-md font-normal text-secondary-foreground"
              >
                {teacher.subject}
              </Badge>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <p className="flex min-w-0 items-center gap-1.5">
                  <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{teacher.email}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="tabular">{teacher.phone}</span>
                </p>
              </div>
            </div>
          </div>

          {canManage && (
            <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onEdit(teacher)}
                data-ocid={`teacher.edit_button.${index + 1}`}
                className="flex-1 rounded-md"
              >
                <Pencil className="size-4" aria-hidden="true" />
                កែប្រែ
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onDelete(teacher)}
                data-ocid={`teacher.delete_button.${index + 1}`}
                className="flex-1 rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                លុប
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
