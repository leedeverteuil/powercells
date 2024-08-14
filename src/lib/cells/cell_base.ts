import type { CellLocation, CellType } from "./cell_types";

export abstract class BaseCell {
  type: CellType;
  location: CellLocation;

  constructor(type: CellType, location: CellLocation) {
    this.type = type;
    this.location = location;
  }
}