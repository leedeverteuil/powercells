import type { CellLocation } from "./cell_types";
import { BaseCell } from "./cell_base";
import { handleLogging } from "../console";
import { buildActionFunction, getFunctionBody } from "../code_editor";
import { Spreadsheet, SpreadsheetContext } from "../spreadsheet";

export type CellButtonSerialized = {
  type: "button";
  location: CellLocation;
  label: string;
  action: string | null;
  buttonStyle: CellButtonStyle;
};

export type CellButtonStyle = "primary" | "secondary" | "destructive";

export class CellButton extends BaseCell {
  label = "Click Me";
  buttonStyle: CellButtonStyle = "primary";
  action: Function | null = null;

  constructor(
    spreadsheet: Spreadsheet,
    location: CellLocation,
    label: string = "Click Me",
    buttonStyle: CellButtonStyle = "primary",
    action: Function | null = null,
  ) {
    super(spreadsheet, location);
    this.label = label;
    this.buttonStyle = buttonStyle;
    this.action = action;
  }

  destroy() { }

  serialize(): CellButtonSerialized {
    return {
      type: "button",
      location: this.location,
      label: this.label,
      buttonStyle: this.buttonStyle,
      action: this.action ? getFunctionBody(this.action) : null,
    };
  };

  static fromSerialized(spreadsheet: Spreadsheet, serialized: CellButtonSerialized): CellButton {
    const { location, label, buttonStyle, action } = serialized;
    const cell = new CellButton(
      spreadsheet,
      location,
      label,
      buttonStyle,
      action ? buildActionFunction(action) : null
    );

    return cell;
  }

  setLabel(label: string) {
    this.label = label;
    this.callHandleCellChangeAsync();
  }

  setButtonStyle(style: CellButtonStyle) {
    this.buttonStyle = style;
    this.callHandleCellChangeAsync();
  }

  setActionFunction(func: Function | null) {
    this.action = func;
    this.callHandleCellChangeAsync();
  }

  async runAction() {
    const cell = this;

    await handleLogging(async () => {
      // no action function
      if (!cell.action) return;

      const { get, set, update } = this.spreadsheet.getPublicFunctions();
      await cell.action(get, set, update);
    }, "action", this);
  }
}
