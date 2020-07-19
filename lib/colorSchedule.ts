import { TimeOfDay } from "./time-of-day.js";

type ColorChange = {
  /** 24-hour time to be passed to TimeOfDay.parse() */
  readonly time: string,
  /** CSS color */
  readonly color: string,
};

type ColorTableEntry = { readonly time: TimeOfDay, readonly color: string };

type FindResult = {
  current: ColorTableEntry
  next: ColorTableEntry;
}

export class ColorSchedule {
  readonly table: ColorTableEntry[];
  readonly midnightColor: string;

  static fromChangeList(changes: readonly ColorChange[]) {
    const table = changes.map(({ time, color }) => ({ time: TimeOfDay.parse(time), color }));
    const midnightColor = changes[changes.length - 1].color;

    return new ColorSchedule(table, midnightColor);
  }

  constructor(table: ColorTableEntry[], midnightColor: string) {
    this.table = table;
    this.midnightColor = midnightColor;
  }

  /** Finds the current color and the next color to change to based on the
   * current time. The "next" change will be earlier in the day when a color
   * setting crosses midnight. */
  find(currentTime: TimeOfDay): FindResult {
    let nextActive = this.table.findIndex(({ time: entryTime }) => entryTime > currentTime);
    // If we don't find a change later than the current time, it's the first one
    // of the next day.
    if (nextActive === -1) nextActive = 0;
    let curActive = nextActive - 1;
    // The entry before the first one is the last change of the previous day.
    if (curActive === -1) curActive = this.table.length - 1;
    return { current: this.table[curActive], next: this.table[nextActive] };
  }

  adjustMinutes(minutes: number): ColorSchedule {
    const newTable = this.table.map(({ time, color }) => ({ time: time.addMinutes(minutes), color }))
    return new ColorSchedule(newTable, newTable[newTable.length - 1].color);
  }
}
