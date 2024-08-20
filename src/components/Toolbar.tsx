import { BookText, Play, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { spreadsheet } from "@/lib/spreadsheet";
import { useState } from "react";
import { SettingsDialog } from "./SettingsDialog";

const Toolbar = () => {
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  const recalculateAll = async () => {
    if (!isRecalculating) {
      setIsRecalculating(true);
      await spreadsheet.recalculate();
      setIsRecalculating(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-start gap-2 px-5 pb-4 border-b border-colors">
        {/* recalculate all */}
        <Button
          disabled={isRecalculating}
          onClick={recalculateAll}
          variant="secondary">
          <Play className="w-4 h-4 mr-2" /> Recalculate All
        </Button>

        {/* open docs */}
        <Button variant="secondary">
          <BookText className="w-4 h-4 mr-2" /> Show Docs
        </Button>

        {/* open settings */}
        <Button onClick={() => setSettingsDialogOpen(true)} variant="secondary">
          <Settings className="w-4 h-4 mr-2" /> Settings
        </Button>
      </div>

      <SettingsDialog
        open={settingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}></SettingsDialog>
    </>
  );
};

export default Toolbar;
