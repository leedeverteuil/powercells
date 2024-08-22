import type { CellButton } from "@/lib/cells/cell_button";
import { getLocationId } from "@/lib/cells/cells_util";
import { buildButtonActionFunction, getFunctionBody } from "@/lib/code_editor";
import { useRenderSubscriber } from "@/lib/render_subscriber";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { CodeTextArea } from "./CodeTextArea";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { DeleteFunctionDialog } from "./DeleteFunctionDialog";
import type { CellTimer } from "@/lib/cells/cell_timer";

type Props = {
  cell: CellButton | CellTimer;
};

const exampleFunctionString = `// do some stuff`;

export const ActionFunction = ({ cell }: Props) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [funcStr, setFuncStr] = useState("");
  const [inputFuncStr, setInputFuncStr] = useState("");
  const renderTs = useRenderSubscriber([getLocationId(cell.location)]);

  useEffect(() => {
    const oldFuncStr = funcStr;
    const newFuncStr = getFunctionBody(cell.action);

    // keep cell's current value up to date
    setFuncStr(newFuncStr);

    // the initial value changed, need to reset input value
    if (oldFuncStr !== newFuncStr) {
      setInputFuncStr(newFuncStr);
    }
  }, [renderTs]);

  const hasAction = cell.action !== null;
  const isFuncDifferent = inputFuncStr !== funcStr;

  const addActionFunc = () => {
    cell.setActionFunction(buildButtonActionFunction(exampleFunctionString));
  };

  const onInput = (value: string) => {
    setInputFuncStr(value);
  };

  const saveChanges = () => {
    // save to cell
    cell.setActionFunction(buildButtonActionFunction(inputFuncStr));
  };

  const openDeleteDialog = () => {
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    cell.setActionFunction(null);
    setDeleteOpen(false);
  };

  return (
    <>
      {hasAction ? (
        <div className="grid w-full gap-1.5">
          <Label htmlFor="actionFunc">Action</Label>
          <CodeTextArea
            id="actionFunc"
            value={inputFuncStr}
            onInput={onInput}></CodeTextArea>

          <div className="flex items-center justify-center gap-1.5">
            <Button
              onClick={saveChanges}
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
          <Label>Action</Label>
          <Button variant="secondary" onClick={addActionFunc} className="w-fit">
            <Plus className="w-4 h-4 mr-1" />
            Add Action Function
          </Button>
        </div>
      )}

      <DeleteFunctionDialog
        title="Delete Action function?"
        open={deleteOpen}
        onConfirm={confirmDelete}
        onClose={() => setDeleteOpen(false)}></DeleteFunctionDialog>
    </>
  );
};
