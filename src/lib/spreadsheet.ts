import { PrivateCellNormal } from "./cells/cell_normal";
import type { CellLocation, CellValue, PrivateCell } from "./cells/cell_types";
import { findCellAtLocation, getLocationId, parseCellLocationFromUserInput } from "./cells/cells_util";

// types
export type SpreadsheetSubscriber = (ts: number) => void;
export type SpreadsheetSubscriberRecord = {
  subscriber: SpreadsheetSubscriber;
  dependencies: string[];
};

export type DependencyNode = {
  cell: PrivateCellNormal;
  neighbors: DependencyNode[];
  visited: boolean;
};

// constants
export const letters = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
  "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
  "u", "v", "w", "x", "y", "z"
];

export class PublicSpreadsheet {
  private privateSpreadsheet: PrivateSpreadsheet;
  private dependentCell: PrivateCellNormal | null = null;

  constructor(privateSpreadsheet: PrivateSpreadsheet, dependentCell: PrivateCellNormal | null = null) {
    this.privateSpreadsheet = privateSpreadsheet;
    this.dependentCell = dependentCell;
  }

  public getCell(col: string | number, row: number): CellValue {
    const location = parseCellLocationFromUserInput(col, row)
    const cell = this.privateSpreadsheet.getCell(location);

    // retrieved cell is now a dependency
    if (this.dependentCell) {
      this.dependentCell.addDependency(cell);
    }

    return cell.value;
  }

  public setCell(col: string | number, row: number, value: CellValue) {
    const location = parseCellLocationFromUserInput(col, row)
    const cell = this.privateSpreadsheet.getCell(location);
    cell.setValue(value);
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
    this.recalculate().then().catch(console.error);
  }

  destroy() {
    // todo
    console.log("destroying spreadsheet");
  }

  getPublicSpreadsheet(dependentCell?: PrivateCellNormal): PublicSpreadsheet {
    // anytime the dependent cell uses public spreadsheet's getCell()
    // it will add that cell retrieved from getCell
    // to the depending cell's dependencies
    return new PublicSpreadsheet(this, dependentCell);
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

  async recalculate() {
    // run all in order
    for (const cell of this.getCalculateOrder()) {
      await cell.runCalculate(false);
      this.updateSubscribers([getLocationId(cell.location)]);
    }
  }

  handleCellChangeAsync(changedCell: PrivateCellNormal) {
    this.handleCellChange(changedCell, [])
      .then()
      .catch(err => {
        console.error(err);
      });
  }

  async handleCellChange(changedCell: PrivateCellNormal, updateChain: string[] = []) {
    this.updateSubscribers([getLocationId(changedCell.location), "grid"]);

    // any cells that depend on changed cell should recalculate
    for (const row of spreadsheet.grid) {
      if (Array.isArray(row)) {
        for (const cell of row) {
          if (cell && cell.type === "normal" && cell.dependencies.includes(changedCell)) {
            await cell.runCalculate(true, updateChain);
          }
        }
      }
    }
  }

  selectLocation(location: CellLocation | null) {
    // update new location and old location
    const deps = ["selectedLocation", "grid"];
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

  private getAllCells(): PrivateCell[] {
    return this.grid.reduce((acc, row) => {
      return [...acc, ...(row ?? [])];
    }, []);
  }

  private getCalculateOrder(): PrivateCellNormal[] {
    const cells = this.getAllCells().filter(c => c && c.type === "normal");

    // build nodes with dependents as neighbors
    const nodes: DependencyNode[] = cells.map(c => { return { cell: c, neighbors: [], visited: false } });
    for (const node of nodes) {
      const deps = node.cell.dependencies;
      for (const dep of deps) {
        const otherNode = nodes.find(n => n.cell === dep)!;
        otherNode.neighbors.push(node);
      }
    }

    // iterative topological sort
    const stack: DependencyNode[] = nodes.filter(n => n.cell.dependencies.length === 0);
    const order: PrivateCellNormal[] = [];

    while (stack.length !== 0) {
      const node = stack.pop();
      if (node && !node.visited) {
        node.visited = true;
        order.push(node.cell);
        for (const n of node.neighbors) {
          if (!n.visited) {
            stack.push(n);
          }
        }
      }
    }

    return order;
  }
}

export const spreadsheet = new PrivateSpreadsheet();

// @ts-ignore
window.spreadsheet = spreadsheet;
