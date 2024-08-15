import type { PrivateCellNormal } from "@/lib/cells/cell_normal";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Play, Plus, Trash2 } from "lucide-react";
import { useRenderSubscriber } from "@/lib/render_subscriber";
import { getLocationId } from "@/lib/cells/cells_util";
import { useEffect, useState } from "react";
import { CodeTextArea } from "./CodeTextArea";
import { buildCalculateFunction, getFunctionBody } from "@/lib/code_editor";

type Props = {
  cell: PrivateCellNormal;
};

const exampleFunctionString = `return currentValue + 5;`;

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
    cell.setCalculateFunction(buildCalculateFunction(exampleFunctionString));
  };

  const onInput = (value: string) => {
    setInputFuncStr(value);
  };

  const saveChanges = () => {
    // save to cell
    cell.setCalculateFunction(buildCalculateFunction(inputFuncStr));

    // re-calculate this cell
    cell.runCalculate();
  };

  const handleRun = () => {
    cell.runCalculate();
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
            {isFuncDifferent ? (
              <Button
                onClick={saveChanges}
                variant="secondary"
                disabled={!isFuncDifferent}
                className="w-full">
                Save changes
              </Button>
            ) : (
              <Button
                onClick={handleRun}
                variant="secondary"
                className="w-full">
                <Play className="w-4 h-4 mr-1.5" />
                Run
              </Button>
            )}

            <Button variant="ghost" className="w-full">
              <Trash2 className="w-4 h-4 mr-1.5" />
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <Label>Calculate</Label>
          <Button
            variant="secondary"
            onClick={addCalculateFunc}
            className="w-fit">
            <Plus className="w-4 h-4 mr-1" />
            Add Calculate Function
          </Button>
        </div>
      )}
    </>
  );
};
