import type { PrivateCellButton } from "@/lib/cells/cell_button";
import { CellLabelInput } from "./CellLabelInput";
import { CellButtonStyleSelect } from "./CellButtonStyleSelect";
import { ButtonActionFunction } from "./ButtonActionFunction";

interface Props {
  cell: PrivateCellButton;
}

export function CellButtonFields({ cell }: Props) {
  return (
    <>
      {/* label editor */}
      <CellLabelInput
        label={cell.label}
        onInput={(label) => cell.setLabel(label)}></CellLabelInput>

      {/* button style editor */}
      <CellButtonStyleSelect
        style={cell.buttonStyle}
        onStyleChange={(style) =>
          cell.setButtonStyle(style)
        }></CellButtonStyleSelect>

      {/* action function */}
      <ButtonActionFunction cell={cell} />
    </>
  );
}
