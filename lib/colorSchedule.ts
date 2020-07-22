import { TimeOfDay } from "./time-of-day.js";

type ColorChange = {
  /** 24-hour time to be passed to TimeOfDay.parse() */
  readonly time: string,
  /** CSS color */
  readonly color: string,
};

export type ColorTableEntry = { time: TimeOfDay, color: string };

type FindResult = {
  current: Readonly<ColorTableEntry>
  next: Readonly<ColorTableEntry>;
}

export class ColorSchedule {
  readonly table: ColorTableEntry[];
  // Only this.table is included in the persisted state.
  temporaryAdjustmentMinutes = 0;
  activeTable!: (ColorTableEntry & { orig: ColorTableEntry })[];
  midnightColor!: string;
  saveCallback: (serialized: string) => void;

  static fromChangeList(changes: readonly ColorChange[], save: (serialized: string) => void) {
    const table = changes.map(({ time, color }) => ({ time: TimeOfDay.parse(time), color }));
    return new ColorSchedule(table, save);
  }

  static fromJSON(json: string, save: (serialized: string) => void): ColorSchedule {
    const table = JSON.parse(json);
    return new ColorSchedule(table.map(({ time, color }: Record<'time' | 'color', string>) =>
      ({ time: TimeOfDay.parse(time), color })), save);
  }

  constructor(table: ColorTableEntry[], save: (serialized: string) => void) {
    this.table = table;
    this.saveCallback = save;
    this.normalize();
  }

  normalize(): void {
    const comparator = (a: ColorTableEntry, b: ColorTableEntry) => a.time.valueOf() - b.time.valueOf();
    this.table.sort(comparator);
    this.activeTable = this.table.map(entry => ({
      time: entry.time.addMinutes(this.temporaryAdjustmentMinutes),
      color: entry.color,
      orig: entry,
    }))
    this.activeTable.sort(comparator);
    this.midnightColor = this.activeTable[this.activeTable.length - 1].color;
  }

  save(): void {
    this.saveCallback(JSON.stringify(this));
  }

  /** Finds the current color and the next color to change to based on the
   * current time. The "next" change will be earlier in the day when a color
   * setting crosses midnight. */
  find(currentTime: TimeOfDay): FindResult {
    let nextActive = this.activeTable.findIndex(({ time: entryTime }) => entryTime > currentTime);
    // If we don't find a change later than the current time, it's the first one
    // of the next day.
    if (nextActive === -1) nextActive = 0;
    let curActive = nextActive - 1;
    // The entry before the first one is the last change of the previous day.
    if (curActive === -1) curActive = this.activeTable.length - 1;
    const current = this.activeTable[curActive];
    const next = this.activeTable[nextActive];
    return {
      current: { time: current.time, color: current.color },
      next: { time: next.time, color: next.color }
    };
  }

  /** Adds a new color change to the schedule just before the 0-indexed argument row. */
  addRow(row: number): void {
    if (row === 0) {
      this.table.unshift({ time: this.table[row].time.addMinutes(-1), color: this.midnightColor });
      console.log(this.table);
    } else {
      const prevRow = this.table[row - 1];
      this.table.splice(row, 0, {
        time: prevRow.time.addMinutes(1),
        color: prevRow.color
      });
    }
    this.normalize();
    this.save();
  }

  removeRow(row: number): void {
    this.table.splice(row, 1);
    this.normalize();
    this.save();
  }

  setTime(row: number, time: TimeOfDay): void {
    this.table[row].time = time.addMinutes(-this.temporaryAdjustmentMinutes);
    this.normalize();
    this.save();
  }

  setColor(row: number, color: string): void {
    this.table[row].color = color;
    this.normalize();
    this.save();
  }

  temporaryAdjustMinutes(minutes: number): void {
    this.temporaryAdjustmentMinutes = minutes;
    this.normalize();
  }

  toJSON(): object {
    return this.table;
  }
}
