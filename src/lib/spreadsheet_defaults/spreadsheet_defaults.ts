import type { SpreadsheetSerialized } from "../spreadsheet";
import { compoundInterest } from "./compound_interest";
import { docs } from "./docs";
import { gameOfLife } from "./game_of_life";
import { weatherApi } from "./weather_api";

export const defaultSheets: { [key: string]: SpreadsheetSerialized } = {
  "docs": docs,
  "compoundInterest": compoundInterest,
  "weatherApi": weatherApi,
  "gameOfLife": gameOfLife,
  "blank": {
    key: "blank",
    grid: [],
    customColSizes: [],
  },
};


