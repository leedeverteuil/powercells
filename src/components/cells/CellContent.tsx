import { getPublicCellFromPrivate } from "@/lib/cells/cells";
import type { CellLocation, PrivateCell } from "@/lib/cells/cell_types";
import type { ReactElement } from "react";
import { spreadsheet } from "@/lib/spreadsheet";
import { useRenderSubscriber } from "@/lib/render_subscriber";

type Props = {
  cell: PrivateCell | null;
  location: CellLocation
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
      content = (
        <>
          {format(
            value,
            getPublicCellFromPrivate(cell),
            spreadsheet.publicSpreadsheet
          )}
        </>
      );
    }
    // no formatter provided
    else {
      content = <span>{value.toString()}</span>;
    }
  }

  return <>{content}</>;
};
