import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Props = {
  label: string;
  onInput: (label: string) => void;
};

export const CellLabelInput = ({ label, onInput }: Props) => {
  const inputHandler = (e: React.FormEvent<HTMLInputElement>) => {
    onInput(e.currentTarget.value);
  };

  return (
    <div className="w-full max-w-sm">
      <Label htmlFor="label" className="mb-1.5">
        Label
      </Label>
      <div>
        <Input
          autoFocus
          onInput={inputHandler}
          value={label}
          type="text"
          id="label"
          placeholder=""
          className="mb-1"
        />
      </div>
    </div>
  );
};
