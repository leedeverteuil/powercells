import { PrivateCellNormal } from "./cells/cell_normal";
import type { CellLocation, PrivateCell } from "./cells/cell_types";
import { getPublicCellFromPrivate, recalculateCellWithValueCheck } from "./cells/cells";
import { findCellAtLocation, getLocationId, parseCellLocationFromUserInput } from "./cells/cells_util";

// types
export type SpreadsheetSubscriber = (ts: number) => void;
export type SpreadsheetSubscriberRecord = {
  subscriber: SpreadsheetSubscriber;
  dependencies: string[];
};

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
  selectedLocation: CellLocation | null = null;
  grid: PrivateCell[][] = [];
  publicSpreadsheet: PublicSpreadsheet;
  subscriberRecords: SpreadsheetSubscriberRecord[] = [];

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

  /** @returns unsubscribe function */
  subscribe(func: SpreadsheetSubscriber, dependencies: string[]): () => void {
    // already in arr
    const exists = this.subscriberRecords.find(s => s.subscriber === func);
    if (!exists) {
      this.subscriberRecords.push({
        subscriber: func,
        dependencies
      });
    }

    // unsub function
    return () => {
      this.subscriberRecords = this.subscriberRecords.filter(s => s.subscriber !== func);
    };
  }

  getCell(location: CellLocation): PrivateCell {
    const existingCell = findCellAtLocation(this.grid, location);

    if (existingCell) {
      return existingCell;
    }

    // no existing cell, but we will create since it is
    // being summoned now
    else {
      const { row, col } = location;
      const grid = this.grid;

      // make row if not already made
      let gridRow = grid[row];
      if (gridRow === undefined) {
        grid[row] = [];
        gridRow = grid[row];
      }

      const newCell = new PrivateCellNormal(location, "");
      gridRow[col] = newCell;

      return newCell;
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
    this.updateSubscribers([getLocationId(changedCell.location)]);

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
  }

  selectLocation(location: CellLocation | null) {
    // update new location and old location
    const deps = ["selectedLocation"];
    if (this.selectedLocation) {
      deps.push(getLocationId(this.selectedLocation));
    }

    if (location) {
      deps.push(getLocationId(location));
    }

    this.selectedLocation = location;
    this.updateSubscribers(deps);
  }

  private updateSubscribers(dependencies: string[]) {
    const ts = Date.now();

    // look for subscribers matching any of those dependencies and fire them
    for (const record of this.subscriberRecords) {
      const recordDeps = record.dependencies;
      if (dependencies.find(d => recordDeps.includes(d)) !== undefined) {
        try { record.subscriber(ts); }
        catch (err) { console.warn(err); }
      }
    }
  }
}

export const spreadsheet = new PrivateSpreadsheet();

// @ts-ignore
window.spreadsheet = spreadsheet;
