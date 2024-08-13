import { Ban, Code } from "lucide-react";
import { Button } from "./ui/button";

const Toolbar = () => {
  return (
    <div className="flex items-center justify-start gap-2 px-5 pb-4 border-b border-colors">
      {/* open hooks drawer */}
      <Button variant="secondary">
        <Code className="w-4 h-4 mr-2" /> Edit Hooks
      </Button>

      {/* deselect current cell */}
      <Button variant="secondary" disabled>
        <Ban className="w-4 h-4 mr-2" /> Deselect
      </Button>
    </div>
  );
};

export default Toolbar;
