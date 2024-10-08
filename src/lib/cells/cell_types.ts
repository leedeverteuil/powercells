import type { CellButton, CellButtonSerialized } from "./cell_button";
import type { CellNormal, CellNormalSerialized } from "./cell_normal";
import type { CellTimer, CellTimerSerialized } from "./cell_timer";

export type CellLocation = {
  row: number;
  col: number;
};

export type CellValue = string | number | boolean | object;

export type CellStyleProperty = "bold" | "italic" | "underline";

export type CellType = "normal" | "button" | "timer";

export type CellStyle = {
  [prop in CellStyleProperty]: boolean;
};

export type Cell = CellNormal | CellButton | CellTimer;

export type CellSerialized = CellNormalSerialized | CellButtonSerialized | CellTimerSerialized;

