import type { CellLocation, PrivateCell } from "@/lib/cells/cell_types";
import { useRenderSubscriber } from "@/lib/render_subscriber";
import { getLocationId } from "@/lib/cells/cells_util";
import { PrivateCellNormal } from "@/lib/cells/cell_normal";
import { PrivateCellButton } from "@/lib/cells/cell_button";
import { CellButton } from "../code_panel/CellButton";

type Props = {
  cell: PrivateCell | null;
  location: CellLocation;
};

export const CellContent = ({ cell, location }: Props) => {
  useRenderSubscriber([getLocationId(location)], true, cell);

  return (
    <span className="overflow-hidden truncate">
      {(() => {
        // normal cells
        if (cell instanceof PrivateCellNormal) {
          const { format, value } = cell;

          // user wrote a formatter
          if (format) {
            return <>{format(value)}</>;
          }
          // no formatter provided
          else {
            return <>{value.toString()}</>;
          }
        }

        // button cells
        else if (cell instanceof PrivateCellButton) {
          return <CellButton cell={cell} />;
        }
      })()}
    </span>
  );
};
