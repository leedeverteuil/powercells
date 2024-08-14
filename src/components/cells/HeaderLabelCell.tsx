import { letters } from "@/lib/spreadsheet";

type Props = {
  row: number;
  col: number;
};

export const HeaderLabelCell = ({ row, col }: Props) => {
  const cellLetter = letters[col];
  const borderClass = `${row === 0 ? "border-t-0" : ""} ${
    col === 0 ? "border-l-0" : ""
  }`;

  return (
    <div
      className={`p-1 border-[0.5px] ${borderClass} border-zinc-200 dark:border-zinc-800 text-center
               text-zinc-600 dark:text-zinc-200 font-medium`}>
      {cellLetter.toUpperCase()}
    </div>
  );
};
