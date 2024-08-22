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

type Props = {
  open: boolean;
  handleConfirm: () => void;
  onClose: () => void;
};

export const TaintedSpreadsheetDialog = ({
  open,
  onClose,
  handleConfirm,
}: Props) => {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You have unsaved changes</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to leave this sheet? You have unsaved changes
            that won't be saved.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
