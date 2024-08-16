import type { CellLocation, PrivateCell } from "@/lib/cells/cell_types";
import type { ReactElement } from "react";
import { useRenderSubscriber } from "@/lib/render_subscriber";
import { getLocationId } from "@/lib/cells/cells_util";

type Props = {
  cell: PrivateCell | null;
  location: CellLocation;
};
export const CellContent = ({ cell, location }: Props) => {
  useRenderSubscriber([getLocationId(location)], true, cell);

  // build content
  let content: ReactElement = <></>;

  if (cell?.type === "normal") {
    const { format, value } = cell;

    // user wrote a formatter
    if (format) {
      content = <>{format(value)}</>;
    }
    // no formatter provided
    else {
      content = <>{value.toString()}</>;
    }
  }

  return <span className="overflow-hidden truncate">{content}</span>;
};
