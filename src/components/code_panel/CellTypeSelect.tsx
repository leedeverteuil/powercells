import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CellType } from "@/lib/cells/cell_types";
import { Label } from "../ui/label";
import { CellTypeChangeDialog } from "./CellTypeChangeDialog";
import { useState } from "react";

type Props = {
  value: CellType;
  handleValueChange: (value: CellType) => void;
};

export const CellTypeSelect = ({ handleValueChange, value }: Props) => {
  const [changeAlert, setChangeAlert] = useState<{
    open: boolean;
    type: CellType | null;
  }>({ open: false, type: null });

  const openAlert = (clickedValue: string) => {
    setChangeAlert({ open: true, type: clickedValue as CellType });
  };

  const handleConfirm = () => {
    const { type } = changeAlert;
    if (type !== null) {
      handleValueChange(type);
      setChangeAlert({ open: false, type: null });
    }
  };

  return (
    <>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label>Cell Type</Label>
        <Select value={value} onValueChange={openAlert}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select cell type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Cell Types</SelectLabel>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="button">Button</SelectItem>
              <SelectItem value="timer">Timer</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <CellTypeChangeDialog
        open={changeAlert.open}
        onClose={() => setChangeAlert({ open: false, type: null })}
        handleConfirm={handleConfirm}></CellTypeChangeDialog>
    </>
  );
};
