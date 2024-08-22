import { useRenderSubscriber } from "@/lib/render_subscriber";
import { Code } from "lucide-react";
import { CellEditor } from "./CellEditor";
import { getLocationId } from "@/lib/cells/cells_util";

export const CodePanel = () => {
  const { spreadsheet } = useRenderSubscriber(["selectedLocation"]);
  if (!spreadsheet) return <></>;

  const selectedLocation = spreadsheet.selectedLocation;

  return selectedLocation === null ? (
    // no selected location
    <div className="flex items-center justify-center h-full">
      <Code className="w-16 h-16 text-zinc-200 dark:text-zinc-800"></Code>
    </div>
  ) : (
    <CellEditor
      key={getLocationId(selectedLocation)}
      location={selectedLocation}
    />
  );
};
