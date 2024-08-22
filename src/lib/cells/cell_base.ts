import type { CellLocation } from "./cell_types";
import { Spreadsheet } from "../spreadsheet";

export abstract class BaseCell {
  spreadsheet: Spreadsheet;
  location: CellLocation;

  constructor(spreadsheet: Spreadsheet, location: CellLocation) {
    this.spreadsheet = spreadsheet;
    this.location = location;
  }

  callHandleCellChangeAsync() {
    //@ts-ignore
    this.spreadsheet.handleCellChangeAsync(this);
  }
}
