import type { CellLocation, PrivateCell } from "@/lib/cells/cell_types";
import { CellContent } from "./CellContent";
import { spreadsheet } from "@/lib/spreadsheet";
import { useRenderSubscriber } from "@/lib/render_subscriber";
import { areLocationsEqual, findCellAtLocation } from "@/lib/cells/cells_util";

type Props = {
  location: CellLocation;
};
export const ContentCell = ({ location }: Props) => {
  const cell = findCellAtLocation(spreadsheet.grid, location);
  const { col, row } = location;
  const selected =
    spreadsheet.selectedLocation &&
    areLocationsEqual(location, spreadsheet.selectedLocation);

  useRenderSubscriber([`${col}-${row}`]);

  const onClick = () => {
    spreadsheet.selectLocation(location);
  };

  // tailwind
  const rowBorderClass = row === 0 ? "border-t-0" : "";
  const colBorderClass = col === 0 ? "border-l-0" : "";
  const selectedClass = selected
    ? "ring-[3px] ring-lime-300 z-10 rounded-sm border-lime-700 !border-l-[0.5px] !border-t-[0.5px]"
    : "";

  return (
    <div
      onClick={onClick}
      className={`p-1 border-[0.5px] ${rowBorderClass} ${colBorderClass} ${selectedClass}
                border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer`}>
      {/* format and render cell's content based on type etc */}
      <CellContent cell={cell} location={location}></CellContent>
    </div>
  );
};
