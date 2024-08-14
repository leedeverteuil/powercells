import type { PrivateCellNormal, PublicCellNormal } from "./cell_normal";

export type CellLocation = {
  row: number;
  col: number;
};

export type CellValue = string | number | boolean;

export type CellType = "normal" | "button" | "toggle" | "slider" | "timer";

export type PrivateCell = PrivateCellNormal;
export type PublicCell = PublicCellNormal;

// private cells

// export type PrivateCellWithButton = BaseCell & {
//   type: "button";
//   id: string;
//   label: string;
//   action: ((spreadsheet: PublicSpreadsheet) => void) | null;
// }

// export type PrivateCellWithToggle = BaseCell & {
//   type: "toggle";
//   id: string;
//   label: string;
//   value: boolean;
//   toggle: ((value: boolean, spreadsheet: PublicSpreadsheet) => void) | null;
// }

// export type PrivateCellWithTimer = BaseCell & {
//   type: "timer";
//   id: string;
//   label: string;
//   loopTimeMs: number;
//   timeLeftMs: number;
// };

// export type PrivateCell = PrivateCellNormal | PrivateCellWithButton | PrivateCellWithToggle | PrivateCellWithTimer;

// export type PublicCellWithButton = BaseCell & {
//   type: "button";
//   location: CellLocation;
//   id: string;
//   label: string;
// }

// export type PublicCellWithToggle = BaseCell & {
//   type: "toggle";
//   location: CellLocation;
//   id: string;
//   label: string;
//   getValue: () => boolean;
// }

// export type PublicCellWithTimer = BaseCell & {
//   type: "timer";
//   location: CellLocation;
//   id: string;
//   label: string;
//   loopTimeMs: number;
//   timeLeftMs: number;
// };

// export type PublicCell = PublicCellNormal | PublicCellWithButton | PublicCellWithToggle | PublicCellWithTimer;
