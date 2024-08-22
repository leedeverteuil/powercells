import type {
  CellButton,
  CellButtonStyle,
} from "@/lib/cells/cell_button";
import { Button } from "../ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  cell: CellButton;
};

export const CellButtonContent = ({ cell }: Props) => {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    if (!loading) {
      setLoading(true);
      await cell.runAction();
      setLoading(false);
    }
  };

  const getButtonVariant = (style: CellButtonStyle) => {
    if (style === "primary") return "default";
    return style;
  };

  return (
    <Button
      disabled={loading}
      onClick={onClick}
      variant={getButtonVariant(cell.buttonStyle)}
      className="!h-6 min-w-full !rounded-sm !text-xs">
      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <></>}
      {cell.label}
    </Button>
  );
};
