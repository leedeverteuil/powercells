import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

type Props = {
  open: boolean;
  onClose: () => void;
  handleConfirm: () => void;
};

export const CellTypeChangeDialog = ({ open, onClose, handleConfirm }: Props) => {
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
          <AlertDialogTitle>Change cell type?</AlertDialogTitle>
          <AlertDialogDescription>
            Any changes you made for the current cell type will be lost
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
