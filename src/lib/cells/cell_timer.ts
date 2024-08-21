import type { CellLocation } from "./cell_types";
import { spreadsheet } from "../spreadsheet";
import { BaseCell } from "./cell_base";
import { handleLogging } from "../console";

const MIN_LOOP_TIME_MS = 500;

export class PrivateCellTimer extends BaseCell {
  label: string;
  loopTimeMs: number;
  lastRunMs: number;
  paused!: boolean;
  action: Function | null;
  unbindFunc: Function | null = null;

  constructor(
    location: CellLocation,
    label: string = "Timer",
    loopTimeMs: number = 5000,
    lastRunMs: number = Date.now(),
    paused: boolean = false,
    action: Function | null = null
  ) {
    super(location);
    this.label = label;
    this.loopTimeMs = loopTimeMs;
    this.lastRunMs = lastRunMs;
    this.action = action;
    this.setPaused(paused);
  }

  setLabel(label: string) {
    this.label = label;
    spreadsheet.handleCellChangeAsync(this);
  }

  setLoopTimeMs(loopTimeMs: number) {
    this.loopTimeMs = Math.max(MIN_LOOP_TIME_MS, loopTimeMs);
    spreadsheet.handleCellChangeAsync(this);

    // rebind interval if running
    this.setPaused(this.paused);
  }

  setPaused(paused: boolean) {
    this.paused = paused;

    // unsub either way
    if (this.unbindFunc) {
      this.unbindFunc();
      this.unbindFunc = null;
    }

    // should run
    if (!paused) {
      this.lastRunMs = Date.now();

      // bind timer
      const timerId = setInterval(() => {
        this.lastRunMs = Date.now();
        this.runAction().then();
      }, this.loopTimeMs);

      // unbind
      this.unbindFunc = () => {
        clearInterval(timerId);
        this.unbindFunc = null;
      };
    }

    spreadsheet.handleCellChangeAsync(this);
  }

  setActionFunction(func: Function | null) {
    this.action = func;
    spreadsheet.handleCellChangeAsync(this);
  }

  async runAction() {
    const cell = this;

    await handleLogging(async () => {
      // no action function
      if (!cell.action) return;

      const { get, set, update } = spreadsheet.getPublicFunctions();
      await cell.action(get, set, update);
    }, "action", this);
  }
}
