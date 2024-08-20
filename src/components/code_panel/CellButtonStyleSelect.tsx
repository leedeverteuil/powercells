import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import type { CellButtonStyle } from "@/lib/cells/cell_button";

type Props = {
  style: CellButtonStyle;
  onStyleChange: (style: CellButtonStyle) => void;
};

export const CellButtonStyleSelect = ({ style, onStyleChange }: Props) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label>Button Style</Label>
      <Select value={style} onValueChange={onStyleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select button style" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Button Styles</SelectLabel>
            <SelectItem value="primary">Primary</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
            <SelectItem value="destructive">Destructive</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
