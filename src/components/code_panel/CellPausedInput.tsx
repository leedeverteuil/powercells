import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

type Props = {
  paused: boolean;
  onCheckedChanged: (paused: boolean) => void;
};

export const CellPausedInput = ({ paused, onCheckedChanged }: Props) => {
  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center space-x-2">
        <Switch
          id="paused"
          checked={paused}
          onCheckedChange={onCheckedChanged}
        />
        <Label htmlFor="paused">Paused</Label>
      </div>
    </div>
  );
};
