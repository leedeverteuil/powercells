import type { CellLocation, CellValue, PrivateCell, PrivateCellNormal, PublicCell, PublicCellNormal, PublicCellWithButton, PublicCellWithTimer, PublicCellWithToggle } from "./cell_types";
import type { PrivateSpreadsheet, PublicSpreadsheet } from "./spreadsheet";

// for converting letters to numbers
const lettersToNums: { [letter: string]: number } = {
  a: 0, b: 1, c: 2, d: 3, e: 4, f: 5,
  g: 6, h: 7, i: 8, j: 9, k: 10, l: 11,
  m: 12, n: 13, o: 14, p: 15, q: 16, r: 17,
  s: 18, t: 19, u: 20, v: 21, w: 22, x: 23,
  y: 24, z: 25
};

// functions
export function parseCellLocationFromUserInput(col: string | number, row: number): CellLocation {
  // column can be a string A - Z sometimes, check if is a letter
  let columnNum = 0;
  if (typeof col === "string") {
    // make sure is valid letter (A-Z)
    const convertValue = lettersToNums[col.toLowerCase()];
    if (convertValue === undefined) {
      throw new Error("Invalid column parameter. Supported values include letters A to Z, or indices 0 to 25.")
    }
    columnNum = convertValue;
  }
  else {
    columnNum = col;
  }

  //! prototype version only has 50 rows (0 to 49).
  if (row > 49 || row < 0) {
    throw new Error("Invalid row parameter. Supported values include 0 to 49.");
  }

  return {
    col: columnNum,
    row: row
  };
}

export function makeBlankPrivateCell(location: CellLocation, spreadsheet: PrivateSpreadsheet): PrivateCellNormal {
  const cell: PrivateCellNormal = {
    type: "normal",
    location,
    value: "",
    dependencies: [],
    dependents: [],
    format: null,
    calculate: null,
    setValue: () => { },
  };

  cell.setValue = (cellValue: CellValue) => {
    cell.value = cellValue;
    spreadsheet.handleCellChange(cell, false);
  };

  return cell;
}

export function addBlankCell(spreadsheet: PrivateSpreadsheet, location: CellLocation): PrivateCellNormal {
  const { row, col } = location;
  const grid = spreadsheet.grid;

  // make row if not already made
  let gridRow = grid[row];
  if (gridRow === undefined) {
    grid[row] = [];
    gridRow = grid[row];
  }

  const newCell = makeBlankPrivateCell(location, spreadsheet);
  gridRow[col] = newCell;

  return newCell;
}

/** @returns `true` if value changed after recalculation */
export function recalculateCellWithValueCheck(cell: PrivateCellNormal, publicSpreadsheet: PublicSpreadsheet): boolean {
  const oldValue = cell.value;
  const publicCell = getPublicCellFromPrivate(cell);

  try {
    const calculatedValue = cell.calculate!(publicCell, publicSpreadsheet);

    // todo validate calculated value

    cell.setValue(calculatedValue);

    return oldValue !== calculatedValue;
  }
  catch (err) {
    console.error(err);
    // todo inform user of error they made
    throw err;
  }
}

export function findCellAtLocation(grid: PrivateCell[][], location: CellLocation): (PrivateCell | null) {
  const row = grid[location.row];
  if (row) {
    const cell = row[location.col]
    if (cell) {
      return cell;
    }
  }

  return null;
}

export function getPublicCellFromPrivate(privateCell: PrivateCell): PublicCell {
  const { type, location } = privateCell;

  // normal cells
  if (type === "normal") {
    const cell: PublicCellNormal = {
      type, location,
      getValue: () => privateCell.value,
      setValue: privateCell.setValue,
    };

    return cell;
  }

  // button cells
  else if (type === "button") {
    const cell: PublicCellWithButton = {
      type, location,
      id: "",
      label: "Untitled Button"
    };

    return cell;
  }

  // timer cells
  else if (type === "timer") {
    const cell: PublicCellWithTimer = {
      type, location,
      id: "",
      label: "Untitled Timer",
      loopTimeMs: 5000,
      timeLeftMs: 5000,
    };

    return cell;
  }

  // toggle cells
  else if (type === "toggle") {
    const cell: PublicCellWithToggle = {
      type, location,
      id: "",
      label: "Untitled Toggle",
      getValue: () => privateCell.value
    };

    return cell;
  }

  throw new Error("Could not convert private cell object to public (Bug)");
}
