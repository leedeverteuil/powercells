import type { CellLocation, CellStyle, CellStyleProperty, CellValue } from "./cell_types";
import { spreadsheet } from "../spreadsheet";
import { BaseCell } from "./cell_base";
import { getLocationId } from "./cells_util";

export type UserFormatFunction = Function;
export type UserCalculateFunction = Function;

export class PrivateCellNormal extends BaseCell {
  dependencies: PrivateCellNormal[] = [];
  value: CellValue;
  format: UserFormatFunction | null = null;
  calculate: UserCalculateFunction | null = null;
  style: CellStyle = { bold: false, italic: false, underline: false };

  constructor(
    location: CellLocation,
    value: CellValue = "",
  ) {
    super(location);
    this.value = value;
  }

  setValue(value: CellValue) {
    this.value = value;
    spreadsheet.handleCellChangeAsync(this);
  }

  addDependency(...deps: PrivateCellNormal[]) {
    for (const d of deps) {
      if (!this.dependencies.includes(d) && d instanceof PrivateCellNormal) {
        this.dependencies.push(d);
      }
    }
  }

  clearDependencies() {
    this.dependencies = [];
  }

  setCalculateFunction(func: UserCalculateFunction | null) {
    this.calculate = func;
    if (func) {
      this.runCalculate()
    }
    else {
      this.dependencies = [];
      spreadsheet.handleCellChangeAsync(this);
    }
  }

  setFormatFunction(func: UserFormatFunction | null) {
    this.format = func;
    spreadsheet.handleCellChangeAsync(this);
  }

  setStyleProp(prop: CellStyleProperty, enabled: boolean) {
    this.style[prop] = enabled;
    spreadsheet.handleCellChangeAsync(this);
  }

  async runCalculate(updateDependents: boolean = true, updateChain: string[] = []) {
    // no calculate function
    if (!this.calculate) return;

    // check update chain to see if already ran
    const locationId = getLocationId(this.location);
    if (updateChain.includes(locationId)) {
      throw new Error("Circular dependency chain stopped... Todo console display");
    }
    else {
      updateChain.push(locationId);
    }

    // new deps will be determined during run
    this.clearDependencies();

    const oldValue = this.value;
    let calculatedValue: CellValue | null = null;

    try {
      const { get, set, update } = spreadsheet.getPublicFunctions(this);
      calculatedValue = await this.calculate(oldValue, get, set, update);
    }
    catch (err) {
      console.error(err);
      // todo inform user of error they made
    }

    this.value = calculatedValue ?? "";

    // update dependents if changed
    const changed = oldValue !== calculatedValue;
    if (changed && updateDependents) {
      await spreadsheet.handleCellChange(this, updateChain);
    }
  }
}
