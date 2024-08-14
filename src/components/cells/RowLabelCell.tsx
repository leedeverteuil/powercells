type Props = {
  row: number;
}

export const RowLabelCell = ({ row }: Props) => {
  const isFirstRow = row === 0;
  const content = isFirstRow ? "" : row - 1;
  const borderClass = isFirstRow ? "border-t-0" : "";

  return (
    <div
      className={`p-1 border-[0.5px] border-r border-zinc-200
                  dark:border-zinc-800 sticky left-0 bg-white dark:bg-zinc-950
                  text-zinc-600 dark:text-zinc-200 font-medium text-center z-[2] ${borderClass}`}>
      {content}
    </div>
  );
}

export default RowLabelCell;
