import { useEffect, useState } from "react";
import { spreadsheet } from "./spreadsheet";

export function useRenderSubscriber(deps: string[]) {
  const [lastRenderTs, setRenderTs] = useState(0);

  useEffect(() => {
    return spreadsheet.subscribe((ts) => {
      setRenderTs(ts);
    }, deps);
  }, [spreadsheet]);

  return lastRenderTs;
}