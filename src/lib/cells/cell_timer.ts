import type { CellLocation } from "./cell_types";
import { BaseCell } from "./cell_base";
import { handleLogging } from "../console";
import { buildActionFunction, getFunctionBody } from "../code_editor";
import { Spreadsheet } from "../spreadsheet";

export type CellTimerSerialized = {
  type: "timer";
  location: CellLocation;
  label: string;
  loopTimeMs: number;
  paused: boolean;
  action: string | null;
};

const MIN_LOOP_TIME_MS = 100;

export class CellTimer extends BaseCell {
  label: string;
  loopTimeMs: number;
  lastRunMs: number;
  paused!: boolean;
  action: Function | null;
  unbindFunc: Function | null = null;

  constructor(
    spreadsheet: Spreadsheet,
    location: CellLocation,
    label: string = "Timer",
    loopTimeMs: number = 5000,
    lastRunMs: number = Date.now(),
    paused: boolean = false,
    action: Function | null = null
  ) {
    super(spreadsheet, location);
    this.label = label;
    this.loopTimeMs = loopTimeMs;
    this.lastRunMs = lastRunMs;
    this.action = action;
    this.initPausedAsync(paused).then().catch(console.error)
  }

  destroy() {
    if (this.unbindFunc) {
      this.unbindFunc();
    }
  }

  serialize(): CellTimerSerialized {
    const { location, label, loopTimeMs, paused, action } = this;

    return {
      type: "timer",
      location, label, loopTimeMs, paused,
      action: action ? getFunctionBody(action) : null
    };
  };

  static fromSerialized(spreadsheet: Spreadsheet, serialized: CellTimerSerialized): CellTimer {
    const { location, label, loopTimeMs, paused, action } = serialized;
    const cell = new CellTimer(
      spreadsheet,
      location,
      label,
      loopTimeMs,
      Date.now(),
      paused,
      action ? buildActionFunction(action) : null
    );

    return cell;
  }

  setLabel(label: string) {
    this.label = label;
    this.callHandleCellChangeAsync();
  }

  setLoopTimeMs(loopTimeMs: number) {
    this.loopTimeMs = Math.max(MIN_LOOP_TIME_MS, loopTimeMs);
    this.callHandleCellChangeAsync();

    // rebind interval if running
    this.setPaused(this.paused);
  }

  async initPausedAsync(paused: boolean) {
    this.setPaused(paused);
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

    this.callHandleCellChangeAsync();
  }

  setActionFunction(func: Function | null) {
    this.action = func;
    this.callHandleCellChangeAsync();
  }

  async runAction() {
    const cell = this;

    await handleLogging(async () => {
      // no action function
      if (!cell.action) return;

      const { get, set, update } = this.spreadsheet.getPublicFunctions();
      await cell.action(get, set, update);
    }, "action", this);
  }
}
