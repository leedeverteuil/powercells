import type { PrivateCell } from "./cells/cell_types";
import { spreadsheet } from "./spreadsheet";
import { getUniqueId } from "./utils";

export type FunctionType = "calculate" | "action" | "format" | "saveAction" | "saveCalculate" | "saveFormat";

export type LogError = {
  key: string;
  error: Error;
  timestamp: number;
  cell: PrivateCell;
  functionType: FunctionType;
};

export let log: LogError[] = [];

export function clearConsole() {
  log = [];
  spreadsheet.updateSubscribers(["console"]);
}

function addLogError(error: any, functionType: FunctionType, cell: PrivateCell) {
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

export async function handleLogging(func: Function, functionType: FunctionType, cell: PrivateCell) {
  try {
    await func();
  }
  catch (error) {
    addLogError(error, functionType, cell);
  }
}

export function handleLoggingSync(func: Function, functionType: FunctionType, cell: PrivateCell) {
  try {
    return func();
  }
  catch (error) {
    addLogError(error, functionType, cell);
  }
}
