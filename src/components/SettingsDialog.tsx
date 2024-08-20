import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { settings } from "@/lib/settings";
import { spreadsheet } from "@/lib/spreadsheet";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const SettingsDialog = ({ open, onClose }: Props) => {
  const [useColumnNumbers, setUseColumnNumbers] = useState(
    settings.useColumnNumbers
  );

  useEffect(() => {
    // reset use column numbers when opening
    if (open) {
      setUseColumnNumbers(settings.useColumnNumbers);
    }
  }, [open]);

  let isSaving = false;

  const onOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const save = () => {
    // prevent spam clicking button
    if (!isSaving) {
      isSaving = true;
      settings.useColumnNumbers = useColumnNumbers;
      settings.saveToLocalStorage();
      spreadsheet.updateSubscribers(["columnHeaders"]);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure how you want the app to work
          </DialogDescription>
        </DialogHeader>

        <div>
          {/* column letters vs numbers */}
          <div className="flex items-center space-x-2">
            <Switch
              id="useColumnNumbers"
              checked={useColumnNumbers}
              onCheckedChange={setUseColumnNumbers}
            />
            <Label htmlFor="useColumnNumbers">
              Use column numbers instead of letters
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
