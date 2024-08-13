import type { PublicSpreadsheet } from "./spreadsheet_types";

export type CellLocation = {
  row: number;
  col: number;
};

export type CellValue = string | number | boolean;

export type CellType = "normal" | "button" | "toggle" | "slider" | "timer";

// shared with public and private
export type BaseCell = {
  type: CellType;
  location: CellLocation;
};

// private cells
export type PrivateCellNormal = BaseCell & {
  type: "normal";
  value: CellValue;
  dependencies: PrivateCellNormal[];
  dependents: PrivateCellNormal[];
  setValue: (value: CellValue) => void;
  format: ((value: CellValue, cell: PublicCell, spreadsheet: PublicSpreadsheet) => string) | null;
  calculate: ((cell: PublicCell, spreadsheet: PublicSpreadsheet) => CellValue) | null;
}

export type PrivateCellWithButton = BaseCell & {
  type: "button";
  id: string;
  label: string;
  action: ((spreadsheet: PublicSpreadsheet) => void) | null;
}

export type PrivateCellWithToggle = BaseCell & {
  type: "toggle";
  id: string;
  label: string;
  value: boolean;
  toggle: ((value: boolean, spreadsheet: PublicSpreadsheet) => void) | null;
}

export type PrivateCellWithTimer = BaseCell & {
  type: "timer";
  id: string;
  label: string;
  loopTimeMs: number;
  timeLeftMs: number;
};

export type PrivateCell = PrivateCellNormal | PrivateCellWithButton | PrivateCellWithToggle | PrivateCellWithTimer;

// public cell types
export type PublicCellNormal = BaseCell & {
  type: "normal";
  location: CellLocation;
  getValue: () => CellValue;
  setValue: (value: CellValue) => void;
}

export type PublicCellWithButton = BaseCell & {
  type: "button";
  location: CellLocation;
  id: string;
  label: string;
}

export type PublicCellWithToggle = BaseCell & {
  type: "toggle";
  location: CellLocation;
  id: string;
  label: string;
  getValue: () => boolean;
}

export type PublicCellWithTimer = BaseCell & {
  type: "timer";
  location: CellLocation;
  id: string;
  label: string;
  loopTimeMs: number;
  timeLeftMs: number;
};

export type PublicCell = PublicCellNormal | PublicCellWithButton | PublicCellWithToggle | PublicCellWithTimer;
