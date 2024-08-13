import type { CellLocation, PrivateCell, PrivateCellNormal } from "./cell_types";
import {
  addBlankCell, findCellAtLocation, getPublicCellFromPrivate,
  parseCellLocationFromUserInput, recalculateCellWithValueCheck
} from "./cells";

// constants
export const letters = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
  "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
  "u", "v", "w", "x", "y", "z"
];

export class PublicSpreadsheet {
  private privateSpreadsheet: PrivateSpreadsheet;

  constructor(privateSpreadsheet: PrivateSpreadsheet) {
    this.privateSpreadsheet = privateSpreadsheet;
  }

  public getCell(col: string | number, row: number) {
    // parse user inputs for location
    const location = parseCellLocationFromUserInput(col, row)

    // look for existing private cell, if not then make it, add it to rows at appropriate space
    const cell = this.privateSpreadsheet.getCell(location);
    return getPublicCellFromPrivate(cell);
  }
}

export class PrivateSpreadsheet {
  grid: PrivateCell[][] = [];
  publicSpreadsheet: PublicSpreadsheet;
  renderListener: ((ts: number) => void) | null = null;

  constructor() {
    this.publicSpreadsheet = new PublicSpreadsheet(this);
  }

  init() {
    this.recalculate();
  }

  destroy() {
    // todo
    console.log("destroying spreadsheet");
  }

  getCell(location: CellLocation): PrivateCell {
    const existingCell = findCellAtLocation(this.grid, location);

    if (existingCell) {
      return existingCell;
    }

    // no existing cell, but we will create since it is
    // being summoned now
    else {
      return addBlankCell(this, location);
    }
  }

  recalculate() {
    for (const row of this.grid) {
      if (Array.isArray(row)) {
        for (const cell of row) {
          // if cell is normal and has no dependencies
          if (cell.type === "normal" && cell.dependencies.length === 0) {
            // run user calculate hook
            if (cell.calculate !== null) {
              recalculateCellWithValueCheck(cell, this.publicSpreadsheet);
            }

            // alert dependents of this cell now
            this.handleCellChange(cell, true);
          }
        }
      }
    }
  }

  handleCellChange(changedCell: PrivateCellNormal, isFullRecalculate = false): void {
    for (const dep of changedCell.dependents) {
      let didChange = false;

      // run user calculate hook
      if (dep.calculate !== null) {
        didChange = recalculateCellWithValueCheck(dep, this.publicSpreadsheet!);
      }

      // alert dependents of this cell now
      if (didChange || isFullRecalculate) {
        this.handleCellChange(dep, isFullRecalculate);
      }
    };

    // for react to re-render
    if (this.renderListener !== null) {
      this.renderListener(Date.now());
    }
  }
}

export const spreadsheet = new PrivateSpreadsheet();

// @ts-ignore
window.spreadsheet = spreadsheet;
