import { letters } from "@/lib/spreadsheet";

const CellsGrid = () => {
  // build rendered cells
  const renderedCells = [];
  for (let row = 0; row < 51; row++) {
    // add label cell for row
    renderedCells.push(
      <div
        key={`${row}-label`}
        className={`p-1 border-[0.5px] ${
          row === 0 ? "border-t-0" : ""
        } border-r border-zinc-200 dark:border-zinc-800 sticky left-0 bg-white
        dark:bg-zinc-950 text-zinc-400 dark:text-zinc-500 text-center`}
      >
        {row === 0 ? "" : row}
      </div>
    );

    for (let col = 0; col < letters.length; col++) {
      // header cell for columns if row is 0
      if (row === 0) {
        const cellLetter = letters[col];
        renderedCells.push(
          <div
            key={`${cellLetter}-label`}
            className={`p-1 border-[0.5px] ${row === 0 ? "border-t-0" : ""} ${
              col === 0 ? "border-l-0" : ""
            } border-zinc-200 dark:border-zinc-800 text-center text-zinc-400 dark:text-zinc-500`}
          >
            {cellLetter.toUpperCase()}
          </div>
        );
      } else {
        const cellLetter = letters[col];
        const cellNumber = row + 1;
        const cellId = `${cellLetter}${cellNumber}`;
        renderedCells.push(
          <div
            key={cellId}
            className={`p-1 border-[0.5px] ${row === 0 ? "border-t-0" : ""}
            ${col === 0 ? "border-l-0" : ""}
            border-zinc-200 dark:border-zinc-800`}
          >
            {/* {cellId} */}
          </div>
        );
      }
    }
  }

  return (
    <div className="max-h-screen overflow-y-scroll">
      <div className="pr-32 text-xs pb-80 cell-grid">{renderedCells}</div>
    </div>
  );
};

export default CellsGrid;
