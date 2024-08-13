import type { CellLocation, PrivateCell } from "@/lib/cell_types";
import { findCellAtLocation, getPublicCellFromPrivate } from "@/lib/cells";
import { TOTAL_NUM_ROWS } from "@/lib/config";
import { letters, spreadsheet } from "@/lib/spreadsheet";
import { useEffect, useState, type ReactElement } from "react";

const CellsGrid = () => {
  // re-check dom whenever the spreadsheet changes
  const [_, setLastChangeTs] = useState(0);
  useEffect(() => {
    const listen = (ts: number) => {
      setLastChangeTs(ts);
    };

    spreadsheet.renderListener = listen;

    return () => {
      if (spreadsheet.renderListener === listen) {
        spreadsheet.renderListener = null;
      }
    };
  }, []);

  // build rendered cells
  const renderedCells: ReactElement[] = [];
  for (let row = 0; row < TOTAL_NUM_ROWS + 1; row++) {
    // add label cell for row
    renderedCells.push(buildRowLabelCell(row));

    for (let col = 0; col < letters.length; col++) {
      // header cell for columns if row is 0
      if (row === 0) {
        renderedCells.push(buildHeaderCell(row, col));
      } else {
        const renderRow = row - 1;
        const location = { row: renderRow, col };
        const cell = findCellAtLocation(spreadsheet.grid, location);
        renderedCells.push(buildContentCell(location, cell));
      }
    }
  }

  return (
    <div className="max-h-screen overflow-y-scroll">
      <div className="pr-32 text-xs pb-80 cell-grid">{renderedCells}</div>
    </div>
  );
};

function buildRowLabelCell(row: number) {
  const isFirstRow = row === 0;
  const content = isFirstRow ? "" : row - 1;
  const borderClass = isFirstRow ? "border-t-0" : "";
  const key = `${row}-label`;

  return (
    <div
      key={key}
      className={`p-1 border-[0.5px] border-r border-zinc-200
                  dark:border-zinc-800 sticky left-0 bg-white dark:bg-zinc-950
                  text-zinc-600 dark:text-zinc-200 font-medium text-center ${borderClass}`}>
      {content}
    </div>
  );
}

function buildHeaderCell(row: number, col: number) {
  const cellLetter = letters[col];
  const key = `${cellLetter}-label`;
  const borderClass = `${row === 0 ? "border-t-0" : ""} ${
    col === 0 ? "border-l-0" : ""
  }`;

  return (
    <div
      key={key}
      className={`p-1 border-[0.5px] ${borderClass} border-zinc-200 dark:border-zinc-800 text-center
               text-zinc-600 dark:text-zinc-200 font-medium`}>
      {cellLetter.toUpperCase()}
    </div>
  );
}

function buildContentCell(location: CellLocation, cell: PrivateCell | null) {
  const { col, row } = location;
  const cellLetter = letters[col];
  const cellNumber = row + 1;
  const cellId = `${cellLetter}${cellNumber}`;

  // build content
  let content: ReactElement = <></>;

  if (cell?.type === "normal") {
    const format = cell.format;
    const value = cell.value;

    // user wrote a formatter
    if (format) {
      content = (
        <>
          {format(
            value,
            getPublicCellFromPrivate(cell),
            spreadsheet.publicSpreadsheet
          )}
        </>
      );
    }
    // no formatter provided
    else {
      content = <span>{value.toString()}</span>;
    }
  }

  return (
    <div
      key={cellId}
      className={`p-1 border-[0.5px] ${row === 0 ? "border-t-0" : ""}
            ${col === 0 ? "border-l-0" : ""}
            border-zinc-200 dark:border-zinc-800`}>
      {content}
    </div>
  );
}

export default CellsGrid;
