import { PublicCellNormal } from "./cell_normal";
import type { PrivateCell, PublicCell } from "./cell_types";

export function getPublicCellFromPrivate(privateCell: PrivateCell): PublicCell {
  const { type, location } = privateCell;

  // normal cells
  if (type === "normal") {
    return new PublicCellNormal(location, privateCell);
  }

  // button cells
  // else if (type === "button") {
  //   const cell: PublicCellWithButton = {
  //     type, location,
  //     id: "",
  //     label: "Untitled Button"
  //   };

  //   return cell;
  // }

  // timer cells
  // else if (type === "timer") {
  //   const cell: PublicCellWithTimer = {
  //     type, location,
  //     id: "",
  //     label: "Untitled Timer",
  //     loopTimeMs: 5000,
  //     timeLeftMs: 5000,
  //   };

  //   return cell;
  // }

  // toggle cells
  // else if (type === "toggle") {
  //   const cell: PublicCellWithToggle = {
  //     type, location,
  //     id: "",
  //     label: "Untitled Toggle",
  //     getValue: () => privateCell.value
  //   };

  //   return cell;
  // }

  throw new Error("Could not convert private cell object to public (Bug)");
}
