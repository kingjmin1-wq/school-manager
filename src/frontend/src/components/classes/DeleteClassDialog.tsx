/**
 * Confirmation dialog for deleting a class. Admin-only by construction.
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
import { useDeleteClass } from "@/hooks/useQueries";
import type { Class } from "@/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteClassDialog({
  classRecord,
  onOpenChange,
  onDeleted,
}: {
  classRecord: Class | null;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}) {
  const deleteClass = useDeleteClass();

  const handleConfirm = () => {
    if (!classRecord) return;
    deleteClass.mutate(classRecord.id, {
      onSuccess: () => {
        toast.success("បានលុបថ្នាក់រៀនរួចរាល់");
        onOpenChange(false);
        onDeleted?.();
      },
      onError: () => toast.error("មិនអាចលុបថ្នាក់រៀនបានទេ។"),
    });
  };

  return (
    <AlertDialog open={!!classRecord} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="rounded-lg border-border shadow-overlay"
        data-ocid="class.delete.dialog"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display">
            លុបថ្នាក់រៀន?
          </AlertDialogTitle>
          <AlertDialogDescription>
            ថ្នាក់រៀន «{classRecord?.name}» នឹងត្រូវលុបចេញពីប្រព័ន្ធ។
            សិស្សដែលបានចុះឈ្មោះក្នុងថ្នាក់នេះនឹងត្រូវដកចេញផងដែរ។
            សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            data-ocid="class.delete.cancel_button"
            className="rounded-md"
          >
            បោះបង់
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              handleConfirm();
            }}
            disabled={deleteClass.isPending}
            data-ocid="class.delete.confirm_button"
            className="rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteClass.isPending && (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            )}
            លុបថ្នាក់រៀន
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
