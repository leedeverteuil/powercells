import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Props = {
  timeMs: number;
  onSave: (timeMs: number) => void;
};

export const CellLoopTimeInput = ({ timeMs, onSave }: Props) => {
  const [inputMs, setInputMs] = useState<any>(timeMs);

  useEffect(() => {
    setInputMs(timeMs);
  }, [timeMs]);

  const saveHandler = () => {
    let inputValue = parseInt(inputMs as any);
    onSave(isNaN(inputValue) ? 5000 : inputValue);
  };

  const inputHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setInputMs(e.currentTarget.value);
  };

  return (
    <div className="w-full max-w-sm">
      <Label htmlFor="loopTimeMs" className="mb-1.5">
        Run Action Interval (Milliseconds)
      </Label>
      <div className="flex items-stretch justify-center gap-2">
        <Input
          onInput={inputHandler}
          value={inputMs}
          type="number"
          id="loopTimeMs"
          placeholder=""
          className="mb-1"
        />

        <Button
          disabled={`${timeMs}` === `${inputMs}`}
          onClick={saveHandler}
          className="min-w-32">
          Save
        </Button>
      </div>
    </div>
  );
};
