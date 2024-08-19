import { PrivateCellNormal } from "./cells/cell_normal";
import type { CellLocation, CellValue, PrivateCell } from "./cells/cell_types";
import { findCellAtLocation, getLocationId, parseLocationQuery } from "./cells/cells_util";

// constants
const DEFAULT_COL_WIDTH = 120;
const MIN_COL_WIDTH = 60;
const MAX_COL_WIDTH = 300;

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

export type PublicFunctions = {
  get: (query: string) => (CellValue | CellValue[]);
  set: (query: string, value: CellValue) => void;
  update: (query: string, handler: (value: CellValue) => CellValue) => void;
};

export type CustomColSizes = {
  [col: number]: number;
};

// constants
export const letters = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
  "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
  "u", "v", "w", "x", "y", "z"
];

export class PrivateSpreadsheet {
  selectedLocation: CellLocation | null = null;
  grid: PrivateCell[][] = [];
  subscriberRecords: SpreadsheetSubscriberRecord[] = [];
  customColSizes: CustomColSizes = {};

  init() {
    this.recalculate().then().catch(console.error);
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

  getGridTemplateColumns() {
    let str = "";

    // there are 26 columns
    for (let i = 0; i < 26; i++) {
      const customSize = this.customColSizes[i] ?? DEFAULT_COL_WIDTH;
      str += ` ${customSize}px`;
    }

    return `40px${str}`;
  }

  updateCustomColumnSize(col: number, delta: number) {
    const current = this.customColSizes[col] ?? 120;
    this.customColSizes[col] = Math.max(
      Math.min(MAX_COL_WIDTH, current - delta),
      MIN_COL_WIDTH
    );

    this.updateSubscribers(["columnSizes"]);
  }

  public runQuery(query: string): PrivateCell[] {
    const results: PrivateCell[] = [];

    // is range or not
    if (query.includes(":")) {
      // split by colon
      const rangeParts = query.split(":");

      if (rangeParts.length !== 2) {
        throw new Error("Invalid query: invalid use of range symbol ':'");
      }

      // parse individual parts
      const locA = parseLocationQuery(rangeParts[0]);
      const locB = parseLocationQuery(rangeParts[1]);

      // build range of cells
      const startCol = locA.col;
      const endCol = locB.col;
      const startRow = locA.row;
      const endRow = locB.row;

      if (startCol > endCol) throw new Error("Invalid query: range start column cannot be greater than end column");
      if (startRow > endRow) throw new Error("Invalid query: range start row cannot be greater than end row");
      if (startRow === endRow && startCol === endCol) throw new Error("Invalid query: range start and end locations cannot be equal")

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          results.push(this.getCell({ col: c, row: r }));
        }
      }
    }
    else {
      const loc = parseLocationQuery(query);
      results.push(this.getCell(loc));
    }

    return results;
  }

  public getPublicFunctions(dependentCell?: PrivateCell): PublicFunctions {
    // get one or many
    const get = (query: string) => {
      const results = this.runQuery(query);

      // link dependencies
      if (dependentCell) { dependentCell.addDependency(...results); }

      const len = results.length
      if (len === 0) {
        return "";
      }
      else if (len === 1) {
        return results[0].value;
      }
      else {
        return results.map(r => r.value);
      }
    };

    // set one or many
    const set = (query: string, value: CellValue) => {
      const results = this.runQuery(query);
      for (const r of results) {
        r.setValue(value);
      }
    };

    // update one or many
    const update = (query: string, handler: (value: CellValue) => CellValue) => {
      const results = this.runQuery(query);
      for (const r of results) {
        r.setValue(handler(r.value));
      }
    };

    return { get, set, update };
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
