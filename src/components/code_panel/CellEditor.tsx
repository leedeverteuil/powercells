import { type CellLocation } from "@/lib/cells/cell_types";
import {
  cellValueToString,
  getLocationDisplayName,
  getLocationId,
} from "@/lib/cells/cells_util";
import { Ban } from "lucide-react";
import { Button } from "../ui/button";
import { spreadsheet } from "@/lib/spreadsheet";
import { CellTypeSelect } from "./CellTypeSelect";
import { CellValueInput } from "./CellValueInput";
import { useRenderSubscriber } from "@/lib/render_subscriber";
import { CalculateFunction } from "./CalculateFunction";

type Props = {
  location: CellLocation;
};

export const CellEditor = ({ location }: Props) => {
  useRenderSubscriber([getLocationId(location)]);

  const displayName = getLocationDisplayName(location);
  const cell = spreadsheet.getCell(location);

  return (
    // selected location
    <div className="">
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
        {/* todo: make this do something */}
        <CellTypeSelect
          value={"normal"}
          onValueChange={() => {}}></CellTypeSelect>

        {/* value editor */}
        <CellValueInput
          value={cellValueToString(cell.value)}
          cellValue={cell.value}
          onInput={(value) => cell.setValue(value)}></CellValueInput>

        {/* calculate function */}
        <CalculateFunction cell={cell} />

        {/* format function */}
      </div>
    </div>
  );
};
