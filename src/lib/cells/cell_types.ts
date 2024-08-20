import type { PrivateCellButton } from "./cell_button";
import type { PrivateCellNormal } from "./cell_normal";
import type { PrivateCellTimer } from "./cell_timer";

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

export type PrivateCell = PrivateCellNormal | PrivateCellButton | PrivateCellTimer;

