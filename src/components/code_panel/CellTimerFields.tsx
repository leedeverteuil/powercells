import { CellLabelInput } from "./CellLabelInput";
import type { PrivateCellTimer } from "@/lib/cells/cell_timer";
import { CellLoopTimeInput } from "./CellLoopTimeInput";
import { CellPausedInput } from "./CellPausedInput";
import { ActionFunction } from "./ActionFunction";

interface Props {
  cell: PrivateCellTimer;
}

export function CellTimerFields({ cell }: Props) {
  return (
    <>
      {/* label editor */}
      <CellLabelInput
        label={cell.label}
        onInput={(label) => cell.setLabel(label)}></CellLabelInput>

      {/* loop time editor */}
      <CellLoopTimeInput
        timeMs={cell.loopTimeMs}
        onSave={(timeMs) => cell.setLoopTimeMs(timeMs)}
      />

      {/* paused editor */}
      <CellPausedInput
        paused={cell.paused}
        onCheckedChanged={(paused) => cell.setPaused(paused)}></CellPausedInput>

      {/* action function */}
      <ActionFunction cell={cell} />
    </>
  );
}
