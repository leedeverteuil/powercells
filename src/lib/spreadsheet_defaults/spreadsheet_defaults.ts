import type { SpreadsheetSerialized } from "../spreadsheet";
import { compoundInterest } from "./compound_interest";

export const defaultSheets: { [key: string]: SpreadsheetSerialized } = {
  "compoundInterest": compoundInterest,
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


