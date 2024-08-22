import type { CellTimer } from "@/lib/cells/cell_timer";
import { useEffect, useState } from "react";

type Props = {
  cell: CellTimer;
};

export const CellTimerContent = ({ cell }: Props) => {
  const [progress, setProgress] = useState(0);
  const percentage = progress * 100;

  useEffect(() => {
    if (!cell.paused) {
      let stopped = false;

      const tick = () => {
        const { loopTimeMs, lastRunMs } = cell;

        setProgress(Math.min(loopTimeMs, Date.now() - lastRunMs) / loopTimeMs);

        if (!stopped) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);

      return () => {
        stopped = true;
      };
    }
  }, [cell.paused]);

  return (
    <div className="relative w-full h-full">
      {/* progress bar */}
      <div
        style={{ width: `${percentage}%` }}
        className={`absolute top-0 left-0 h-full z-[5] ${
          cell.paused ? "bg-zinc-200 dark:bg-zinc-900" : "bg-lime-300"
        }`}></div>

      {/* label */}
      <p
        className={`z-[6] absolute top-0 left-0 p-1 w-full ${
          cell.paused ? "text-zinc-400 dark:text-zinc-500" : "text-lime-700"
        } text-center h-full overflow-x-scroll no-scrollbar font-medium`}>
        {cell.label}
      </p>
    </div>
  );
};
