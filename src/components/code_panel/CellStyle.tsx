import type { PrivateCellNormal } from "@/lib/cells/cell_normal";
import { Bold, Italic, Underline } from "lucide-react";
import { Label } from "../ui/label";
import type { CellStyleProperty } from "@/lib/cells/cell_types";
import { useRenderSubscriber } from "@/lib/render_subscriber";
import { getLocationId } from "@/lib/cells/cells_util";
import { Toggle } from "../ui/toggle";

type Props = {
  cell: PrivateCellNormal;
  handleToggle: (prop: CellStyleProperty, enabled: boolean) => void;
};

export const CellStyle = ({ cell, handleToggle }: Props) => {
  useRenderSubscriber([getLocationId(cell.location)]);

  const { bold, italic, underline } = cell.style;

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label>Text Style</Label>
      <div className="flex items-center justify-start gap-1">
        <Toggle
          pressed={bold}
          onPressedChange={() => handleToggle("bold", !bold)}
          aria-label="Toggle bold">
          <Bold className="w-4 h-4" />
        </Toggle>

        <Toggle
          pressed={italic}
          onPressedChange={() => handleToggle("italic", !italic)}
          aria-label="Toggle italic">
          <Italic className="w-4 h-4" />
        </Toggle>

        <Toggle
          pressed={underline}
          onPressedChange={() => handleToggle("underline", !underline)}
          aria-label="Toggle underline">
          <Underline className="w-4 h-4" />
        </Toggle>
      </div>
    </div>
  );
};
