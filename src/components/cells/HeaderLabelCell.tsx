import { useRenderSubscriber } from "@/lib/render_subscriber";
import { settings } from "@/lib/settings";
import { letters } from "@/lib/spreadsheet";
import { useEffect, useState } from "react";

type Props = {
  row: number;
  col: number;
  onResize: (delta: number) => void;
};

export const HeaderLabelCell = ({ row, col, onResize }: Props) => {
  useRenderSubscriber(["columnHeaders"]);

  const [isResizing, setIsResizing] = useState(false);

  const cellLetter = letters[col];
  const borderClass = `${row === 0 ? "border-t-0" : ""} ${
    col === 0 ? "border-l-0" : ""
  }`;

  let lastX = 0;

  const drag = (e: MouseEvent) => {
    const { screenX } = e;
    if (lastX === 0) {
      lastX = screenX;
    } else {
      const delta = lastX - screenX;
      lastX = screenX;
      onResize(delta);
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", drag);
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener("mouseup", function () {
      window.removeEventListener("mousemove", drag);
      setIsResizing(false);
      lastX = 0;
    });
  });

  const startResize = () => setIsResizing(true);

  return (
    <div
      className={`p-1 border-[0.5px] ${borderClass} border-zinc-200 dark:border-zinc-800 text-center
               text-zinc-600 dark:text-zinc-200 font-medium relative`}>
      {settings.useColumnNumbers ? col : cellLetter.toUpperCase()}

      {/* for resizing */}
      <div
        onMouseDown={startResize}
        className="absolute top-0 right-[-0.375rem] z-10 rounded-sm hover:border border-lime-500 w-3 h-full bg-transparent hover:bg-[#DFF9B4] dark:hover:bg-[#2B4311]  hover:cursor-col-resize"></div>
    </div>
  );
};
