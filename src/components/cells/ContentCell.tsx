import type { CellLocation } from "@/lib/cells/cell_types";
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
  const colBorderClass = col === 0 ? "border-l-0" : "";
  const selectedClass = selected
    ? "ring-[4px] ring-lime-300/50 dark:ring-lime-700/50 z-[1] outline outline-1 outline-lime-500 rounded-sm"
    : "";

  return (
    <div
      onClick={onClick}
      className={`p-1 border-[0.5px] ${colBorderClass} ${selectedClass}
                border-zinc-200 dark:border-zinc-800 cursor-pointer overflow-x-scroll no-scrollbar`}>
      {/* format and render cell's content based on type etc */}
      <CellContent cell={cell} location={location}></CellContent>
    </div>
  );
};
