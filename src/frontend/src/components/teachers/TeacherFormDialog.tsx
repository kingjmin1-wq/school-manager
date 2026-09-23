/**
 * Add / edit teacher dialog.
 *
 * The draft lives entirely in local state; the query cache is never used as a
 * form store. The dialog is only rendered for admins by the caller.
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
import { useCreateTeacher, useUpdateTeacher } from "@/hooks/useQueries";
import type { Teacher, TeacherInput } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Draft = {
  name: string;
  subject: string;
  email: string;
  phone: string;
};

const EMPTY_DRAFT: Draft = { name: "", subject: "", email: "", phone: "" };

function draftFrom(teacher: Teacher | null): Draft {
  if (!teacher) return EMPTY_DRAFT;
  return {
    name: teacher.name,
    subject: teacher.subject,
    email: teacher.email,
    phone: teacher.phone,
  };
}

export function TeacherFormDialog({
  open,
  onOpenChange,
  teacher,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: Teacher | null;
}) {
  const isEditing = teacher !== null;
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [error, setError] = useState<string | null>(null);

  const createTeacher = useCreateTeacher();
  const updateTeacher = useUpdateTeacher();
  const isPending = createTeacher.isPending || updateTeacher.isPending;

  // One-time initialization when the dialog opens for a specific record.
  useEffect(() => {
    if (open) {
      setDraft(draftFrom(teacher));
      setError(null);
    }
  }, [open, teacher]);

  const setField = (field: keyof Draft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: TeacherInput = {
      name: draft.name.trim(),
      subject: draft.subject.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
    };

    if (!payload.name || !payload.subject || !payload.email || !payload.phone) {
      setError("សូមបំពេញព័ត៌មានទាំងអស់ជាមុនសិន។");
      return;
    }

    setError(null);
    const onError = () => {
      setError("រក្សាទុកមិនបានសម្រេច។ សូមព្យាយាមម្តងទៀត។");
      toast.error("រក្សាទុកមិនបានសម្រេច");
    };

    if (isEditing && teacher) {
      updateTeacher.mutate(
        { id: teacher.id, update: payload },
        {
          onSuccess: () => {
            toast.success("បានកែប្រែព័ត៌មានគ្រូរួចរាល់");
            onOpenChange(false);
          },
          onError,
        },
      );
      return;
    }

    createTeacher.mutate(payload, {
      onSuccess: () => {
        toast.success("បានបន្ថែមគ្រូថ្មីរួចរាល់");
        onOpenChange(false);
      },
      onError,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-lg border-border shadow-overlay sm:max-w-lg"
        data-ocid="teacher.form.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold tracking-tight">
            {isEditing ? "កែប្រែព័ត៌មានគ្រូ" : "បន្ថែមគ្រូថ្មី"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "កែប្រែព័ត៌មានទំនាក់ទំនង និងមុខវិជ្ជាបង្រៀនរបស់គ្រូ។"
              : "បំពេញព័ត៌មានគ្រូថ្មីដើម្បីចុះបញ្ជីក្នុងប្រព័ន្ធ។"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="teacher-name">ឈ្មោះពេញ</Label>
              <Input
                id="teacher-name"
                value={draft.name}
                onChange={(event) => setField("name", event.target.value)}
                placeholder="ឧ. សុខ ចន្ថា"
                autoComplete="off"
                data-ocid="teacher.form.name_input"
                className="rounded-md"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="teacher-subject">មុខវិជ្ជា</Label>
              <Input
                id="teacher-subject"
                value={draft.subject}
                onChange={(event) => setField("subject", event.target.value)}
                placeholder="ឧ. គណិតវិទ្យា"
                autoComplete="off"
                data-ocid="teacher.form.subject_input"
                className="rounded-md"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="teacher-email">អ៊ីមែល</Label>
              <Input
                id="teacher-email"
                type="email"
                value={draft.email}
                onChange={(event) => setField("email", event.target.value)}
                placeholder="teacher@school.edu.kh"
                autoComplete="off"
                data-ocid="teacher.form.email_input"
                className="rounded-md"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="teacher-phone">លេខទូរស័ព្ទ</Label>
              <Input
                id="teacher-phone"
                type="tel"
                value={draft.phone}
                onChange={(event) => setField("phone", event.target.value)}
                placeholder="012 345 678"
                autoComplete="off"
                data-ocid="teacher.form.phone_input"
                className="rounded-md tabular"
              />
            </div>
          </div>

          {error && (
            <p
              role="alert"
              data-ocid="teacher.form.error_state"
              className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-ocid="teacher.form.cancel_button"
              className="rounded-md"
            >
              បោះបង់
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="teacher.form.submit_button"
              className="rounded-md"
            >
              {isPending
                ? "កំពុងរក្សាទុក…"
                : isEditing
                  ? "រក្សាទុកការកែប្រែ"
                  : "បន្ថែមគ្រូ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
