import { useContext, useEffect, useState } from "react";
import type { Cell } from "./cells/cell_types";
import { SpreadsheetContext } from "./spreadsheet";

export function useRenderSubscriber(deps: string[], requiresCell?: boolean, cell?: Cell | null) {
  const [lastRenderTs, setRenderTs] = useState(0);
  const spreadsheet = useContext(SpreadsheetContext);

  useEffect(() => {
    if (spreadsheet && (!requiresCell || cell !== null)) {
      return spreadsheet.subscribe((ts) => {
        setRenderTs(ts);
      }, deps);
    }
  }, [spreadsheet, cell]);

  return { spreadsheet, lastRenderTs };
}
