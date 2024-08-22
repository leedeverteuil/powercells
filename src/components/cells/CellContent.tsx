import type { CellLocation, Cell } from "@/lib/cells/cell_types";
import { useRenderSubscriber } from "@/lib/render_subscriber";
import { getLocationId } from "@/lib/cells/cells_util";
import { CellNormal } from "@/lib/cells/cell_normal";
import { CellButton } from "@/lib/cells/cell_button";
import { CellTimer } from "@/lib/cells/cell_timer";
import { handleLoggingSync } from "@/lib/console";
import { CellButtonContent } from "../code_panel/CellButtonContent";
import { CellTimerContent } from "../code_panel/CellTimer";

type Props = {
  cell: Cell | null;
  location: CellLocation;
};

export const CellContent = ({ cell, location }: Props) => {
  useRenderSubscriber([getLocationId(location)], true, cell);

  return (
    <span className="overflow-hidden truncate">
      {(() => {
        // normal cells
        if (cell instanceof CellNormal) {
          const { format, value } = cell;

          // user wrote a formatter
          if (format) {
            return (
              <>{handleLoggingSync(format, "format", cell)}</>
            );
          }
          // no formatter provided
          else {
            return <>{value.toString()}</>;
          }
        }

        // button cells
        else if (cell instanceof CellButton) {
          return <CellButtonContent cell={cell} />;
        }

        // timer cells
        else if (cell instanceof CellTimer) {
          return <CellTimerContent cell={cell} />;
        }
      })()}
    </span>
  );
};
