import { Code, Play } from "lucide-react";
import { Button } from "./ui/button";
import { spreadsheet } from "@/lib/spreadsheet";
import { useState } from "react";

const Toolbar = () => {
  const [isRecalculating, setIsRecalculating] = useState(false);

  const recalculateAll = () => {
    if (!isRecalculating) {
      setIsRecalculating(true);
      spreadsheet.recalculate();
      setIsRecalculating(false);
    }
  };

  return (
    <div className="flex items-center justify-start gap-2 px-5 pb-4 border-b border-colors">
      {/* recalculate all */}
      <Button disabled={isRecalculating} onClick={recalculateAll} variant="secondary">
        <Play className="w-4 h-4 mr-2" /> Recalculate All
      </Button>

      {/* open hooks drawer */}
      <Button variant="secondary">
        <Code className="w-4 h-4 mr-2" /> Edit Hooks
      </Button>
    </div>
  );
};

export default Toolbar;
