import type {
  PrivateCellNormal,
  UserCalculateFunction,
} from "@/lib/cells/cell_normal";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useRenderSubscriber } from "@/lib/render_subscriber";
import { getLocationId } from "@/lib/cells/cells_util";
import { useEffect, useState } from "react";
import { CodeTextArea } from "./CodeTextArea";
import { getFunctionBody } from "@/lib/code_editor";

type Props = {
  cell: PrivateCellNormal;
};

const exampleFunctionString = `return cell.getValue() + 5;`;

export const CalculateFunction = ({ cell }: Props) => {
  const [funcStr, setFuncStr] = useState("");
  const [inputFuncStr, setInputFuncStr] = useState("");
  const renderTs = useRenderSubscriber([getLocationId(cell.location)]);

  useEffect(() => {
    const oldFuncStr = funcStr;
    const newFuncStr = getFunctionBody(cell.calculate);

    // keep cell's current value up to date
    setFuncStr(newFuncStr);

    // the initial value changed, need to reset input value
    if (oldFuncStr !== newFuncStr) {
      setInputFuncStr(newFuncStr);
    }
  }, [renderTs]);

  const hasCalculate = cell.calculate !== null;
  const isFuncDifferent = inputFuncStr !== funcStr;

  const addCalculateFunc = () => {
    cell.setCalculateFunction(
      Function(exampleFunctionString) as UserCalculateFunction
    );
  };

  const onInput = (value: string) => {
    setInputFuncStr(value);
  };

  const saveChanges = () => {
    // parse code
    // save to cell
    // re-calculate this cell (must be awaited)
  };

  return (
    <>
      {hasCalculate ? (
        <div className="grid w-full gap-1.5">
          <Label htmlFor="calculateFunc">Calculate</Label>
          <CodeTextArea
            id="calculateFunc"
            value={inputFuncStr}
            onInput={onInput}></CodeTextArea>

          <div className="flex items-center justify-center gap-1.5">
            <Button
              onClick={saveChanges}
              variant="secondary"
              disabled={!isFuncDifferent}
              className="w-full">
              Save changes
            </Button>

            <Button variant="ghost" className="w-full">
              <Trash2 className="w-4 h-4 mr-1.5" />
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <Label>Calculate</Label>
          <Button onClick={addCalculateFunc} className="w-fit">
            <Plus className="w-4 h-4 mr-1" />
            Add Calculate Function
          </Button>
        </div>
      )}
    </>
  );
};
