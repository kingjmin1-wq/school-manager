/**
 * Destructive confirmation for removing a teacher. Admin-only by the caller.
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
import { useDeleteTeacher } from "@/hooks/useQueries";
import type { Teacher } from "@/types";
import { toast } from "sonner";

export function TeacherDeleteDialog({
  teacher,
  onOpenChange,
}: {
  teacher: Teacher | null;
  onOpenChange: (open: boolean) => void;
}) {
  const deleteTeacher = useDeleteTeacher();

  const handleConfirm = () => {
    if (!teacher) return;
    deleteTeacher.mutate(teacher.id, {
      onSuccess: () => {
        toast.success("បានលុបគ្រូចេញពីប្រព័ន្ធ");
        onOpenChange(false);
      },
      onError: () => {
        toast.error("លុបមិនបានសម្រេច។ សូមព្យាយាមម្តងទៀត។");
      },
    });
  };

  return (
    <AlertDialog open={teacher !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="rounded-lg border-border shadow-overlay"
        data-ocid="teacher.delete.dialog"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-lg font-bold tracking-tight">
            លុបគ្រូនេះចេញ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            ព័ត៌មានរបស់ <span className="font-semibold">{teacher?.name}</span>{" "}
            នឹងត្រូវលុបចេញពីប្រព័ន្ធជាអចិន្ត្រៃយ៍។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            data-ocid="teacher.delete.cancel_button"
            className="rounded-md"
          >
            បោះបង់
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteTeacher.isPending}
            data-ocid="teacher.delete.confirm_button"
            className="rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteTeacher.isPending ? "កំពុងលុប…" : "លុបគ្រូ"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
