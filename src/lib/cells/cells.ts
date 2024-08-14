import type { PrivateSpreadsheet, PublicSpreadsheet } from "../spreadsheet";
import { PrivateCellNormal, PublicCellNormal } from "./cell_normal";
import type { CellLocation, PrivateCell, PublicCell } from "./cell_types";

/** @returns `true` if value changed after recalculation */
export function recalculateCellWithValueCheck(cell: PrivateCellNormal, publicSpreadsheet: PublicSpreadsheet): boolean {
  const oldValue = cell.value;
  const publicCell = getPublicCellFromPrivate(cell);

  try {
    const calculatedValue = cell.calculate!(publicCell, publicSpreadsheet);

    // todo validate calculated value

    cell.setValue(calculatedValue);

    return oldValue !== calculatedValue;
  }
  catch (err) {
    console.error(err);
    // todo inform user of error they made
    throw err;
  }
}

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
