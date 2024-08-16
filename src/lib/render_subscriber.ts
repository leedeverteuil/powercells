import { useEffect, useState } from "react";
import { spreadsheet } from "./spreadsheet";
import type { PrivateCell } from "./cells/cell_types";

export function useRenderSubscriber(deps: string[], requiresCell?: boolean, cell?: PrivateCell | null) {
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