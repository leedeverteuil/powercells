import type { CellLocation } from "./cell_types";

export abstract class BaseCell {
  location: CellLocation;

  constructor(location: CellLocation) {
    this.location = location;
  }
}