import type { CellLocation, PrivateCell } from "@/lib/cells/cell_types";
import type { ReactElement } from "react";
import { useRenderSubscriber } from "@/lib/render_subscriber";

type Props = {
  cell: PrivateCell | null;
  location: CellLocation;
};
export const CellContent = ({ cell, location }: Props) => {
  const { col, row } = location;
  useRenderSubscriber([`${col}-${row}`]);

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
