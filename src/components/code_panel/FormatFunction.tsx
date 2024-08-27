import type { CellNormal } from "@/lib/cells/cell_normal";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useRenderSubscriber } from "@/lib/render_subscriber";
import { getLocationId } from "@/lib/cells/cells_util";
import { useEffect, useState } from "react";
import { CodeTextArea } from "./CodeTextArea";
import { buildFormatFunction, getFunctionBody } from "@/lib/code_editor";
import { DeleteFunctionDialog } from "./DeleteFunctionDialog";
import { handleLoggingSync } from "@/lib/console";

type Props = {
  cell: CellNormal;
};

const exampleFunctionString = "return `** ${value} **`;";

export const FormatFunction = ({ cell }: Props) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [funcStr, setFuncStr] = useState("");
  const [inputFuncStr, setInputFuncStr] = useState("");
  const { lastRenderTs } = useRenderSubscriber([getLocationId(cell.location)]);

  useEffect(() => {
    const oldFuncStr = funcStr;
    const newFuncStr = getFunctionBody(cell.format);

    // keep cell's current value up to date
    setFuncStr(newFuncStr);

    // the initial value changed, need to reset input value
    if (oldFuncStr !== newFuncStr) {
      setInputFuncStr(newFuncStr);
    }
  }, [lastRenderTs]);

  const hasFormat = cell.format !== null;
  const isFuncDifferent = inputFuncStr !== funcStr;

  const addFormatFunc = () => {
    cell.setFormatFunction(buildFormatFunction(exampleFunctionString));
  };

  const onInput = (value: string) => {
    setInputFuncStr(value);
  };

  const saveChanges = () => {
    // catch errors and log
    const func = handleLoggingSync(
      () => {
        return buildFormatFunction(inputFuncStr);
      },
      "saveFormat",
      cell
    );

    // save to cell
    if (func) {
      cell.setFormatFunction(func);
    }
  };

  const openDeleteDialog = () => {
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    cell.setFormatFunction(null);
    setDeleteOpen(false);
  };

  return (
    <>
      {hasFormat ? (
        <div className="grid w-full gap-1.5">
          <Label htmlFor="formatFunc">Format</Label>
          <CodeTextArea
            id="formatFunc"
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
          <Label>Format</Label>
          <Button variant="secondary" onClick={addFormatFunc} className="w-fit">
            <Plus className="w-4 h-4 mr-1" />
            Add Format Function
          </Button>
        </div>
      )}

      <DeleteFunctionDialog
        title="Delete Format function?"
        open={deleteOpen}
        onConfirm={confirmDelete}
        onClose={() => setDeleteOpen(false)}></DeleteFunctionDialog>
    </>
  );
};
