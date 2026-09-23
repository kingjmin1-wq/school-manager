/**
 * Destructive confirmation for removing a student record.
 */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteStudent } from "@/hooks/useQueries";
import type { Student } from "@/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteStudentDialog({
  student,
  onOpenChange,
  onDeleted,
}: {
  student: Student | null;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}) {
  const deleteStudent = useDeleteStudent();

  const handleConfirm = () => {
    if (!student) return;
    deleteStudent.mutate(student.id, {
      onSuccess: () => {
        toast.success("បានលុបសិស្សរួចរាល់");
        onOpenChange(false);
        onDeleted?.();
      },
      onError: () => toast.error("មិនអាចលុបសិស្សបានទេ"),
    });
  };

  return (
    <AlertDialog open={student !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="rounded-lg"
        data-ocid="student.delete_dialog"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-lg font-bold tracking-tight">
            លុបសិស្សនេះ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            ការលុបនឹងដកព័ត៌មានរបស់{" "}
            <span className="font-semibold text-foreground">
              {student?.name}
            </span>{" "}
            និងការចុះឈ្មោះចូលថ្នាក់ទាំងអស់ចេញជាអចិន្ត្រៃយ៍។ សកម្មភាពនេះមិនអាច ត្រឡប់វិញបានទេ។
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            disabled={deleteStudent.isPending}
            data-ocid="student.delete.cancel_button"
            className="rounded-md"
          >
            បោះបង់
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              handleConfirm();
            }}
            disabled={deleteStudent.isPending}
            data-ocid="student.delete.confirm_button"
            className="rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteStudent.isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            លុបសិស្ស
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
