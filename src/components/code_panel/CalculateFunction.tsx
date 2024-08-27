import type { CellNormal } from "@/lib/cells/cell_normal";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Play, Plus, Trash2 } from "lucide-react";
import { useRenderSubscriber } from "@/lib/render_subscriber";
import { getLocationId } from "@/lib/cells/cells_util";
import { useEffect, useState } from "react";
import { CodeTextArea } from "./CodeTextArea";
import { buildCalculateFunction, getFunctionBody } from "@/lib/code_editor";
import { DeleteFunctionDialog } from "./DeleteFunctionDialog";

type Props = {
  cell: CellNormal;
};

const exampleFunctionString = `return "Hello World!";`;

export const CalculateFunction = ({ cell }: Props) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [funcStr, setFuncStr] = useState("");
  const [inputFuncStr, setInputFuncStr] = useState("");
  const { lastRenderTs } = useRenderSubscriber([getLocationId(cell.location)]);

  useEffect(() => {
    const oldFuncStr = funcStr;
    const newFuncStr = getFunctionBody(cell.calculate);

    // keep cell's current value up to date
    setFuncStr(newFuncStr);

    // the initial value changed, need to reset input value
    if (oldFuncStr !== newFuncStr) {
      setInputFuncStr(newFuncStr);
    }
  }, [lastRenderTs]);

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
  };

  const handleRun = () => {
    cell.runCalculate();
  };

  const openDeleteDialog = () => {
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    cell.setCalculateFunction(null);
    setDeleteOpen(false);
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

            <Button
              onClick={openDeleteDialog}
              variant="ghost"
              className="w-full">
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

      <DeleteFunctionDialog
        title="Delete Calculate function?"
        open={deleteOpen}
        onConfirm={confirmDelete}
        onClose={() => setDeleteOpen(false)}></DeleteFunctionDialog>
    </>
  );
};
