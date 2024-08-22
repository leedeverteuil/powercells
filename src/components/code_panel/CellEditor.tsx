import { type CellLocation, type CellType } from "@/lib/cells/cell_types";
import {
  getCellTypeFromConstructor,
  getLocationDisplayName,
  getLocationId,
} from "@/lib/cells/cells_util";
import { Ban } from "lucide-react";
import { Button } from "../ui/button";
import { CellTypeSelect } from "./CellTypeSelect";
import { useRenderSubscriber } from "@/lib/render_subscriber";
import { CellNormalFields } from "./CellNormalFields";
import { CellNormal } from "@/lib/cells/cell_normal";
import { CellButton } from "@/lib/cells/cell_button";
import { CellButtonFields } from "./CellButtonFields";
import { CellTimer } from "@/lib/cells/cell_timer";
import { CellTimerFields } from "./CellTimerFields";

type Props = {
  location: CellLocation;
};

export const CellEditor = ({ location }: Props) => {
  const { spreadsheet } = useRenderSubscriber([getLocationId(location)]);
  if (!spreadsheet) return <></>;

  const displayName = getLocationDisplayName(location);
  const cell = spreadsheet.getCell(location);

  const cellType = getCellTypeFromConstructor(cell.constructor);
  if (!cellType) return <></>;

  return (
    // selected location
    <div className="h-full pb-20 overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-3 border-b">
        {/* cell location info */}
        <h3 className="text-xl font-semibold tracking-tight">
          Cell {displayName}
        </h3>

        {/* deselect current cell */}
        <Button
          onClick={() => spreadsheet.selectLocation(null)}
          variant="secondary">
          <Ban className="w-4 h-4 mr-2" /> Deselect
        </Button>
      </div>

      <div className="px-5 py-3 space-y-5">
        {/* cell type editor */}
        <CellTypeSelect
          value={cellType}
          onValueChange={(value) => {
            if (value) {
              spreadsheet.setCellType(location, value as CellType);
            }
          }}></CellTypeSelect>

        {(() => {
          if (cell instanceof CellNormal) {
            return <CellNormalFields cell={cell} />;
          } else if (cell instanceof CellButton) {
            return <CellButtonFields cell={cell} />;
          } else if (cell instanceof CellTimer) {
            return <CellTimerFields cell={cell} />;
          }
        })()}
      </div>
    </div>
  );
};
