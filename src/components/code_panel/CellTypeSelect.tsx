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

type Props = {
  value: CellType;
  onValueChange: (value?: string) => void;
};

export const CellTypeSelect = ({ onValueChange, value }: Props) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label>Cell Type</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select cell type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Cell Types</SelectLabel>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="button">Button</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
