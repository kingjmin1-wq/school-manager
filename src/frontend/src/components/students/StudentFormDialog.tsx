/**
 * Create / edit student dialog.
 *
 * The form draft is local `useState`; it is seeded once when the dialog opens
 * for an existing record and never re-derived from query data afterwards.
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
import { useCreateStudent, useUpdateStudent } from "@/hooks/useQueries";
import { GENDER_OPTIONS, STUDENT_STATUS_OPTIONS } from "@/lib/labels";
import type { Gender, Student, StudentStatus } from "@/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Draft = {
  name: string;
  gender: Gender;
  dateOfBirth: string;
  guardianName: string;
  guardianPhone: string;
  status: StudentStatus;
};

const EMPTY_DRAFT: Draft = {
  name: "",
  gender: GENDER_OPTIONS[0].value,
  dateOfBirth: "",
  guardianName: "",
  guardianPhone: "",
  status: STUDENT_STATUS_OPTIONS[0].value,
};

function draftFromStudent(student: Student): Draft {
  return {
    name: student.name,
    gender: student.gender,
    dateOfBirth: student.dateOfBirth,
    guardianName: student.guardianName,
    guardianPhone: student.guardianPhone,
    status: student.status,
  };
}

export function StudentFormDialog({
  open,
  onOpenChange,
  student,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student | null;
}) {
  const isEditing = Boolean(student);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [error, setError] = useState<string | null>(null);

  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const isPending = createStudent.isPending || updateStudent.isPending;

  // Seed the draft once per open, from the record being edited.
  useEffect(() => {
    if (!open) return;
    setDraft(student ? draftFromStudent(student) : EMPTY_DRAFT);
    setError(null);
  }, [open, student]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = draft.name.trim();
    const guardianName = draft.guardianName.trim();
    const guardianPhone = draft.guardianPhone.trim();

    if (!name) {
      setError("សូមបញ្ចូលឈ្មោះសិស្ស។");
      return;
    }
    if (!guardianName) {
      setError("សូមបញ្ចូលឈ្មោះអាណាព្យាបាល។");
      return;
    }
    if (!guardianPhone) {
      setError("សូមបញ្ចូលលេខទូរស័ព្ទអាណាព្យាបាល។");
      return;
    }
    setError(null);

    const payload = {
      name,
      gender: draft.gender,
      dateOfBirth: draft.dateOfBirth,
      guardianName,
      guardianPhone,
      status: draft.status,
    };

    if (student) {
      updateStudent.mutate(
        { id: student.id, update: payload },
        {
          onSuccess: () => {
            toast.success("បានកែប្រែព័ត៌មានសិស្សរួចរាល់");
            onOpenChange(false);
          },
          onError: () => toast.error("មិនអាចកែប្រែព័ត៌មានសិស្សបានទេ"),
        },
      );
      return;
    }

    createStudent.mutate(payload, {
      onSuccess: () => {
        toast.success("បានបន្ថែមសិស្សថ្មីរួចរាល់");
        onOpenChange(false);
      },
      onError: () => toast.error("មិនអាចបន្ថែមសិស្សបានទេ"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto rounded-lg sm:max-w-lg"
        data-ocid="student.form_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold tracking-tight">
            {isEditing ? "កែប្រែព័ត៌មានសិស្ស" : "បន្ថែមសិស្សថ្មី"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "កែប្រែព័ត៌មានផ្ទាល់ខ្លួន និងស្ថានភាពសិក្សារបស់សិស្ស។"
              : "បំពេញព័ត៌មានខាងក្រោមដើម្បីចុះឈ្មោះសិស្សថ្មី។"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="student-name">ឈ្មោះសិស្ស</Label>
            <Input
              id="student-name"
              value={draft.name}
              onChange={(event) => set("name", event.target.value)}
              placeholder="ឧ. សុខ ដារា"
              autoComplete="off"
              data-ocid="student.name_input"
              className="rounded-md"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="student-gender">ភេទ</Label>
              <Select
                value={draft.gender}
                onValueChange={(value) => set("gender", value as Gender)}
              >
                <SelectTrigger
                  id="student-gender"
                  data-ocid="student.gender_select"
                  className="rounded-md"
                >
                  <SelectValue placeholder="ជ្រើសរើសភេទ" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="student-dob">ថ្ងៃកំណើត</Label>
              <Input
                id="student-dob"
                type="date"
                value={draft.dateOfBirth}
                onChange={(event) => set("dateOfBirth", event.target.value)}
                data-ocid="student.dob_input"
                className="rounded-md"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="student-guardian">ឈ្មោះអាណាព្យាបាល</Label>
              <Input
                id="student-guardian"
                value={draft.guardianName}
                onChange={(event) => set("guardianName", event.target.value)}
                placeholder="ឧ. សុខ វិចិត្រ"
                autoComplete="off"
                data-ocid="student.guardian_input"
                className="rounded-md"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="student-phone">លេខទូរស័ព្ទអាណាព្យាបាល</Label>
              <Input
                id="student-phone"
                type="tel"
                inputMode="tel"
                value={draft.guardianPhone}
                onChange={(event) => set("guardianPhone", event.target.value)}
                placeholder="ឧ. 012 345 678"
                autoComplete="off"
                data-ocid="student.phone_input"
                className="rounded-md tabular"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="student-status">ស្ថានភាពសិក្សា</Label>
            <Select
              value={draft.status}
              onValueChange={(value) => set("status", value as StudentStatus)}
            >
              <SelectTrigger
                id="student-status"
                data-ocid="student.status_select"
                className="rounded-md"
              >
                <SelectValue placeholder="ជ្រើសរើសស្ថានភាព" />
              </SelectTrigger>
              <SelectContent>
                {STUDENT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error ? (
            <p
              role="alert"
              data-ocid="student.form.error_state"
              className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          ) : null}

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              data-ocid="student.form.cancel_button"
              className="rounded-md"
            >
              បោះបង់
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="student.form.submit_button"
              className="rounded-md"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              {isEditing ? "រក្សាទុកការកែប្រែ" : "បន្ថែមសិស្ស"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
