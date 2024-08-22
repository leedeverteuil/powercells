import type { SpreadsheetSerialized } from "./spreadsheet";

export const defaultSheets: { [key: string]: SpreadsheetSerialized } = {
  "dataCleaning": {
    key: "dataCleaning",
    grid: [],
    customColSizes: [],
  },
  "weatherApi": {
    key: "weatherApi",
    grid: [],
    customColSizes: [],
  },
  "gameOfLife": {
    key: "gameOfLife",
    grid: [],
    customColSizes: [],
  },
  "blank": {
    key: "blank",
    grid: [],
    customColSizes: [],
  }
};
