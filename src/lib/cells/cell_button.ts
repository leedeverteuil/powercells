import type { CellLocation } from "./cell_types";
import { spreadsheet } from "../spreadsheet";
import { BaseCell } from "./cell_base";

export type CellButtonStyle = "primary" | "secondary" | "destructive";

export class PrivateCellButton extends BaseCell {
  label = "Click Me";
  buttonStyle: CellButtonStyle = "primary";
  action: Function | null = null;

  constructor(
    location: CellLocation,
    label: string = "Click Me",
    buttonStyle: CellButtonStyle = "primary",
    action: Function | null = null,
  ) {
    super(location);
    this.label = label;
    this.buttonStyle = buttonStyle;
    this.action = action;
  }

  setLabel(label: string) {
    this.label = label;
    spreadsheet.handleCellChangeAsync(this);
  }

  setButtonStyle(style: CellButtonStyle) {
    this.buttonStyle = style;
    spreadsheet.handleCellChangeAsync(this);
  }

  setActionFunction(func: Function | null) {
    this.action = func;
    spreadsheet.handleCellChangeAsync(this);
  }

  async runAction() {
    // no action function
    if (!this.action) return;

    try {
      const { get, set, update } = spreadsheet.getPublicFunctions();
      await this.action(get, set, update);
    }
    catch (err) {
      console.error(err);
      // todo inform user of error they made
    }
  }
}
