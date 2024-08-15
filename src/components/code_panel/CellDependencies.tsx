import type { PrivateCellNormal } from "@/lib/cells/cell_normal";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { getLocationDisplayName, getLocationId } from "@/lib/cells/cells_util";

type Props = {
  cell: PrivateCellNormal;
};

export const CellDependencies = ({ cell }: Props) => {
  const deps = cell.dependencies;
  return (
    <div>
      <Label>Dependencies</Label>
      {deps.length === 0 ? (
        <p className="text-sm text-zinc-400 dark:text-zinc-700">
          No dependencies
        </p>
      ) : (
        <div className="flex flex-wrap items-center justify-start gap-1 mt-0.5">
          {deps.map((d) => (
            <Badge
              key={getLocationId(d.location)}
              variant="outline"
              className="!rounded-none">
              {getLocationDisplayName(d.location)}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
