import { getLocationDisplayName } from "@/lib/cells/cells_util";
import { clearConsole, log, type LogError } from "@/lib/console";
import { useRenderSubscriber } from "@/lib/render_subscriber";
import { Eraser } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function formatErrorMessage(entry: LogError) {
  const { error, functionType } = entry;

  let verb = "running";
  let funcName: string = functionType;

  if (functionType.startsWith("save")) {
    verb = "saving";
    funcName = functionType.slice(4).toLowerCase();
  }

  return (
    <p>
      Error when {verb} <span className="font-semibold">{funcName}</span>:{" "}
      {error.message}
    </p>
  );
}

export const Console = () => {
  const { spreadsheet } = useRenderSubscriber(["console"]);
  if (!spreadsheet) return;

  return (
    <div className="relative h-48 p-3 space-y-2 overflow-y-auto border rounded-md bg-zinc-950 border-zinc-950 dark:border-zinc-800">
      {/* clear button */}

      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => clearConsole(spreadsheet)}
              className="absolute top-2 right-2">
              <Eraser className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={10}>
            <p>Clear console</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {log.map((entry) => {
        const locName = getLocationDisplayName(entry.cell.location);

        return (
          <div
            key={entry.key}
            className="flex items-center justify-start gap-2 font-mono text-sm tracking-tight text-red-500">
            {/* cell box indicator */}
            <p className="p-1 border border-red-500 w-fit min-w-[2rem] text-center rounded-sm">
              {locName}
            </p>
            {formatErrorMessage(entry)}
          </div>
        );
      })}
    </div>
  );
};
