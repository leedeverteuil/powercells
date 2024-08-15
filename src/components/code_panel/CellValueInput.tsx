import type { CellValue } from "@/lib/cells/cell_types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { inputToCellValue } from "@/lib/cells/cells_util";
import { Badge } from "../ui/badge";

type Props = {
  value: string;
  cellValue: CellValue;
  onInput: (value: CellValue) => void;
};

export const CellValueInput = ({ value, onInput, cellValue }: Props) => {
  const inputHandler = (e: React.FormEvent<HTMLInputElement>) => {
    const rawInput = e.currentTarget.value;
    const convertedValue = inputToCellValue(rawInput);
    onInput(convertedValue);
  };

  return (
    <div className="w-full max-w-sm">
      <Label htmlFor="value" className="mb-1.5">
        Value
      </Label>
      <div>
        <Input
          autoFocus
          onInput={inputHandler}
          value={value}
          type="value"
          id="value"
          placeholder=""
          className="mb-1"
        />

        {/* value type detector */}
        <div className="">
          <Badge variant="secondary">{typeof cellValue}</Badge>
        </div>
      </div>
    </div>
  );
};
