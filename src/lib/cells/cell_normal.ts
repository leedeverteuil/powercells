import type { CellLocation, CellValue, PublicCell } from "./cell_types";
import { PublicSpreadsheet, spreadsheet } from "../spreadsheet";
import { BaseCell } from "./cell_base";

export class PublicCellNormal extends BaseCell {
  private cell: PrivateCellNormal;

  constructor(location: CellLocation, cell: PrivateCellNormal) {
    super("normal", location);
    this.cell = cell;
  }

  getValue() {
    return this.cell.value;
  }

  setValue(value: CellValue) {
    this.cell.setValue(value);
  }
}

export type UserFormatFunction = ((value: CellValue, cell: PublicCell, spreadsheet: PublicSpreadsheet) => string);
export type UserCalculateFunction = ((cell: PublicCell, spreadsheet: PublicSpreadsheet) => CellValue);

export class PrivateCellNormal extends BaseCell {
  dependencies: PrivateCellNormal[] = [];
  dependents: PrivateCellNormal[] = [];
  value: CellValue;
  format: UserFormatFunction | null = null;
  calculate: UserCalculateFunction | null = null;

  constructor(
    location: CellLocation,
    value: CellValue,
  ) {
    super("normal", location);
    this.value = value;
  }

  setValue(value: CellValue) {
    this.value = value;
    spreadsheet.handleCellChange(this, false);
  }
}
