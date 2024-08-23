import type { CellLocation, CellStyle, CellStyleProperty, CellValue } from "./cell_types";
import { BaseCell } from "./cell_base";
import { getLocationId } from "./cells_util";
import { handleLogging } from "../console";
import { buildCalculateFunction, buildFormatFunction, getFunctionBody } from "../code_editor";
import { Spreadsheet } from "../spreadsheet";

export type CellNormalSerialized = {
  type: "normal";
  location: CellLocation;
  value: CellValue;
  format: string | null;
  calculate: string | null;
  style: CellStyle;
};

export class CellNormal extends BaseCell {
  value: CellValue;
  dependencies: CellNormal[] = [];
  format: Function | null;
  calculate: Function | null;
  style: CellStyle;

  constructor(
    spreadsheet: Spreadsheet,
    location: CellLocation,
    value: CellValue = "",
    format: Function | null = null,
    calculate: Function | null = null,
    style: CellStyle = { bold: false, italic: false, underline: false }
  ) {
    super(spreadsheet, location);
    this.value = value;
    this.format = format;
    this.calculate = calculate;
    this.style = style;
  }

  destroy() { }

  serialize(): CellNormalSerialized {
    return {
      type: "normal",
      location: this.location,
      value: this.value,
      format: this.format ? getFunctionBody(this.format) : null,
      calculate: this.calculate ? getFunctionBody(this.calculate) : null,
      style: this.style,
    };
  };

  static fromSerialized(spreadsheet: Spreadsheet, serialized: CellNormalSerialized): CellNormal {
    const { location, value, format, calculate, style } = serialized;
    const cell = new CellNormal(
      spreadsheet,
      location,
      value,
      format ? buildFormatFunction(format) : null,
      calculate ? buildCalculateFunction(calculate) : null,
      style,
    );

    return cell;
  }

  setValue(value: CellValue) {
    this.value = value;
    this.callHandleCellChangeAsync();
  }

  addDependency(...deps: CellNormal[]) {
    for (const d of deps) {
      if (!this.dependencies.includes(d) && d instanceof CellNormal) {
        this.dependencies.push(d);
      }
    }
  }

  clearDependencies() {
    this.dependencies = [];
  }

  setCalculateFunction(func: Function | null) {
    this.calculate = func;
    if (!func) {
      this.dependencies = [];
    }

    this.callHandleCellChangeAsync();
  }

  setFormatFunction(func: Function | null) {
    this.format = func;
    this.callHandleCellChangeAsync();
  }

  setStyleProp(prop: CellStyleProperty, enabled: boolean) {
    this.style[prop] = enabled;
    this.callHandleCellChangeAsync();
  }

  isDefault() {
    if (this.value !== "") return false;
    if (this.format !== null) return false;
    if (this.calculate !== null) return false;
    if (this.style.bold || this.style.italic || this.style.underline) return false;
    return true;
  }

  async runCalculate(updateDependents: boolean = true, updateChain: string[] = []) {
    // no calculate function
    if (!this.calculate) return;

    // check update chain to see if already ran
    const locationId = getLocationId(this.location);
    if (updateChain.includes(locationId)) {
      // build chain string
      let chainStr = updateChain.map(id => `[${id}]`).join(" -> ");
      throw new Error(`Circular dependency detected: ${chainStr}`);
    }
    else {
      updateChain.push(locationId);
    }

    // new deps will be determined during run
    this.clearDependencies();

    const oldValue = this.value;
    let calculatedValue: CellValue | null = null;

    // run calculate function
    const cell = this;
    await handleLogging(async () => {
      if (!cell.calculate) return;
      const { get, set, update } = this.spreadsheet.getPublicFunctions(this);
      calculatedValue = await cell.calculate(oldValue, get, set, update);
    }, "calculate", cell);

    this.value = calculatedValue ?? "";

    // update dependents if changed
    const changed = oldValue !== calculatedValue;
    if (changed && updateDependents) {
      await this.spreadsheet.handleCellChange(this, updateChain);
    }
  }
}
