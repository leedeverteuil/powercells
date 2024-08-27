import { Play, RefreshCcw, Save, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { SettingsDialog } from "./SettingsDialog";
import { useToast } from "./ui/use-toast";
import { useRenderSubscriber } from "@/lib/render_subscriber";
import { ResetSheetDialog } from "./ResetSheetDialog";

type Props = {
  handleResetSheet: () => void;
};

const Toolbar = ({ handleResetSheet }: Props) => {
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [resetSheetDialogOpen, setResetSheetDialogOpen] = useState(false);
  const { toast } = useToast();

  const { spreadsheet } = useRenderSubscriber(["tainted"]);
  if (!spreadsheet) return <></>;

  const recalculateAll = async () => {
    if (!isRecalculating) {
      setIsRecalculating(true);
      await spreadsheet.recalculate();
      setIsRecalculating(false);
    }
  };

  const handleSave = () => {
    const success = spreadsheet.saveToStorage();
    toast({
      title: success
        ? "Saved sheet successfully"
        : "Something went wrong saving sheet",
    });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-2 px-5 pb-4 border-b border-colors">
        <div className="flex items-center justify-start gap-2">
          {/* recalculate all */}
          <Button
            disabled={isRecalculating}
            onClick={recalculateAll}
            variant="secondary">
            <Play className="w-4 h-4 mr-2" /> Recalculate All
          </Button>

          {/* save sheet */}
          <Button
            disabled={!spreadsheet.tainted}
            variant="secondary"
            onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
        </div>

        <div className="flex items-center justify-start gap-2">
          {/* reset sheet */}
          <Button
            onClick={() => setResetSheetDialogOpen(true)}
            variant="secondary">
            <RefreshCcw className="w-4 h-4 mr-2" /> Reset Sheet
          </Button>

          {/* open settings */}
          <Button
            onClick={() => setSettingsDialogOpen(true)}
            variant="secondary">
            <Settings className="w-4 h-4 mr-2" /> Settings
          </Button>
        </div>
      </div>

      <SettingsDialog
        open={settingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}></SettingsDialog>

      <ResetSheetDialog
        open={resetSheetDialogOpen}
        onClose={() => setResetSheetDialogOpen(false)}
        handleConfirm={handleResetSheet}></ResetSheetDialog>
    </>
  );
};

export default Toolbar;
