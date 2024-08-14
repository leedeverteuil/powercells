import type { CellLocation, PrivateCell } from "./cell_types";

// for converting letters to numbers
const lettersToNums: { [letter: string]: number } = {
  a: 0, b: 1, c: 2, d: 3, e: 4, f: 5,
  g: 6, h: 7, i: 8, j: 9, k: 10, l: 11,
  m: 12, n: 13, o: 14, p: 15, q: 16, r: 17,
  s: 18, t: 19, u: 20, v: 21, w: 22, x: 23,
  y: 24, z: 25
};

// functions
export function getLocationId(location: CellLocation) {
  return `${location.col}-${location.row}`;
}

export function areLocationsEqual(locationA: CellLocation, locationB: CellLocation) {
  return locationA.col === locationB.col && locationA.row === locationB.row;
}

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
