/**
 * Enroll a student into a class.
 *
 * Classes the student already belongs to are excluded from the picker so the
 * dialog can never submit a duplicate enrollment.
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddEnrollment, useClasses } from "@/hooks/useQueries";
import { formatCount } from "@/lib/format";
import type { Id, Student } from "@/types";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export function EnrollStudentDialog({
  open,
  onOpenChange,
  student,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
}) {
  const classesQuery = useClasses();
  const addEnrollment = useAddEnrollment();
  const [classId, setClassId] = useState<string>("");

  const enrolledIds = useMemo(
    () => new Set(student.classIds.map((id) => id.toString())),
    [student.classIds],
  );

  const availableClasses = useMemo(
    () =>
      (classesQuery.data ?? []).filter(
        (item) => !enrolledIds.has(item.id.toString()),
      ),
    [classesQuery.data, enrolledIds],
  );

  useEffect(() => {
    if (!open) return;
    setClassId("");
  }, [open]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!classId) {
      toast.error("សូមជ្រើសរើសថ្នាក់រៀន");
      return;
    }
    addEnrollment.mutate(
      { studentId: student.id, classId: BigInt(classId) as Id },
      {
        onSuccess: () => {
          toast.success("បានចុះឈ្មោះសិស្សចូលថ្នាក់រួចរាល់");
          onOpenChange(false);
        },
        onError: () => toast.error("មិនអាចចុះឈ្មោះចូលថ្នាក់បានទេ"),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-lg sm:max-w-md"
        data-ocid="enrollment.form_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold tracking-tight">
            ចុះឈ្មោះចូលថ្នាក់រៀន
          </DialogTitle>
          <DialogDescription>
            ជ្រើសរើសថ្នាក់រៀនដើម្បីចុះឈ្មោះ{" "}
            <span className="font-semibold text-foreground">
              {student.name}
            </span>
            ។
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="enroll-class">ថ្នាក់រៀន</Label>
            {classesQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">កំពុងផ្ទុកបញ្ជីថ្នាក់រៀន…</p>
            ) : availableClasses.length === 0 ? (
              <p
                data-ocid="enrollment.empty_state"
                className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
              >
                គ្មានថ្នាក់រៀនដែលអាចចុះឈ្មោះបានទេ។ សិស្សនេះបានចុះឈ្មោះគ្រប់ថ្នាក់រួចហើយ។
              </p>
            ) : (
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger
                  id="enroll-class"
                  data-ocid="enrollment.class_select"
                  className="rounded-md"
                >
                  <SelectValue placeholder="ជ្រើសរើសថ្នាក់រៀន" />
                </SelectTrigger>
                <SelectContent>
                  {availableClasses.map((item) => (
                    <SelectItem
                      key={item.id.toString()}
                      value={item.id.toString()}
                    >
                      {item.name} · {item.gradeLevel} (
                      {formatCount(item.enrolledCount)}/
                      {formatCount(item.capacity)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={addEnrollment.isPending}
              data-ocid="enrollment.cancel_button"
              className="rounded-md"
            >
              បោះបង់
            </Button>
            <Button
              type="submit"
              disabled={
                addEnrollment.isPending || availableClasses.length === 0
              }
              data-ocid="enrollment.submit_button"
              className="rounded-md"
            >
              {addEnrollment.isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              ចុះឈ្មោះ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
