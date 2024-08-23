import type { SpreadsheetSerialized } from "../spreadsheet";
import { compoundInterest } from "./compound_interest";
import { gameOfLife } from "./game_of_life";
import { weatherApi } from "./weather_api";

export const defaultSheets: { [key: string]: SpreadsheetSerialized } = {
  "compoundInterest": compoundInterest,
  "weatherApi": weatherApi,
  "gameOfLife": gameOfLife,
  "blank": {
    key: "blank",
    grid: [],
    customColSizes: [],
  }
};


