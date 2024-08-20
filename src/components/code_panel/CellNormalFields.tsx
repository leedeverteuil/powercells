import type { PrivateCellNormal } from "@/lib/cells/cell_normal";
import { CellValueInput } from "./CellValueInput";
import { CalculateFunction } from "./CalculateFunction";
import { CellDependencies } from "./CellDependencies";
import { FormatFunction } from "./FormatFunction";
import { CellStyle } from "./CellStyle";
import type { CellStyleProperty } from "@/lib/cells/cell_types";
import { cellValueToString } from "@/lib/cells/cells_util";

interface Props {
  cell: PrivateCellNormal;
}

export function CellNormalFields({ cell }: Props) {
  return (
    <>
      {/* value editor */}
      <CellValueInput
        value={cellValueToString(cell.value)}
        cellValue={cell.value}
        onInput={(value) => cell.setValue(value)}></CellValueInput>

      {/* calculate function */}
      <CalculateFunction cell={cell} />

      {/* dependencies */}
      <CellDependencies cell={cell}></CellDependencies>

      {/* format function */}
      <FormatFunction cell={cell}></FormatFunction>

      {/* styling options */}
      <CellStyle
        cell={cell}
        handleToggle={(prop: CellStyleProperty, enabled: boolean) =>
          cell.setStyleProp(prop, enabled)
        }></CellStyle>
    </>
  );
}
