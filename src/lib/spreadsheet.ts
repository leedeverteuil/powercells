import { createContext } from "react";
import { CellButton } from "./cells/cell_button";
import { CellNormal } from "./cells/cell_normal";
import { CellTimer } from "./cells/cell_timer";
import type { CellLocation, CellType, CellValue, Cell, CellSerialized } from "./cells/cell_types";
import { findCellAtLocation, getConstructorForCellType, getLocationId, parseLocationQuery } from "./cells/cells_util";
import { defaultSheets } from "./spreadsheet_defaults/spreadsheet_defaults";

// constants
const DEFAULT_COL_WIDTH = 120;
const MIN_COL_WIDTH = 60;
const MAX_COL_WIDTH = 700;

// types
export type SpreadsheetSubscriber = (ts: number) => void;
export type SpreadsheetSubscriberRecord = {
  subscriber: SpreadsheetSubscriber;
  dependencies: string[];
};

export type DependencyNode = {
  cell: CellNormal;
  neighbors: DependencyNode[];
  visited: boolean;
};

export type PublicFunctions = {
  get: (query: string) => (CellValue | CellValue[]);
  set: (query: string, value: CellValue) => void;
  update: (query: string, handler: (value: CellValue) => CellValue) => void;
};

export type CustomColSizes = {
  [col: number]: number | null;
};

export type SpreadsheetSerialized = {
  key: string;
  grid: ((CellSerialized | null)[] | null)[];
  customColSizes: CustomColSizes;
};

// constants
export const letters = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
  "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
  "u", "v", "w", "x", "y", "z"
];

// context
export const SpreadsheetContext = createContext<Spreadsheet | null>(null);

export class Spreadsheet {
  key: string;
  selectedLocation: CellLocation | null = null;
  grid: ((Cell | null)[] | null)[] = [];
  subscriberRecords: SpreadsheetSubscriberRecord[] = [];
  customColSizes: CustomColSizes = {};
  tainted: boolean = false;
  initDone: boolean = false;

  constructor(key: string) {
    this.key = key;
  }

  init() {
    this.recalculate()
      .then()
      .catch(console.error)
      .finally(() => {
        this.initDone = true;
      });
  }

  serialize(): SpreadsheetSerialized {
    // convert to serialized cells
    const convertedGrid = this.grid.map(row => {
      return row ? row.map(cell => {
        return cell ? cell.serialize() : null;
      }) : null;
    });

    return {
      key: this.key,
      grid: convertedGrid,
      customColSizes: this.customColSizes
    };
  }

  static fromSerialized(serialized: SpreadsheetSerialized): Spreadsheet {
    const { grid, customColSizes, key } = serialized;
    const spreadsheet = new Spreadsheet(key);

    spreadsheet.customColSizes = customColSizes;
    spreadsheet.grid = grid.map(row => {
      if (row) {
        return row.map((serializedCell) => {
          if (serializedCell) {
            const type = serializedCell.type;
            if (type === "normal") { return CellNormal.fromSerialized(spreadsheet, serializedCell); }
            if (type === "button") { return CellButton.fromSerialized(spreadsheet, serializedCell); }
            if (type === "timer") { return CellTimer.fromSerialized(spreadsheet, serializedCell); }
            throw new Error("Failed to build spreadsheet from serialized data.");
          }
          else {
            return null;
          }
        });
      }
      else {
        return null;
      }
    });

    return spreadsheet;
  }

  saveToStorage() {
    try {
      const item = localStorage.getItem("spreadsheetSaves");
      const json = JSON.parse(item || "{}");
      json[this.key] = this.serialize();
      localStorage.setItem("spreadsheetSaves", JSON.stringify(json));

      // for disabling save button, and
      // stop showing warning message when
      // switching sheets
      this.tainted = false;

      return true;
    }
    catch (err) {
      console.error(err);
      return false;
    }
  }

  static fromStorage(key: string): Spreadsheet {
    let obj: SpreadsheetSerialized | null = null;
    try {
      const item = localStorage.getItem("spreadsheetSaves");
      const json = JSON.parse(item || "{}");
      obj = json[key];
    }
    catch (err) {
      console.error(err);
    }

    if (!obj) {
      obj = defaultSheets[key];
    }

    return Spreadsheet.fromSerialized(obj);
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

  setCellType(location: CellLocation, type: CellType) {
    const existingCell = findCellAtLocation(this.grid, location);
    const cellConstructor = getConstructorForCellType(type);
    if (!cellConstructor) return;

    if (!existingCell || existingCell.constructor !== cellConstructor) {
      // need to create button cell
      const { row, col } = location;
      const grid = this.grid;

      // make row if not already made
      let gridRow = grid[row];
      if (!gridRow) {
        grid[row] = [];
        gridRow = grid[row];
      }

      const newCell = new cellConstructor(this, location);
      gridRow[col] = newCell;

      this.handleCellChangeAsync(newCell);
    }
  }

  getCell(location: CellLocation): Cell {
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
      if (!gridRow) {
        grid[row] = [];
        gridRow = grid[row];
      }

      const newCell = new CellNormal(this, location, "");
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

  handleCellChangeAsync(changedCell: Cell) {
    this.handleCellChange(changedCell, [])
      .then()
      .catch(err => {
        console.error(err);
      });
  }

  async handleCellChange(changedCell: Cell, updateChain: string[] = []) {
    if (this.initDone) {
      this.tainted = true;
    }

    this.updateSubscribers([getLocationId(changedCell.location), "grid", "tainted"]);

    // any cells that depend on changed cell should recalculate
    if (changedCell instanceof CellNormal) {
      for (const row of this.grid) {
        if (Array.isArray(row)) {
          for (const cell of row) {
            if (cell && cell instanceof CellNormal && cell.dependencies.includes(changedCell)) {
              await cell.runCalculate(true, updateChain);
            }
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

  runQuery(query: string): Cell[] {
    const results: Cell[] = [];

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

  getPublicFunctions(dependentCell?: CellNormal): PublicFunctions {
    // get one or many
    const get = (query: string) => {
      const results = this.runQuery(query);

      // link dependencies (only normal cells)
      if (dependentCell) {
        dependentCell.addDependency(...results.filter(c => c instanceof CellNormal));
      }

      const len = results.length
      if (len === 0) {
        return "";
      }
      else if (len === 1) {
        const firstResult = results[0];
        return firstResult instanceof CellNormal ? firstResult.value : "";
      }
      else {
        return results.map(r => {
          return r instanceof CellNormal ? r.value : "";
        });
      }
    };

    // set one or many
    const set = (query: string, value: CellValue) => {
      const results = this.runQuery(query);
      for (const r of results) {
        if (r instanceof CellNormal) {
          r.setValue(value);
        }
      }
    };

    // update one or many
    const update = (query: string, handler: (value: CellValue) => CellValue) => {
      const results = this.runQuery(query);
      for (const r of results) {
        if (r instanceof CellNormal) {
          r.setValue(handler(r.value));
        }
      }
    };

    return { get, set, update };
  }

  updateSubscribers(dependencies: string[]) {
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

  private getAllCells(): Cell[] {
    const cells: Cell[] = []

    for (const row of this.grid) {
      if (row) {
        for (const cell of row) {
          if (cell) {
            cells.push(cell);
          }
        }
      }
    }

    return cells;
  }

  private getCalculateOrder(): CellNormal[] {
    const cells = this.getAllCells().filter(c => c && c instanceof CellNormal);

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
    const order: CellNormal[] = [];

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
