import type { Cell } from "./cells/cell_types";
import { getUniqueId } from "./utils";
import type { Spreadsheet } from "./spreadsheet";

export type FunctionType = "calculate" | "action" | "format" | "saveAction" | "saveCalculate" | "saveFormat";

export type LogError = {
  key: string;
  error: Error;
  timestamp: number;
  cell: Cell;
  functionType: FunctionType;
};

export let log: LogError[] = [];

export function clearConsole(spreadsheet: Spreadsheet) {
  log = [];
  spreadsheet.updateSubscribers(["console"]);
}

function addLogError(error: any, functionType: FunctionType, cell: Cell, spreadsheet: Spreadsheet) {
  if (error instanceof Error) {
    spreadsheet.updateSubscribers(["console"]);

    log = [{
      key: getUniqueId(),
      timestamp: Date.now(),
      error,
      cell,
      functionType
    }, ...log];

    console.warn("Error caught and logged to app console.");
  }
}

export async function handleLogging(func: Function, functionType: FunctionType, cell: Cell) {
  const spreadsheet = cell.spreadsheet;

  try {
    await func();
  }
  catch (error) {
    addLogError(error, functionType, cell, spreadsheet);
  }
}

export function handleLoggingSync(func: Function, functionType: FunctionType, cell: Cell) {
  const spreadsheet = cell.spreadsheet;

  try {
    return func();
  }
  catch (error) {
    addLogError(error, functionType, cell, spreadsheet);
  }
}
