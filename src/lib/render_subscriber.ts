import { useEffect, useState } from "react";
import { spreadsheet } from "./spreadsheet";
import type { Cell } from "./cells/cell_types";

export function useRenderSubscriber(deps: string[], requiresCell?: boolean, cell?: Cell | null) {
  const [lastRenderTs, setRenderTs] = useState(0);

  useEffect(() => {
    if (!requiresCell || cell !== null) {
      return spreadsheet.subscribe((ts) => {
        setRenderTs(ts);
      }, deps);
    }
  }, [spreadsheet, cell]);

  return lastRenderTs;
}