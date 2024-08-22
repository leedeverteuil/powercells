import { BookText, Play, RefreshCcw, Save, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { SettingsDialog } from "./SettingsDialog";
import { useToast } from "./ui/use-toast";
import { useRenderSubscriber } from "@/lib/render_subscriber";

const Toolbar = () => {
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
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

          {/* reset sheet */}
          <Button variant="secondary">
            <RefreshCcw className="w-4 h-4 mr-2" /> Reset
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
          {/* open docs */}
          <Button variant="secondary">
            <BookText className="w-4 h-4 mr-2" /> Show Docs
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
    </>
  );
};

export default Toolbar;
