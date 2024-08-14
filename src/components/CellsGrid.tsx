import { TOTAL_NUM_ROWS } from "@/lib/config";
import { letters, spreadsheet } from "@/lib/spreadsheet";
import { type ReactElement } from "react";
import RowLabelCell from "./cells/RowLabelCell";
import { HeaderLabelCell } from "./cells/HeaderLabelCell";
import { ContentCell } from "./cells/ContentCell";
import { useRenderSubscriber } from "@/lib/render_subscriber";
import { findCellAtLocation } from "@/lib/cells/cells_util";
import type { CellLocation } from "@/lib/cells/cell_types";

const CellsGrid = () => {
  useRenderSubscriber(["grid"]);

  // build rendered cells
  const renderedCells: ReactElement[] = [];
  for (let row = 0; row < TOTAL_NUM_ROWS + 1; row++) {
    // add label cell for row
    renderedCells.push(
      <RowLabelCell key={`${row}-row-label`} row={row}></RowLabelCell>
    );

    for (let col = 0; col < letters.length; col++) {
      // header cell for columns if row is 0
      if (row === 0) {
        renderedCells.push(
          <HeaderLabelCell
            key={`${col}-col-label`}
            row={row}
            col={col}></HeaderLabelCell>
        );
      } else {
        const renderRow = row - 1;
        const location: CellLocation = { row: renderRow, col };
        renderedCells.push(
          <ContentCell
            key={`${col}-${renderRow}-cell`}
            location={location}></ContentCell>
        );
      }
    }
  }

  return (
    <div className="max-h-screen overflow-y-scroll">
      <div className="pr-32 text-xs pb-80 cell-grid">{renderedCells}</div>
    </div>
  );
};

export default CellsGrid;
