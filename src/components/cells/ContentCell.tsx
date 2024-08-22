import type { CellLocation } from "@/lib/cells/cell_types";
import { CellContent } from "./CellContent";
import { spreadsheet } from "@/lib/spreadsheet";
import { useRenderSubscriber } from "@/lib/render_subscriber";
import {
  areLocationsEqual,
  findCellAtLocation,
  getLocationId,
} from "@/lib/cells/cells_util";
import { CellNormal } from "@/lib/cells/cell_normal";

type Props = {
  location: CellLocation;
};
export const ContentCell = ({ location }: Props) => {
  const cell = findCellAtLocation(spreadsheet.grid, location);
  const { col } = location;
  const selected =
    spreadsheet.selectedLocation &&
    areLocationsEqual(location, spreadsheet.selectedLocation);

  useRenderSubscriber([getLocationId(location)], true, cell);

  const onClick = () => {
    spreadsheet.selectLocation(location);
  };

  // tailwind
  const colBorderClass = col === 0 ? "border-l-0" : "";
  const selectedClass = selected
    ? "ring-[4px] ring-[#DFF9B4] dark:ring-[#2B4311] z-[1] outline outline-1 outline-lime-500 rounded-sm"
    : "";

  const styleClasses =
    cell && cell instanceof CellNormal
      ? `${cell.style.bold ? "font-semibold" : ""}
      ${cell.style.italic ? "italic" : ""}
      ${cell.style.underline ? "underline" : ""}
    `
      : "";

  const paddingClass = cell instanceof CellNormal ? "p-1" : "p-0";

  return (
    <div
      onClick={onClick}
      className={`border-[0.5px] ${paddingClass} ${colBorderClass} ${selectedClass} ${styleClasses}
                border-zinc-200 dark:border-zinc-800 cursor-pointer overflow-x-scroll no-scrollbar`}>
      {/* format and render cell's content based on type etc */}
      <CellContent cell={cell} location={location}></CellContent>
    </div>
  );
};
