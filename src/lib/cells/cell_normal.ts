import type { CellLocation, CellValue } from "./cell_types";
import { PublicSpreadsheet, spreadsheet } from "../spreadsheet";
import { BaseCell } from "./cell_base";
import { getPublicCellFromPrivate } from "./cells";

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

export type UserFormatFunction = ((currentValue: CellValue) => string);
export type UserCalculateFunction = ((currentValue: CellValue, spreadsheet: PublicSpreadsheet) => CellValue);

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
    spreadsheet.handleCellChange(this);
  }

  addDependency(cell: PrivateCellNormal) {
    if (!this.dependencies.includes(cell)) {
      this.dependencies.push(cell);
    }
  }

  clearDependencies() {
    this.dependencies = [];
  }

  setCalculateFunction(func: UserCalculateFunction) {
    this.calculate = func;
    this.dependencies = []; // reset dependencies
    this.runCalculate()
  }

  runCalculate(updateDependents: boolean = true) {
    // new deps will be determined during run
    this.clearDependencies();

    const oldValue = this.value;
    let calculatedValue: CellValue | null = null;

    try {
      calculatedValue = this.calculate!(oldValue, spreadsheet.getPublicSpreadsheet(this));
    }
    catch (err) {
      console.error(err);
      // todo inform user of error they made
    }

    this.setValue(calculatedValue ?? "");

    // update dependents if changed
    const changed = oldValue !== calculatedValue;
    if (changed && updateDependents) {
      spreadsheet.handleCellChange(this);
    }
  }
}
