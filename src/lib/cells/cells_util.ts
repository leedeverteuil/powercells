import { letters } from "../spreadsheet";
import { CellButton } from "./cell_button";
import { CellNormal } from "./cell_normal";
import { CellTimer } from "./cell_timer";
import type { CellLocation, CellType, CellValue, Cell } from "./cell_types";

// for converting letters to numbers
const lettersToNums: { [letter: string]: number } = {
  a: 0, b: 1, c: 2, d: 3, e: 4, f: 5,
  g: 6, h: 7, i: 8, j: 9, k: 10, l: 11,
  m: 12, n: 13, o: 14, p: 15, q: 16, r: 17,
  s: 18, t: 19, u: 20, v: 21, w: 22, x: 23,
  y: 24, z: 25
};

const numsToLetters: { [num: number]: string } = {
  0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f',
  6: 'g', 7: 'h', 8: 'i', 9: 'j', 10: 'k', 11: 'l',
  12: 'm', 13: 'n', 14: 'o', 15: 'p', 16: 'q', 17: 'r',
  18: 's', 19: 't', 20: 'u', 21: 'v', 22: 'w', 23: 'x',
  24: 'y', 25: 'z'
};

// functions
export function getConstructorForCellType(type: CellType) {
  if (type === "normal") return CellNormal;
  if (type === "button") return CellButton;
  if (type === "timer") return CellTimer;

  return null;
}

export function getCellTypeFromConstructor(constructor: Function): CellType | null {
  if (constructor === CellNormal) return "normal";
  if (constructor === CellButton) return "button";
  if (constructor === CellTimer) return "timer";

  return null;
}

export function getLocationId(location: CellLocation) {
  return `${location.col}-${location.row}`;
}

export function areLocationsEqual(locationA: CellLocation, locationB: CellLocation) {
  return locationA.col === locationB.col && locationA.row === locationB.row;
}

export function getLocationDisplayName(location: CellLocation) {
  return `${numsToLetters[location.col]}${location.row}`.toUpperCase();
}

export function parseLocationQuery(queryCell: string): CellLocation {
  // prepare initial
  queryCell = queryCell ?? "";
  queryCell = queryCell.trim();

  if (queryCell.length < 2) {
    throw new Error("Invalid query: must be at least 2 characters long.")
  }

  let parts: string[] = [];

  // comma format or not
  if (queryCell.includes(",")) {
    parts = queryCell.split(",");
    if (parts.length !== 2) {
      throw new Error("Invalid query: invalid use of comma.");
    }
  }
  else {
    parts = [queryCell[0], queryCell.slice(1, queryCell.length)];
  }

  // parse parts into col and row
  let col: number;
  let row: number;

  // col parse
  const colStr = (parts[0] ?? "").trim().toLowerCase();
  // can be a single letter
  if (letters.includes(colStr)) {
    col = lettersToNums[colStr];
  }
  // can be a number from 0 to 25
  else {
    col = parseInt(colStr);
    if (isNaN(col)) {
      throw new Error("Invalid query: failed to parse column number.");
    }
    if (col < 0 || col > 25) {
      throw new Error("Invalid query: valid column number range is 0 to 25.");
    }
  }

  // row parse
  const rowStr = (parts[1] ?? "").trim();
  // can be a number from 0 to 49
  row = parseInt(rowStr);
  if (isNaN(row)) {
    throw new Error("Invalid query: failed to parse row number.");
  }
  if (row < 0 || row > 49) {
    throw new Error("Invalid query: valid row number range is 0 to 49.");
  }

  return {
    col, row
  };
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

export function findCellAtLocation(grid: Cell[][], location: CellLocation): (Cell | null) {
  const row = grid[location.row];
  if (row) {
    const cell = row[location.col]
    if (cell) {
      return cell;
    }
  }

  return null;
}

export function inputToCellValue(input: string): CellValue {
  // if value is `true` or `false` it's a bool
  if (input === "true") {
    return true;
  }
  else if (input === "false") {
    return false;
  }
  // valid int
  else if (input.match(/^-?\d+$/)) {
    return parseInt(input, 10);
  }
  // valid float
  else if (input.match(/^-?\d*\.\d+$/)) {
    return parseFloat(input);
  }
  // no clue what it is, keep it as string
  else {
    return input;
  }
}

export function cellValueToString(value: CellValue): string {
  return value.toString();
}
