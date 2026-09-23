/**
 * Create / edit dialog for a class.
 *
 * Admin-only by construction: the parent only renders it for admins. The form
 * draft is local state, cleared synchronously on submit so a failed save can
 * restore it without wiping newer input.
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
import {
  useCreateClass,
  useTeachers,
  useUpdateClass,
} from "@/hooks/useQueries";
import type { Class, ClassInput, Id } from "@/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const NO_TEACHER = "__none__";

const GRADE_LEVELS = [
  "ថ្នាក់ទី ១",
  "ថ្នាក់ទី ២",
  "ថ្នាក់ទី ៣",
  "ថ្នាក់ទី ៤",
  "ថ្នាក់ទី ៥",
  "ថ្នាក់ទី ៦",
  "ថ្នាក់ទី ៧",
  "ថ្នាក់ទី ៨",
  "ថ្នាក់ទី ៩",
  "ថ្នាក់ទី ១០",
  "ថ្នាក់ទី ១១",
  "ថ្នាក់ទី ១២",
];

type FormState = {
  name: string;
  gradeLevel: string;
  homeroomTeacherId: string;
  capacity: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  gradeLevel: "",
  homeroomTeacherId: NO_TEACHER,
  capacity: "30",
};

function toFormState(classRecord: Class): FormState {
  return {
    name: classRecord.name,
    gradeLevel: classRecord.gradeLevel,
    homeroomTeacherId:
      classRecord.homeroomTeacherId !== undefined
        ? classRecord.homeroomTeacherId.toString()
        : NO_TEACHER,
    capacity: classRecord.capacity.toString(),
  };
}

export function ClassFormDialog({
  open,
  onOpenChange,
  classRecord,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classRecord?: Class | null;
}) {
  const isEditing = !!classRecord;
  const { data: teachers = [], isLoading: teachersLoading } = useTeachers();
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  // One-time initialization when the dialog opens for an existing record.
  useEffect(() => {
    if (!open) return;
    setForm(classRecord ? toFormState(classRecord) : EMPTY_FORM);
    setError(null);
  }, [open, classRecord]);

  const isPending = createClass.isPending || updateClass.isPending;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = form.name.trim();
    const gradeLevel = form.gradeLevel.trim();
    const capacity = Number(form.capacity);

    if (!name) {
      setError("សូមបញ្ចូលឈ្មោះថ្នាក់រៀន។");
      return;
    }
    if (!gradeLevel) {
      setError("សូមបញ្ចូលកម្រិតថ្នាក់។");
      return;
    }
    if (!Number.isFinite(capacity) || capacity <= 0) {
      setError("ចំណុះថ្នាក់ត្រូវតែជាចំនួនវិជ្ជមាន។");
      return;
    }

    setError(null);
    const homeroomTeacherId: Id | undefined =
      form.homeroomTeacherId === NO_TEACHER
        ? undefined
        : BigInt(form.homeroomTeacherId);

    if (isEditing && classRecord) {
      // The backend treats an absent `homeroomTeacherId` as "leave unchanged",
      // so clearing an assigned teacher is not supported by this control.
      if (homeroomTeacherId === undefined) {
        setError("មិនអាចដកគ្រូបន្ទុកចេញបានទេ។ សូមជ្រើសរើសគ្រូបន្ទុកផ្សេង ឬបោះបង់ការកែប្រែ។");
        return;
      }
      updateClass.mutate(
        {
          id: classRecord.id,
          update: {
            name,
            gradeLevel,
            capacity: BigInt(capacity),
            homeroomTeacherId,
          },
        },
        {
          onSuccess: () => {
            toast.success("បានធ្វើបច្ចុប្បន្នភាពថ្នាក់រៀនរួចរាល់");
            onOpenChange(false);
          },
          onError: () => setError("មិនអាចធ្វើបច្ចុប្បន្នភាពថ្នាក់រៀនបានទេ។"),
        },
      );
      return;
    }

    const input: ClassInput = {
      name,
      gradeLevel,
      capacity: BigInt(capacity),
      homeroomTeacherId,
    };
    createClass.mutate(input, {
      onSuccess: () => {
        toast.success("បានបង្កើតថ្នាក់រៀនថ្មីរួចរាល់");
        onOpenChange(false);
      },
      onError: () => setError("មិនអាចបង្កើតថ្នាក់រៀនបានទេ។"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-lg border-border shadow-overlay sm:max-w-lg"
        data-ocid="class.form.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEditing ? "កែប្រែថ្នាក់រៀន" : "បន្ថែមថ្នាក់រៀនថ្មី"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "កែប្រែព័ត៌មានថ្នាក់រៀន គ្រូបន្ទុក និងចំណុះថ្នាក់។"
              : "បំពេញព័ត៌មានខាងក្រោមដើម្បីបង្កើតថ្នាក់រៀនថ្មី។"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="class-name">ឈ្មោះថ្នាក់រៀន</Label>
            <Input
              id="class-name"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="ឧ. ១២A វិទ្យាសាស្ត្រ"
              autoComplete="off"
              data-ocid="class.form.name_input"
              className="rounded-md"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="class-grade">កម្រិតថ្នាក់</Label>
              <Input
                id="class-grade"
                value={form.gradeLevel}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    gradeLevel: event.target.value,
                  }))
                }
                placeholder="ឧ. ថ្នាក់ទី ១២"
                list="class-grade-options"
                autoComplete="off"
                data-ocid="class.form.grade_input"
                className="rounded-md"
              />
              <datalist id="class-grade-options">
                {GRADE_LEVELS.map((level) => (
                  <option key={level} value={level} />
                ))}
              </datalist>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="class-capacity">ចំណុះថ្នាក់</Label>
              <Input
                id="class-capacity"
                type="number"
                min={1}
                inputMode="numeric"
                value={form.capacity}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, capacity: event.target.value }))
                }
                data-ocid="class.form.capacity_input"
                className="tabular rounded-md"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="class-teacher">គ្រូបន្ទុកថ្នាក់</Label>
            <Select
              value={form.homeroomTeacherId}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, homeroomTeacherId: value }))
              }
              disabled={teachersLoading}
            >
              <SelectTrigger
                id="class-teacher"
                data-ocid="class.form.teacher_select"
                className="w-full rounded-md"
              >
                <SelectValue placeholder="ជ្រើសរើសគ្រូបន្ទុក" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_TEACHER}>គ្មានគ្រូបន្ទុក</SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem
                    key={teacher.id.toString()}
                    value={teacher.id.toString()}
                  >
                    {teacher.name} · {teacher.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p
              role="alert"
              data-ocid="class.form.error_state"
              className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-ocid="class.form.cancel_button"
              className="rounded-md"
            >
              បោះបង់
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="class.form.submit_button"
              className="rounded-md"
            >
              {isPending && (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              )}
              {isEditing ? "រក្សាទុកការកែប្រែ" : "បង្កើតថ្នាក់រៀន"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
