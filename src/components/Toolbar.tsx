import { BookText, Play, RefreshCcw, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { useContext, useState } from "react";
import { SettingsDialog } from "./SettingsDialog";
import { SpreadsheetContext } from "@/lib/spreadsheet";

const Toolbar = () => {
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  const spreadsheet = useContext(SpreadsheetContext);
  if (!spreadsheet) return <></>;

  const recalculateAll = async () => {
    if (!isRecalculating) {
      setIsRecalculating(true);
      await spreadsheet.recalculate();
      setIsRecalculating(false);
    }
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
            <RefreshCcw className="w-4 h-4 mr-2" /> Reset Sheet
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
